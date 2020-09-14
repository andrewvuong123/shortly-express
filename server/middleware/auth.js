const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //INPUT: access the parsed req.cookies
  //QUERY user data from cookies related to that session
  //OUTPUT: attached to req.sessions = {} with relevant user information, res.cookies
  //attach to req.session() // session.isLoggedIn
  //logged in... sessionOBJ

  Promise.resolve(req.cookies.shortlyid).then(hash => {
    if (!hash) {
      throw hash;
    }
    return models.Sessions.get({hash});
  }).tap(session => {
    if (!session) {
      throw session;
    }
  }).catch(() => {
    // create new cookie if does not match or does not exist
    return models.Sessions.create().then(results => {
      return models.Sessions.get({ id: results.insertId});
    }).tap(session => {
      res.cookie('shortlyid', session.hash);
    });
  }).then(session => {
    req.session = session;
    next();
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

//session., res.{message: 'sucessful creation, session.info}

module.exports.verifySession = (req, res, next) => {
  //redirect to login...vip endpoints ...
  //redirect
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};