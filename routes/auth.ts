import { Router, Request, Response } from 'express';
import { query } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import isAccEnabled from '../middlewares/isAccEnabled';

dotenv.config();

const authRouter = Router();
authRouter.use(cookieParser());

authRouter.post('/login', isAccEnabled, async (req: Request, res: Response) => {
  console.log('Login endpoint hit');
  const { email, password } = req.body;
  console.log(email);
  
  try {
    const sql = 'SELECT * FROM users WHERE userMail = ?';
    const users = await query(sql, [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found. Please try again or contact your administrator.' });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.hashedPass);
    
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password. Please try again or contact your administrator.' });
    }

    if (!user.isAccEnabled) {
      return res.status(403).json({ message: 'Account disabled, please contact your administrator.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET non défini');
      return res.status(500).json({ message: 'Erreur de configuration du serveur' });
    }

    const token = jwt.sign(
      { id: user.idUser, email: user.userMail, isAdmin: user.isAdmin, isAccEnabled: user.isAccEnabled }, 
      jwtSecret, 
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.idUser,
        email: user.userMail,
        isAdmin: user.isAdmin,
        isAccEnabled: user.isAccEnabled
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).send(error);
  }
});

export default authRouter;