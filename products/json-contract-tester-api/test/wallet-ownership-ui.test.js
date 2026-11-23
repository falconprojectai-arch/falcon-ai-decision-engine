import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../wallet-ownership.html', import.meta.url), 'utf8');

test('wallet UI uses the ownership challenge and verification routes', () => {
  assert.match(html, /\/v1\/auth\/challenge/);
  assert.match(html, /\/v1\/auth\/verify/);
  assert.match(html, /nonce:challenge\.nonce/);
  assert.match(html, /method:'personal_sign'/);
});

test('wallet UI requires Base and invalidates proofs when account or chain changes', () => {
  assert.match(html, /parseInt\(chain,16\)!==8453/);
  assert.match(html, /accountsChanged/);
  assert.match(html, /chainChanged/);
});

test('wallet UI only reports ownership proof and never requests a transaction', () => {
  assert.match(html, /result\.verified===true/);
  assert.match(html, /result\.paymentAuthorized===false/);
  assert.match(html, /result\.sessionCreated===false/);
  assert.doesNotMatch(html, /eth_sendTransaction|wallet_sendCalls|sendTransaction|\.transfer\(/);
});

test('wallet UI does not request private keys or recovery phrases', () => {
  assert.doesNotMatch(html, /eth_getPrivateKey|privateKeyToAccount|seedPhrase|mnemonic/);
});
