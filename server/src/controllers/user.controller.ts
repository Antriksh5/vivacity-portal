import { Request, Response } from 'express';
import Candidate from '../models/candidate.model'; // Sequelize model

export const GetUser = async (req: Request, res: Response) => {
  try {
    const user = await Candidate.findByPk(res.locals.candidateId);

    if (user) {
      const user_detail = {
        name: user.name,
        gender: user.gender,
        phone_number: user.phone_number,
        email: user.email,
        college: user.college_details, // This is already an object
        referral_code: user.referral_id,
        referred_candidates: user.referred_candidates, // This is already an array
      };
      res.status(201).json(user_detail);
    } else {
      res.status(404).json({ message: 'User not found' }); // Use 404 for not found
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
