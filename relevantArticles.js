var db = require('./db');

var getArticles = function (cb){
    db.getTagsWithArticles(function (result){
        var articleTags = result;
        if (articleTags.length > 10){
            articleTags = result.slice(0, 10);
        }

        var articles = [];
        var url = [];
        articleTags.forEach(function(articleTag){
            var articlesForTag = articleTag["articles"];

            var firstArticle = articlesForTag[0];

            if (url.indexOf(firstArticle["url"]) == -1){
                articles.push(firstArticle);
                url.push(firstArticle["url"]);

            }
        });

        
        cb(articles);
    });
};

exports.getArticles = getArticles;