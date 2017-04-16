# fuckmwbot
A bot to Flair Users Considering Knowing Model World

## Configuration and Running

[Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) are required.

```
npm install
cd dist/
nano config.js # configure the bot; see blow
node main.js # or forever main.js if you use forever to keep the script running
```

You need to first creat a bot account (or an existing one) at reddit, then go to https://www.reddit.com/prefs/apps to create an app. For this bot, you should choose `script` as the type and `http://example.com` (or any uri really) for redirect uri.

![a screenshot of how to create an app to use Reddit api](https://i.imgur.com/ZwHhrFX.png)
![a screenshot of the "examplebot" app after creation](https://i.imgur.com/GRZ5cBi.png)
![a screenshot of where you can get the ID and secret](https://i.imgur.com/CcJtAFt.png)

The configuration file is straightforward:

```javascript
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  reddit: {
    userAgent: 'USER_AGENT', // put a user agent string here; SEE https://github.com/reddit/reddit/wiki/API
    clientId: 'CLIENT ID', // put client ID here; see above screenshot
    clientSecret: 'CLIENT SECRET', // put client secret here; see above screenshot
    username: 'BOT USERNAME', // put your bot account's username here
    password: 'BOT PASSWORD'// put your bot account's password here
  },
  mods: ['MODERATOR_1', 'MODERATOR_2'] // put your moderators here; NOTE: THEY CAN CHANGE FLAIRS FOR EVERYONE
};
```


## Usage

First add the bot as a moderator (with flair permission) to all subreddits you want it to set flairs on. There are two formats of supported: [YAML](https://yaml.org) and CSV (comma separated values).

### YAML

Then send a private message in the following format to the bot account:

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

It supports setting flairs for multiple subreddits at once, e.g.

```yaml
---
user:
  - zhantongz
  - smallweinerdengboi99
flair:
  text: 
  - mcbc flair text
  - cmhoc flair text
  css: 
  - mcbc-flair
  - cmhoc-flair
  subreddit:
  - mcbc
  - cmhoc
```

You can also use the following for shared flairs:

```yaml
---
user:
  - zhantongz
  - smallweinerdengboi99
flair:
  text: 
  - Flair text for both /r/mcbc and /r/cmhoc
  css: 
  - common-flair-class
  subreddit:
  - mcbc
  - cmhoc
```

The bot can also accept multiple requests in one message, e.g.

```yaml
---
- user:
  - zhantongz
  - cmhoc
  flair:
    text:
    - mcbc flair text
    - cmhoc flair text
    css:
    - mcbc-flair
    - cmhoc-flair
    subreddit:
    - mcbc
    - cmhoc
- user:
  - smallweinerdengboi99
  flair:
    text: cmhoc flair
    css: cmhoc-flair
    subreddit: cmhoc
```

### CSV

Send a message to the bot in the following format (first row MUST be `csv`):

```
csv
username1,subreddit1,text1,css-class1
username2,subreddit2,text2,css-class2
username3,subreddit3,text3,css-class3
```

i.e. the CSV message 
```csv
csv
zhantongz,mcbc,flair text,flair-css-class
smallweinerdengboi99,mcbc,flair text,flair-css-class
```
is equivalent to

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
