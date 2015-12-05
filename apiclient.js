var request = require('request');

function getNyTimesNews(){
    console.log("getNyTimes");

    //FIXME add request parameter for date
    request('http://api.nytimes.com/svc/topstories/v1/home.json?api-key=280e9e9dd28e9bb3cef90aae49daa39f:7:73666688', function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            var response = JSON.parse(body);
            var articles = [];
            response["results"].forEach(function(article){
                var articleEntry = {
                    url:     article["url"],
                    //FIXME
                    section: article["section"],
                    title:   article["title"],
                    pubDate: article["updated_date"]
                    //FIXME tags
                };
                console.log(articleEntry);
                articles.push(articleEntry);
            });

            var db = require('./db');
            db.insertArticles(articles);
        }
    });
}

//FIXME add request parameter for date
function getGuardianNews(){
    request('http://content.guardianapis.com/search?api-key=b308bcee-6a93-4b57-b5c2-1c92344227a3&show-elements=all', function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            var response = JSON.parse(body)["response"];
            var articles = [];
            response ["results"].forEach(function(article){
                var articleEntry = {
                    url:     article["webUrl"],
                    section: article["sectionId"],
                    title:   article["webTitle"],
                    pubdate: article["webPublicationDate"]
                };
                console.log(articleEntry);
                articles.push(articleEntry);
            });
            var db = require('./db');
            db.insertArticles(articles);
        }
    });
}

exports.getNyTimesNews = getNyTimesNews;
exports.getGuardianNews = getGuardianNews;