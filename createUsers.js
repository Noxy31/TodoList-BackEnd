import { query } from '../db';

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tp-todolist'
};

async function createUser(userName, userSurname, userMail, hashedPass, isAdmin, isAccEnabled) {
    const connection = await mysql.createConnection(dbConfig); // Connection a la bdd
    
    const hashedPassword = await bcrypt.hash(hashedPass, 10); // On stock le mdp hashé dans une variable hashedPassword
    
    const sql = 'INSERT INTO users (userName, userSurname, userMail, hashedPass, isAdmin, isAccEnabled) VALUES (?, ?, ?, ?, ?, ?)';
    await connection.execute(sql, [userName, userSurname, userMail, hashedPassword, isAdmin, isAccEnabled]); // On envoie la requete insert into
    
    console.log(`Utilisateur créé : ${userName}`);
    await connection.end(); // On consolelog la confirmation que les users on bien été créé
}

async function main() {
    await createUser('John', 'Doe', 'john.doe@mail.com', 'john.doe01', false, true); // Création d'utilisateur john doe
    await createUser('Jane', 'Due', 'jane.due@mail.com', 'jane.due01', false, true); // Crétation utilisatrice jane due
    await createUser('Jack', 'Ladmin', 'jack.ladmin@mail.com', 'jack.ladmin01', true, true); // Création du premier admin Jack
    await createUser('Jacotte', 'Ladmin', 'jacotte.ladmin@mail.com', 'jacotte.ladmin01', true, true); // Creation du deuxieme admin Jacotte
}

main().catch(err => console.error(err));