"use strict";
var yeoman = require("yeoman-generator");
function yo(p) {
    return p;
}
var Poc = (function () {
    function Poc() {
        yeoman.generators.Base.apply(this, arguments);
        console.log("Poc.constructor");
        this.fullname = "POC";
        yo(this).option("path", { desc: "element output path", defaults: "app" });
    }
    Poc.prototype.initializing = function () {
        console.log("Poc.initializing", this.fullname);
        this.fullname = "POC";
    };
    Poc.prototype.prompting = function () {
        console.log("Generator.prompting");
    };
    Poc.prototype.configuring = function () {
        console.log("Generator.configuring");
    };
    Poc.prototype.end = function () {
        console.log("Generator.end");
    };
    Poc.prototype.poc = function () {
        console.log("Poc.poc");
    };
    return Poc;
}());
var gen = yeoman.generators.Base.extend(Poc.prototype);
module.exports = gen;
//# sourceMappingURL=index.js.map