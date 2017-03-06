"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Welcome to ${chalk.red("vizabi-tool")} generator!`));

    return this.prompt([
      {
        type: "input",
        name: "tool",
        message: `Please enter tool name in ${chalk.green("UpperCamelCase")}.`
      }
    ]).then(p => this.props = p);
  }

  writing() {
    this._configureTemplates();
    this._configurePackage();
  }

  _configureTemplates() {
    const { tool } = this.props;
    const toolLower = tool.toLowerCase();
    const props = {
      tool,
      toolLower,
    };

    [
      "component.js",
      "index.js",
      "styles.scss",
      "template.html",
    ].forEach(this._copyTplWithProps(props, "src"));

    this._copyTplWithProps(props)("bundler.js");
  }

  _copyTplWithProps(props, folder = '') {
    folder = folder && `${folder}/`;
    return template => {
      this.fs.copyTpl(
        this.templatePath(`${folder}${template}.txt`),
        this.destinationPath(`${folder}${template}`),
        props
      );
    };
  }

  _configurePackage() {

    const pkgPath = this.destinationPath("package.json");
    const pkg = this.fs.readJSON(pkgPath, {});

    pkg.scripts = Object.assign({}, pkg.scripts, {
      preinstall: "npm link ../vizabi",
      build: "webpack --progress",
    });

    this.fs.writeJSON(pkgPath, pkg);
  }

  install() {
    this.npmInstall([
      "vizabi/vizabi-tool-bundler"
    ], {
      "save-dev": true,
    });
  }
};
