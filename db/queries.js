const pool = require("./pool");

async function getAllItems(sort = 'ASC') {
    const {rows} = await pool.query(`SELECT * FROM lol_items where normalStoreItemBool = True ORDER BY price ${sort === 'DESC' ? 'DESC' : 'ASC'} LIMIT 10`);
    return rows;
}

async function getFilteredItems(tagFilter, sort = 'ASC') {
    const {rows} = await pool.query
    (`SELECT id, name, price, image_url, item_tag
    FROM lol_items 
    LEFT JOIN item_tags on id=item_id 
    WHERE normalStoreItemBool = True
    AND item_tag= $1
    ORDER BY price ${sort === 'DESC' ? 'DESC' : 'ASC'} LIMIT 10`, [tagFilter])
    return rows;
}

async function getItem(itemId) {
    const {rows} = await pool.query(`SELECT id, name, price, image_url, item_tag
    FROM lol_items
    LEFT JOIN item_tags on id = item_tags.item_id
    WHERE id = $1`, [itemId])
    return rows;
}

        // LEFT JOIN rows_components on id = item_components.item_id
module.exports = {
    getAllItems,
    getFilteredItems,
    getItem
}