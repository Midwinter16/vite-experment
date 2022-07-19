const jwt = require("jsonwebtoken");

const secret = "vite-experiment";

let setToken = (username) => {
  const rule = {
    username,
  };
  let token = jwt.sign(rule, secret, { expiresIn: 60 * 60 * 24 * 7 });
  return token;
};

module.exports.setToken = setToken;
