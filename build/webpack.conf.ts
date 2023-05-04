import * as fs from 'fs'
import * as path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { GlobalEnv } from '../modules/env'
// @ts-ignore
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

const resolve = (file: string) => path.resolve(__dirname, file)
const isProd = GlobalEnv.isProd

const viewFolderPath = path.resolve(__dirname, '../views')
const viewFileList = fs.readdirSync(viewFolderPath)

// Set entry based on views.
const entry: Record<string, string> = {}
viewFileList.forEach((dirName: string) => {
  entry[dirName] = viewFolderPath + `/${dirName}/index.ts`
})

const webpackConfig: webpack.Configuration = {
  entry,

  mode: isProd ? 'production' : 'development',

  devtool: isProd ? undefined : 'eval-source-map',

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: 'static/scripts/[name].[contenthash].js',
    chunkFilename: 'static/scripts/[id].[chunkhash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    },
    fallback: {
      string_decoder: false,
      stream: require.resolve('stream-browserify')
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader'
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'static/assets/[name].[chunkhash].[ext]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(GlobalEnv.nodeEnv)
    }),

    new FriendlyErrorsWebpackPlugin()
  ],

  watch: true,

  optimization: {
    minimize: isProd,
    minimizer: isProd
      ? [new TerserPlugin(), new CssMinimizerPlugin()]
      : []
  }
}

if (isProd) {
  webpackConfig.plugins!.push(new MiniCssExtractPlugin({
    filename: 'static/css/[name].[chunkhash].css'
  }))
} else {
  // Development setup.
  Object.keys(webpackConfig.entry!).forEach((entryName: string) => {
    (webpackConfig.entry as any)[entryName] = [resolve('./dev-client.ts')].concat((webpackConfig.entry as any)[entryName])
  })

  // Hot Module Replacement.
  webpackConfig.plugins!.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

// Define HTML configuration by reading dir "views".
viewFileList.forEach((dirName: string) => {
  const tplPath = viewFolderPath + `/${dirName}/index.pug`
  if (fs.existsSync(tplPath)) {
    webpackConfig.plugins!.push(new HtmlWebpackPlugin({
      filename: `templates/${dirName}.html`,
      template: tplPath,
      inject: true,
      chunks: [dirName]
    }))
  }
})

export {
  webpackConfig
}
