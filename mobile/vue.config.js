const path = require("path");
const resolve = function(dir) {
  return path.join(__dirname, dir);
};
// const webpack = require('webpack')

const isProd = process.env.NODE_ENV === "production";
// const isDev = process.env.NODE_ENV === 'development'
const productionGzipExtensions = ["js", "css"];
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const extensionsValue = [".vue", ".js", ".json"];

module.exports = {
  publicPath: isProd ? "./" : "/",
  outputDir: "dist",
  assetsDir: "static",
  runtimeCompiler: true,
  lintOnSave: false, // 是否开启eslint保存检测
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@views", resolve("src/views"))
      .set("@components", resolve("src/components"))
      .set("@utils", resolve("src/utils"))
      .set("@api", resolve("src/service"));
    config.optimization.minimizer("terser").tap(args => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: "all",
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[/]node_modules[/]/,
          priority: 10,
          chunks: "initial"
        },
        iview: {
          name: "chunk-vant",
          priority: 20,
          test: /[/]node_modules[/]_?vant(.*)/
        },
        commons: {
          name: "chunk-commons",
          minChunks: 2,
          priority: 5,
          chunks: "initial",
          reuseExistingChunk: true
        }
      }
    });
  },
  // 如果你需要基于环境有条件地配置行为, 通过这个，你可以直接修改配置，会通过webpack-merge 合并到最终的配置中
  configureWebpack: config => {
    config.resolve.extensions = extensionsValue; // 可不写的扩展名
    // 生产环境
    if (isProd) {
      // 打包生产.gz压缩包
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240, // 对超过10k的数据压缩
          minRatio: 0.8,
          deleteOriginalAssets: false // 不删除源文件
        })
      );
    }
  },
  devServer: {
    host: "0.0.0.0",
    port: "8088",
    hot: true,
    open: true,
    overlay: {
      warning: false,
      error: true
    }
  },
  // css相关配置
  css: {
    loaderOptions: {
      sass: {
        additionalData:
          '@import "~@/assets/styles/_varibles.scss"; @import "~@/assets/styles/mixin.scss";'
      }
    }
  }
};
