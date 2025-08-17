const {Router} = require("express");
const itemRouter = Router();
const itemController = require("../controllers/itemController");

itemRouter.get("/", (req, res) => {res.send("Nothing here, input a valid item Id")});
itemRouter.get("/:itemId", itemController.renderItemGet);
itemRouter.delete("/:itemId", itemController.deleteItem);
module.exports = itemRouter;