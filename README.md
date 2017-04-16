# fuckmwbot
A bot to Flair Users Considering Knowing Model World

## Configuration and Running

[Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) are required.

```
npm install
nano config.js # configure the bot; see blow
node main.js # or forever main.js if you use forever to keep the script running
```

You need to first creat a bot account (or an existing one) at reddit, then go to https://www.reddit.com/prefs/apps to create an app. For this bot, you should choose `script` as the type and `http://example.com` (or any uri really) for redirect uri.

![a screenshot of how to create an app to use Reddit api](https://i.imgur.com/ZwHhrFX.png)
![a screenshot of the "examplebot" app after creation](https://i.imgur.com/GRZ5cBi.png)
![a screenshot of where you can get the ID and secret](https://i.imgur.com/CcJtAFt.png)

The configuration file is straightforward:

```javascript
export {
  reddit: {
    userAgent: 'USER_AGENT', // put a user agent string here; SEE https://github.com/reddit/reddit/wiki/API
    clientId: 'CLIENT ID', // put client ID here; see above screenshot
    clientSecret: 'CLIENT SECRET', // put client secret here; see above screenshot
    username: 'BOT USERNAME', // put your bot account's username here
    password: 'BOT PASSWORD' // put your bot account's password here
  }
}
```


## Usage

First add the bot as a moderator (with flair permission) to all subreddits you want it to set flairs on.

Then send a private message in the following format to the bot account (it's [YAML](https://yaml.org)!):

```yaml
---
user:
  - zhantongz
  - smallweinerdengboi99
flair:
  text: flair text
  css: flair-css-class
  subreddit: mcbc
```

Above message will ask the bot to set a flair saying "flair text" with `flair-css-class` CSS class for the users `zhantongz` and `smallweinerdengboi99` on /r/MCBC. The `user` part may be omitted and then the flair will be set for the sender of the message, allowing self-requests.

