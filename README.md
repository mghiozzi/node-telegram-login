# node-telegram-login

[![Build Status](https://travis-ci.org/MarcelloGhiozzi/node-telegram-login.svg?branch=master)](https://travis-ci.org/MarcelloGhiozzi/node-telegram-login)
[![npm version](https://badge.fury.io/js/node-telegram-login.svg)](http://badge.fury.io/js/node-telegram-login)
[![devDependency Status](https://david-dm.org/MarcelloGhiozzi/node-telegram-login/dev-status.svg)](https://david-dm.org/MarcelloGhiozzi/node-telegram-login#info=devDependencies)
[![GitHub issues](https://img.shields.io/github/issues/MarcelloGhiozzi/node-telegram-login.svg)](https://github.com/MarcelloGhiozzi/node-telegram-login/issues)
[![GitHub stars](https://img.shields.io/github/stars/MarcelloGhiozzi/node-telegram-login.svg)](https://github.com/MarcelloGhiozzi/node-telegram-login/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MarcelloGhiozzi/node-telegram-login/master/LICENSE)

Check Telegram Login Widget hash manually or with an express.js middleware

## Installation

Install through npm:
```
npm install --save node-telegram-login
```

## Usage

Use it in your app like so:

```javascript
const TOKEN = '<BOT_TOKEN>'
const TelegramLogin = require('node-telegram-login');
const MySiteLogin = new TelegramLogin(TOKEN);

if(MySiteLogin.checkLoginData(data)) console.log('Data is from telegram! ;)');
if(!MySiteLogin.checkLoginData(data)) console.log('Data is NOT from telegram :(')
```

You can use it like an express.js middleware like this:

```javascript
const TOKEN = '<BOT_TOKEN>'
const TelegramLogin = require('node-telegram-login');
const MySiteLogin = new TelegramLogin(TOKEN);

app.get('/login', MySiteLogin.defaultMiddleware(), (req, res) => {
  console.log(res.locals.telegram_user) //null if not from telegram, contains login data otherwise;
});

```

Also it is possible to set a custom middleware with specified success and fail functions.
Success function will be called with req, res, next and the login_data.
Fail function will be called with req, res, next arguments.
In this case you are responsable of calling next()

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

app.get('/login', MySiteLogin.customMiddleware(success, fail), (req, res) => {
  //do your stuff;
});

```
