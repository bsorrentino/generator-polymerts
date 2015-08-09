/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
var hyd = require('hydrolysis');
var path = require("path");
var _s = require('underscore.string');
var yeoman = require("yeoman-generator");
var generator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        (function (yo) {
            yo.templateType = function (p) {
                switch (p.type) {
                    case '*':
                        return 'any';
                    case 'Array':
                        return 'Array<any>';
                    case 'Object':
                        return p.type;
                    default:
                        return p.type.toLowerCase();
                }
            };
            yo.templateParams = function (params) {
                if (!params)
                    return "";
                return params.map(function (value, index, array) {
                    return value.name;
                }).join(', ');
            };
            yo.parseEl = function (el) {
                console.log(el);
                yo.element = el;
                yo.publicProps = el.properties.filter(function (value, index, array) {
                    return !((value.function) || (value.private));
                });
                yo.publicMethods = el.properties.filter(function (value, index, array) {
                    //console.log( "params",  value.params, yo.templateParams( value.params ) );
                    return ((value.function) && !(value.private));
                });
                var target = path.join(yo.options.output, yo.elementName.concat(".ts"));
                yo.template(path.join(__dirname, 'templates/_element.ts'), target);
                var content = yo.fs.read(target);
                yo.fs.write(target, _s.unescapeHTML(content));
            };
            yo.argument("elementName", { required: true, type: 'string', desc: "element name. Must contains dash symbol!" });
            yo.option("output", { desc: "element output path", defaults: "typings/polymer" });
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
            yo.className = _s.classify(yo.elementName);
            hyd.Analyzer.analyze(elementHtml)
                .then(function (analyzer) {
                yo.parseEl(analyzer.elementsByTagName[_this.elementName]);
            });
        })(this);
    },
    end: function () {
        (function (yo) {
        })(this);
    }
});
module.exports = generator;
