/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

var hyd = require('hydrolysis');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");


module hydrolysis {

  export interface EventDescriptor {
    
  }
  
  
  export interface PropertyDescriptor {
    name:string;
    type:string; 
    desc:string;
    default:any;
    readOnly?:boolean;
    params?:Array<Object>;
    published?:boolean;
    function?:boolean;
    private?:boolean;
    
  }
  export interface ElementDescriptor {
    type:string;
    desc:string;    

    events:Array<Object>;
    properties:Array<PropertyDescriptor>;
    
    is:string;

    scriptElement:Object;
    contentHref:string;
    jsdoc:Object;
    
    demos:Array<Object>;
    hero:string;
          
  }  
}

module generator {

  export interface IMemFsEditor {
     
    exists( path:string ):boolean;
    
    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );
    
    
  }


  export interface IOptions {
  }
  
  export interface IElement extends yeoman.IYeomanGenerator {
    fs:IMemFsEditor;

    elementName:string;

    options:IOptions;
   
    // custom
    parseEl( el:hydrolysis.ElementDescriptor );
  }
 
}
 
var generator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    ((yo:generator.IElement) => {
    
      yo.parseEl  = (el:hydrolysis.ElementDescriptor) => {
           
        var result = el.properties.filter( ( value, index, array ) => {
          return !((value.function) || (value.private))  ;
        });
        
         console.log( result );
      }
      
      yo.argument("elementName",
        {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});

    })(this);
    
  },
  initializing: function() {
    ((yo:generator.IElement) => {
      
      if (yo.elementName.indexOf('-') === -1) {
        yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }

    })(this);


  },
  prompting: function () {
    ((yo:generator.IElement) => {

    })(this);

  },
  configuring: function() {
    ((yo:generator.IElement) => {


    })(this);

  },
  gen : function() {
    ((yo:generator.IElement) => {
      
      
      var pathBower = path.join(process.cwd(), 'bower_components')
      // el = "x-foo/x-foo"
      var  el = path.join(this.elementName, this.elementName);

      var pathToEl = path.join(pathBower, el);
  
      var elementHtml = pathToEl.concat('.html');
      
      console.log( "generating typescript for element", this.elementName, elementHtml );
      
      hyd.Analyzer.analyze( elementHtml )
        .then((analyzer) => {
        
          yo.parseEl( analyzer.elementsByTagName[this.elementName] );
      });

    })(this);

  },
  end:function() {
    ((yo:generator.IElement) => {

    })(this);

  }

} );


module.exports = generator;
