/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

//import $ = require('cheerio');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");

module GeneratorPolymerTS {

  type yo = yo.YeomanGeneratorBase;

  export interface IMemFsEditor {

    exists( path:string ):boolean;

    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );

  }

  export interface IOptions {
    path:string;
    nodecorator:boolean;
  }

  export class El  {
    fs:IMemFsEditor;

    includeImport:boolean;
    elementName:string;
    className:string;
    pathToBower:string;
    options:IOptions;

    dependencies:Array<String>;

    yo:yo;

    constructor() {
      yeoman.generators.Base.apply(this, arguments);

      this.yo = <any>this;

      this.dependencies = [ "polymer","polymer-ts" ];

      this.yo.argument("elementName",
          {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});

      this.yo.option("path",{desc:"element output path", defaults:"app"});
      this.yo.option("nodecorator",{desc:"generate element without decorator. TS < 1.5 compatibility", defaults:false}) ;

    }

    initializing() {

      if (this.elementName.indexOf('-') === -1) {
        this.yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }
    }

    prompting() {
        if( !this._existsElementsFile() ) return;

        var done = this.yo.async();

        var prompts = [
          {
            name: 'includeImport',
            message: 'Would you like to include an import in your elements.html file?',
            type: 'confirm',
            default: false
          }
        ];

        this.yo.prompt(prompts, function (answers:any) {
          this.yo.includeImport = answers.includeImport;
          done();
        }.bind(this.yo));

    }

    configuring() {
    }

    // MAIN TASK
    execute() {
          //console.log( "El.execute" );

          // el = "x-foo/x-foo"
          var  el = path.join(this.elementName, this.elementName);

          // pathToEl = "app/elements/foo/bar/x-foo"
          var pathToEl = path.join(this.options.path, "elements", el);


          console.log( "Generating Element", el, "pathToEl", pathToEl);

          // Used by element template
          this.pathToBower = path.relative(
            path.dirname(pathToEl),
            path.join(process.cwd(), this.options.path, 'bower_components')
          );

          this.yo.template(path.join(__dirname, 'templates/_element.html'), pathToEl.concat('.html'));
          this.yo.template(path.join(__dirname, 'templates/_demo.html'),
              path.join(this.options.path, "elements", this.elementName, "demo.html"));

          this.className = _s.classify(this.elementName)

          var templateEl = (!this.options.nodecorator) ? 'templates/_element.tst' : 'templates/_element-no-decorator.tst' ;

          try {

              this.yo.template(path.join(__dirname, templateEl), pathToEl.concat('.ts'));

              if (this.includeImport && this._existsElementsFile()) {

                  var elementsPath = path.join( this.options.path,'elements/elements.html')
                  var file = this.fs.read(elementsPath);
                  el = el.replace('\\', '/');
                  file += '<link rel="import" href="' + el + '.html">\n';
                  this.fs.write(elementsPath, file);
              }
          }
          catch( e ) {
              this.yo.log( "error: " + e);
          }
      }

      end() {
      }

    // custom
    private _existsElementsFile() {
      return  this.fs.exists('app/elements/elements.html');
    }


  }

} // end generator module

var generator = yeoman.generators.Base.extend(GeneratorPolymerTS.El.prototype);


module.exports = generator;
