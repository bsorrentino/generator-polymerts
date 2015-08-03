## Yeoman generator to scaffold out [Polymer 1.0](http://www.polymer-project.org/)'s elements using Typescript based on [PolymerTS](https://github.com/nippur72/PolymerTS) project

## Introduction

[PolymerTS](https://github.com/nippur72/PolymerTS) is a project that allow to develop [Polymer 1.0](http://www.polymer-project.org/) element using Typescript @decorated classes.

It is thought to work joined with [Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/)

## Features

 * PolymerTS's element scaffold

## Installation

`` npm install -g generator-polymerts ``

## Generators

 * [polymerts:el](#element-alias-el)


### Element (alias: El)
Generates a polymer element in `app/elements` and optionally appends an import to `app/elements/elements.html`.

Example:
```bash

yo polymerts:el my-element
```

**Note: You must pass in an element name, and the name must contain a dash "-"**

#### Options

```
--path, override default directory structure, ex: --path foo/bar will put your element in app/elements/foo/bar
```
