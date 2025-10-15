#! /usr/bin/env node
const { Client } = require("pg");
require('dotenv').config();

const result = [];
async function getItems() {
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.12.1/data/en_US/item.json');
  const itemsData = (await response.json()).data;
  for (let itemId in itemsData) {
    let normalStoreItemBool = true;
    let item = itemsData[itemId];
    if ((itemId) == 3013) ( console.log("before filter"))
    if (item.maps && item.maps["11"]) {
      // if ((itemId) == 3013) ( console.log("after filter"))
      if (item.consumed || item.hideFromAll || (item.inStore == false) || (item.requiredChampion) || !item.gold.purchasable) {
        normalStoreItemBool = false;
      }
      result.push({
        id: parseInt(itemId), name: item.name, price: item.gold.total, itemComponents: item.from ? item.from.map(Number) : [], buildInto: item.into,
        image: "https://ddragon.leagueoflegends.com/cdn/15.12.1/img/item/" + item.image.full, tags: item.tags, displayItemInStore: normalStoreItemBool
      })
    }
  }
  console.log(result[1]);
  return result
}
// && !item.consumed && !item.hideFromAll && !(item.inStore == false) && !(item.requiredChampion) && item.gold.purchasable)

//do not need (255) after INT
const SQL = `
CREATE TABLE IF NOT EXISTS lol_items (
  id INTEGER PRIMARY KEY,
  name VARCHAR ( 255 ),
  price INT,
  image_url VARCHAR (255),
  normalStoreItemBool BOOLEAN
);

CREATE TABLE IF NOT EXISTS item_components (
  item_id INT,
  item_component_id INT,
  FOREIGN KEY (item_id) REFERENCES lol_items(id) ON DELETE CASCADE,
  FOREIGN KEY (item_component_id) REFERENCES lol_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255) UNIQUE,
  displayOnMainPageBool BOOLEAN
);

CREATE TABLE IF NOT EXISTS item_tags (
  item_id INT,
  tag_id INT,
  FOREIGN KEY (item_id) REFERENCES lol_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
`

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.EXTERNAL_DB_URL,
    ssl: {
      require: true, //why did this fix "read ECONNRESET"? discord suggestion
      rejectUnauthorized: false
    }
  });
  await client.connect();
  await client.query(SQL);
  let items = await getItems();
  for (let item of items) {
    await client.query(
      "INSERT INTO lol_items(id, name, price, image_url, normalStoreItemBool) VALUES($1, $2, $3, $4, $5)", [item.id, item.name, item.price, item.image, item.displayItemInStore]
    );
  }

  for (let item of items) { //duplicate for of loop necessary because I cannot reference item_component_id if it has not been already added as Id to lol_items, and not all items are added in lol_items
    if (item.itemComponents) {
      for (component of item.itemComponents) {
      await client.query(
        "INSERT INTO item_components(item_id, item_component_id) VALUES ($1, $2)", [item.id, component]
      )
    }
    }
    if (item.tags) {
      for (let tag of item.tags) {
        //for each tag of each item, insert into tags db. if it exists already, do nothing and return nothing, no rows
        const insertedTag = await client.query(
          "INSERT INTO tags(name, displayOnMainPageBool) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING id", [tag, false]
        );

        let tagId;
        if (insertedTag.rows.length > 0) {
          tagId = insertedTag.rows[0].id
        } else {
          //if nothing is returned, tags already contains the tag, find the id of the tag
          const findTagId = await client.query(
            "SELECT id FROM tags WHERE name = $1", [tag]
          );
          tagId = findTagId.rows[0].id; 
        }

        await client.query(
          "INSERT INTO Item_tags(item_id, tag_id) VALUES($1, $2)", [item.id, tagId]
        );
      }
    }
  }
  await client.end();
  console.log("done");
}

main();

module.exports = { result }

//item_tag values:  Armor,CooldownReduction,Stealth,SpellDamage,Active,CriticalStrike,SpellVamp,Jungle,MagicPenetration,ArmorPenetration,Vision,GoldPer,Tenacity,Boots,Aura
//maybe create another table complete_items, that only contains items which do not have "into" in the api?
//possible filters: select price range (maybe even with a mouse draggable range bar), tags, maybe complete items/components/base items