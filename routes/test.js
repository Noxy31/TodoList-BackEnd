const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TP-TodoList'
};

async function getUserPassword(email) {
    const connection = await mysql.createConnection(dbConfig);
    const sql = 'SELECT hashedPass FROM utilisateur WHERE userMail = ?';
    const [rows] = await connection.execute(sql, [email]);
    await connection.end();
    return rows.length > 0 ? rows[0].hashedPass : null;
}


async function testPassword() {
    const passwordToTest = 'john.doe01'; // Le mot de passe à tester
    const hashedPasswordFromDb = '$2b$10$qAs0EkjR7.w0vM3ZhMWYfeFVrEqyIOMZ0eU6epLVym/'; // Remplace par le hachage récupéré de la base de données

    const match = await bcrypt.compare(passwordToTest, hashedPasswordFromDb);
    console.log(`Mot de passe correct : ${match}`); // Devrait retourner true si le mot de passe correspond
}

testPassword().catch(err => console.error(err));