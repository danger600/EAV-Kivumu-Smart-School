import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAdmissionApplication,
  generateTrackingCode,
  formatContactUrl,
  calculateGradePoint,
  checkRoleAccess,
} from './schoolLogic';

test('formatContactUrl creates valid WhatsApp link for 0795547233', () => {
  const url = formatContactUrl('whatsapp', '0795547233', 'Inquiry test');
  assert.match(url, /^https:\/\/wa\.me\/250795547233\?text=/);
});

test('formatContactUrl creates valid tel link for direct phone call', () => {
  const url = formatContactUrl('tel', '0795547233');
  assert.equal(url, 'tel:+250795547233');
});

test('validateAdmissionApplication flags missing required fields', () => {
  const result = validateAdmissionApplication({
    firstName: '',
    lastName: '',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.firstName);
  assert.ok(result.errors.lastName);
  assert.ok(result.errors.email);
});

test('validateAdmissionApplication succeeds with full valid application', () => {
  const result = validateAdmissionApplication({
    firstName: 'Remmy',
    lastName: 'Tigern',
    email: 'remmy@kivumu.edu.rw',
    phone: '0795547233',
    desiredTrade: 'SWD',
    levelApplied: 5,
    previousSchool: 'GS Kivumu O-Level',
    aggregateScore: 88,
    guardianName: 'Jean Bosco',
    guardianPhone: '0788123456',
  });
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
  assert.ok(result.trackingCode?.startsWith('KIV-2026-'));
});

test('calculateGradePoint returns correct letter and GPA', () => {
  assert.deepEqual(calculateGradePoint(92), { letter: 'A', gpa: 4.0, label: 'Distinction' });
  assert.deepEqual(calculateGradePoint(74), { letter: 'B', gpa: 3.0, label: 'Credit' });
  assert.deepEqual(calculateGradePoint(45), { letter: 'F', gpa: 0.0, label: 'Fail' });
});

test('checkRoleAccess enforces proper role capabilities', () => {
  assert.equal(checkRoleAccess('SUPER_ADMIN', 'manage_users'), true);
  assert.equal(checkRoleAccess('TEACHER', 'edit_grades'), true);
  assert.equal(checkRoleAccess('STUDENT', 'edit_grades'), false);
  assert.equal(checkRoleAccess('STUDENT', 'view_grades'), true);
  assert.equal(checkRoleAccess('ACCOUNTANT_BURSAR', 'edit_finance'), true);
});

test('generateTrackingCode produces structured IDs', () => {
  const code = generateTrackingCode();
  assert.match(code, /^KIV-2026-\d{4}$/);
});

import { analyzeSequence } from './scienceData';

test('analyzeSequence correctly computes GC content and base counts for DNA', () => {
  const dna = 'ATGCATGC';
  const stats = analyzeSequence(dna);
  assert.equal(stats.length, 8);
  assert.equal(stats.gcContent, 50);
  assert.equal(stats.isValidDna, true);
  assert.equal(stats.baseCounts['A'], 2);
  assert.equal(stats.baseCounts['G'], 2);
});

test('analyzeSequence identifies protein sequences', () => {
  const protein = 'MKVLAF';
  const stats = analyzeSequence(protein);
  assert.equal(stats.isValidProtein, true);
  assert.equal(stats.length, 6);
});

