#! /usr/bin/env node
const { Client } = require("pg");
require('dotenv').config();

const result = [];
async function getItems() {
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.12.1/data/en_US/item.json');
  const itemsData = (await response.json()).data;
  for (let itemId in itemsData) {
    let item = itemsData[itemId];
    if (item.maps && item.maps["11"] && item.gold.purchasable && !item.consumed) {
      result.push({
        id: itemId, name: item.name, price: item.gold.total, buildFrom: item.from, buildInto: item.into,
        image: "https://ddragon.leagueoflegends.com/cdn/15.12.1/img/item/" + item.image.full, tags: item.tags
      })
    }
  }
  console.log(result[1]);
  return result
}

//do not need (255) after INT
const SQL = `
CREATE TABLE IF NOT EXISTS lol_items (
  id INTEGER PRIMARY KEY,
  name VARCHAR ( 255 ),
  price INT,
  image_url VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS item_components (
  item_id INT,
  item_component_id INT,
  FOREIGN KEY (item_id) REFERENCES lol_items(id),
  FOREIGN KEY (item_component_id) REFERENCES lol_items(id)
);

CREATE TABLE IF NOT EXISTS item_tags (
  item_id INT,
  item_tag VARCHAR (255),
  FOREIGN KEY (item_id) REFERENCES lol_items(id)
);
`


async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.user}:${process.env.password}@localhost:5432/lol_items`,
  });
  await client.connect();
  await client.query(SQL);
  let items = await getItems();
  for (let item of items) {
    await client.query(
      "INSERT INTO lol_items(id, name, price, image_url) VALUES($1, $2, $3, $4)", [item.id, item.name, item.price, item.image]
    );
  }
  await client.end();
  console.log("done");
}

main();

module.exports = { result } //what did I add this for?