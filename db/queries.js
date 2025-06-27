const pool = require("./pool");

async function getAllItems() {
    const {rows} = await pool.query("SELECT * FROM lol_items LIMIT 10");
    return rows;
}

module.exports = {
    getAllItems
}