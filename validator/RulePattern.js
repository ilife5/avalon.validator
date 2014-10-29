define(["avalon"], function(avalon) {
    var alpha = /^[a-zA-Z]+$/,
        alphanumeric = /^[a-zA-Z0-9]+$/,
        numeric = /^-?[0-9]+$/,
        int = /^(?:-?(?:0|[1-9][0-9]*))$/,
        float = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
        hexadecimal = /^[0-9a-fA-F]+$/,
        hexcolor = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        remail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

    avalon.validatorPattern = {
        required: {
            message: "请填写此字段" ,
            validate: function(value) {
                return value !== ""
            }
        },
        url: {
            message: "",
            validate: function(value) {

            }
        },
        empty: {
            message: "允许为空" ,
            validate: function(value) {
                return value === ""
            }
        },
        numeric: {
            message: "请输入数值",
            validate: function(value) {
                return numeric.test( value )
            }
        },
        email: {
            message: "请输入电子邮件地址",
            validate: function(value) {
                return remail.test(value)
            }
        }
    }

    avalon.validatorPattern.add = function(name, pattern) {
        if(typeof func === void 0) {
            return avalon.validatorPattern.name
        } else {
            avalon.validatorPattern[name] = pattern
        }
    }

    return avalon
})