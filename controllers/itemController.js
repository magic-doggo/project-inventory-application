const db = require("../db/queries");

async function getItems(req, res) {
    const items = await db.getAllItems();
    console.log(items);
    res.render("index", {
        title: "index",
        items: items
    })
}

module.exports = {
    getItems
}