import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


export const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'eventos_app',
  waitForConnections: true,
  connectionLimit: 10,
});



