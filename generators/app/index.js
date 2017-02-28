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
        message: "Please enter tool name in UpperCamelCase."
      }
    ]).then(p => this.props = p);
  }

  writing() {
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
    ].forEach(this._copyTplWithProps("src", props));

    this._copyTplWithProps("public", props)("index.html");

    this._configurePackage();
  }

  _copyTplWithProps(folder, props) {
    return template => {
      this.fs.copyTpl(
        this.templatePath(`${folder}/${template}.txt`),
        this.destinationPath(`${folder}/${template}`),
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
      "vizabi-tool-bundler": "github:kuguarpwnz/vizabi-tool-bundler",
    });

    this.fs.writeJSON(pkgPath, pkg);
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
