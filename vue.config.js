module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:9200/",
        pathRewrite: { "^/api/": "" },
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  }
};
