const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;


const TelegramLogin = require('../dist/index').TelegramLogin;
const TOKEN = 'THISISJUSTATEST';
const myLogin = new TelegramLogin(TOKEN)

const valid_payload = {
  id: 2038510,
  auth_date: '1518786225',
  first_name: 'HappyBoi',
  photo_url: 'https://t.me/i/userpic/392/HappyBoi.jpg',
  username: 'HappyBoi',
  hash: '4e701ce359ca4395b7d9fc67a1dba0c46bb6fa76f0cbf4097c22fe6c0e42ad59',
}
const invalid_payload = {
  id: 2038510,
  auth_date: '1518786225',
  first_name: 'HappyBoi',
  photo_url: 'https://t.me/i/userpic/392/HappyBoi.jpg',
  username: 'HappyBoi',
  hash: '4e701ce359ca4395badhashbadhash6fa76f0cbf4097c22fe6c0e42ad59',
};

const valid_data = {
  id: 2038510,
  auth_date: '1518786225',
  first_name: 'HappyBoi',
  photo_url: 'https://t.me/i/userpic/392/HappyBoi.jpg',
  username: 'HappyBoi',
  hash: '4e701ce359ca4395b7d9fc67a1dba0c46bb6fa76f0cbf4097c22fe6c0e42ad59',
}

describe('checkLoginData', function () {
  it('should validate and return data payload', function * () {
    const result = myLogin.checkLoginData(valid_payload);
    expect(result).to.eql(valid_data)
  })
  it('should NOT validate payload and return false', function * () {
    const result = myLogin.checkLoginData(invalid_payload);
    expect(result).to.eql(false)
  })
});


describe('defaultMiddleware', function () {
  it('should return a function()', function * () {
    const middleware = myLogin.defaultMiddleware();
    expect(middleware).to.be.an('function');
  });
  it('should accept three arguments', function * () {
    const middleware = myLogin.defaultMiddleware();
    expect(middleware.length).to.equal(3);
  });
  it('should call next() once', function * (){
    const middleware = myLogin.defaultMiddleware();
    const nextSpy = chai.spy();
    const result = middleware({query: valid_payload}, {locals: {}}, nextSpy)
    expect(nextSpy).to.have.been.called.once;
  });
  it('should set res.locals.telegram_user to data', function * (){
    const middleware = myLogin.defaultMiddleware();
    const nextSpy = chai.spy();
    const res = {locals: {}};
    const result = middleware({query: valid_payload}, res, nextSpy)
    expect(res.locals.telegram_user).to.eql(valid_data)
  });
})


describe('customMiddleware', function () {
  it('should return a function()', function * () {
    const middleware = myLogin.customMiddleware(() => null, () => null);
    expect(middleware).to.be.an('function');
  });
  it('should accept three arguments', function * () {
    const middleware = myLogin.customMiddleware(() => null, () => null);
    expect(middleware.length).to.equal(3);
  });
  it('should call success() once', function * (){
    const successSpy = chai.spy()
    const nextSpy = chai.spy();
    const middleware = myLogin.customMiddleware(successSpy, () => null);
    const res = {locals: {}};
    const result = middleware({query: valid_payload}, res, nextSpy)
    expect(successSpy).to.have.been.called.once;
  });
  it('should call fail() once', function * (){
    const failSpy = chai.spy()
    const nextSpy = chai.spy();
    const middleware = myLogin.customMiddleware(() => null,failSpy);
    const res = {locals: {}};
    const result = middleware({query: invalid_payload}, res, nextSpy)
    expect(failSpy).to.have.been.called.once;
  });
})
