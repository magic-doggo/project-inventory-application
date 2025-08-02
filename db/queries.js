const pool = require("./pool");

async function getAllItems(sort = 'ASC') {
    const { rows } = await pool.query(`SELECT * FROM lol_items where normalStoreItemBool = True ORDER BY price ${sort === 'DESC' ? 'DESC' : 'ASC'} LIMIT 10`);
    return rows;
}

async function getFilteredItems(tagFilter, sort = 'ASC') {
    const { rows } = await pool.query
        (`SELECT id, name, price, image_url, item_tag
    FROM lol_items 
    LEFT JOIN item_tags on id=item_id 
    WHERE normalStoreItemBool = True
    AND item_tag= $1
    ORDER BY price ${sort === 'DESC' ? 'DESC' : 'ASC'} LIMIT 10`, [tagFilter])
    return rows;
}

async function getItem(itemId) {
    const { rows } = await pool.query(`SELECT id, name, price, image_url
    FROM lol_items
    WHERE id = $1`, [itemId])
    return rows;
}
// LEFT JOIN item_tags on id = item_tags.item_id

async function getItemTags(itemId) {
    const { rows } = await pool.query(`SELECT item_tag
    FROM item_tags
    WHERE item_id = $1`, [itemId])
    return rows
}

async function getItemComponents(itemId) {
    const { rows } = await pool.query(`SELECT item_component_id
    FROM item_components 
    WHERE item_id = $1`, [itemId])
    return rows;
}

// drop image_url if not displaying it in dropdown
async function getItemsByName(name) {
    const { rows } = await pool.query(`SELECT id, name, image_url
    FROM lol_items
    WHERE normalStoreItemBool = TRUE 
    AND name ILIKE $1`, [`%${name}%`])
    return rows;
}

async function createNewItem(item) {
    await pool.query("INSERT INTO lol_items(id, name, price, image_url, normalStoreItemBool) VALUES($1, $2, $3, $4, $5)", [item.id, item.name, item.price, item.image_url, True])
    if (item.tags) {
        for (tag of item.tags) {
            await pool.query("INSERT  INTO item_tags (item_id, item_tag) VALUES($1, $2)", [item.id, tag]);
        }
    }
    if (item.itemComponents) {
        for (component of item.itemComponents) {
            await pool.query("INSERT INTO item_components(item_id, item_component_id) VALUES ($1, $2)", [item.id, component])
        }
    }
}

async function getNextItemId() {
    const res = await pool.query("SELECT MAX(id) as id from lol_items WHERE id >= 1000000");
    const maxId = res.rows[0].id;
    if (maxId) return maxId+1;
    else return 1000000
}

//there are about 20 tags, I do not want all of them to appear on the index page for filtering
//mainTags will appear on main page. rest of tags will still be displayed under items that use them
//SpellBlock more up to date than magicResist in api
let mainTags = ["Armor", "SpellBlock", "Damage", "SpellDamage", "AttackSpeed", "AbilityHaste", "CriticalStrike", "ArmorPenetration", "MagicPenetration"]

module.exports = {
    getAllItems,
    getFilteredItems,
    getItem,
    getItemComponents,
    getItemTags,
    mainTags,
    getItemsByName,
    createNewItem,
    getNextItemId
}