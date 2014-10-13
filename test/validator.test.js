function avalonConfig() {
    avalon.config({
        debug: false
    });
}

avalon.define("demo", function() {});

/*
describe("get fixtures use jasmine.getFixtures", function() {
    it("should get html from path", function() {
        var f = jasmine.getFixtures();
        f.fixturesPath = 'base';
        f.load("test/index.html");
        avalon.scan();
    });
});*/
