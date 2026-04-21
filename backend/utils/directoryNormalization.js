const normalizeDepartmentName = (name) => {
  return String(name || '')
    .replace(/^Department\s+of\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

module.exports = {
  normalizeDepartmentName,
};
