import webpack from 'webpack';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

process.noDeprecation = true;

const webpackConfig = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/index.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            if (process.env.NODE_ENV === 'development') return '[name].[ext]?[hash]';
            return '[hash].[ext]'
          },
          outputPath: './img/'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    })
  ],

  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      img: path.resolve(__dirname, './src/assets/img'),
      styl: path.resolve(__dirname, './src/assets/styl')
    }
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },

  performance: {
    hints: false
  },

  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'development') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.NamedModulesPlugin()
  ]);
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = '#source-map';

  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
};

export default webpackConfig;
