import test from 'node:test';
import assert from 'node:assert/strict';
import { getVerifiedPayTo } from '../src/receiver.js';
const wallet = '0x2222222222222222222222222222222222222222';
test('accepts only a match with the independently pinned receiver', () => {
  assert.equal(getVerifiedPayTo({ PAY_TO: wallet, PAY_TO_EXPECTED: wallet.toLowerCase() }), wallet);
});
test('fails closed when the pinned receiver is missing', () => {
  assert.equal(getVerifiedPayTo({ PAY_TO: wallet }), null);
});
test('fails closed when the configured receiver differs', () => {
  assert.equal(getVerifiedPayTo({ PAY_TO: wallet, PAY_TO_EXPECTED: '0x1111111111111111111111111111111111111111' }), null);
});
test('fails closed for malformed addresses', () => {
  assert.equal(getVerifiedPayTo({ PAY_TO: '0x123', PAY_TO_EXPECTED: wallet }), null);
});
