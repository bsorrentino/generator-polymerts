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
 
  export interface BehaviorDescriptor extends ElementDescriptor  { }


  export interface Analyzer {
    
    behaviors:Array<BehaviorDescriptor>;

    elementsByTagName:{ [name: string]: ElementDescriptor };
    
    
  }
  
}

module generator {

  export interface IMemFsEditor {
     
    exists( path:string ):boolean;
    
    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );
    
    
  }


  export interface IOptions {
    elpath:string;
    path:string;
    
  }
  
  export interface ThisGenerator extends yeoman.IYeomanGenerator {
    fs:IMemFsEditor;
    
    mkdir( path:string );

    // custom

    options:IOptions;
    elementName:string; 
    
    parseBehavior( el:hydrolysis.BehaviorDescriptor );
    parse( analyzer:hydrolysis.Analyzer );
    
    templateParams( params:Array<Object> ):string ;
    templateType( p:hydrolysis.PropertyDescriptor ):string;
    templateDesc( p:hydrolysis.Descriptor ):string;  
    unescapeFile( path:string );
  }
 
}

var generator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    ((yo:generator.ThisGenerator) => {
      
      yo.argument("elementName",
        {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});
 
      yo.option("elpath",{desc:"element source path"}); 
      yo.option("path",{desc:"element output path", defaults:"typings/polymer"}) ;

      
      yo.unescapeFile = ( path:string ) => {

        var content = yo.fs.read(path);
        yo.fs.write( path, _s.unescapeHTML(content.toString()) );
        
      }
      yo.templateDesc = ( p:hydrolysis.Descriptor ):string => {      
        var r = new RegExp( '\\*/', 'g');
        return p.desc.replace( r, '' );
      };

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

    
      yo.parseBehavior  = (el:hydrolysis.BehaviorDescriptor) => {

        
        var tk =  el.is.split('.');

        var module = ( tk.length == 1 ) ? "Polymer" : tk[0];
        var name = ( tk.length == 1 ) ? tk[0] : tk[1]; 
                            
        var target = path.join( yo.options.path, name.concat(".d.ts"));
        
        var publicProps = el.properties.filter( ( value, index, array ) => {
          return !((value.function) || (value.private))  ;
        });
        
        var publicMethods = el.properties.filter( ( value, index, array ) => {
          return ((value.function) && !(value.private))  ;
        });

        yo.template( path.join(__dirname, 'templates/_behaviour.ts'), target, 
              { element: el,
                moduleName:module,
                className:_s.classify(name),
                props:publicProps,
                methods:publicMethods,
                templateParams:yo.templateParams,
                templateType:yo.templateType,
                templateDesc:yo.templateDesc
              } 
        );
           
        yo.unescapeFile(target);
      }
      
      yo.parse  = (analyzer:hydrolysis.Analyzer) => {
       
        var el = analyzer.elementsByTagName[this.elementName];
         
        
        yo.mkdir( yo.options.path );

        if( analyzer.behaviors ) {
            var set = {};
            
            analyzer.behaviors.forEach( (v, index, array ) => {   
                if( !set[v.is] ) { // apply once
                  set[v.is] = v;
                  yo.parseBehavior(v);
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
        
        var target = path.join( yo.options.path, el.is.concat(".d.ts"));
       
        yo.template( path.join(__dirname, 'templates/_element.ts'), target , 
              { element: el,
                moduleName:module,
                className:_s.classify(el.is),
                props:publicProps,
                methods:publicMethods,
                templateParams:yo.templateParams,
                templateType:yo.templateType,
                templateDesc:yo.templateDesc

              } 
        );

        yo.unescapeFile(target);
        
      }

 
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
      
      
      var pathBower = path.join(process.cwd(), 'bower_components');

      var el =  ( yo.options.elpath ) ? 
        path.join(yo.options.elpath, this.elementName) :
        path.join(this.elementName, this.elementName);

      var pathToEl = path.join(pathBower, el);
  
      var elementHtml = pathToEl.concat('.html');
      
      console.log( "generating typescript for element", this.elementName, elementHtml );
       
      hyd.Analyzer.analyze( elementHtml )
        .then((analyzer) => {
        
          yo.parse( analyzer );
      });

    })(this);

  },
  end:function() {
    ((yo:generator.ThisGenerator) => {

    })(this);

  }

} );


module.exports = generator;
