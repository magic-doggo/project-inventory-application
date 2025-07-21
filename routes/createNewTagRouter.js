const {Router} = require("express");
const createNewTagRouter = Router();
// const itemController = require("../controllers/itemController");

createNewTagRouter.get("/", (req, res) => {
    res.render("createNewItem", 
        {title: "Create New Item"}
    )
});

module.exports = createNewTagRouter;