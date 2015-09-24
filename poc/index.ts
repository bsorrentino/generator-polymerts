/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

//import $ = require('cheerio');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");

type yo = yo.YeomanGeneratorBase;

class Poc  {
    
    fullname : string;
    
    
    constructor() {
        yeoman.generators.Base.apply(this, arguments);    
        console.log("Poc.constructor");    


        ((yo:yo) => {

            this.fullname = "POC";  
      
            yo.option("path",{desc:"element output path", defaults:"app"});
                
        })(<any>this);
        
    }
    
    initializing() {
        console.log("Poc.initializing", this.fullname);    
        this.fullname = "POC";
    }
    
    prompting() {
        console.log("Poc.prompting");    
    }
    
    configuring() {
        console.log("Poc.configuring");    
    }
    
    poc() {
        console.log("Poc.poc");    
    }
    
    end() {
        console.log("Poc.end");    
    }
}
  
var gen = yeoman.generators.Base.extend( Poc.prototype );
 
/*
var gen = yeoman.generators.Base.extend({
    
  constructor: function () {
     yeoman.generators.Base.apply(this, arguments);    
     this.poc = new Poc();
     console.log( "fullname", this.fullname );
    
  },
  initializing: function() {
  },
  prompting: function () {
  },
  configuring: function() {
  },
  poc : function() {
  },
  end:function() {
  }

});
*/

module.exports = gen;
