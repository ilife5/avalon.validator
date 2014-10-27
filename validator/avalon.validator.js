define(["avalon.getModel", "validator/RuleParse", "validator/RulePattern", "validator/validate"], function(avalon) {

    var rword = /[^, ]+/g, //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
        defaults = {
            "events": ["focus", "blur", "input"]
        },
        specialEventType = {
            "focus": "focusin",
            "blur": "focusout"
        },
        focusinBubbles = "onfocusin" in document

    avalon.bindingHandlers.validate = function(data, vmodels) {

        var form = data.element,
            events = avalon.mix(true, defaults.events, ["input"]),
            widgetName = "validate",
            optVm

        //解析data.value，获取配置项，操作id
        var args = data.value.match(rword) || [],
            optName     //配置项属性名
        if (args[0] === "$" || !args[0]) {
            args[0] = widgetName + setTimeout("1")
        }
        data.value = args.join(",")
        optName = args[1] || widgetName
        optVm = avalon.getModel(optName, vmodels)

        //使用内部的vm提供调用接口
        avalon.define(args[0], function(vm) {

            /**
             * 遍历elements，返回验证结果
             */
            vm.validate = function() {}
        });

        //构造与controls的通信机制
        //一种通信是通过事件代理，在from上监听controls的事件
        //另一种是form直接调用controls
        eventBind(form, events, function(evt) {
            evt = evt ? evt : window.event
            console.log(evt.target.value)
        })
    }

    function eventBind(elem, events, handler) {
        var $elem = avalon(elem);

        avalon.each(events, function(i, evt) {

            if(evt === "focus" || evt === "blur") {
                // http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
                // Support: Firefox, Chrome, Safari
                if(!focusinBubbles) {
                    $elem.bind(evt, handler, true)
                } else {
                    elem["on"+specialEventType[evt]] = handler
                }
            } else if( evt === "input" ) {
                //当需要支持input事件时，相当于想要支持输入，粘贴
                //http://www.quirksmode.org/dom/events/cutcopypaste.html
                avalon.each(["keydown", "paste"], function(i, event) {
                    $elem.bind(event, function(evt) {
                        lazyExecute(evt, handler)
                    })
                })
            } else {
                $elem.bind(evt, handler)
            }

        })
    }

    function lazyExecute(evt, handler) {
        var _this = this
        if(lazyExecute.id) {
            clearTimeout(lazyExecute.id)
        }
        return lazyExecute.id = setTimeout(function() {
            lazyExecute.id = null
            handler.call(_this, evt)
        }, 200)
    }

    /**
     * 规则抽取
     */
    function getRules(elements) {
        //分别获取required，type，以及pattern的值

        return ""
    }

    return avalon

});