import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: { id: number, email: string, isAdmin: boolean };
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies['token'];
  
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

export default authMiddleware;
