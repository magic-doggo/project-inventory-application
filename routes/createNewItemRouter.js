const {Router} = require("express");
const createNewItemRouter = Router();
const itemController = require("../controllers/itemController");

createNewItemRouter.get("/", itemController.renderCreateNewItem);
// createNewItemRouter.get("/search", itemController.searchItemComponents);
createNewItemRouter.post("/", itemController.createNewItem);


module.exports = createNewItemRouter;
