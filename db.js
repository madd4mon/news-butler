var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var insertArticles = function (newArticles) {

    MongoClient.connect('mongodb://127.0.0.1:27017/newsbutler', function (err, db) {
        if (err) throw err;
        var collection = db.collection('article');
        collection.insertMany(newArticles, function (err, docs) {
            db.close();
        });
    });
};

exports.insertArticles = insertArticles;
