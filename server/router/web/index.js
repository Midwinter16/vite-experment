module.exports = (app) => {
  // 引入数据库
  const User = require("../../model/User");
  // 引入jwt
  const jwt = require("jsonwebtoken");

  const router = require("express").Router();
  // 写入路由
  app.use("/api", router);

  // 前端title变化的api，用于查询用户是否存在
  router.get("/userinfo/:username?", async (req, res) => {
    const data = await User.findOne().where({ account: req.params.username });
    res.send(data);
  });

  // 登录api
  router.post("/login", async (req, res) => {
    // 有token的情况下
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization.split(" ").pop(),
        req.secret,
        async function (err, data) {
          // 没报错
          if (!err) {
            res.send({
              info: "success",
              status: 200,
              haveToken: false,
              message: "login success",
            });
          } else {
            res.send(err.message);
            res.send({
              info: "error",
              status: 200,
              haveToken: false,
              message: err.message,
            });
          }
        }
      );
    } else {
      const data = await User.findOne().where({
        account: req.body.account,
        password: req.body.password,
      });
      if (!data) {
        res.send({
          info: "error",
          status: 200,
          haveToken: false,
          message: "user password error",
        });
      } else if (req.body.remAcc) {
        // 如果用户要求保存账户信息，返回token给前端
        const token = jwt.sign(
          { account: data.account, id: data._id },
          req.secret,
          {
            expiresIn: 60 * 60 * 24 * 7,
          }
        );
        res.send({
          info: "success",
          status: 200,
          haveToken: true,
          message: "login success",
          token,
        });
      } else {
        res.send({
          info: "success",
          status: 200,
          haveToken: false,
          message: "login success",
        });
      }
    }
  });

  // 注册api
  router.post("/register", async (req, res) => {
    let allUsers = await User.count();
    // 默认用户名
    let zeros = "User000000";
    User.create(
      Object.assign(
        {
          name: zeros.substring(0, 9 - allUsers.toString().length) + allUsers,
        },
        req.body
      )
    );
    res.send({
      info: "success",
      status: 200,
      haveToken: false,
      message: "user registration success",
    });
  });
};
