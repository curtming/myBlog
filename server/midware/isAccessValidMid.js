const User = require("../models/User");

const ROUTES = [
  "/api/admin/user/login",
  "/api/admin/user/create",
  "/api/admin/user/authLogin",
  "/api/admin/exhibits/getList",
  "/getList",
  "/api/admin/user/decryptPhoneNumber",
];

const routeSet = new Set(ROUTES);

module.exports = () => {
  return async (req, res, next) => {
    if (routeSet.has(req.path)) {
      next();
      return;
    }
    if (!req.headers.authorization) {
      console.log("401===>", req.path, req.headers);

      res.status(401).send({ msg: "请先登录" });
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      try {
        const tokenWithoutBearer = token.replace("Bearer ", "");
        let { id } = require("jsonwebtoken").verify(
          tokenWithoutBearer,
          process.env.JWT_SECRET
        );
        const user = await User.findById(id);
        if (!user) {
          res.status(401).send({ msg: "请先登录" });
        } else {
          next();
        }
      } catch (error) {
        console.log("validRes", error);
        res.status(401).send({ msg: "请先登录" });
      }
    }
  };
};
