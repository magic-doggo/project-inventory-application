const express = require("express");
const path = require("node:path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const result = [];


async function getItems() {
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.12.1/data/en_US/item.json');
  const itemsData = (await response.json()).data;
  for (let itemId in itemsData) {
    let item = itemsData[itemId];
    if (item.maps && item.maps["11"] && item.gold.purchasable && !item.consumed) {
      result.push({id: itemId, name: item.name, price: item.gold.total, buildFrom: item.from, buildInto: item.into,
         image: "https://ddragon.leagueoflegends.com/cdn/15.12.1/img/item/" + item.image.full })
    }
  }
  console.log(result);
  return result
}
// console.log(getItems())
app.get("/", (req, res) => res.send(result));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});