// All 66 Bible books with exact YouVersion / Bible.com URL codes
export const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis',           code: 'GEN' },
  { name: 'Exodus',            code: 'EXO' },
  { name: 'Leviticus',         code: 'LEV' },
  { name: 'Numbers',           code: 'NUM' },
  { name: 'Deuteronomy',       code: 'DEU' },
  { name: 'Joshua',            code: 'JOS' },
  { name: 'Judges',            code: 'JDG' },
  { name: 'Ruth',              code: 'RUT' },
  { name: '1 Samuel',          code: '1SA' },
  { name: '2 Samuel',          code: '2SA' },
  { name: '1 Kings',           code: '1KI' },
  { name: '2 Kings',           code: '2KI' },
  { name: '1 Chronicles',      code: '1CH' },
  { name: '2 Chronicles',      code: '2CH' },
  { name: 'Ezra',              code: 'EZR' },
  { name: 'Nehemiah',          code: 'NEH' },
  { name: 'Esther',            code: 'EST' },
  { name: 'Job',               code: 'JOB' },
  { name: 'Psalms',            code: 'PSA' },
  { name: 'Proverbs',          code: 'PRO' },
  { name: 'Ecclesiastes',      code: 'ECC' },
  { name: 'Song of Solomon',   code: 'SNG' },
  { name: 'Isaiah',            code: 'ISA' },
  { name: 'Jeremiah',          code: 'JER' },
  { name: 'Lamentations',      code: 'LAM' },
  { name: 'Ezekiel',           code: 'EZK' },
  { name: 'Daniel',            code: 'DAN' },
  { name: 'Hosea',             code: 'HOS' },
  { name: 'Joel',              code: 'JOL' },
  { name: 'Amos',              code: 'AMO' },
  { name: 'Obadiah',           code: 'OBA' },
  { name: 'Jonah',             code: 'JON' },
  { name: 'Micah',             code: 'MIC' },
  { name: 'Nahum',             code: 'NAM' },
  { name: 'Habakkuk',          code: 'HAB' },
  { name: 'Zephaniah',         code: 'ZEP' },
  { name: 'Haggai',            code: 'HAG' },
  { name: 'Zechariah',         code: 'ZEC' },
  { name: 'Malachi',           code: 'MAL' },
  // New Testament
  { name: 'Matthew',           code: 'MAT' },
  { name: 'Mark',              code: 'MRK' },
  { name: 'Luke',              code: 'LUK' },
  { name: 'John',              code: 'JHN' },
  { name: 'Acts',              code: 'ACT' },
  { name: 'Romans',            code: 'ROM' },
  { name: '1 Corinthians',     code: '1CO' },
  { name: '2 Corinthians',     code: '2CO' },
  { name: 'Galatians',         code: 'GAL' },
  { name: 'Ephesians',         code: 'EPH' },
  { name: 'Philippians',       code: 'PHP' },
  { name: 'Colossians',        code: 'COL' },
  { name: '1 Thessalonians',   code: '1TH' },
  { name: '2 Thessalonians',   code: '2TH' },
  { name: '1 Timothy',         code: '1TI' },
  { name: '2 Timothy',         code: '2TI' },
  { name: 'Titus',             code: 'TIT' },
  { name: 'Philemon',          code: 'PHM' },
  { name: 'Hebrews',           code: 'HEB' },
  { name: 'James',             code: 'JAS' },
  { name: '1 Peter',           code: '1PE' },
  { name: '2 Peter',           code: '2PE' },
  { name: '1 John',            code: '1JN' },
  { name: '2 John',            code: '2JN' },
  { name: '3 John',            code: '3JN' },
  { name: 'Jude',              code: 'JUD' },
  { name: 'Revelation',        code: 'REV' },
];

/**
 * Available Bible translations with their stable Bible.com version IDs.
 * These IDs are permanent — they identify specific translations on bible.com / YouVersion.
 */
export const BIBLE_TRANSLATIONS = [
  { code: 'NIV',  id: 111,  label: 'NIV – New International Version' },
  { code: 'KJV',  id: 1,    label: 'KJV – King James Version' },
  { code: 'ESV',  id: 59,   label: 'ESV – English Standard Version' },
  { code: 'NLT',  id: 116,  label: 'NLT – New Living Translation' },
  { code: 'NKJV', id: 114,  label: 'NKJV – New King James Version' },
  { code: 'AMP',  id: 1588, label: 'AMP – Amplified Bible' },
  { code: 'MSG',  id: 97,   label: 'MSG – The Message' },
];

export const DEFAULT_TRANSLATION = 'NIV';

/**
 * Returns the Bible.com browser fallback URL for a scripture reference.
 * e.g. "Philippians 4:13", "NIV" → "https://www.bible.com/bible/111/PHP.4.13.NIV"
 * On mobile, if YouVersion is installed the OS intercepts this URL and opens the app.
 */
export function getScriptureUrl(reference, translationCode = DEFAULT_TRANSLATION) {
  if (!reference) return null;
  const book = BIBLE_BOOKS.find(b =>
    reference.toLowerCase().startsWith(b.name.toLowerCase())
  );
  if (!book) return null;
  const translation =
    BIBLE_TRANSLATIONS.find(t => t.code === translationCode) || BIBLE_TRANSLATIONS[0];
  // "4:13" → "4.13"
  const ref = reference.slice(book.name.length).trim().replace(':', '.');
  return `https://www.bible.com/bible/${translation.id}/${book.code}.${ref}.${translation.code}`;
}

/**
 * Returns the YouVersion mobile deep link for a scripture reference.
 * e.g. "Philippians 4:13", "NIV" → "youversion://bible?reference=PHP.4.13.NIV"
 * On iOS/Android this launches the YouVersion app directly if installed.
 * Use getScriptureUrl() as the browser fallback if this deep link fails.
 */
export function getScriptureDeepLink(reference, translationCode = DEFAULT_TRANSLATION) {
  if (!reference) return null;
  const book = BIBLE_BOOKS.find(b =>
    reference.toLowerCase().startsWith(b.name.toLowerCase())
  );
  if (!book) return null;
  const code = translationCode || DEFAULT_TRANSLATION;
  const ref = reference.slice(book.name.length).trim().replace(':', '.');
  return `youversion://bible?reference=${book.code}.${ref}.${code}`;
}
