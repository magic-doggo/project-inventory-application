const db = require("../db/queries");

async function getItems(req, res) {
    const tag = req.query.tag;
    const sort = req.query.priceSort;
    const tags = await db.mainTags();
    let items;
    if (!tag) {
        items = await db.getAllItems(sort);
    } else items = await db.getFilteredItems(tag, sort);
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: tag,
        selectedPriceSort: sort,
        tags: tags
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
    const result = await db.getItemsByName(query);
    res.json(result)
}

async function createNewItem(req, res) {
    const { itemName, price, image_url, tag, components } = req.body;
    console.log("Item Name:", itemName);
    console.log("Components:", components);
    let id = await db.getNextItemId();
    const itemComponentsArray = JSON.parse(components)
    item = {
        id: id,
        name: itemName,
        price: price,
        image_url: image_url,
        itemComponents: itemComponentsArray,
        tags: tag
    }
    console.log(item)
    // push the item to the db and then redirect to the created item page
    db.createNewItem(item)
    res.redirect(`/item/${item.id}`);
}

async function renderManageTags(req, res) {
        res.render("manageTags", {
        title: "Manage Tags",
        tags: db.mainTags
    })
}

async function createNewTag(req, res) {
    console.log(req.body.tagName);
    let tag = req.body.tagName;
    db.createNewTag(tag)
    res.redirect("/");
}

async function deleteTags(tags) {
    console
}

module.exports = {
    getItems,
    renderItemGet,
    renderCreateNewItem,
    searchItemComponents,
    createNewItem,
    renderManageTags,
    createNewTag,
    deleteTags
}

// create support for deleting tags. when tag is deleted, modify all items that have it to no longer have it?
//then worry about how many items to show on dropdown when creating new item
//then manage dropdown in header. can make it absolute position or something to cover part screen?
//create new db for supported tags. currently stored in array and is lost of app closure