const pool = require("./pool");

async function getAllItems() {
    const {rows} = await pool.query("SELECT * FROM lol_items where normalStoreItemBool = True LIMIT 10");
    return rows;
}

//get items and their tag
// SELECT id, name, item_tag
// FROM lol_items
// LEFT JOIN item_tags
// ON id = item_id
// WHERE normalStoreItemBool = True;



module.exports = {
    getAllItems
}