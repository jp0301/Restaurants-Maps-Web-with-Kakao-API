module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");



  // 식당 목록 조회
  app.get("/restaurants", index.readRestaurants);
};