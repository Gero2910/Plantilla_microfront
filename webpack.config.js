const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const webpack = require("webpack");
const path = require("path");

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
      publicPath: process.env.REACT_URL_SERVIDOR, // Usar directamente la variable de entorno cargada por env-cmd
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env), // Definir todas las variables de entorno
      }),
    ],
    resolve: {
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },
  });
};
