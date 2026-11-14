// ============ EDIT YOUR PERSONAL TEXT HERE ============
export const siteConfig = {
  coupleName: 'Esraa & Mustafa', // shown at the very end
  musicUrl: '/assets/music/our-song.mp3',
  songTitle: 'Our song',
  videoUrl: '/assets/video/our-video.mp4',

  // --- SECRET QUESTION & ANSWER (capitalization/extra spaces don't matter) ---
  mode: 'question', // 'question' or 'code'
  secretCode: 'Friends Academy',
  secretQuestion: 'What was the place where we first met? 👀',
  secretAnswer: 'Friends Academy',

  // --- WRONG ANSWER REACTIONS (cycled in order) ---
  wrongMessages: ['try again.', 'Think again👀', 'طب ركّز كدا احسنلك', 'mostafaaa😡', 'Really? 😭', 'يا سلام؟ بعد كل ده؟ 🙄'],

  // --- BIRTHDAY REVEAL (after the countdown) ---
  birthday: {
    title: 'Happy Birthday, ya Safsofty 🤍',
    subtitle: 'I love you more more more more than you think👀🎂',
    question: 'But...do you love me as much as I love you? 🥹',
    next: 'Yesss🥹🤍',
  },

  // --- THE YES / NO QUESTION ---
  surprise: {
    question: 'طب...بتحبني انا اكتر ولا ميسي؟ 👀',
    yes: 'انا🥹🤍',
    no: ' ميسي😡',
    yesTitle: 'أيوه كدا احبك🤭❤️',
    yesText: 'خد بوسهه 👀',
    yesButton: 'Okay, now watch this 👀',
    noTitle: 'ميسيي!!! طب خليه ينفعك بق ياحبيبي😡',
    noText: 'متكلمنيييش تانيي🔪',
    noButton: 'خلاص خلاص 🤍',
    noAttempts: 3, // how many dodges before the warning appears
  },

  // --- VIDEO ---
  video: {
    leadIn: 'US ❤️🫂',
    title: 'Our Special Video 🎬',
    line1: 'All the little moments...',
    line2: 'that somehow became my favorite memories.',
    caption: "Some memories don't need a reason to stay.",
    placeholder: 'Your special video goes here 🎬',
  },

  // --- LETTER ---
  letter: { close: 'Close', note: 'open me💌' },

  // --- CAKE ---
  cake: {
    title: 'One more little thing... 🎂',
    button: 'Blow out the candles 🕯️',
    wish: 'Make a Wish, my baby. ❤️',
    after: 'I hope we get many more moments like this.',
    again:'🕯️اتمنى تاني ',
  },

   // --- FINAL MESSAGE ---
  final: {
    opener: 'Before you leave...',
    lines: ["Out of all the memories we've made,", 'my favorite part is that there are still so many left to make.'],
    toast: ["Here's to us.", 'To the stupid jokes.', 'The random conversations.', 'The little moments.', "And everything that's still waiting for us."],
    replay: 'Replay the Magic ✨',
    footer: 'Made with countless beautiful memories, heartfelt emotions, and so much love.🤍',
    tag: 'Forever and hopelessly in love with you.',
  },
};
