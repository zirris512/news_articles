const Router = require("express").Router;
const db = require("../models");
const cheerio = require("cheerio");
const axios = require("axios");

const allRoutes = Router();

allRoutes.get("/scrape", (_req, res) => {
    axios.get("https://www.reddit.com/r/news/").then(response => {
        const $ = cheerio.load(response.data);

        $(".Post").each((_i, element) => {
            let result = {};

            result.title = $(".SQnoC3ObvgnGjWt90zD9Z", element).text();
            result.url = $("._13svhQIUZqD9PVzFcLwOKT", element).attr("href");

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
        let articleList = [];

        for(let i = 0; i < dbArticle.length; i++) {
            articleList[i] = {id: dbArticle[i]._id, title: dbArticle[i].title, url: dbArticle[i].url};
        };

        res.render("index", {articles: articleList});
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
        return db.Articles.findOneAndUpdate({_id: req.params.id}, {$push: {comments: dbComments._id}}, {new: true});
    }).then(dbArticle => {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = allRoutes;