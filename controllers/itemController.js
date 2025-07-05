const db = require("../db/queries");

async function getItems(req, res) {
    // const filtersObject = req.query;
    const tag = req.query.tag;
    let sort = req.query.priceSort;
    // const filtersArray = Object.values(filtersObject);
    let items;
    if (!tag) {
        items = await db.getAllItems();
    } else items = await db.getFilteredItems(tag, sort);
    console.log(tag)
    // const items2 = db.getFilteredItems(filters);
    // let items2 = [];
    // for (let i = 0; i < 2; i++) {
    //     items2.push(items[i])
    // } //if want to show less items?
    // console.log(items);
    // console.log(filtersArray);
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