/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
//import $ = require('cheerio');
var path = require("path");
var _s = require('underscore.string');
var yeoman = require("yeoman-generator");
var generator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        //console.log( "constructor!");
        (function (yo) {
            yo.existsElementsFile = function () {
                return yo.fs.exists('app/elements/elements.html');
            };
            yo.dependencies = ["polymer-ts.html"];
            yo.argument("elementName", { required: true, type: 'string', desc: "element name. Must contains dash symbol!" });
            yo.option("path", { desc: "element output path", defaults: "app" });
        })(this);
    },
    initializing: function () {
        //console.log( "initializing!");
        (function (yo) {
            if (yo.elementName.indexOf('-') === -1) {
                yo.emit('error', new Error('Element name must contain a dash "-"\n' +
                    'ex: yo polymer:el my-element'));
            }
        })(this);
    },
    prompting: function () {
        //console.log( "prompting!" );
        (function (yo) {
            if (!yo.existsElementsFile())
                return;
            var done = yo.async();
            var prompts = [
                {
                    name: 'includeImport',
                    message: 'Would you like to include an import in your elements.html file?',
                    type: 'confirm',
                    default: false
                }
            ];
            yo.prompt(prompts, function (answers) {
                yo.includeImport = answers.includeImport;
                done();
            }.bind(yo));
        })(this);
    },
    configuring: function () {
        //console.log( "configuring!" );
        (function (yo) {
        })(this);
    },
    element: function () {
        //console.log( "element writing!");
        var _this = this;
        (function (yo) {
            console.log("writing");
            // el = "x-foo/x-foo"
            var el = path.join(_this.elementName, _this.elementName);
            // pathToEl = "app/elements/foo/bar/x-foo"
            var pathToEl = path.join(yo.options.path, "elements", el);
            console.log("el", el, "pathToEl", pathToEl);
            // Used by element template
            yo.pathToBower = path.relative(path.dirname(pathToEl), path.join(process.cwd(), yo.options.path, 'bower_components'));
            yo.template(path.join(__dirname, 'templates/_element.html'), pathToEl.concat('.html'));
            yo.className = _s.classify(yo.elementName);
            yo.template(path.join(__dirname, 'templates/_element.ts'), pathToEl.concat('.ts'));
            // Wire up the dependency in elements.html
            if (yo.includeImport && yo.existsElementsFile()) {
                var elementsPath = path.join(yo.options.path, 'elements/elements.html');
                var file = yo.fs.read(elementsPath);
                el = el.replace('\\', '/');
                file += '<link rel="import" href="' + el + '.html">\n';
                yo.fs.write(elementsPath, file);
            }
        })(this);
    },
    end: function () {
        //console.log( "end" );
        (function (yo) {
        })(this);
    }
});
module.exports = generator;
