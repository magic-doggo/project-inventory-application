const express = require("express");
const path = require("node:path");
const app = express();
require('dotenv').config();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

//to do
//filter items based on tags: Damage, SpellDamage, Health, Armor, SpellBlock. maybe attack speed/cdr/lifesteal/armorpen/magicpen
//when item is opened, display components (build from / into)


//optional:
//tab for builds where user can combine up to 6 items 