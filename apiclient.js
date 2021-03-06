var request = require('request');
var ObjectID = require('mongodb').ObjectID;
var db = require('./db');
var moment = require('moment');
moment().format();

var getNyTimesNews = function(){
    //FIXME add request parameter for date
    request('http://api.nytimes.com/svc/topstories/v1/home.json?api-key=280e9e9dd28e9bb3cef90aae49daa39f:7:73666688', function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            console.log("nytimes api successfully requested");
            var response = JSON.parse(body);
            var articles = [];
            response["results"].forEach(function(article){
                var mom = moment(article["updated_date"], "YYYY-MM-DD HH:mm+-HH:mm");
                var url = article["url"];
                var articleEntry = {
                    _id:     ObjectID(hashCode(url)),
                    url:     url,
                    //FIXME
                    section: article["section"],
                    title:   article["title"],
                    pubDate: mom.toISOString()
                };

                articles.push(articleEntry);
            });
            db.insertArticles(articles);
        }

    });
};

//FIXME add request parameter for date
var getGuardianNews = function(){
    request('http://content.guardianapis.com/search?api-key=b308bcee-6a93-4b57-b5c2-1c92344227a3&show-elements=all', function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
            console.log("guardian api successfully requested");
            var response = JSON.parse(body)["response"];
            var articles = [];
            response ["results"].forEach(function(article){
                var url = article["webUrl"];
                var articleEntry = {
                    _id:     ObjectID(hashCode(url)),
                    url:     url,
                    section: article["sectionId"],
                    title:   article["webTitle"],
                    pubdate: article["webPublicationDate"]
                };
                articles.push(articleEntry);
            });
            db.insertArticles(articles);
        }
    });
};


var hashCode = function(string){
    var hash = 0;
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
};


exports.getNyTimesNews = getNyTimesNews;
exports.getGuardianNews = getGuardianNews;