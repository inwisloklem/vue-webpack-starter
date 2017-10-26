import webpack from 'webpack';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

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
          outputPath: 'img/'
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
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
      components: path.resolve(__dirname, './src/components'),
      fonts: path.resolve(__dirname, './src/assets/fonts'),
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
  }
}

if (process.env.NODE_ENV === 'development') {
  webpackConfig.devtool = '#eval-source-map';

  webpackConfig.module.rules.unshift({
    test: /\.vue$/,
    loader: 'vue-loader'
  });

  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.NamedModulesPlugin()
  ]);
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = '#source-map';

  webpackConfig.module.rules.unshift({
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      extractCSS: true
    }
  });

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
    }),

    new ExtractTextPlugin({
     filename: './css/style.css?[hash]'
    })
  ]);
};

export default webpackConfig;
