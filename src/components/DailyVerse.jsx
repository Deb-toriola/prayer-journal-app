import { BookOpen } from 'lucide-react';
import { getTodayString } from '../utils/constants';

const VERSES = [
  { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
  { text: "The prayer of a righteous person is powerful and effective.", ref: "James 5:16" },
  { text: "Call to me and I will answer you and tell you great and unsearchable things you do not know.", ref: "Jeremiah 33:3" },
  { text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.", ref: "James 1:5" },
  { text: "Devote yourselves to prayer, being watchful and thankful.", ref: "Colossians 4:2" },
  { text: "The Lord is near to all who call on him, to all who call on him in truth.", ref: "Psalm 145:18" },
  { text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7" },
  { text: "Be joyful in hope, patient in affliction, faithful in prayer.", ref: "Romans 12:12" },
  { text: "And pray in the Spirit on all occasions with all kinds of prayers and requests.", ref: "Ephesians 6:18" },
  { text: "Let us then approach God\u2019s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.", ref: "Hebrews 4:16" },
  { text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.", ref: "Mark 11:24" },
  { text: "Pray continually, give thanks in all circumstances; for this is God\u2019s will for you in Christ Jesus.", ref: "1 Thessalonians 5:17-18" },
  { text: "This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.", ref: "1 John 5:14" },
  { text: "The Lord has heard my cry for mercy; the Lord accepts my prayer.", ref: "Psalm 6:9" },
  { text: "Before they call I will answer; while they are still speaking I will hear.", ref: "Isaiah 65:24" },
  { text: "If my people, who are called by my name, will humble themselves and pray and seek my face, then I will hear from heaven.", ref: "2 Chronicles 7:14" },
  { text: "You will seek me and find me when you seek me with all your heart.", ref: "Jeremiah 29:13" },
  { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4" },
  { text: "In the morning, Lord, you hear my voice; in the morning I lay my requests before you and wait expectantly.", ref: "Psalm 5:3" },
  { text: "The eyes of the Lord are on the righteous, and his ears are attentive to their cry.", ref: "Psalm 34:15" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "For where two or three gather in my name, there am I with them.", ref: "Matthew 18:20" },
  { text: "With God all things are possible.", ref: "Matthew 19:26" },
  { text: "Wait for the Lord; be strong and take heart and wait for the Lord.", ref: "Psalm 27:14" },
  { text: "He who began a good work in you will carry it on to completion until the day of Christ Jesus.", ref: "Philippians 1:6" },
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
  { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
  { text: "And we know that in all things God works for the good of those who love him.", ref: "Romans 8:28" },
  { text: "The Lord is my light and my salvation \u2014 whom shall I fear?", ref: "Psalm 27:1" },
];

function getDailyVerse() {
  // Pick verse based on day of year so it changes daily but is consistent all day
  const today = getTodayString();
  const dayOfYear = Math.floor(
    (new Date(today) - new Date(today.split('-')[0], 0, 0)) / 86400000
  );
  return VERSES[dayOfYear % VERSES.length];
}

export default function DailyVerse() {
  const verse = getDailyVerse();

  return (
    <div className="daily-verse">
      <div className="daily-verse-icon">
        <BookOpen size={14} />
      </div>
      <div className="daily-verse-content">
        <p className="daily-verse-text">&ldquo;{verse.text}&rdquo;</p>
        <span className="daily-verse-ref">&mdash; {verse.ref}</span>
      </div>
    </div>
  );
}
