var request = require('request');

function getNyTimesNews(){
    console.log("getNyTimes");

    //FIXME add request parameter for date
    request('http://api.nytimes.com/svc/topstories/v1/home.json?api-key=280e9e9dd28e9bb3cef90aae49daa39f:7:73666688', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            response = JSON.parse(body);
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

function getGuardianNews(){
    // FIXME
    console.log("getGuardian");
    /*
    request('http://content.guardianapis.com/sections?api-key=test', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            JSON.parse(body, function(k, v) {
                if (k == 'id'){
                    console.log(v);
                }
            });
        }
    });
    */
}





exports.getNyTimesNews = getNyTimesNews;
exports.getGuardianNews = getGuardianNews;