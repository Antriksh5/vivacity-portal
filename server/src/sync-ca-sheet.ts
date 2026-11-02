import sequelize from './util/db';
import { Op } from 'sequelize';
import Candidate from './models/candidate.model';
import { exportCampusAmbassador } from './util/caSheetExport';

async function sync() {
  if (!process.env.CA_SHEET_URL && !process.env.REGISTRATION_SHEET_URL) {
    throw new Error('Set CA_SHEET_URL or REGISTRATION_SHEET_URL before syncing.');
  }
  await sequelize.authenticate();
  // Explicitly omit passwords from the records loaded for export.
  const candidates = await Candidate.findAll({ attributes: [
    'id', 'createdAt', 'name', 'email', 'phone_number', 'gender', 'referral_id', 'college_details',
  ], where: { email: { [Op.ne]: 'preview@example.test' } }, order: [['id', 'ASC']] });
  let synced = 0;
  for (const candidate of candidates) {
    if (await exportCampusAmbassador(candidate)) synced++;
  }
  console.log(`CA sheet sync: ${synced}/${candidates.length} entries exported or already present.`);
  if (synced !== candidates.length) process.exitCode = 1;
}

sync().catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
