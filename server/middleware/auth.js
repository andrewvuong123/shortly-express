const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //INPUT: access the parsed req.cookies
  //QUERY user data from cookies related to that session
  //OUTPUT: attached to req.sessions = {} with relevant user information
  //attach to req.session() // session.isLoggedIn
  //logged in... sessionOBJ

  console.log('Create Session Initialized');
  console.log('Create Session Initialized');
  console.log('Create Session Initialized');
  console.log('Create Session Initialized');
  console.log('Create Session Initialized');
  console.log('Create Session Initialized');
  console.log(res.cookie);
  if (!req.cookies.shortlyid) {
    models.Sessions.create().then((packet) => {
      models.Sessions.get({id: packet.insertId}).then(data => {
        console.log(data);
        res.cookies = {shortlyid: data.hash};
        //models.Users.get({id: userId})
        req.session = data;
        console.log(res.cookies);
        console.log('Request Session is');
        console.log(req.session.hash);
        next();
      });
    });
  } else {
    //CHECK IF HASH VALID
    const { shortlyid } = req.cookies;
    models.Sessions.get({shortlyid}).then(data => {
      if (hash === data.hash) {
        //VALID HASH
        res.cookies = {shortlyid: hash};
        req.session = data;
        next();
      } else {
        //NOT VALID
        console.log('Session OBJ:');
        models.Sessions().create().then(obj => {
          models.Sessions.get({shortlyid}).then(user => {
            res.cookies = {shortlyid: obj.hash};
            req.session = obj;
            next();
          });
        });
      }
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

//session., res.{message: 'sucessful creation, session.info}

module.exports.verifySession = (req, res, next) => {
  //redirect to login...vip endpoints ...
  //redirect

  if (!req.session.user) {
    res.redirect('/login');
  }
  next();
};