const {Router} = require("express");
const manageTagsRouter = Router();
const itemController = require("../controllers/itemController");

manageTagsRouter.get("/", itemController.renderManageTags);

manageTagsRouter.post("/", itemController.createNewTag)
manageTagsRouter.post("/delete", itemController.deleteTags)

module.exports = manageTagsRouter;