// Karma configuration
// Generated on Wed Sep 17 2014 21:25:20 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        "./vendor/jquery.js",
        "./vendor/jasmine-jquery.js",
        {
            "pattern": "test/*.html",
            "included": false
        },
        {
            "pattern": "validator/*.js",
            "included": false
        },
        "./avalon.js",
	{
            "pattern": "./avalon.getModel.js",
            "included": false
        },
        {  
            "pattern": "./deferred.js",
            "included": false
        },
        "./test/spec.js",
        {
            "pattern": "./test/*.js",
            "included": false
        }
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html'],

    htmlReporter: {
        outputFile: "tests/units.html"
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 20000,
    
    plugins : [
	"karma-jasmine",
	"karma-chrome-launcher",
	"karma-firefox-launcher",
        "karma-htmlfile-reporter"
    ]

  });
};
