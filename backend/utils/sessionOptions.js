const SESSION_START_YEAR = 2009;

const getSessionOptions = (date = new Date()) => {
  const currentYear = date.getFullYear();
  const sessions = [];
  const lastStartYear = currentYear - 1;

  for (let year = SESSION_START_YEAR; year <= lastStartYear; year += 1) {
    sessions.push(`${year}-${year + 1}`);
  }

  return sessions;
};

const isValidSession = (session) => {
  if (!session) return false;
  return getSessionOptions().includes(String(session).trim());
};

module.exports = {
  SESSION_START_YEAR,
  getSessionOptions,
  isValidSession,
};
