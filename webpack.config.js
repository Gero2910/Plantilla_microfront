const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

module.exports = (webpackConfigEnv, argv) => {
  // Cargar las variables de entorno desde el archivo correspondiente
  const env = dotenv.config({ path: `./.env.${webpackConfigEnv.ENVIRONMENT || 'development'}` }).parsed;

  // Formatear las variables de entorno para que sean accesibles en el frontend
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

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
      publicPath: env.REACT_URL_SERVIDOR,
    },
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
  });
};

adminUsuario