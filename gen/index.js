var hyd = require('hydrolysis');
var mkdirp = require("mkdirp");
var path = require("path");
var _s = require('underscore.string');
var yeoman = require("yeoman-generator");
var GeneratorPolymerTS;
(function (GeneratorPolymerTS) {
    var Gen = (function () {
        function Gen() {
            yeoman.generators.Base.apply(this, arguments);
            this.yo = this;
            this.yo.argument("elementName", { required: true, type: 'string', desc: "element name. Must contains dash symbol!" });
            this.yo.option("elpath", { desc: "element source path" });
            this.yo.option("path", { desc: "element output path", defaults: "typings/polymer" });
        }
        Gen.prototype._parseElement = function (analyzer) {
            var _this = this;
            var el = analyzer.elementsByTagName[this.elementName];
            mkdirp.sync(this.options.path);
            if (el.behaviors && el.behaviors.length == 0) {
                el.behaviors = null;
            }
            if (analyzer.behaviors) {
                var set = {};
                analyzer.behaviors.forEach(function (v, index, array) {
                    if (!set[v.is]) {
                        set[v.is] = v;
                        _this._parseBehavior(v);
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
            var target = path.join(this.options.path, el.is.concat(".d.ts"));
            try {
                this.yo.template(path.join(__dirname, 'templates/_element.tst'), target, { element: el,
                    moduleName: module,
                    className: _s.classify(el.is),
                    props: publicProps,
                    methods: publicMethods,
                    templateParams: this._templateParams,
                    templateType: this._templateType,
                    templateDesc: this._templateDesc
                });
                this._unescapeFile(target);
            }
            catch (e) {
                this.yo.log("error: " + e);
            }
        };
        Gen.prototype._parseBehavior = function (el) {
            var tk = el.is.split('.');
            var module = (tk.length == 1) ? "Polymer" : tk[0];
            var name = (tk.length == 1) ? tk[0] : tk[1];
            var target = path.join(this.options.path, name.concat(".d.ts"));
            var publicProps = el.properties.filter(function (value, index, array) {
                return !((value.function) || (value.private));
            });
            var publicMethods = el.properties.filter(function (value, index, array) {
                return ((value.function) && !(value.private));
            });
            try {
                this.yo.template(path.join(__dirname, 'templates/_behaviour.tst'), target, { element: el,
                    moduleName: module,
                    className: _s.classify(name),
                    props: publicProps,
                    methods: publicMethods,
                    templateParams: this._templateParams,
                    templateType: this._templateType,
                    templateDesc: this._templateDesc
                });
                this._unescapeFile(target);
            }
            catch (e) {
                console.log("error: ", e);
            }
        };
        Gen.prototype._templateParams = function (params) {
            if (!params)
                return "";
            return params.map(function (value, index, array) {
                return value.type ? (value.name + ': ' + value.type) : value.name;
            }).join(', ');
        };
        Gen.prototype._templateType = function (p) {
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
        Gen.prototype._templateDesc = function (p, tabs) {
            if (tabs === void 0) { tabs = '\t'; }
            var desc = p.desc || '';
            var newline = new RegExp('\\n', 'g');
            var comment = new RegExp('\\*/', 'g');
            return desc.replace(newline, '\n\t' + tabs).replace(comment, '');
        };
        Gen.prototype._unescapeFile = function (path) {
            var content = this.fs.read(path);
            this.fs.write(path, _s.unescapeHTML(content.toString()));
        };
        Gen.prototype.initializing = function () {
            if (this.elementName.indexOf('-') === -1) {
                this.yo.emit('error', new Error('Element name must contain a dash "-"\n' +
                    'ex: yo polymer:el my-element'));
            }
        };
        Gen.prototype.configuring = function () {
        };
        Gen.prototype.prompting = function () {
        };
        Gen.prototype.execute = function () {
            var _this = this;
            var pathBower = path.join(process.cwd(), 'bower_components');
            var el = (this.options.elpath) ?
                path.join(this.options.elpath, this.elementName) :
                path.join(this.elementName, this.elementName);
            var pathToEl = path.join(pathBower, el);
            var elementHtml = pathToEl.concat('.html');
            console.log("generating typescript for element", this.elementName, elementHtml);
            hyd.Analyzer.analyze(elementHtml)
                .then(function (analyzer) {
                _this._parseElement(analyzer);
            });
        };
        Gen.prototype.end = function () {
        };
        return Gen;
    })();
    GeneratorPolymerTS.Gen = Gen;
})(GeneratorPolymerTS || (GeneratorPolymerTS = {}));
var gen = yeoman.generators.Base.extend(GeneratorPolymerTS.Gen.prototype);
module.exports = gen;
//# sourceMappingURL=index.js.map