'use strict';

var _snoowrap = require('snoowrap');

var _snoowrap2 = _interopRequireDefault(_snoowrap);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _limiter = require('limiter');

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var limiter = new _limiter.RateLimiter(59, 'minute');

console.log(_config2.default);

var r = new _snoowrap2.default(_config2.default.reddit);

function setflair(user, flair) {
  if (Array.isArray(flair.subredditName)) {
    flair.subredditName.forEach(function (subreddit, index) {
      r.getUser(user).assignFlair({
        subredditName: subreddit,
        text: flair.text[index] || flair.text[0],
        cssClass: flair.css[index] || flair.css[0]
      }).catch(function (e) {
        throw e;
      });;
    });
  } else {
    r.getUser(user).assignFlair({
      subredditName: flair.subreddit,
      text: flair.text,
      cssClass: flair.css
    }).catch(function (e) {
      throw e;
    });;
  }
}

var process = function process() {
  r.getUnreadMessages().then(function (list) {
    list.forEach(function (msg) {
      r.markMessagesAsRead([msg.name]);
      var parsed = {};
      try {
        parsed = _jsYaml2.default.safeLoad(msg.body);
        if (!_config2.default.mods.includes(msg.author.name)) {
          if ("user" in parsed) {
            throw "UNAUTHORIZED. YOU MAY ONLY SET FLAIR FOR YOURSELF.";
          }
        }
        if (Array.isArray(parsed)) {
          parsed.forEach(function (user) {
            limiter.removeTokens(1, function (err, remainingRequests) {
              setflair(user.user, user.flair);
            });
          });
        } else {
          setflair(parsed.user || msg.author.name, parsed.flair);
        }
        msg.reply('SUCCESS');
      } catch (e) {
        msg.reply('**FAILURE**\n\n          ' + e);
      }
    });
  });
};

setInterval(process, 1000 * 10);