const STUDENT_EMAIL_DOMAIN = 'student.just.edu.bd';

const normalizeStudentEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeStudentId = (studentId) => String(studentId || '').trim();

const buildStudentEmail = (studentId, departmentCode) => {
  const normalizedStudentId = normalizeStudentId(studentId);
  const normalizedDepartmentCode = String(departmentCode || '').trim().toLowerCase();

  return `${normalizedStudentId}.${normalizedDepartmentCode}@${STUDENT_EMAIL_DOMAIN}`;
};

module.exports = {
  STUDENT_EMAIL_DOMAIN,
  normalizeStudentEmail,
  normalizeStudentId,
  buildStudentEmail,
};