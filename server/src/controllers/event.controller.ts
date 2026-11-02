import NormalUser from '../models/register.model';
import { Request, Response } from 'express';
import Candidate from '../models/candidate.model';
import sequelize from '../util/db';
import { Op, Transaction } from 'sequelize';
import { exportToSheets } from '../util/sheetExport';

export const RegisterUser = async (req: Request, res: Response) => {
  const { personaldetails: details, eventdetails: events } = req.body || {};
  if (!details || !Array.isArray(events)
      || typeof details.name !== 'string' || !details.name.trim()
      || typeof details.university !== 'string' || !details.university.trim()
      || typeof details.email !== 'string' || !/^\S+@\S+\.\S+$/.test(details.email.trim())
      || !/^\d{10}$/.test(String(details.mobile))
      || typeof details.participant !== 'boolean'
      || (details.referralCode != null && typeof details.referralCode !== 'string')
      || (details.participant && events.length === 0)) {
    return res.status(400).json({ message: 'Invalid registration details', success: false });
  }
  if (events.some(event => !event || typeof event.category !== 'string' || !event.category.trim()
      || typeof event.eventName !== 'string' || !event.eventName.trim()
      || !/^\d+$/.test(String(event.teamSize)) || !Number.isSafeInteger(Number(event.teamSize))
      || Number(event.teamSize) < 1 || typeof event.captain !== 'boolean'
      || typeof event.teamName !== 'string' || !event.teamName.trim()
      || !Array.isArray(event.teamMembers) || event.teamMembers.some((name: unknown) => typeof name !== 'string')
      || event.teamMembers.length > Number(event.teamSize))) {
    return res.status(400).json({ message: 'Invalid event or team details', success: false });
  }
  const email = details.email.trim().toLowerCase();
  const mobile = String(details.mobile);
  const referral = (details.referralCode || '').trim().toUpperCase();
  try {
    // One registration and its CA credit are committed together. SQLite uses a
    // write reservation; MySQL serializes registrations through the CA row lock.
    const result = await sequelize.transaction({
      type: Transaction.TYPES.IMMEDIATE,
    }, async transaction => {
      const ca = referral ? await Candidate.findOne({
        where: { referral_id: referral }, transaction, lock: transaction.LOCK.UPDATE,
      }) : null;
      if (referral && !ca) return { status: 404, message: 'No CA with this referral code found' };
      const duplicate = await NormalUser.findOne({
        where: { [Op.or]: [{ email }, { mobile }] }, transaction,
      });
      if (duplicate) return { status: 409, message: 'Email or phone number already registered' };
      await NormalUser.create({
        name: details.name.trim(), email, mobile,
        university: details.university.trim(), referralCode: referral,
        participant: details.participant, eventInfo: details.participant ? events : [],
      }, { transaction });
      if (ca) {
        const existing = typeof ca.referred_candidates === 'string'
          ? JSON.parse(ca.referred_candidates) : ca.referred_candidates;
        ca.set('referred_candidates', [...(existing || []), details.name.trim()]);
        ca.changed('referred_candidates', true);
        await ca.save({ transaction });
      }
      return { status: 201, message: 'User registered successfully' };
    });
    if (result.status !== 201) return res.status(result.status).json({ message: result.message, success: false });

    // Current registration sheet expects a flat payload, one row per event.
    const rows = details.participant ? events : [{}];
    for (const event of rows) {
      const row = {
        name: details.name.trim(), email, phone: mobile,
        college: details.university.trim(), referral,
        isParticipant: details.participant ? 'yes' : 'no',
        eventCat: event.category || '', eventName: event.eventName || '',
        teamSize: event.teamSize == null ? '' : String(event.teamSize),
        isCaptain: typeof event.captain === 'boolean' ? (event.captain ? 'yes' : 'no') : '',
        teamName: event.teamName || '', membersName: (event.teamMembers || []).join(', '),
      };
      await exportToSheets([process.env.REGISTRATION_SHEET_URL], row);
      await exportToSheets([process.env.SHEET_API2, process.env.SHEET_API_GDG_2], {
        data: {
          Name: row.name, Email: email, MobileNumber: mobile, University: row.college,
          ReferralCode: referral, Participant: row.isParticipant,
          EventCategory: row.eventCat, EventName: row.eventName, TeamSize: row.teamSize,
          Captain: row.isCaptain, TeamName: row.teamName, TeamMembers: row.membersName,
          RegisteredAt: new Date().toISOString(),
        },
      });
    }
    return res.status(201).json({ message: result.message, success: true });
  } catch (error) {
    console.error('Registration failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ message: 'Registration failed. Please try again.', success: false });
  }
};
