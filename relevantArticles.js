var db = require('./db');

var getArticles = function (cb){
    db.getArticles(function (articles){
        cb(articles);
    });
};

exports.getArticles = getArticles;