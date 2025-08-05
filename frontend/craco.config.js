const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable TypeScript checker to prevent memory issues
      const forkTsCheckerIndex = webpackConfig.plugins.findIndex(
        plugin => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );
      
      if (forkTsCheckerIndex !== -1) {
        webpackConfig.plugins[forkTsCheckerIndex].options = {
          ...webpackConfig.plugins[forkTsCheckerIndex].options,
          memoryLimit: 512,
          workers: 1,
        };
      }

      // Optimize memory usage
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000,
            },
            leaflet: {
              test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
              name: 'leaflet',
              chunks: 'all',
              priority: 10,
            },
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };

      // Reduce memory usage during development
      if (env === 'development') {
        webpackConfig.optimization.minimize = false;
        webpackConfig.devtool = 'eval-source-map';
      }

      return webpackConfig;
    },
  },
  devServer: {
    port: 3000,
    allowedHosts: 'all',
  },
  typescript: {
    enableTypeChecking: false,
  },
};
