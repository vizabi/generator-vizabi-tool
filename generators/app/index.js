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
    ].forEach(this._copyTplWithProps(props, "src"));

    this._copyTplWithProps(props, "public")("index.html");
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

    pkg.peerDependencies = Object.assign({}, pkg.peerDependencies, {
      vizabi: "*",
    });

    pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
      "vizabi-tool-bundler": "github:vizabi/vizabi-tool-bundler",
    });

    pkg.scripts = Object.assign({}, pkg.scripts, {
      bundler: "node bundler",
      build: "npm run bundler",
      start: "cross-env WATCH=1 npm run bundler"
    });

    this.fs.writeJSON(pkgPath, pkg);
  }

  install() {
    this.installDependencies({ bower: false });
    this.npmInstall(["cross-env"], { "save-dev": true });
  }
};
