const db = require("../db/queries");

async function getItems(req, res) {
    const tag = req.query.tag;
    const sort = req.query.priceSort;
    let items;
    if (!tag) {
        items = await db.getAllItems(sort);
    } else items = await db.getFilteredItems(tag, sort);
    // console.log(tag)
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: tag,
        selectedPriceSort: sort
    })
}


module.exports = {
    getItems,
}