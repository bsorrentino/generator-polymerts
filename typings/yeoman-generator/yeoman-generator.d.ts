// Type definitions for yeoman-generator
// Project: https://github.com/yeoman/generator
// Definitions by: Kentaro Okuno <http://github.com/armorik83>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
/// <reference path="../node/node.d.ts" />

declare module yo {

  export interface IYeomanGenerator {
    
    argument(name: string, config: IArgumentConfig): void;
    composeWith(namespace: string, options: any, settings?: IComposeSetting): IYeomanGenerator;
    defaultFor(name: string): void;
    destinationRoot(rootPath: string): string;
    determineAppname(): void;
    getCollisionFilter(): (output: any) => void;
    hookFor(name: string, config: IHookConfig): void;
    option(name: string, config: IYeomanGeneratorOption): void;
    rootGeneratorName(): string;
    run(args?: any): void;
    run(args: any, callback?: Function): void;
    runHooks(callback?: Function): void;
    sourceRoot(rootPath: string): string;

		emit(event: string, ...args: any[]): boolean;

    prompt( prompts:Array<IPromptConfig>, cb:(answer:any) => void );
    async(): Function;
    templatePath( ...path:string[] ):string;

    template( src:string, dest:string );
    readFileAsString(path:string):string;  
    writeFileFromString( content:string, path:string);

  }

	export class YeomanGeneratorBase implements IYeomanGenerator, NodeJS.EventEmitter {

		argument(name: string, config: IArgumentConfig): void;
		composeWith(namespace: string, options: any, settings?: IComposeSetting): IYeomanGenerator;
		defaultFor(name: string): void;
		destinationRoot(rootPath: string): string;
		determineAppname(): void;
		getCollisionFilter(): (output: any) => void;
		hookFor(name: string, config: IHookConfig): void;
		option(name: string, config: IYeomanGeneratorOption): void;
		rootGeneratorName(): string;
		run(args?: any): void;
		run(args: any, callback?: Function): void;
		runHooks(callback?: Function): void;
		sourceRoot(rootPath: string): string;
		addListener(event: string, listener: Function): NodeJS.EventEmitter;
		on(event: string, listener: Function): NodeJS.EventEmitter;
		once(event: string, listener: Function): NodeJS.EventEmitter;
		removeListener(event: string, listener: Function): NodeJS.EventEmitter;
		removeAllListeners(event?: string): NodeJS.EventEmitter;
		setMaxListeners(n: number): void;
		listeners(event: string): Function[];
		emit(event: string, ...args: any[]): boolean;

    prompt( prompts:Array<IPromptConfig>, cb:(answer:any) => void );
    async(): Function;
    templatePath( ...path:string[] ):string;
    template( src:string, dest:string );
    readFileAsString(path:string):string;  
    writeFileFromString( content:string, path:string);

	}

/*

from: https://github.com/SBoudrias/Inquirer.js

type: (String) Type of the prompt. Defaults: input - Possible values: input, confirm, list, rawlist, password
name: (String) The name to use when storing the answer in the anwers hash.
message: (String|Function) The question to print. If defined as a function, the first parameter will be the current inquirer session answers.
default: (String|Number|Array|Function) Default value(s) to use if nothing is entered, or a function that returns the default value(s). If defined as a function, the first parameter will be the current inquirer session answers.
choices: (Array|Function) Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers.
Array values can be simple strings, or objects containing a name (to display) and a value properties (to save in the answers hash). Values can also be a Separator.
validate: (Function) Receive the user input and should return true if the value is valid, and an error message (String) otherwise. If false is returned, a default error message is provided.
filter: (Function) Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.
when: (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
*/
  export interface IPromptConfig {
    type: string;
    name: string;
    message: string;
    default: any;
    choices?: Array<any>|Function;
    validate?: (input:any) => boolean|string;
    filter?: (input:any) =>any;
    when?: (input:any) => any;
  }

  export interface IArgumentConfig {
    desc?: string;
    required?: boolean;
    optional?: boolean;
    type?: any;
    defaults?: any;
  }

  export interface IComposeSetting {
    local?: string;
    link?: string;
  }

  export interface IHookConfig {
    as: string;
    args: any;
    options: any;
  }

  export interface IYeomanGeneratorOption {
    alias?: string;
    defaults?: any;
    desc?: string;
    hide?: boolean;
    type?: any;
  }

  export interface IQueueProps{
    initializing: () => void;
    prompting?: () => void;
    configuring?: () => void;
    default?: () => void;
    writing?: {
      [target: string]: () => void;
    };
    conflicts?: () => void;
    install?: () => void;
    end: () => void;
  }

  export interface INamedBase extends IYeomanGenerator {
  }

  export interface IBase extends INamedBase {
  }

  export interface IAssert {
    file(path: string): void;
    file(paths: string[]): void;
    fileContent(file: string, reg: RegExp): void;

    /** @param {[String, RegExp][]} pairs */
    fileContent(pairs: any[][]): void;

    /** @param {[String, RegExp][]|String[]} pairs */
    files(pairs: any[]): void;

    /**
     * @param {Object} subject
     * @param {Object|Array} methods
     */
    implement(subject: any, methods: any): void;
    noFile(file: string): void;
    noFileContent(file: string, reg: RegExp): void;

    /** @param {[String, RegExp][]} pairs */
    noFileContent(pairs: any[][]): void;

    /**
     * @param {Object} subject
     * @param {Object|Array} methods
     */
    noImplement(subject: any, methods: any): void;

    textEqual(value: string, expected: string): void;
  }

  export interface ITestHelper {
    createDummyGenerator(): IYeomanGenerator;
    createGenerator(name: string, dependencies: any[], args: any, options: any): IYeomanGenerator;
    decorate(context: any, method: string, replacement: Function, options: any): void;
    gruntfile(options: any, done: Function): void;
    mockPrompt(generator: IYeomanGenerator, answers: any): void;
    registerDependencies(dependencies: string[]): void;
    restore(): void;

    /** @param {String|Function} generator */
    run(generator: any): IRunContext;
  }

  export interface IRunContext {
    async(): Function;
    inDir(dirPath: string): IRunContext;

    /** @param {String|String[]} args */
    withArguments(args: any): IRunContext;
    withGenerators(dependencies: string[]): IRunContext;
    withOptions(options: any): IRunContext;
    withPrompts(answers: any): IRunContext;
  }

  /** @type file file-utils */
  var file: any;
  var assert: IAssert;
  var test: ITestHelper;
  module generators {

	  export class NamedBase extends YeomanGeneratorBase implements INamedBase {
		  constructor(args: string | string[], options: any);
	  }

	  export class Base extends NamedBase implements IBase {
		  static extend(protoProps: IQueueProps, staticProps?: any): IYeomanGenerator;
	  }

	  }
  }
}

declare module "yeoman-generator" {
  export = yo;
}
