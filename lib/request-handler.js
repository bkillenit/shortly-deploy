var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Link = require('../app/models/link');
var User = require('../app/models/user');
var Promise = require('bluebird');

///////////REFERENCE////////////////
// http://mongoosejs.com/docs/api.html
// http://mongoosejs.com/docs/queries.html

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if (err) throw 'ERROR: Failed to fetch links';
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  var query = Promise.promisify(Link.findOne);
  query({url: uri}).then(function(link) {
    if(link) res.send(200, link); // if found, send back the link
    util.getUrlTitle = Promise.promisify(util.getUrlTitle);
    util.getUrlTitle(uri).then(function(title) {
      // Copy pasted from app/model/link file.
      var shasum = crypto.createHash('sha1');
      shasum.update(uri);
      var code = shasum.digest('hex').slice(0, 5);
      var link = new Link({
        url: uri,
        base_url: req.header.origin,
        code: code,
        title: title
      });
      link.save(function(err) {
        if (err) throw 'ERROR: Could not save link'; // error case
        res.send(200, link); // link saved
      });
    })
    .catch(function(err) {
      throw 'ERROR: Couldn not get URL title'; // Couldn't get URL title.
    });
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });

  var query = Promise.promisify(User.findOne);

  query({username: username}).then(function(user){
    if(!user) res.redirect('/login');
    else {
      if(bcrypt.compareSync(password, user.password)) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    }
  })
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = Promise.promisify(User.findOne);

  query({username: username}).then(function(user){
    if(user) res.redirect('/login'); // If user already exists, redirect to login
    bcrypt.hash = Promise.promisify(bcrypt.hash);
    return bcrypt.hash(password, null, null)
  }).then(function(hash) {
    var user = new User({username: username, password: hash});
    user.save(function(err) {
      if (err) throw 'ERROR: Save Failure'; // Save failure
      req.session.username = username;
      res.redirect('/');
    })
  });
};

exports.navToLink = function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};