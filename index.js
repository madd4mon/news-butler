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

//Mail and basic user administration function

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

// app.post(/mail/, urlencodedParser, function (req, res, next) {
//   // setup e-mail data with unicode symbols
//   var mailOptions = {
//       from: 'Newsbutler Jenkins <newsbutler.jenkins@googlemail.com>',
//       to: req.body.mail, // list of receivers
//       subject: 'Your news summary is ready', // Subject line
//       hmtl: 'Hello ' + req.body.name + '!<br /><br />How are you doing? Here is the freshest information I could gather for you right now. Enjoy your news. Feel free to ring, when you need my services again.' // plaintext body
//   };
//
//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, function(error, info){
//       if(error){
//           return console.log(error);
//       }
//       res.render('home');
//   });
// });

app.post(/adduser/, urlencodedParser, function (req, res, next) {
  var db = require('./db');
  db.addUser(req.body.name, req.body.mail, req.body.time);

  var mailOptions = {
      from: 'Newsbutler Jenkins <newsbutler.jenkins@googlemail.com>',
      to: req.body.mail, // list of receivers
      subject: 'Your news summary is ready', // Subject line
      html: 'Hello ' + req.body.name + '!<br /><br />How are you doing? Here is the freshest information I could gather for you right now. <a href="http://localhost:3000/dashboard">Enjoy your news</a>. Feel free to ring, when you need my services again.<br/><br/>Sincerly<br/>Jenkins<br/>News Butler' // plaintext body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
  });

  res.render('home');
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
