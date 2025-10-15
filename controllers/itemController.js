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
    console.log(item)
    res.render("item", {
        item: item[0],
        tags: tags,
        components: componentItemsDetails
    })
}

async function renderCreateNewItem(req, res) {
    const tags = await db.mainTags();
    res.render("createNewItem", {
        title: "Create New Item",
        tags: tags
    })
}

async function searchItemComponents(req, res) {
    const query = req.query.component.toLowerCase();
    const result = await db.getItemsByName(query);
    res.json(result)
}

async function createNewItem(req, res) {
    const { itemName, price, image_url, tag, components } = req.body;
    let id = await db.getNextItemId();
    // console.log("components: ", components)
    let itemComponentsArray = [];
    let itemTagsArray = [];
    if (components && components.length > 0) {
       itemComponentsArray = JSON.parse(components);
    }
    if (tag && tag.length > 0) {
        itemTagsArray = Array.isArray(tag) ? tag : [tag]
    }

    const item = {
        id: id,
        name: itemName,
        price: price,
        image_url: image_url,
        itemComponents: itemComponentsArray,
        tags: itemTagsArray
    }
    // push the item to the db and then redirect to the created item page
    await db.createNewItem(item)
    res.redirect(`/item/${item.id}`);
}

async function renderManageTags(req, res) {
        const tags = await db.mainTags();
        res.render("manageTags", {
        title: "Manage Tags",
        tags: tags
    })
}

async function createNewTag(req, res) {
    // console.log(req.body.tagName);
    let tag = req.body.tagName;
    db.createNewTag(tag)
    res.redirect("/");
}

async function deleteTags(req, res) {
    let tags = req.body.tag;
    if (!tags) {
        tags = []
    } else if (!Array.isArray(tags)) {
        tags = [tags]
    }
    for (let tag of tags) {
        db.deleteTag(tag);
    }
    res.redirect("/manageTags");
}

async function deleteItem(req, res){
    const itemId = req.params.itemId;
    // console.log(itemId, " controller itemid");
    // console.log(req.body, "req.body");
    //temporary manual password until until curriculum reaches creation of user accounts
    if (req.body.password !== 'password') return res.status(401).json({message: "Incorrect password"});
    try {
        await db.deleteItem(itemId);
        res.status(200).send("item deleted");
    } catch (err) {
        console.log(err);
        console.log("pasta")
        res.status(500).send("error deleting item")
    }
}

module.exports = {
    getItems,
    renderItemGet,
    renderCreateNewItem,
    searchItemComponents,
    createNewItem,
    renderManageTags,
    createNewTag,
    deleteTags,
    deleteItem
}

// create support for deleting tags. when tag is deleted, modify all items that have it to no longer have it?
//then worry about how many items to show on dropdown when creating new item
//then manage dropdown in header. can make it absolute position or something to cover part screen?
//create new db for supported tags. currently stored in array and is lost of app closure