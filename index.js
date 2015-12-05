var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/users/emmy', function (req, res) {
  res.render('dashboard');
});

app.get('/users/emmy/settings', function (req, res) {
  res.render('settings');
});

//Add static folder
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


var CronJob = require('cron').CronJob;
new CronJob('0 * * * * *', function() {
    var apiclient = require('./apiclient');
    apiclient.getNyTimesNews();
    apiclient.getGuardianNews();
    console.log('You will see this message every minute');
}, null, true, 'Europe/Berlin');
