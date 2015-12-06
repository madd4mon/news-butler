var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get(/dashboard/, function (req, res) {
    var relevant = require('./relevantArticles');
    relevant.getArticles(function (articles){
        console.log(articles);
        res.render('dashboard', {articles: articles});
    });
});

app.get(/information/, function (req, res) {
  res.render('information');
});

app.get(/settings/, function (req, res) {
  res.render('settings');
});

//Mail function

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    secureConnection: true,
    auth: {
        user: 'newsbutler.jenkins@googlemail.com',
        pass: 'howcaniserveyou'
    }
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post(/mail/, urlencodedParser, function (req, res, next) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Newsbutler Jenkins <newsbutler.jenkins@googlemail.com>',
      to: req.body.mail, // list of receivers
      subject: 'Your news summary is ready', // Subject line
      text: 'Hello world' // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      res.render('home');
  });
});

//Add static folder
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('News Butler listening at http://%s:%s', host, port);
});

// every minute request the APIs from guardian and new york times

var CronJob = require('cron').CronJob;
new CronJob('0 * * * * *', function() {
    var apiclient = require('./apiclient');
    console.log('APIs will be requested by cron job');
    apiclient.getNyTimesNews();
    apiclient.getGuardianNews()


}, null, true, 'Europe/Berlin');
