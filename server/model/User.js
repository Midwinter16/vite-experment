// 建立models模型（unk）
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  account: { type: String },
  password: { type: String },
  name: { type: String },
});

module.exports = mongoose.model("User", schema);
