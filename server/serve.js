const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// header设置，中间件形式
app.use("*", (req, res, next) => {
  // 设置允许访问源
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // 设置允许请求头类型
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  // 设置允许访问方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  //内容类型：如果是post请求必须指定这个属性
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 设置jwt验证，并将jwt和secret传递下去
const secret = "vite-experiment";
app.use("*", (req, res, next) => {
  req.secret = secret;
  next();
});

// 引入数据库和路由
require("./db/db")(app);
require("./router/web/index")(app);

app.listen("8000", () => {
  console.log("this server start at http://localhost:8000");
});
