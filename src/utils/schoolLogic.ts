/**
 * EAV Kivumu Smart School - Core Business Logic & Pure Functions
 * Developed by Remmy | L5 SWD
 * Instagram: @tigernsanz | Contact: 0795547233
 */

export interface AdmissionFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredTrade: 'SWD' | 'VET' | 'AGR' | 'GEN';
  levelApplied: number;
  previousSchool: string;
  aggregateScore: number;
  guardianName: string;
  guardianPhone: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  trackingCode?: string;
}

/**
 * Validates an admission application according to EAV Kivumu standards
 */
export function validateAdmissionApplication(data: Partial<AdmissionFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'A valid email address is required.';
  }

  // Rwandan / international phone validation
  const cleanPhone = (data.phone || '').replace(/[\s-]/g, '');
  if (!cleanPhone || cleanPhone.length < 9) {
    errors.phone = 'Valid phone number is required (e.g. 0795547233).';
  }

  if (!data.desiredTrade || !['SWD', 'VET', 'AGR', 'GEN'].includes(data.desiredTrade)) {
    errors.desiredTrade = 'Please select a valid academic department / trade.';
  }

  if (!data.levelApplied || data.levelApplied < 1 || data.levelApplied > 5) {
    errors.levelApplied = 'Applied level must be between 1 and 5.';
  }

  if (!data.previousSchool || data.previousSchool.trim().length < 3) {
    errors.previousSchool = 'Please specify your previous school or examination center.';
  }

  if (typeof data.aggregateScore !== 'number' || data.aggregateScore < 0 || data.aggregateScore > 100) {
    errors.aggregateScore = 'Aggregate score must be between 0 and 100%.';
  }

  if (!data.guardianName || data.guardianName.trim().length < 2) {
    errors.guardianName = 'Guardian or parent name is required.';
  }

  const cleanGuardianPhone = (data.guardianPhone || '').replace(/[\s-]/g, '');
  if (!cleanGuardianPhone || cleanGuardianPhone.length < 9) {
    errors.guardianPhone = 'Guardian contact phone is required.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    trackingCode: isValid ? generateTrackingCode() : undefined,
  };
}

/**
 * Generates an official tracking code for admissions
 */
export function generateTrackingCode(prefix = 'KIV-2026'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

/**
 * Formats Rwandan telephone to standard WhatsApp link or tel href
 */
export function formatContactUrl(
  type: 'whatsapp' | 'tel',
  phoneNumber = '0795547233',
  customMessage = 'Hello Remmy and EAV Kivumu Smart School administration, I have an inquiry.'
): string {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  let formatted = digitsOnly;

  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    formatted = '250' + digitsOnly.slice(1);
  } else if (!digitsOnly.startsWith('250') && digitsOnly.length === 9) {
    formatted = '250' + digitsOnly;
  }

  if (type === 'whatsapp') {
    return `https://wa.me/${formatted}?text=${encodeURIComponent(customMessage)}`;
  }
  return `tel:+${formatted}`;
}

/**
 * Converts numeric score to letter grade and evaluation
 */
export function calculateGradePoint(score: number): {
  letter: 'A' | 'B' | 'C' | 'D' | 'F';
  gpa: number;
  label: string;
} {
  if (score >= 80) return { letter: 'A', gpa: 4.0, label: 'Distinction' };
  if (score >= 70) return { letter: 'B', gpa: 3.0, label: 'Credit' };
  if (score >= 60) return { letter: 'C', gpa: 2.0, label: 'Merit' };
  if (score >= 50) return { letter: 'D', gpa: 1.0, label: 'Pass' };
  return { letter: 'F', gpa: 0.0, label: 'Fail' };
}

/**
 * Permission checker for the 25 school system roles
 */
export function checkRoleAccess(
  role: string,
  permission: 'view_grades' | 'edit_grades' | 'manage_users' | 'view_applications' | 'edit_finance'
): boolean {
  const permissionsMap: Record<string, string[]> = {
    SUPER_ADMIN: ['view_grades', 'edit_grades', 'manage_users', 'view_applications', 'edit_finance'],
    ADMIN: ['view_grades', 'edit_grades', 'manage_users', 'view_applications', 'edit_finance'],
    HEADMASTER: ['view_grades', 'manage_users', 'view_applications', 'edit_finance'],
    DEAN_OF_STUDIES: ['view_grades', 'edit_grades', 'view_applications'],
    TEACHER: ['view_grades', 'edit_grades'],
    ACCOUNTANT_BURSAR: ['edit_finance', 'view_applications'],
    STUDENT: ['view_grades'],
    PARENT: ['view_grades'],
    LIBRARIAN: ['view_grades'],
  };

  const allowed = permissionsMap[role] || [];
  return allowed.includes(permission);
}
