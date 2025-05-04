const { withExpoWebpack } = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await withExpoWebpack(env, argv);

  // Add your custom image loader config
  config.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: "url-loader",
      options: {
        name: "[name].[ext]",
        esModule: false,
      }
    }
  });

  return config;
};
