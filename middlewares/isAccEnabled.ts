// idem que pour isAdmin mais pour les routes get et post, vérifie si le compte de l'utilisateur n'est pas désactivé (empeche la connexion de l'utilisateur)

import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './authenticate';

const enAccMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && !req.user.isAccEnabled) {
    return res.status(403).json({ message: '' });
  }
  next();
};

export default enAccMiddleware;