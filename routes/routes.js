const Router = require("express").Router;
const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");

const allRoutes = Router();

allRoutes.get("/scrape", (_req, res) => {
    axios.get("https://www.pcgamer.com/news/").then(response => {
        const $ = cheerio.load(response.data);

        $("div .listingResults").each((_i, element) => {
            let result = {};

            result.title = $(element).children("h3").text();
            result.summary = $(element).children("p .synopsis").text();
            result.url = $(element).children("a .article-link").attr("href");

            db.Articles.create(result).then(dbArticle => {
                console.log(dbArticle);
            }).catch(err => {
                console.log(err);
            });
        });

        res.send("Scrape Successful!");
    });
});

allRoutes.get("/", (_req, res) => {
    db.Articles.find({}).then(dbArticle => {
        res.render("index", {Articles: dbArticle});
    }).catch(err => {
        res.json(err);
    });
});

allRoutes.get("/articles/:id", (req, res) => {
    db.Articles.findOne({_id: req.params.id}).populate("comments").then(dbArticle => {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
});

allRoutes.post("/articles/:id", (req, res) => {
    db.Comments.create(req.body).then(dbComments => {
        return db.Articles.findOneAndUpdate({_id: req.params.id}, {ArticleID: dbComments._id}, {new: true});
    }).then(dbArticle => {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = allRoutes;