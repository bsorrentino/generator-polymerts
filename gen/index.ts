/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

var hyd = require('hydrolysis');

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
}

module generator {

  export interface IMemFsEditor {
     
    exists( path:string ):boolean;
    
    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );
    
    
  }


  export interface IOptions {
    output:string;
  }
  
  export interface ThisGenerator extends yeoman.IYeomanGenerator {
    fs:IMemFsEditor;

    elementName:string;
    className:string;
    options:IOptions;
    // custom
     
    element:hydrolysis.ElementDescriptor
    publicProps:Array<hydrolysis.PropertyDescriptor>;
    publicMethods:Array<hydrolysis.PropertyDescriptor>;
    
    parseEl( el:hydrolysis.ElementDescriptor );
    templateParams( params:Array<Object> ):string ;
    templateType( p:hydrolysis.PropertyDescriptor ):string;
  }
 
}

var generator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    ((yo:generator.ThisGenerator) => {
      
      yo.templateType = ( p:hydrolysis.PropertyDescriptor ):string => {
        
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
      
      yo.templateParams = ( params?:Array<Object> ):string  => {
        
        if( !params ) return "";

        return params.map<string>( ( value, index, array:Object[]) => {               
          return value.name ;      
        }).join(', ');
      }
    
      yo.parseEl  = (el:hydrolysis.ElementDescriptor) => {
        
        console.log( el );
        
        yo.element = el;
        
        yo.publicProps = el.properties.filter( ( value, index, array ) => {
          return !((value.function) || (value.private))  ;
        });
        yo.publicMethods = el.properties.filter( ( value, index, array ) => {
          //console.log( "params",  value.params, yo.templateParams( value.params ) );
          return ((value.function) && !(value.private))  ;
        });
        
        var target = path.join( yo.options.output, yo.elementName.concat(".ts"));
        
        yo.template( path.join(__dirname, 'templates/_element.ts'), target);
        
        
        var content:string = yo.fs.read(target);
        yo.fs.write( target, _s.unescapeHTML(content) );
      }

      yo.argument("elementName",
        {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});
 
      yo.option("output",{desc:"element output path", defaults:"typings/polymer"})  
 
    })(this);
    
  },
  initializing: function() {
    ((yo:generator.ThisGenerator) => {
      
      if (yo.elementName.indexOf('-') === -1) {
        yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }

    })(this);


  },
  prompting: function () {
    ((yo:generator.ThisGenerator) => {

    })(this);

  },
  configuring: function() {
    ((yo:generator.ThisGenerator) => {


    })(this);

  },
  gen : function() {
    ((yo:generator.ThisGenerator) => {
      
      
      var pathBower = path.join(process.cwd(), 'bower_components')
      // el = "x-foo/x-foo"
      var  el = path.join(this.elementName, this.elementName);

      var pathToEl = path.join(pathBower, el);
  
      var elementHtml = pathToEl.concat('.html');
      
      console.log( "generating typescript for element", this.elementName, elementHtml );
       
      yo.className = _s.classify(yo.elementName)
      
      hyd.Analyzer.analyze( elementHtml )
        .then((analyzer) => {
        

          yo.parseEl( analyzer.elementsByTagName[this.elementName] );
      });

    })(this);

  },
  end:function() {
    ((yo:generator.ThisGenerator) => {

    })(this);

  }

} );


module.exports = generator;
