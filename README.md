# node-telegram-login

[![Build Status](https://travis-ci.org/MarcelloGhiozzi/node-telegram-login.svg?branch=master)](https://travis-ci.org/MarcelloGhiozzi/node-telegram-login)
[![npm version](https://badge.fury.io/js/node-telegram-login.svg)](http://badge.fury.io/js/node-telegram-login)
[![devDependency Status](https://david-dm.org/MarcelloGhiozzi/node-telegram-login/dev-status.svg)](https://david-dm.org/MarcelloGhiozzi/node-telegram-login#info=devDependencies)
[![GitHub issues](https://img.shields.io/github/issues/MarcelloGhiozzi/node-telegram-login.svg)](https://github.com/MarcelloGhiozzi/node-telegram-login/issues)
[![GitHub stars](https://img.shields.io/github/stars/MarcelloGhiozzi/node-telegram-login.svg)](https://github.com/MarcelloGhiozzi/node-telegram-login/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MarcelloGhiozzi/node-telegram-login/master/LICENSE)

Check [Telegram Login Widget](https://core.telegram.org/widgets/login) hash manually or with an express.js middleware


```
npm install node-telegram-login
```

Simply use the check method

```typescript
import { TelegramLogin } from 'node-telegram-login'
const TelegramAuth = new TelegramLogin('<BOT_TOKEN>');

const verify = (data: TelegramLoginPayload) => 
  console.log(
    TelegramAuth.checkLoginData(data) ?
    `Payload is safe! We can trust ${data.first_name}`,
    'Uhm. Payload is not secure'
  );
```

Or as an express.js middleware like this:

```typescript
import { TelegramLogin } from 'node-telegram-login'
const TelegramAuth = new TelegramLogin('<BOT_TOKEN>');

app.get('/login/telegram', TelegramAuth.defaultMiddleware(), (req, res) => {
  console.log(res.locals.telegram_user)
});

