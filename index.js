require('dotenv').config();
var path = require('path');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));



app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


// POST route from contact form
app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: process.env.GMAIL_USER,
    subject: 'New message from contact form at tylerkrys.ca',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
  	console.log(mailOpts);
    if (error) {
    	console.log(error);
    	res.sendFile(__dirname + '/index.html');
    }
    else {
      res.redirect('/');
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}` ));

