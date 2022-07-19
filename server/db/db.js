module.exports = (app) => {
  const server = require("mongoose");
  server.connect("mongodb://127.0.0.1:27017/viteExperiment", {
    useNewUrlParser: true,
  });
};
