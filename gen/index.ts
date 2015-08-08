/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

var hyd = require('hydrolysis');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");

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
    existsElementsFile();
  }
 
}
 
var generator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    ((yo:generator.IElement) => {
    
      yo.existsElementsFile  = () => {
       return  yo.fs.exists('app/elements/elements.html');
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
        console.log(analyzer.elementsByTagName[this.elementName])
      });

    })(this);

  },
  end:function() {
    ((yo:generator.IElement) => {

    })(this);

  }

} );


module.exports = generator;
