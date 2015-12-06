var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var DB_CONNECTION = 'mongodb://127.0.0.1:27017/newsbutler';

var insertArticles = function (newArticles) {
    MongoClient.connect(DB_CONNECTION, function (err, db) {
        if (err) throw err;
        var collection = db.collection('article');
        newArticles.forEach(function(article){
            collection.count({url: article["url"]}, function(err, count){
                if (count == 0){
                    collection.insertOne(article, function (err, docs) {

                    });
                }
            })
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


var getConfigValue = function (cf){
    MongoClient.connect(DB_CONNECTION, function(err, db) {
        if(err) throw err;
        var collection = db.collection('article');
        collection.find().toArray(function(err, results) {
            console.log(results);
            cf(results);
            db.close();
        });
    });
};

exports.insertArticles = insertArticles;
exports.getArticles = getArticles;
