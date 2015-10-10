define(["avalon", "deferred", "validator/RuleParse", "validator/RulePattern"], function(avalon, Deferred, parser) {

    // 判断是否为html5新增的表单元素
    var rh5control = /^email|url|number|range|date|month|week|time|color$/

    //判断是否有某属性节点
    var hasAttribute = document.documentElement.hasAttribute ? function(el, attr) {
        return el.hasAttribute(attr)
    } : function(el, attr) {//IE67
        var outer = el.outerHTML, part = outer.slice(0, outer.search(/\/?['"]?>(?![^<]*<['"])/));
        return new RegExp("\\s" + attr + "\\b", "i").test(part);
    }

    //判断是否为计算表达式
    function isExpression(expression) {
        return avalon.type(expression) === "array" && expression.length > 1
    }

    function getElementValue(control) {
        return control.value
    }

    function getMessage(control, message) {
        return avalon(control).attr("data-validator-message") || message || ""
    }

    //判断expression的类型
    //如果expression的类型为一元或者二元操作，包装为该操作结果的promise对象
    //在过程中，对操作符进行相应处理
    //如果expression的类型为表达式RULE，直接返回可以代表该RULE的promise对象
    //在Deferred中，resolve相当于正常的call, apply语句， reject相当于throw语句，otherwise相当于catch 语句，ensure相当于finally语句
    function parsePattern(pattern) {

        var dfd = Deferred(),
            element = this

        if(isExpression(pattern)) {
            parseExpression.call(this, pattern).then(function(result) {
                dfd.resolve(result)
            }, function(err) {
                dfd.reject(err)
            })
        } else {
            var validatorPattern = avalon.validatorPattern[pattern.name],
                result

            if(!validatorPattern) {
                dfd.reject("没有找到相应的pattern：" + pattern.name)
            } else {
                result = validatorPattern.validate.call(element, getElementValue(element), pattern.value)

                if(Deferred.isPromise(result)) {
                    result.then(function(result) {
                        //resolve
                        dfd.resolve({
                            result: result,
                            message: getMessage(element, validatorPattern.message)
                        })
                    }, function(err) {
                        dfd.reject(err)
                    })
                } else {
                    dfd.resolve({
                        result: result,
                        message: getMessage(element, validatorPattern.message)
                    })
                }
            }
        }

        return dfd.promise
    }

    function parseExpression(expressions) {

        var dfd = new Deferred(),
            element = this

        if(expressions.length === 2) {
            parsePattern.call(this, expressions[1]).then(function(result) {
                result.result = !result.result
                //resolve 进行一元运算
                dfd.resolve(result)
            }, function(err) {
                //reject
                dfd.reject(err)
            })
        } else {
            Deferred.all(parsePattern.call(this, expressions[0]), parsePattern.call(this, expressions[2])).then(function(results) {
                //resolve 进行二元运算
                if(expressions[1] === "&&") {
                    var failResults = results.filter(function(r) {
                        return !r.result
                    }), result = true,
                        message = ""

                    if(failResults.length > 0) {
                        message = failResults[0].message
                        result = false
                    }

                    dfd.resolve({
                        result: result,
                        message: message
                    })
                } else {
                    dfd.resolve({
                        result: results[0].result || results[1].result,
                        message: results[0].message + "或者" + results[1].message
                    })
                }
            }, function(err) {
                //reject
                dfd.reject(err)
            })
        }

        return dfd.promise
    }

    /**
     * 对表单控件进行验证
     * 首先对表单元素的可验证性做区分，disabled状态的控件不予验证
     * @param control
     * @param form
     */
    function validate(control, form) {
        //判断控件的验证性
        if(control.disabled) {
            return
        }

        var dfd = new Deferred()

        var $control = avalon(control),
            required = hasAttribute(control, "required"),
            pattern = $control.attr("data-validator-pattern"),
            type = $control.attr("type"),
            isH5Control,
            patternSeq = []

        //pattern的获取顺序为required属性 --> type --> pattern
        if(control.tagName.toLowerCase() === "input" && (isH5Control = rh5control.test(type))) {
            patternSeq.push(type)
        }
        if(pattern) {
            patternSeq.push('(' + pattern + ')')
        }
        if(required) {
            patternSeq.unshift("required")
        }

        //如果一个元素不具有required，html5的type以及pattern中的任意一项，不进行验证，直接返回
        if(!required && !isH5Control && !pattern) {
            dfd.resolve({
                result: true
            })
        } else if(!required && getElementValue(control) === "") {
            //如果一个元素不具有required属性，且其值为空，则验证通过
            dfd.resolve({
                result: true
            })
        } else {
            //调用语法分析器对控件的pattern进行分析
            //调用语义解析器对语法进行执行，生成promise对象
            parsePattern.call(control, parser.parse(patternSeq.join("&&"))).then(function(result) {
                dfd.resolve(result)
            }, function(err) {
                dfd.reject(err)
            })
        }

        return dfd.promise

    }

    return validate
})