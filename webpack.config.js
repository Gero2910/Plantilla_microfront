const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "Fincamex",
    projectName: "prueba",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    externals: ["react", "react-dom"],
    output: {
      filename: "Fincamex-prueba.js",
      publicPath: "http://192.168.0.58:4000/",
    },
  });
};
