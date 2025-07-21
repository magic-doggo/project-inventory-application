const {Router} = require("express");
const indexRouter = Router();
const itemController = require("../controllers/itemController");

indexRouter.get("/", itemController.getItems);
indexRouter.get("/search", itemController.searchItemComponents);

module.exports = indexRouter;