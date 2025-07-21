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
        selectedPriceSort: sort,
        tags: db.mainTags
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

async function renderCreateNewItem(req, res) {
    res.render("createNewItem", {
        title: "Create New Item",
        tags: db.mainTags
    })
}

async function searchItemComponents(req, res) {
    const query = req.query.component.toLowerCase();
    console.log(query);
    const result = await db.getItemsByName(query);
    res.json(result)
}

module.exports = {
    getItems,
    renderItemGet,
    renderCreateNewItem,
    searchItemComponents
}