const db = require("../db/queries");

async function getItems(req, res) {
    const tag = req.query.tag;
    const sort = req.query.priceSort;
    let items;
    if (!tag) {
        items = await db.getAllItems(sort);
    } else items = await db.getFilteredItems(tag, sort);
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: tag,
        selectedPriceSort: sort
    })
}

async function renderItemGet(req, res) {
    const itemId = req.params.itemId;
    const item = await db.getItem(itemId);
    const itemComponentsIds = await db.getItemComponents(itemId);
    let tags = await db.getItemTags(itemId)
    let componentItemsDetails = []
    for (let id of itemComponentsIds) {
        let itemDetails = await db.getItem(id.item_component_id)
        componentItemsDetails.push(...itemDetails)
    }
    console.log(componentItemsDetails)
    res.render("item", {
        item: item[0],
        tags: tags,
        components: componentItemsDetails
    })
}

module.exports = {
    getItems,
    renderItemGet
}