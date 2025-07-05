const db = require("../db/queries");

async function getItems(req, res) {
    const tag = req.query.tag;
    const sort = req.query.priceSort;
    let items;
    if (!tag) {
        items = await db.getAllItems(sort);
    } else items = await db.getFilteredItems(tag, sort);
    console.log(items)
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: tag,
        selectedPriceSort: sort
    })
}

async function renderItemGet(req, res) {
    const itemId = req.params.itemId;
    console.log(itemId, "itemId")
    const item = await db.getItem(itemId);
    console.log(item);
    let itemTags = [];
    for (entry of item) {
        itemTags.push(entry.item_tag)
    }
    console.log(itemTags)
    res.render("item", {
        item: item[0],
        tags: itemTags
    })
}

module.exports = {
    getItems,
    renderItemGet
}