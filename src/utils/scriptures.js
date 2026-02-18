// Daily rotating scriptures — one per day, cycles through the list
// To add your own: just add more objects to the array in the same format
export const DAILY_SCRIPTURES = [
  { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
  { text: "The Lord is near to all who call on him, to all who call on him in truth.", ref: "Psalm 145:18" },
  { text: "Call to me and I will answer you and tell you great and unsearchable things you do not know.", ref: "Jeremiah 33:3" },
  { text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7" },
  { text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.", ref: "1 Thessalonians 5:16–18" },
  { text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.", ref: "Mark 11:24" },
  { text: "If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven.", ref: "2 Chronicles 7:14" },
  { text: "The prayer of a righteous person is powerful and effective.", ref: "James 5:16" },
  { text: "Come near to God and he will come near to you.", ref: "James 4:8" },
  { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts.", ref: "Philippians 4:6–7" },
  { text: "This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.", ref: "1 John 5:14" },
  { text: "Evening, morning and noon I cry out in distress, and he hears my voice.", ref: "Psalm 55:17" },
  { text: "I lift up my eyes to the mountains — where does my help come from? My help comes from the Lord, the Maker of heaven and earth.", ref: "Psalm 121:1–2" },
  { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
  { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
  { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
  { text: "Before they call I will answer; while they are still speaking I will hear.", ref: "Isaiah 65:24" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:5–6" },
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
  { text: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", ref: "Proverbs 18:10" },
  { text: "He said to them, 'When you pray, say: Father, hallowed be your name, your kingdom come.'", ref: "Luke 11:2" },
  { text: "In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.", ref: "Romans 8:26" },
  { text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.", ref: "Ephesians 3:20" },
  { text: "And pray in the Spirit on all occasions with all kinds of prayers and requests.", ref: "Ephesians 6:18" },
  { text: "Seek the Lord while he may be found; call on him while he is near.", ref: "Isaiah 55:6" },
  { text: "The eyes of the Lord are on the righteous, and his ears are attentive to their cry.", ref: "Psalm 34:15" },
  { text: "God is our refuge and strength, an ever-present help in trouble.", ref: "Psalm 46:1" },
  { text: "Let us then approach God's throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.", ref: "Hebrews 4:16" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4" },
  { text: "The Lord has heard my cry for mercy; the Lord accepts my prayer.", ref: "Psalm 6:9" },
];

// Returns today's scripture — same one all day, changes at midnight
export function getDailyScripture() {
  const today = new Date();
  // Use day of year so it cycles through the full list
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_SCRIPTURES.length;
  return DAILY_SCRIPTURES[index];
}
