import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/db';
import bcrypt from 'bcryptjs';

// Define the structure for college_details JSON
interface CollegeDetails {
  state: string;
  district: string;
  name: string;
  degree: string;
  isSociety: string;
  society: string;
}

// Define the attributes for the Candidate model
class Candidate extends Model {
  public id!: number; // Sequelize adds 'id' by default
  public name!: string;
  public email!: string;
  public password!: string;
  public phone_number!: string; // Using STRING for phone numbers is safer
  public referral_id!: string;
  public gender!: 'MALE' | 'FEMALE' | 'OTHERS';
  public college_details!: CollegeDetails;
  public referred_candidates!: string[]; // Will be stored as JSON

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Candidate model
Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING, // Use STRING to preserve leading zeros or symbols
      allowNull: false,
      unique: true,
    },
    referral_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHERS'),
      allowNull: false,
    },
    college_details: {
      type: DataTypes.JSON, // Store the object as JSON
      allowNull: false,
    },
    referred_candidates: {
      type: DataTypes.JSON, // Store the array as JSON
      defaultValue: [], // Default to an empty array
    },
  },
  {
    sequelize, // We need to pass the connection instance
    modelName: 'Candidate', // We need to choose the model name
    hooks: {
      // Use 'beforeCreate' hook to hash password, similar to 'pre.save'
      beforeCreate: async (candidate: Candidate) => {
        candidate.password = await bcrypt.hash(candidate.password, 12);
      },
    },
  }
);

export default Candidate;
