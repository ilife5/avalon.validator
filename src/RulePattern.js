var alpha = /^[a-zA-Z]+$/
    , alphanumeric = /^[a-zA-Z0-9]+$/
    , numeric = /^-?[0-9]+$/
    , int = /^(?:-?(?:0|[1-9][0-9]*))$/
    , float = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
    , hexadecimal = /^[0-9a-fA-F]+$/
    , hexcolor = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

avalon.validatorPattern = {
    required: {//不能为空
        message : "请填写此字段" ,
        validate : function() {
            return this.value !== ""
        }
    },
    empty: {
        message : "允许为空" ,
        validate : function() {
            return this.value === ""
        }
    },
    numeric: {
        message : "请输入数值",
        validate : function() {
            return numeric.test( this.value )
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