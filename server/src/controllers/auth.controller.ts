import { exportToSheets } from '../util/sheetExport';
import { exportCampusAmbassador } from '../util/caSheetExport';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Candidate from '../models/candidate.model'; // Sequelize model
import { createSecretToken } from '../util/SecretToken';
import { generateRandomString, candidateValid } from '../util/helper'; // Updated helpers

export const signUp = async (req: Request, res: Response) => {
  const details = req.body?.personaldetails;
  if (!details || !req.body?.collegedetails
      || typeof details.Name !== 'string' || !details.Name.trim()
      || typeof details.Email !== 'string' || !/^\S+@\S+\.\S+$/.test(details.Email)
      || !/^\d{10}$/.test(String(details.Phone))
      || typeof details.ConfirmPass !== 'string'
      || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(details.ConfirmPass)
      || details.CreatePass !== details.ConfirmPass
      || !['MALE', 'FEMALE', 'OTHERS'].includes(details.Gender)) {
    return res.status(400).json({ error: 'Invalid CA signup details', success: false });
  }
  details.Email = details.Email.trim().toLowerCase();
  try {
  const generatedRef = await generateRandomString(6);
  let { personaldetails, collegedetails } = req.body;
  const Valid = await candidateValid(
    personaldetails.Email,
    personaldetails.Phone
  );

  if (Valid[0] && Valid[1]) {
    try {
      // Use Sequelize's create method
      const candidate = await Candidate.create({
        name: personaldetails.Name,
        email: personaldetails.Email,
        password: personaldetails.ConfirmPass, // Hook will hash this
        phone_number: String(personaldetails.Phone),
        referral_id: generatedRef,
        gender: personaldetails.Gender,
        college_details: collegedetails, // This will be stored as JSON
        referred_candidates: [], // Explicitly set empty array
      });

      // Use candidate.id (number) from Sequelize
      const token = createSecretToken(candidate.id.toString());
      
      res.cookie('token', token, {
        httpOnly: false,
      });

      // Sheet exports are optional. Database signup remains valid if an export fails.
      await exportCampusAmbassador(candidate);
      await exportToSheets([process.env.SHEET_API1, process.env.SHEET_API_GDG_1], {
        data: {
          Name: personaldetails.Name, Email: personaldetails.Email,
          PhoneNumber: personaldetails.Phone, Gender: personaldetails.Gender,
          ReferralID: generatedRef,
          State: collegedetails.state, District: collegedetails.district,
          CollegeName: collegedetails.collegename, Degree: collegedetails.degree,
          IsSociety: collegedetails.isSociety, Society: collegedetails.society,
          RegisteredAt: new Date().toISOString(),
        },
      });

      res.status(201).json({
        message: 'User Signed in successfully',
        success: true,
        referral_code: generatedRef,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  } else {
    // Error handling (unchanged)
    if (!Valid[0] && !Valid[1]) {
      res.status(409).json({
        error: 'Email and Phone number already registered',
        message:
          'The email address and phone number provided is already associated with an existing user account.',
      });
    } else if (!Valid[0]) {
      res.status(409).json({
        error: 'Email already registered',
        message:
          'The email address provided is already associated with an existing user account.',
      });
    } else {
      res.status(409).json({
        error: 'Phone number already registered',
        message:
          'The phone number provided is already associated with an existing user account.',
      });
    }
  }
  } catch {
    return res.status(500).json({ error: 'Unable to create CA account', success: false });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Use Sequelize's findOne with 'where'
    const user = await Candidate.findOne({
      where: { email: String(email || '').trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid Credentials',
        success: false,
      });
    }

    // Bcrypt comparison (unchanged)
    const auth: boolean = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({
        message: 'Invalid Credentials',
        success: false,
      });
    }

    // Use user.id from Sequelize
    const token = createSecretToken(user.id.toString());

    res.status(201).json({
      message: 'User Signed in successfully',
      success: true,
      token,
      id: user.id, // Send back Sequelize ID
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', success: false });
  }
};
