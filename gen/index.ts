/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
///  <reference path='../typings/mkdirp/mkdirp.d.ts' />

var hyd = require('hydrolysis');

import mkdirp = require("mkdirp");

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");


module hydrolysis {

  export interface Descriptor {
    desc:string;
  }
  export interface EventDescriptor extends Descriptor {
       jsdoc:Array<Object>;
       name:string;
       params:Array<Object>;
  }


  export interface PropertyDescriptor extends Descriptor{
    name:string;
    type:string;
    default:any;
    readOnly?:boolean;
    params?:Array<Object>;
    published?:boolean;
    function?:boolean;
    private?:boolean;

  }
  export interface ElementDescriptor extends Descriptor {
    type:string;

    behaviors:Array<string>;
    events:Array<EventDescriptor>;
    properties:Array<PropertyDescriptor>;

    is:string;

    scriptElement:Object;
    contentHref:string;
    jsdoc:Object;

    demos:Array<Object>;
    hero:string;

  }

  export interface BehaviorDescriptor extends ElementDescriptor  { }


  export interface Analyzer {

    behaviors:Array<BehaviorDescriptor>;

    elementsByTagName:{ [name: string]: ElementDescriptor };


  }

}

module GeneratorPolymerTS {

  type yo = yo.YeomanGeneratorBase;

  export interface IMemFsEditor {

    exists( path:string ):boolean;

    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );


  }


  export interface IOptions {
    elpath:string;
    path:string;

  }

  // YEOMAN GENERATOR GENERATOR
  export class Gen /* extends yeoman.IYeomanGenerator */ {
    fs:IMemFsEditor;
    // custom

    options:IOptions;
    elementName:string;

    yo:yo; // this reference as yo.YeomanGeneratorBase

    private _parseElement( analyzer:hydrolysis.Analyzer ) {

      var el = analyzer.elementsByTagName[this.elementName];

      mkdirp.sync( this.options.path );

      if( analyzer.behaviors ) {
          var set = {};

          analyzer.behaviors.forEach( (v, index, array ) => {
              if( !set[v.is] ) { // apply once
                set[v.is] = v;
                this._parseBehavior(v);
              }
          });

      }

      var publicProps = el.properties.filter( ( value, index, array ) => {
        return !((value.function) || (value.private))  ;
      });

      var publicMethods = el.properties.filter( ( value, index, array ) => {
        return ((value.function) && !(value.private))  ;
      });

      var module = el.is.split('-')[0];

      var target = path.join( this.options.path, el.is.concat(".d.ts"));

      try  {
          this.yo.template( path.join(__dirname, 'templates/_element.tst'), target ,
              { element: el,
                  moduleName:module,
                  className:_s.classify(el.is),
                  props:publicProps,
                  methods:publicMethods,
                  templateParams:this._templateParams,
                  templateType:this._templateType,
                  templateDesc:this._templateDesc

              }
          );
          this._unescapeFile(target);
      }
      catch( e ) {
          this.yo.log( "error: " + e);
      }


    }
    private _parseBehavior( el:hydrolysis.BehaviorDescriptor ) {
      var tk =  el.is.split('.');

      var module = ( tk.length == 1 ) ? "Polymer" : tk[0];
      var name = ( tk.length == 1 ) ? tk[0] : tk[1];

      var target = path.join( this.options.path, name.concat(".d.ts"));

      var publicProps = el.properties.filter( ( value, index, array ) => {
        return !((value.function) || (value.private))  ;
      });

      var publicMethods = el.properties.filter( ( value, index, array ) => {
        return ((value.function) && !(value.private))  ;
      });

      try {
          this.yo.template( path.join(__dirname, 'templates/_behaviour.tst'), target,
              { element: el,
                  moduleName:module,
                  className:_s.classify(name),
                  props:publicProps,
                  methods:publicMethods,
                  templateParams:this._templateParams,
                  templateType:this._templateType,
                  templateDesc:this._templateDesc
              }
          );

          this._unescapeFile(target);
      }
      catch( e ) {
          console.log( "error: ", e);
      }

    }
    private _templateParams( params:Array<Object> ):string {
      if( !params ) return "";

      return params.map<string>( ( value, index, array:Object[]) => {
        return value.name ;
      }).join(', ');

    }
    private _templateType( p:hydrolysis.PropertyDescriptor ):string {
      switch(p.type){
        case'*':
          return 'any';
        case 'Array':
          return 'Array<any>'
        case 'Object':
          return p.type;
        default:
          return p.type.toLowerCase();
      }

    }
    private _templateDesc( p:hydrolysis.Descriptor, tabs:string = '\t' ):string{
      var desc = p.desc || '';
      var newline = new RegExp( '\\n', 'g');
      var comment = new RegExp( '\\*/', 'g');
      return desc.replace(newline, '\n\t' + tabs ).replace( comment, '' );

    }
    private _unescapeFile( path:string ) {
      var content = this.fs.read(path);
      this.fs.write( path, _s.unescapeHTML(content.toString()) );

    }

    constructor() {
      yeoman.generators.Base.apply(this, arguments);
      //console.log( "Gen.constructor");

      this.yo = <any>this; // this reference as yo.YeomanGeneratorBase

      this.yo.argument("elementName",
        {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});

      this.yo.option("elpath",{desc:"element source path"});
      this.yo.option("path",{desc:"element output path", defaults:"typings/polymer"}) ;

    }
    // YO METHOD
    initializing() {
      //console.log( "Gen.initializing");

      if (this.elementName.indexOf('-') === -1) {
        this.yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }
    }
    // YO METHOD
    configuring() {
      //console.log( "Gen.configuring");
    }
    // YO METHOD
    prompting() {
      //console.log( "Gen.prompting");
    }
    // GOAL METHOD
    execute() {
      //console.log( "Gen.execute" );
      var pathBower = path.join(process.cwd(), 'bower_components');

      var el =  ( this.options.elpath ) ?
        path.join(this.options.elpath, this.elementName) :
        path.join(this.elementName, this.elementName);

      var pathToEl = path.join(pathBower, el);

      var elementHtml = pathToEl.concat('.html');

      console.log( "generating typescript for element", this.elementName, elementHtml );

      hyd.Analyzer.analyze( elementHtml )
        .then((analyzer) => {
          this._parseElement( analyzer );
      });
    }
    // YO METHOD
    end() {
    }

  }

}

var gen = yeoman.generators.Base.extend(GeneratorPolymerTS.Gen.prototype);


module.exports = gen;
