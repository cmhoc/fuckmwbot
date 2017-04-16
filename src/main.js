import snoowrap from 'snoowrap';
import yaml from 'js-yaml';
import {RateLimiter} from 'limiter';
import config from './config.js';

const limiter = new RateLimiter(59, 'minute');

console.log(config);

const r = new snoowrap(config.reddit);

function setflair(user, flair) {
  if(Array.isArray(flair.subredditName)) {
    flair.subredditName.forEach((subreddit, index) => {
      r.getUser(user).assignFlair(
        {
          subredditName: subreddit,
          text: flair.text[index] || flair.text[0],
          cssClass: flair.css[index] || flair.css[0]
        }
      ).catch((e) => {throw e});;
    });
  } else {
    r.getUser(user).assignFlair(
      {
        subredditName: flair.subreddit,
        text: flair.text,
        cssClass: flair.css
      }
    ).catch((e) => {throw e});;
  }
}


let process = () => {
  r.getUnreadMessages().then((list) => {
    list.forEach((msg) => {
      r.markMessagesAsRead([msg.name]);
      let parsed = {};
      try {
        parsed = yaml.safeLoad(msg.body);
        if (!config.mods.includes(msg.author.name)) {
          if ("user" in parsed) {
            throw "UNAUTHORIZED. YOU MAY ONLY SET FLAIR FOR YOURSELF.";
          }
        }
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

