import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-token-auth'];
    try {
      const authData = verify(token, process.env.JWT_SECRET);
      req['user'] = authData;
    } catch (error) {
      throw new UnauthorizedException();
    }
    next();
  }
}
