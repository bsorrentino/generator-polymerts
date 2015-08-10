/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
var hyd = require('hydrolysis');
var path = require("path");
var _s = require('underscore.string');
var yeoman = require("yeoman-generator");
var generator = yeoman.generators.Base.extend({
    constructor: function () {
        var _this = this;
        yeoman.generators.Base.apply(this, arguments);
        (function (yo) {
            yo.argument("elementName", { required: true, type: 'string', desc: "element name. Must contains dash symbol!" });
            yo.option("elpath", { desc: "element source path" });
            yo.option("path", { desc: "element output path", defaults: "typings/polymer" });
            yo.unescapeFile = function (path) {
                var content = yo.fs.read(path);
                yo.fs.write(path, _s.unescapeHTML(content.toString()));
            };
            yo.templateDesc = function (p) {
                var r = new RegExp('\\*/', 'g');
                return p.desc.replace(r, '');
            };
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
            yo.parseBehavior = function (el) {
                var tk = el.is.split('.');
                var module = (tk.length == 1) ? "Polymer" : tk[0];
                var name = (tk.length == 1) ? tk[0] : tk[1];
                var target = path.join(yo.options.path, name.concat(".d.ts"));
                var publicProps = el.properties.filter(function (value, index, array) {
                    return !((value.function) || (value.private));
                });
                var publicMethods = el.properties.filter(function (value, index, array) {
                    return ((value.function) && !(value.private));
                });
                yo.template(path.join(__dirname, 'templates/_behaviour.ts'), target, { element: el,
                    moduleName: module,
                    className: _s.classify(name),
                    props: publicProps,
                    methods: publicMethods,
                    templateParams: yo.templateParams,
                    templateType: yo.templateType,
                    templateDesc: yo.templateDesc
                });
                yo.unescapeFile(target);
            };
            yo.parse = function (analyzer) {
                var el = analyzer.elementsByTagName[_this.elementName];
                yo.mkdir(yo.options.path);
                if (analyzer.behaviors) {
                    var set = {};
                    analyzer.behaviors.forEach(function (v, index, array) {
                        if (!set[v.is]) {
                            set[v.is] = v;
                            yo.parseBehavior(v);
                        }
                    });
                }
                var publicProps = el.properties.filter(function (value, index, array) {
                    return !((value.function) || (value.private));
                });
                var publicMethods = el.properties.filter(function (value, index, array) {
                    return ((value.function) && !(value.private));
                });
                var module = el.is.split('-')[0];
                var target = path.join(yo.options.path, el.is.concat(".d.ts"));
                yo.template(path.join(__dirname, 'templates/_element.ts'), target, { element: el,
                    moduleName: module,
                    className: _s.classify(el.is),
                    props: publicProps,
                    methods: publicMethods,
                    templateParams: yo.templateParams,
                    templateType: yo.templateType,
                    templateDesc: yo.templateDesc
                });
                yo.unescapeFile(target);
            };
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
            var el = (yo.options.elpath) ?
                path.join(yo.options.elpath, _this.elementName) :
                path.join(_this.elementName, _this.elementName);
            var pathToEl = path.join(pathBower, el);
            var elementHtml = pathToEl.concat('.html');
            console.log("generating typescript for element", _this.elementName, elementHtml);
            hyd.Analyzer.analyze(elementHtml)
                .then(function (analyzer) {
                yo.parse(analyzer);
            });
        })(this);
    },
    end: function () {
        (function (yo) {
        })(this);
    }
});
module.exports = generator;
