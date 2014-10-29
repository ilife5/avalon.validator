define(["avalon.getModel", "validator/validate", "deferred"], function(avalon, validate, Deferred) {

    var specialEventType = {
            "focus": "focusin",
            "blur": "focusout"
        },
        focusinBubbles = "onfocusin" in document

    var widget = avalon.ui.validator = function(form, data, vmodels) {

        var options = data["validatorOptions"],
            vmodel


        //使用内部的vm提供调用接口

        vmodel = avalon.define({
            $id: data["validatorId"],
            validate: function() {},
            $init: function() {
                //构造与controls的通信机制
                //一种通信是通过事件代理，在from上监听controls的事件
                //另一种是form直接调用controls
                eventBind(form, options.events, function(evt) {
                    evt = evt ? evt : window.event
                    var element = evt.target
                    validate(element).then(function(result) {
                        options.onValidate.call(element, element, result)
                    }, function(err) {
                        avalon.log(err)
                    })
                })
            }
        })

        return vmodel
    }

    widget.defaults = {
        "events": ["focus", "blur", "input"],
        "onValidate": avalon.noop
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