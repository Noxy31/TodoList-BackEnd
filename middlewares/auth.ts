import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Récupére le token depuis les en-têtes de la requête
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant.' });
  }

  // Le token est présent, on vérifie sa validité
  try {
    const decoded = jwt.verify(token, process.env.df26575025880a95a32e086f3ce40af5589472869dc22a532ebd0256fe96afd6 as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

export default authMiddleware;