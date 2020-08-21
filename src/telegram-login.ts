import * as crypto from 'crypto';
import { Request, Response, NextFunction} from 'express';

function verifyTelegramPayload(payload: TelegramLoginPayload, secret: Buffer)  {
  const hash = payload.hash;
  delete payload.hash;
  const check = crypto.createHmac('sha256', secret).update(
    Object
    .keys(payload)
    .map((key: keyof TelegramLoginPayload) => `${key}=${payload[key]}`)
    .sort()
    .join('\n')
  ).digest('hex');
  return hash === check ? Object.assign(payload, {hash}) : false;
}

export interface TelegramLoginPayload {
  id: number;
  hash: string;
  auth_date: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export  class TelegramLogin {

  private secret: Buffer;

  constructor(token: string){
    this.secret = crypto.createHash('sha256').update(token).digest();
  }

  checkLoginData(data: TelegramLoginPayload) {
    return verifyTelegramPayload(data, this.secret)
  }

  defaultMiddleware() {
    return (req: Request<any,any, any, TelegramLoginPayload>, res: Response, next: NextFunction) => {
      res.locals.telegram_user = verifyTelegramPayload(req.query, this.secret);
      next();
    }
  }

  customMiddleware(
    success: (req: Request<any,any, any, TelegramLoginPayload>, res: Response, next: NextFunction, payload: TelegramLoginPayload) => void,
    fail: (req: Request<any,any, any, TelegramLoginPayload>, res: Response, next: NextFunction) => void
  ) {
    return (req: Request<any,any, any, TelegramLoginPayload>, res: Response, next: NextFunction) => {
      let payload = this.checkLoginData(req.query)
      return payload ? success(req,res,next,payload) : fail(req, res, next)
    }
  }

}
