import Candidate from '../models/candidate.model';
import NormalUser from '../models/register.model';

export async function generateRandomString(length: number): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';
  let refPresent = true;

  // Loop until we find a unique ID
  while (refPresent) {
    result = ''; // Reset result
    for (let i = 0; i < length / 2; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    for (let i = 0; i < length / 2; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result += numbers.charAt(randomIndex);
    }

    // Check if this ID already exists using Sequelize
    const existingCandidate = await Candidate.findOne({
      where: { referral_id: result },
    });
    
    if (!existingCandidate) {
      refPresent = false; // Found a unique ID, exit loop
    }
  }
  return result;
}

export async function candidateValid(
  email: string,
  phone_number: number | string, // Allow string
): Promise<boolean[]> {
  // Find using 'where' clause
  const emailValid = await Candidate.findOne({
    where: { email: email },
  });
  const phoneValid = await Candidate.findOne({
    where: { phone_number: String(phone_number) }, // Ensure it's a string
  });
  return [!Boolean(emailValid), !Boolean(phoneValid)];
}

export async function UserValid(
  email: string,
  phone_number: number | string, // Allow string
): Promise<boolean[]> {
  const emailValid = await NormalUser.findOne({
    where: { email: email },
  });
  const phoneValid = await NormalUser.findOne({
    where: { mobile: String(phone_number) }, // Check against 'mobile' field
  });
  return [!Boolean(emailValid), !Boolean(phoneValid)];
}
