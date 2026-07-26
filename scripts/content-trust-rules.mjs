export const FORBIDDEN_CLAIMS = [
  { pattern: /20\+ years|over 20 years|more than 20 years|after 20 years|twenty years of salon experience/i, label: 'unsupported rolling tenure claim' },
  { pattern: /team of 4 stylists/i, label: 'unsupported team-size claim' },
  { pattern: /4\.9-star Google rating|(?:Google[^\n]{0,50}4\.9|4\.9[^\n]{0,50}Google)|\b762\+?\b|53\+?[^\n]{0,20}4\.9/i, label: 'unsupported aggregate review claim' },
  {
    pattern: /\b5\.0\s*\/\s*5\b[^\n]{0,80}(?:rating|rated|review)|(?:rating|rated|review)[^\n]{0,80}\b5\.0\s*\/\s*5\b/i,
    label: 'unsupported 5.0/5 aggregate review claim',
    allowedFiles: new Set(['src/config/proofRegistry.ts']),
  },
  { pattern: /(?:since|established|founded|expert care since) 2018/i, label: 'conflicting tenure claim' },
  { pattern: /15 minutes from Bangor/i, label: 'unsupported travel-time claim' },
  { pattern: /L['’]Or[ée]al Colour Specialist|DevaCut certified|Brazilian Blowout certified/i, label: 'unsupported credential claim' },
  { pattern: /up to 4 weddings per Saturday|no waitlist/i, label: 'unsupported capacity or availability claim' },
  { pattern: /loyal 60\+ clientele/i, label: 'unsupported client-demographic claim' },
  { pattern: /\$30 for under-12s|\$25 with a junior/i, label: 'unsupported price claim' },
  { pattern: /four hundred client trials|400 client trials/i, label: 'unsupported trial-volume claim' },
];

export const findForbiddenClaims = (file, text) =>
  FORBIDDEN_CLAIMS
    .filter(({ pattern, allowedFiles }) =>
      !allowedFiles?.has(file) && pattern.test(text),
    )
    .map(({ label }) => label);
