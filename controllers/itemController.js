const db = require("../db/queries");

async function getItems(req, res) {
    //maybe if tags/some other filters exist, items = not get all items but some other filter
    const items = await db.getAllItems();
    let selectedTag = req.query.tag;
    let selectedPriceSort = req.query.priceSort;
    // let items2 = [];
    // for (let i = 0; i < 2; i++) {
    //     items2.push(items[i])
    // } //if want to show less items?
    console.log(items);
    res.render("index", {
        title: "index",
        items: items,
        selectedTag: selectedTag,
        selectedPriceSort: selectedPriceSort
    })
}

function filterByTag(tag) {

}

module.exports = {
    getItems
}