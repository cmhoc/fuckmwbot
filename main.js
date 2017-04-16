import snoowrap from 'snoowrap';
import yaml from 'js-yaml';
import {RateLimiter} from 'limiter';
import config from './config.js';

const limiter = new RateLimiter(59, 'minute');

const r = new snoowrap(config.reddit);

function setflair(user, flair) {
  console.log(user, flair);
  r.getUser(user).assignFlair(
    {
      subredditName: flair.subreddit,
      text: flair.text,
      cssClass: flair.css
    }
  ).catch((e) => {throw e});
}


let process = () => {
  r.getUnreadMessages().then((list) => {
    list.forEach((msg) => {
      r.markMessagesAsRead([msg.name]);
      let parsed = {};
      try {
        parsed = yaml.safeLoad(msg.body);
        if(Array.isArray(parsed)) {
          parsed.forEach((user) => {
            limiter.removeTokens(1, (err, remainingRequests) => {
              setflair(user.user, user.flair);
            })
          });
        } else {
          setflair(parsed.user || msg.author.name, parsed.flair);
        }
        msg.reply(`SUCCESS`);
      } catch (e) {
        msg.reply(`**FAILURE**

          ${e}`)
      }
    })
  });
};


setInterval(process, 1000*10);
