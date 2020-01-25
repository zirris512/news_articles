const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

const app = express();

const routes = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pcArticles";

mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
