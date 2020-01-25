const Router = require("express").Router;
const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");

const allRoutes = Router();

allRoutes.get("/scrape", (_req, res) => {
    axios.get("https://www.pcgamer.com/news/").then(response => {
        const $ = cheerio.load(response.data);

        $("div .listingResult", "#content").each((_i, element) => {
            let result = {};

            result.title = $(".article-name", element).text();
            result.summary = $(".synopsis", element).text().replace('News\n', '').replace('news\n', '');
            result.url = $(".article-link", element).attr("href");

            db.Articles.create(result).then(dbArticle => {
                console.log(dbArticle);
            }).catch(err => {
                console.log(err);
            });
        });

        res.send("Scrape Complete!");
    });
});

allRoutes.get("/", (_req, res) => {
    db.Articles.find({}).then(dbArticle => {
        console.log(dbArticle);
        res.render("index", {articles: dbArticle});
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
        res.json(dbComments);
    }).then(dbArticle => {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = allRoutes;