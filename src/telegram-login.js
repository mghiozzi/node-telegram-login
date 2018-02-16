const crypto = require('crypto');
module.exports = class TelegramLogin {
  constructor(token){
    this.token = token;
    this.secret = crypto.createHash('sha256').update(this.token).digest();
  }

  checkLoginData(data){
    let input_hash = data.hash;
    delete data.hash;
    let array = [];
    for (let key in data){
      array.push(key+'='+data[key]);
    }
    array = array.sort();
    let check_string = array.join('\n');
    let check_hash = crypto.createHmac('sha256', this.secret).update(check_string).digest('hex');
    if (check_hash == input_hash){
      return data;
    } else {
      return false;
    }
  }

  defaultMiddleware(req, res, next){
    if (req.query.hash && req.query.id){
      res.locals.telegram_user = this.checkLoginData(req.query);
    }
    next();
  }

  customMiddleware(success, fail){
    return (req, res, next) => {
      let login_data = this.checkLoginData(req.query)
      if (req.query.hash && req.query.id && login_data){
        success(req,res,next,login_data);
      } else {
        fail(req,res,next);
      }
    }
  }
}
