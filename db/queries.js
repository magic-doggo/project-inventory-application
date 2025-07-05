const pool = require("./pool");

async function getAllItems() {
    const {rows} = await pool.query("SELECT * FROM lol_items where normalStoreItemBool = True LIMIT 10");
    return rows;
}

async function getFilteredItems(filter, sort = 'ASC') {
    const {rows} = await pool.query
    (`SELECT id, name, item_tag, price, image_url
    FROM lol_items 
    LEFT JOIN item_tags on id=item_id 
    WHERE normalStoreItemBool = True
    AND item_tag= $1
    ORDER BY price ${sort === 'DESC' ? 'DESC' : 'ASC'} LIMIT 10`, [filter])
    return rows;
}

module.exports = {
    getAllItems,
    getFilteredItems
}