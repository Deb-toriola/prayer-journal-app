// All 66 Bible books with Bible.com / YouVersion URL codes
export const BIBLE_BOOKS = [
  // Old Testament
  { name: 'Genesis',        code: 'GEN' },
  { name: 'Exodus',         code: 'EXO' },
  { name: 'Leviticus',      code: 'LEV' },
  { name: 'Numbers',        code: 'NUM' },
  { name: 'Deuteronomy',    code: 'DEU' },
  { name: 'Joshua',         code: 'JOS' },
  { name: 'Judges',         code: 'JDG' },
  { name: 'Ruth',           code: 'RUT' },
  { name: '1 Samuel',       code: '1SA' },
  { name: '2 Samuel',       code: '2SA' },
  { name: '1 Kings',        code: '1KI' },
  { name: '2 Kings',        code: '2KI' },
  { name: '1 Chronicles',   code: '1CH' },
  { name: '2 Chronicles',   code: '2CH' },
  { name: 'Ezra',           code: 'EZR' },
  { name: 'Nehemiah',       code: 'NEH' },
  { name: 'Esther',         code: 'EST' },
  { name: 'Job',            code: 'JOB' },
  { name: 'Psalms',         code: 'PSA' },
  { name: 'Proverbs',       code: 'PRO' },
  { name: 'Ecclesiastes',   code: 'ECC' },
  { name: 'Song of Solomon', code: 'SNG' },
  { name: 'Isaiah',         code: 'ISA' },
  { name: 'Jeremiah',       code: 'JER' },
  { name: 'Lamentations',   code: 'LAM' },
  { name: 'Ezekiel',        code: 'EZK' },
  { name: 'Daniel',         code: 'DAN' },
  { name: 'Hosea',          code: 'HOS' },
  { name: 'Joel',           code: 'JOL' },
  { name: 'Amos',           code: 'AMO' },
  { name: 'Obadiah',        code: 'OBA' },
  { name: 'Jonah',          code: 'JON' },
  { name: 'Micah',          code: 'MIC' },
  { name: 'Nahum',          code: 'NAM' },
  { name: 'Habakkuk',       code: 'HAB' },
  { name: 'Zephaniah',      code: 'ZEP' },
  { name: 'Haggai',         code: 'HAG' },
  { name: 'Zechariah',      code: 'ZEC' },
  { name: 'Malachi',        code: 'MAL' },
  // New Testament
  { name: 'Matthew',        code: 'MAT' },
  { name: 'Mark',           code: 'MRK' },
  { name: 'Luke',           code: 'LUK' },
  { name: 'John',           code: 'JHN' },
  { name: 'Acts',           code: 'ACT' },
  { name: 'Romans',         code: 'ROM' },
  { name: '1 Corinthians',  code: '1CO' },
  { name: '2 Corinthians',  code: '2CO' },
  { name: 'Galatians',      code: 'GAL' },
  { name: 'Ephesians',      code: 'EPH' },
  { name: 'Philippians',    code: 'PHP' },
  { name: 'Colossians',     code: 'COL' },
  { name: '1 Thessalonians', code: '1TH' },
  { name: '2 Thessalonians', code: '2TH' },
  { name: '1 Timothy',      code: '1TI' },
  { name: '2 Timothy',      code: '2TI' },
  { name: 'Titus',          code: 'TIT' },
  { name: 'Philemon',       code: 'PHM' },
  { name: 'Hebrews',        code: 'HEB' },
  { name: 'James',          code: 'JAS' },
  { name: '1 Peter',        code: '1PE' },
  { name: '2 Peter',        code: '2PE' },
  { name: '1 John',         code: '1JN' },
  { name: '2 John',         code: '2JN' },
  { name: '3 John',         code: '3JN' },
  { name: 'Jude',           code: 'JUD' },
  { name: 'Revelation',     code: 'REV' },
];

/**
 * Given a scripture string like "Philippians 4:6", returns the Bible.com URL.
 * Falls back gracefully if the book isn't found.
 */
export function getScriptureUrl(reference) {
  if (!reference) return null;
  const book = BIBLE_BOOKS.find(b =>
    reference.toLowerCase().startsWith(b.name.toLowerCase())
  );
  if (!book) return null;
  const ref = reference.slice(book.name.length).trim().replace(':', '.'); // "4:6" → "4.6"
  return `https://www.bible.com/bible/116/${book.code}.${ref}.NLT`;
}
