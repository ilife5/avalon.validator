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
                    evt = fixEvent(evt || window.event)
                    var element = evt.target
                    validate(element).then(function(result) {
                        options.onValidate.call(element, element, result)
                    }, function(err) {
                        avalon.log(err)
                    })
                })
            },
            validate: function() {
                //
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

    function fixEvent(event) {
        var ret = {}
        for (var i in event) {
            ret[i] = event[i]
        }
        var target = ret.target = event.srcElement
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if (/mouse|click/.test(event.type)) {
            var doc = target.ownerDocument || DOC
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
            ret.wheelDeltaY = ret.wheelDelta
            ret.wheelDeltaX = 0
        }
        ret.timeStamp = new Date - 0
        ret.originalEvent = event
        ret.preventDefault = function() { //阻止默认行为
            event.returnValue = false
        }
        ret.stopPropagation = function() { //阻止事件在DOM树中的传播
            event.cancelBubble = true
        }
        return ret
    }

    return avalon

});