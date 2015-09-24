/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />
var yeoman = require("yeoman-generator");
var Poc = (function () {
    function Poc() {
        var _this = this;
        yeoman.generators.Base.apply(this, arguments);
        console.log("Poc.constructor");
        (function (yo) {
            _this.fullname = "POC";
            yo.option("path", { desc: "element output path", defaults: "app" });
        })(this);
    }
    Poc.prototype.initializing = function () {
        console.log("Poc.initializing", this.fullname);
        this.fullname = "POC";
    };
    Poc.prototype.prompting = function () {
        console.log("Poc.prompting");
    };
    Poc.prototype.configuring = function () {
        console.log("Poc.configuring");
    };
    Poc.prototype.poc = function () {
        console.log("Poc.poc");
    };
    Poc.prototype.end = function () {
        console.log("Poc.end");
    };
    return Poc;
})();
var gen = yeoman.generators.Base.extend(Poc.prototype);
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
