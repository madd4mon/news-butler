var request = require('request');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var DB_CONNECTION = 'mongodb://127.0.0.1:27017/newsbutler';

var insertArticles = function (newArticles) {
    MongoClient.connect(DB_CONNECTION, function (err, db) {
        if (err) throw err;
        var collection = db.collection('article');
        newArticles.forEach(function(article){
            setTimeout(function () {
                collection.count({url: article["url"]}, function(err, count){
                    if (count == 0){
                        getConceptsForUrl(article["url"], function (tags){
                            article["tags"] = tags;
                            collection.insertOne(article, function (err, docs) {console.log("added article to db");});
                        });
                    }
                });
            }, 1000);

        });
    });
};

//FIXME add date
var getArticles = function (cf){
    MongoClient.connect(DB_CONNECTION, function(err, db) {
        if(err) throw err;
        var collection = db.collection('article');
        collection.find().toArray(function(err, results) {
            //console.log(results);
            cf(results);
            db.close();
        });
    });
};


var getTagsWithArticles = function (cf){
    MongoClient.connect(DB_CONNECTION, function(err, db) {
        if(err) throw err;
        var collection = db.collection('article');
        collection.aggregate([
            { $project : {
                url : 1,
                tags : 1,
                title: 1,
                pubDate: 1
            }},
            { $unwind : "$tags" },
            { $group : {
                _id : {tag : "$tags"},
                count: { $sum: 1 },
                articles : { $addToSet : "$$ROOT" }
            }},
            { $sort : { "count" : -1}}
        ], function(err, results) {
            cf(results);
            db.close();
        });
    });
};



var getConceptsForUrl = function (article_url, cb){
    var encoded_uri = encodeURI(article_url);
    var apikey = "32cc71fb360c95cd7a1644510db5c5267e79060c";
    var url = "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedConcepts?apikey=" + apikey + "&url=" + encoded_uri + "&outputMode=json";
    request(url, function (error, resp, body) {
        var tags = [];
        if (!error && resp.statusCode == 200) {
            var concepts = JSON.parse(body)["concepts"];
            console.log(body);
            concepts.forEach(function(concept){
                var conc = concept["text"];
                var relevance = concept["relevance"];
                if (parseFloat(relevance) > 0.5){
                    tags.push(conc);
                }
            });
            console.log(tags);
        } else {
            console.log ("error" + err);
        }
        cb(tags);
    });
};

var addUser = function (username,usermail,settime) {
    MongoClient.connect(DB_CONNECTION, function(err, db) {
        if(err) throw err;
        var collection = db.collection('user');
        //Convert time
        var stringToTime = settime.split(":");
        var newtime = new Date();
        newtime.setHours(stringToTime[0]);
        newtime.setMinutes(stringToTime[1]);
        //Add user to db
        var user = {name:username, mail:usermail, time:newtime};
        collection.insert(user);
    });
};

exports.insertArticles = insertArticles;
exports.getArticles = getArticles;
exports.getTagsWithArticles = getTagsWithArticles;
exports.addUser = addUser;
