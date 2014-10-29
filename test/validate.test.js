//test validate/validate.js
define(["validator/validate"], function(validate) {
    describe("validate", function() {
        it("validate <input required> should be false", function() {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            validate(input).then(function(result) {
                expect(result).toBe(false)
            })
        })
        it("validate <input required> should be false", function() {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            validate(input).then(function(result) {
                expect(result).toBe(false)
            })
        })
        it("validate <input required value=123> should be true", function() {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.value = 123
            validate(input).then(function(result) {
                expect(result).toBe(true)
            })
        })
        it("validate <input required value=123 type=email> should be false", function() {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("type", "email")
            input.value = 123
            validate(input).then(function(result) {
                expect(result).toBe(true)
            })
        })
        it("validate <input required value=test@qq.com type=email> should be true", function() {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("type", "email")
            input.value = "test@qq.com"
            validate(input).then(function(result) {
                expect(result).toBe(true)
            })
        })
    })
})


