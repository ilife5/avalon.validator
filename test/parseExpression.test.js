//判断是否为计算表达式
function isExpression(expression) {
    return avalon.type(expression) === "array" && expression.length > 1
}

//判断expression的类型
//如果expression的类型为一元或者二元操作，包装为该操作结果的promise对象
//在过程中，对操作符进行相应处理
//如果expression的类型为表达式RULE，直接返回可以代表该RULE的promise对象
//在Deferred中，resolve相当于正常的call, apply语句， reject相当于throw语句，otherwise相当于catch 语句，ensure相当于finally语句
function parsePattern(pattern) {

    var dfd = Deferred()

    if(isExpression(pattern)) {
        parseExpression.call(this, pattern).then(function(result) {
            dfd.resolve(result)
        }, function() {
            dfd.resolve(arguments)
        })
    } else {
        var validatorPattern = avalon.validatorPattern[pattern.name],
            result

        if(!validatorPattern) {
            dfd.reject({
                message: "没有找到相应的pattern：" + pattern.name
            })
        } else {
            result = validatorPattern.validate.call(this, pattern.value)

            if(Deferred.isPromise(result)) {
                result.then(function(result) {
                    //resolve
                    dfd.resolve(result)
                }, function() {
                    dfd.reject(arguments)
                })
            } else {
                dfd.resolve(result)
            }
        }
    }

    return dfd.promise
}

function parseExpression(expressions) {

    var dfd = new Deferred()

    if(expressions.length === 2) {
        parsePattern.call(this, expressions[1]).then(function(result) {
            //resolve 进行一元运算
            dfd.resolve(!result)
        }, function() {
            //reject
            dfd.reject(arguments)
        })
    } else {
        Deferred.all(parsePattern.call(this, expressions[0]), parsePattern.call(this, expressions[2])).then(function(results) {
            //resolve 进行二元运算
            if(expressions[1] === "&&") {
                dfd.resolve(results[0] && results[1])
            } else {
                dfd.resolve(results[0] || results[1])
            }
        }, function() {
            //reject
            dfd.reject(arguments)
        })
    }

    return dfd.promise
}

//判断是否为表达式
describe("isExpression", function() {
    it("['!', {name: 'number'}] should be a expression", function() {
        expect(isExpression(['!', {name: 'number'}])).toBe(true);
    });
    it("[{name: 'number'}, '&&', {name: 'max_len', value: '10'}] should be a expression", function() {
        expect(isExpression([{name: 'number'}, '&&', {name: 'max_len', value: '10'}])).toBe(true);
    });
    it("{name: 'max-len', value: '5'} should not be a expression", function() {
        expect(isExpression({name: 'max-len', value: '5'})).toBe(false);
    });
});

describe("parsePattern", function() {
    it("input.value = ''. The result of parsePattern({name: 'required'}) should be false", function() {
        var input = document.createElement("INPUT")
        input.value = ""
        parsePattern.call(input, {name: "required"}).then(function(result) {
            expect(result).toBe(false)
        })
    })
    it("input.value = '123'. The result of parsePattern({name: 'required'}) should be true", function() {
        var input = document.createElement("INPUT")
        input.value = "123"
        parsePattern.call(input, {name: "required"}).then(function(result) {
            expect(result).toBe(true)
        })
    })
    it("a pattern can with a promise return value", function(done) {
        avalon.validatorPattern.add('asyncMethod', {
            validate: function() {
                var dfd = new Deferred()
                setTimeout(function() {
                    dfd.resolve(true)
                }, 2000)
                return dfd.promise
            }
        })
        parsePattern({name: "asyncMethod"}).then(function(result) {
            expect(result).toBe(true)
            done()
        })
    })
    it("Does not exist pattern should reject with message", function() {
        parsePattern({name: "StealthMan"}).then(function() {}, function(err) {
            expect(typeof err.message).toBe("string")
        })
    })
    it("input.value = '123'. The pattern ['required', '&&', {name: 'numeric'}] should be true", function() {
        var input = document.createElement("INPUT")
        input.value = "123"
        parsePattern.call(input, [{name: 'required'}, '&&', {name: 'numeric'}]).then(function(result) {
            expect(result).toBe(true)
        })
    })
    it("input.value = 'string'. The pattern ['required', '&&', {name: 'numeric'}] should be false", function() {
        var input = document.createElement("INPUT")
        input.value = "string"
        parsePattern.call(input, [{name: 'required'}, '&&', {name: 'numeric'}]).then(function(result) {
            expect(result).toBe(false)
        })
    })
});