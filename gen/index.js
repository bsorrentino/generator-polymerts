/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
var hyd = require('hydrolysis');
var path = require("path");
var yeoman = require("yeoman-generator");
var generator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        (function (yo) {
            yo.existsElementsFile = function () {
                return yo.fs.exists('app/elements/elements.html');
            };
            yo.argument("elementName", { required: true, type: 'string', desc: "element name. Must contains dash symbol!" });
        })(this);
    },
    initializing: function () {
        (function (yo) {
            if (yo.elementName.indexOf('-') === -1) {
                yo.emit('error', new Error('Element name must contain a dash "-"\n' +
                    'ex: yo polymer:el my-element'));
            }
        })(this);
    },
    prompting: function () {
        (function (yo) {
        })(this);
    },
    configuring: function () {
        (function (yo) {
        })(this);
    },
    gen: function () {
        var _this = this;
        (function (yo) {
            var pathBower = path.join(process.cwd(), 'bower_components');
            // el = "x-foo/x-foo"
            var el = path.join(_this.elementName, _this.elementName);
            var pathToEl = path.join(pathBower, el);
            var elementHtml = pathToEl.concat('.html');
            console.log("generating typescript for element", _this.elementName, elementHtml);
            hyd.Analyzer.analyze(elementHtml)
                .then(function (analyzer) {
                console.log(analyzer.elementsByTagName[_this.elementName]);
            });
        })(this);
    },
    end: function () {
        (function (yo) {
        })(this);
    }
});
module.exports = generator;
