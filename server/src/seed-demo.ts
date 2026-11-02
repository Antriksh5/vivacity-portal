import sequelize from './util/db';
import Candidate from './models/candidate.model';
import { generateRandomString } from './util/helper';

async function seed() {
  if (sequelize.getDialect() !== 'sqlite' || process.env.NODE_ENV === 'production') {
    throw new Error('Demo accounts are only supported in the local SQLite preview.');
  }
  await sequelize.sync();
  const email = 'preview@example.test';
  if (!await Candidate.findOne({ where: { email } })) {
    await Candidate.create({
      name: 'Preview Ambassador', email, password: 'Preview2026!',
      phone_number: '9000000000', referral_id: await generateRandomString(6),
      gender: 'OTHERS', college_details: {
        state: 'Rajasthan', district: 'Jaipur', collegename: 'Preview College',
        degree: 'BTech', isSociety: 'No', society: '',
      }, referred_candidates: [],
    });
  }
  console.log('Local preview account ready: preview@example.test / Preview2026!');
}

seed().catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
