import Candidate from '../models/candidate.model';
import { exportToSheets } from './sheetExport';

export async function exportCampusAmbassador(candidate: Candidate) {
  const url = process.env.CA_SHEET_URL || process.env.REGISTRATION_SHEET_URL;
  if (!url) {
    console.error('CA sheet export is not configured; account remains saved in the database.');
    return false;
  }
  const college = typeof candidate.college_details === 'string'
    ? JSON.parse(candidate.college_details) : candidate.college_details;
  return exportToSheets([url], {
    recordType: 'campusAmbassador',
    registeredAt: candidate.createdAt.toISOString(),
    name: candidate.name, email: candidate.email, phone: candidate.phone_number,
    gender: candidate.gender, referral: candidate.referral_id,
    college: college.collegename || college.name || '', degree: college.degree || '',
    state: college.state || '', district: college.district || '',
    isSociety: college.isSociety || 'No', society: college.society || '',
  });
}
