// Middleware qui sert a sécuriser les routes admin 'post' dans le backend (la sécurisation dans le frontend uniquement n'étant, pour moi, pas suffisante)

import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './authenticate';

const isAdminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "" });
  }
};

export default isAdminMiddleware;