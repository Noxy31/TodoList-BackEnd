import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import dotenv from 'dotenv';

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

export default authMiddleware;