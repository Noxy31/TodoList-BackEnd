import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Création de la pool de connexions à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Fonction helper pour exécuter des requêtes SQL
export async function query(sqlString: string, params: any[] = []): Promise<any> {
  try {
    const [result] = await pool.execute(sqlString, params);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL :", error);
    throw error;
  }
}