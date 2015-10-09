//test validate/validate.js
define(["validator/validate"], function(validate, RuleParse) {

    describe("validate", function() {
        it("validate <input required> should be false", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            validate(input).then(function(result) {
                expect(result.result).toBe(false)
                done()
            })
        })
        it("validate <input required> should be false", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            validate(input).then(function(result) {
                expect(result.result).toBe(false)
                done()
            })
        })
        it("validate <input required value=123> should be true", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.value = 123
            validate(input).then(function(result) {
                expect(result.result).toBe(true)
                done()
            })
        })
        it("validate <input required value=123 type=email> should be false", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("type", "email")
            input.value = 123
            validate(input).then(function(result) {
                expect(result.result).toBe(false)
                done()
            })
        })
        it("validate <input required value=test@qq.com type=email> should be true", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("type", "email")
            input.value = "test@qq.com"
            validate(input).then(function(result) {
                expect(result.result).toBe(true)
                done()
            })
        })
        it("validate <input required value=test data-validator-pattern=email||numeric> should be false", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("data-validator-pattern", "email||numeric")
            input.value = "test"
            validate(input).then(function(result) {
                expect(result.result).toBe(false)
                done()
            })
        })
        it("validate <input required value=123 data-validator-pattern=email||numeric> should be true", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("required", "")
            input.setAttribute("data-validator-pattern", "email||numeric")
            input.value = "123"
            validate(input).then(function(result) {
                expect(result.result).toBe(true)
                done()
            })
        })
        it("validate <input value=123 data-validator-pattern=email&&(numeric||word)> should be true", function(done) {
            var input = document.createElement("INPUT")
            input.setAttribute("data-validator-pattern", "email&&(numeric||word)")
            input.value = "123"
            validate(input).then(function(result) {
                expect(result.result).toBe(false)
                done()
            })
        })
    })
})


