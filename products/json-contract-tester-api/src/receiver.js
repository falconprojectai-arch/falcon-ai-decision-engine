const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

// PAY_TO_EXPECTED is a separately managed, pinned baseline. Never derive it
// from PAY_TO: doing so would make a compromised PAY_TO self-validating.
export function getVerifiedPayTo(env) {
  const configured = env?.PAY_TO;
  const expected = env?.PAY_TO_EXPECTED;
  if (typeof configured !== 'string' || typeof expected !== 'string' ||
      !ADDRESS_RE.test(configured) || !ADDRESS_RE.test(expected)) return null;
  return configured.toLowerCase() === expected.toLowerCase() ? configured : null;
}
