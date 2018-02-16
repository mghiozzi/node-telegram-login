# node-telegram-login
Check Telegram login widget hash + express.js middleware

## Installation

Install through npm:
```
npm install --save https://github.com/MarcelloGhiozzi/node-telegram-login.git
```

Then use it in your app like so:

```javascript
const TOKEN = '<BOT_TOKEN>'
const TelegramLogin = require('node-telegram-login');
const MySiteLogin = new TelegramLogin(TOKEN);

if(MySiteLogin.checkLoginData(data)) console.log('Data is from telegram! ;)');
if(!MySiteLogin.checkLoginData(data)) console.log('Data is NOT from telegram :(')
```

You can use it like an express middleware like this:

```javascript
const TOKEN = '<BOT_TOKEN>'
const TelegramLogin = require('node-telegram-login');
const MySiteLogin = new TelegramLogin(TOKEN);

app.get('/login', MySiteLogin.defaultMiddleware, (req, res) => {
  console.log(res.locals.telegram_user) //null if not from telegram, contains login data otherwise;
});

```

Also it is possible to set a custom middleware with specified success and fail functions

```javascript
const TOKEN = '<BOT_TOKEN>'
const TelegramLogin = require('node-telegram-login');
const MySiteLogin = new TelegramLogin(TOKEN);

let success = (req,res,next,login_data) => {
  res.locals.telegram_user = login_data;
  next();
}

let fail = (req,res,next) => {
  res.sendStatus(403);
}

app.get('/login', MySiteLogin.customMiddleware(succes, fail), (req, res) => {
  //do your stuff;
});

```
