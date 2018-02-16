const crypto = require('crypto');

function checkLogin(data, secret){
  data = JSON.parse(JSON.stringify(data));
  let input_hash = data.hash;
  delete data.hash;
  let array = [];
  for (let key in data){
    array.push(key+'='+data[key]);
  }
  array = array.sort();
  let check_string = array.join('\n');
  let check_hash = crypto.createHmac('sha256', secret).update(check_string).digest('hex');
  if (check_hash == input_hash){
    return data;
  } else {
    return false;
  }
}

module.exports = class TelegramLogin {
  constructor(token){
    this.token = token;
    this.secret = crypto.createHash('sha256').update(this.token).digest();
  }

  checkLoginData(data){
    return checkLogin(data, this.secret)
  }

  defaultMiddleware(){
    return (req,res,next) => {
      res.locals.telegram_user = checkLogin(req.query, this.secret);
      next();
    }
  }

  customMiddleware(success, fail){
    return (req, res, next) => {
      let login_data = checkLogin(req.query, this.secret)
      if (login_data){
        success(req,res,next,login_data);
      } else {
        fail(req,res,next);
      }
    }
  }
}
