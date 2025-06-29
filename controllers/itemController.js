const db = require("../db/queries");

async function getItems(req, res) {
    const items = await db.getAllItems();
    let selectedTag = req.query.tag;
    // let items2 = [];
    // for (let i = 0; i < 2; i++) {
    //     items2.push(items[i])
    // } //if want to show less items?
    console.log(items);
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: selectedTag
    })
}

module.exports = {
    getItems
}