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
            console.log(articleTag["_id"]["tag"]);

            for (var i = 0; i < articlesForTag.length; i++) {
                var article = articlesForTag[i];
                if (url.indexOf(article["url"]) == -1){
                    articles.push(article);
                    url.push(article["url"]);
                    break;
                }
            }
        });
        cb(articles);
    });
};

exports.getArticles = getArticles;