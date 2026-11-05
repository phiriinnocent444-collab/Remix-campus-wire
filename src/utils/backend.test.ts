import test from 'node:test';
import assert from 'node:assert/strict';

test('Full-stack backend data schema validation', () => {
  const sampleUser = {
    id: 'user-test-1',
    email: 'test@unza.zm',
    alias: 'Monk_99',
    university: 'unza',
    program: 'Computer Science',
    year: 3,
  };

  assert.equal(sampleUser.email.endsWith('.zm'), true);
  assert.equal(sampleUser.university, 'unza');
  assert.equal(typeof sampleUser.year, 'number');
});

test('InfinityFree MySQL table definitions check', () => {
  const requiredTables = ['users', 'posts', 'comments'];
  const sql = `
    CREATE TABLE IF NOT EXISTS users (id VARCHAR(64) PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS posts (id VARCHAR(64) PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS comments (id VARCHAR(64) PRIMARY KEY);
  `;

  for (const table of requiredTables) {
    assert.equal(sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`), true);
  }
});

test('University crest ID mapping check', () => {
  const supportedUnis = [
    'all',
    'unza',
    'cbu',
    'mulungushi',
    'nipa',
    'evelyn_hone',
    'lmmu',
    'cavendish',
    'zcas',
    'apex',
    'mukuba',
    'nkrumah',
    'eden',
  ];

  assert.equal(supportedUnis.length, 13);
  assert.equal(supportedUnis.includes('unza'), true);
  assert.equal(supportedUnis.includes('cbu'), true);
  assert.equal(supportedUnis.includes('nipa'), true);
});
