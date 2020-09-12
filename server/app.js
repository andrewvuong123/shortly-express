const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const cookieParser = require('./middleware/cookieParser');
const Auth = require('./middleware/auth');
const models = require('./models');
const db = require('./db');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser);
app.use(Auth.createSession);


app.get('/',
  (req, res) => {
    res.render('index');
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.post('/signup', (req, res, next) => {
  console.log('signup initiated');
  //INPUT: req.body.username
  //INPUT: req.body.password
  var username = req.body.username;
  var password = req.body.password;
  //check to see if username exists
  //if it does, reject("user already exists")
  //else models.user ({username, password})
  models.Users.signup({username, password}, (err, msg) => {
    if (err) {
      res.status(403).redirect('/signup');
    } else {
      //signed up OK
      models.Users.get({username}).then(user => {
        models.Sessions.get({hash: req.session.hash}).then(session => {
          console.log('session found');
          console.log(session);
          session.userId = user.id;
          res.status(200).redirect('/');
        });
      });
    }
  });
});

app.post('/login', (req, res, next) => {
  //INPUT: req.body.username
  //INPUT: req.body.password
  var username = req.body.username;
  var password = req.body.password;
  //check if username exists
  //catch(err => res.send('Sorry username doesnt exist'));
  //if it does, check if password is right
  //catch(err => res.send({error: password, msg: 'Sorry wrong password)});
  // err {password} toggle red field for the password input box. //css
  // if matches, create session token
  //  convert to cookie
  //  store in sessions table
  // else reject
  //catch res.send('wrong credentials');
  models.Users.login({username, password}, (err, msg) => {
    if (err) {
      res.status(403).redirect('/login');
    } else {
      models.Users.get({username}).then(user => {
        models.Sessions.get({hash: req.session.hash}).then(session => {
          session.userId = user.id;
          res.status(200).redirect('/');
          next();
        });
      });
    }
  });
});


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {
  //redirect if code === null

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
