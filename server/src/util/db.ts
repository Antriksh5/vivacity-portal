import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

const useSqlite = process.env.DB_DIALECT === 'sqlite';

if (!useSqlite && (!DB_NAME || !DB_USER || !DB_HOST)) {
      console.error(
            '❌ Missing one or more required database environment variables.',
      );
      process.exit(1);
}

// Initialize Sequelize using separate parameters
const sequelize = useSqlite ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || './ca-local.sqlite',
      logging: false,
}) : new Sequelize(DB_NAME!, DB_USER!, DB_PASS, {
      host: DB_HOST,
      port: +(DB_PORT || 3306), // default MySQL port
      dialect: 'mysql',
      logging: false, 
});

export default sequelize;
