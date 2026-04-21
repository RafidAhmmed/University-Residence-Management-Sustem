const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DirectoryOption = require('../models/DirectoryOption');
const { normalizeDepartmentName } = require('../utils/directoryNormalization');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseOfficeCsv = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });

    return row;
  });
};

const toBool = (value) => String(value).toLowerCase() === 'true';

const mapKind = (type) => {
  if (type === 'department') return 'department';
  if (type === 'hall') return 'hall';
  return null;
};

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hall_management';
  const csvPath = path.join(__dirname, '..', 'office.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`office.csv not found at ${csvPath}`);
  }

  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseOfficeCsv(csvText);

  const options = rows
    .map((row) => {
      const kind = mapKind(row.type);
      if (!kind) return null;
      if (!toBool(row.is_active)) return null;

      return {
        kind,
        sourceId: Number(row.id),
        name: kind === 'department' ? normalizeDepartmentName(row.name) : row.name,
        nameBn: row.name_bn || null,
        code: row.code || null,
        displayOrder: Number(row.display_order || 0),
        isActive: true,
      };
    })
    .filter(Boolean);

  await mongoose.connect(mongoUri);

  await DirectoryOption.deleteMany({ kind: { $in: ['department', 'hall'] } });
  await DirectoryOption.insertMany(options, { ordered: false });

  const departmentCount = options.filter((item) => item.kind === 'department').length;
  const hallCount = options.filter((item) => item.kind === 'hall').length;

  console.log(`Seed complete. Departments: ${departmentCount}, Halls: ${hallCount}`);

  await mongoose.disconnect();
};

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error('Seeding failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // no-op
    }
    process.exit(1);
  });
