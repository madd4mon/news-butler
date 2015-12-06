var db = require('./db');

var getArticles = function (cb){
    db.getTagsWithArticles(function (result){
        var articleTags = result;
        if (articleTags.length > 10){
            articleTags = result.slice(0, 10);
        }

        var articles = [];
        articleTags.forEach(function(articleTag){
            var articlesForTag = articleTag["articles"];
            articles.push(articlesForTag[0]);
        });
        console.log("-----");
        console.log(articles);
        cb(articles);
    });
};

exports.getArticles = getArticles;