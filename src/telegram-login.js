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

  defaultMiddleware(){
    let that = this;
    return (req,res,next) => {
      let data = req.query;
      res.locals.telegram_user = that.checkLoginData(req.query);
      next();
    }
  }

  customMiddleware(success, fail){
    let that = this;
    return (req, res, next) => {
      let login_data = that.checkLoginData(req.query)
      if (login_data){
        success(req,res,next,login_data);
      } else {
        fail(req,res,next);
      }
    }
  }
}
