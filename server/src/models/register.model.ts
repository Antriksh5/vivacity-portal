import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/db';

// Define the structure for eventInfo JSON
interface EventDetails {
  category: string;
  eventName: string;
  teamSize?: number; // Made optional as it was commented out in interface
  captain: boolean;
  captainName: string;
  teamMembers?: string[]; // Made optional
}

// Define the attributes for the NormalUser model
class NormalUser extends Model {
  public id!: number;
  public name!: string;
  public mobile!: string; // Using STRING for phone numbers
  public email!: string;
  public university!: string;
  public referralCode?: string;
  public participant!: boolean;
  public eventInfo!: EventDetails[]; // Stored as JSON
}

// Initialize the NormalUser model
NormalUser.init(
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
    mobile: {
      type: DataTypes.STRING, // Use STRING for mobile number
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    university: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: true, // Based on original schema
    },
    participant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    eventInfo: {
      type: DataTypes.JSON, // Store array of event details as JSON
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'NormalUser',
  }
);

export default NormalUser;
