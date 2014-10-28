var callback = window.__karma__.loaded
window.__karma__.loaded = avalon.noop

require(["test/RuleParse.test"], function() {
    callback.call(window.__karma__)
    window.__karma__.loaded = callback
})
