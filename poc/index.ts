/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

//import $ = require('cheerio');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");

type yo = yo.YeomanGeneratorBase;

function yo(p:Poc):yo {
  return <any>p;
}

class Poc  {
  fullname : string;

  constructor() {
      yeoman.generators.Base.apply(this, arguments);

      console.log("Poc.constructor");
      this.fullname = "POC";

      yo(this).option("path",{desc:"element output path", defaults:"app"});


  }
  initializing() {
    console.log("Poc.initializing", this.fullname);
    this.fullname = "POC";
  }

  prompting() {
      console.log("Generator.prompting");
  }

  configuring() {
      console.log("Generator.configuring");
  }
  end() {
      console.log("Generator.end");
  }



  poc() {
      console.log("Poc.poc");
  }



}
var gen = yeoman.generators.Base.extend( Poc.prototype );


module.exports = gen;
