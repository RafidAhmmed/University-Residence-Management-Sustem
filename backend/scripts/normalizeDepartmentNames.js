const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const DirectoryOption = require('../models/DirectoryOption');
const User = require('../models/User');
const { normalizeDepartmentName } = require('../utils/directoryNormalization');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hall_management';
  await mongoose.connect(mongoUri);

  const departmentOptions = await DirectoryOption.find({ kind: 'department' });
  for (const option of departmentOptions) {
    const normalized = normalizeDepartmentName(option.name);
    if (normalized && normalized !== option.name) {
      option.name = normalized;
      await option.save();
    }
  }

  const users = await User.find({ department: { $exists: true, $ne: null } });
  for (const user of users) {
    const normalized = normalizeDepartmentName(user.department);
    if (normalized && normalized !== user.department) {
      user.department = normalized;
      await user.save();
    }
  }

  console.log(`Normalized departments. Options: ${departmentOptions.length}, Users: ${users.length}`);
  await mongoose.disconnect();
};

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error('Normalization failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // no-op
    }
    process.exit(1);
  });
