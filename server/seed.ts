import { connectDB } from './config/db';
import { Profile } from './models/Profile';
import { PrivacySettings } from './models/PrivacySettings';
import { AlgorithmWeight } from './models/AlgorithmWeight';
import { Match } from './models/Match';
import { Message } from './models/Message';
import { Subscription } from './models/Subscription';

const SEED_PROFILES = [
  // 1. Current Active User
  {
    id: 'usr_me_01',
    email: 'aarav.sharma@milanai.com',
    emailMasked: 'aa***@milanai.com',
    displayName: 'Aarav Sharma',
    age: 28,
    gender: 'male',
    city: 'Bengaluru',
    distanceBucket: '< 5 km',
    bio: 'Product Designer who loves outdoor trekking, filter coffee, and deep tech discussions. Looking for a mindful partner to explore life with.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 8,
      financialOutlook: 8,
      spontaneity: 7,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Active (3-4x week)',
      pets: 'Loves Dogs',
    },
    interests: ['Trekking', 'UI/UX Design', 'Indie Music', 'Podcasts', 'Specialty Coffee'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
  },

  // 2. Candidate 1: Ananya Roy
  {
    id: 'usr_cand_01',
    email: 'ananya.roy@milanai.com',
    emailMasked: 'an***@milanai.com',
    displayName: 'Ananya Roy',
    age: 27,
    gender: 'female',
    city: 'Bengaluru',
    distanceBucket: '< 3 km away',
    bio: 'Architect passionate about sustainable urban spaces, classical music, and pottery. Always up for a weekend trail walk!',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 9,
      financialOutlook: 8,
      spontaneity: 6,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Active (3-4x week)',
      pets: 'Loves Dogs',
    },
    interests: ['Architecture', 'Trekking', 'Pottery', 'Specialty Coffee', 'Classical Music'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
  },

  // 3. Candidate 2: Diya Mehta
  {
    id: 'usr_cand_02',
    email: 'diya.mehta@milanai.com',
    emailMasked: 'di***@milanai.com',
    displayName: 'Diya Mehta',
    age: 26,
    gender: 'female',
    city: 'Mumbai',
    distanceBucket: '< 7 km away',
    bio: 'Software engineer by day, amateur pastry chef by night. Big fan of sci-fi novels, board games, and weekend road trips.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 8,
      financialOutlook: 7,
      spontaneity: 9,
      emotionalExpressiveness: 7,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Non-drinker',
      fitness: 'Yoga & Pilates',
      pets: 'No pets',
    },
    interests: ['Baking', 'Board Games', 'Sci-Fi Books', 'Travel', 'Badminton'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
  },

  // 4. Candidate 3: Meera Nambiar
  {
    id: 'usr_cand_03',
    email: 'meera.nambiar@milanai.com',
    emailMasked: 'me***@milanai.com',
    displayName: 'Meera Nambiar',
    age: 29,
    gender: 'female',
    city: 'Bengaluru',
    distanceBucket: '< 12 km away',
    bio: 'Environmental economist. Love hiking, classical dance, and discussing world politics over masala chai.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 7,
      careerAmbition: 9,
      financialOutlook: 9,
      spontaneity: 5,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Eggetarian',
      smoking: 'Never',
      drinking: 'Occasional',
      fitness: 'Running / Marathon',
      pets: 'Cat person',
    },
    interests: ['Economics', 'Running', 'Bharatanatyam', 'Chai', 'Documentaries'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'vip',
  },

  // 5. Candidate 4: Riya Kapoor
  {
    id: 'usr_cand_04',
    email: 'riya.kapoor@milanai.com',
    emailMasked: 'ri***@milanai.com',
    displayName: 'Riya Kapoor',
    age: 27,
    gender: 'female',
    city: 'Delhi NCR',
    distanceBucket: '< 4 km away',
    bio: 'UX Researcher exploring human-computer interaction. Love indie bookstores, documentary films, and experimenting with sourdough.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 9,
      financialOutlook: 8,
      spontaneity: 8,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Daily Yoga',
      pets: 'Loves Dogs',
    },
    interests: ['UX Research', 'Bookstores', 'Sourdough Baking', 'Cinema', 'Jazz Music'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'vip',
  },

  // 6. Candidate 5: Tanvi Deshmukh
  {
    id: 'usr_cand_05',
    email: 'tanvi.deshmukh@milanai.com',
    emailMasked: 'ta***@milanai.com',
    displayName: 'Tanvi Deshmukh',
    age: 28,
    gender: 'female',
    city: 'Pune',
    distanceBucket: '< 6 km away',
    bio: 'Clinical Psychologist. Dedicated to mindfulness, mental health advocacy, and watercolor painting on quiet weekends.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 8,
      financialOutlook: 8,
      spontaneity: 6,
      emotionalExpressiveness: 10,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Non-drinker',
      fitness: 'Mindful Meditation',
      pets: 'Cat person',
    },
    interests: ['Psychology', 'Mindfulness', 'Painting', 'Nature Walks', 'Gardening'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
  },

  // 7. Candidate 6: Isha Sengupta
  {
    id: 'usr_cand_06',
    email: 'isha.sengupta@milanai.com',
    emailMasked: 'is***@milanai.com',
    displayName: 'Isha Sengupta',
    age: 26,
    gender: 'female',
    city: 'Kolkata',
    distanceBucket: '< 8 km away',
    bio: 'Robotics Engineer & avid violinist. Exploring AI applications in medical diagnostics. Love stargazing and historical fiction.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 10,
      financialOutlook: 8,
      spontaneity: 7,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Eggetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Swimming & Badminton',
      pets: 'Loves Dogs',
    },
    interests: ['Robotics', 'Violin', 'Astronomy', 'Sci-Fi', 'Coffee Roasting'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
  },

  // 8. Candidate 7: Kavya Venkataraman
  {
    id: 'usr_cand_07',
    email: 'kavya.v@milanai.com',
    emailMasked: 'ka***@milanai.com',
    displayName: 'Kavya Venkat',
    age: 27,
    gender: 'female',
    city: 'Chennai',
    distanceBucket: '< 10 km away',
    bio: 'Fintech Product Lead & Carnatic vocalist. Love morning beach runs, south Indian filter coffee, and exploring indie art galleries.',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 9,
      financialOutlook: 9,
      spontaneity: 6,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Non-drinker',
      fitness: 'Morning Beach Running',
      pets: 'Cat person',
    },
    interests: ['Fintech', 'Carnatic Music', 'Art Galleries', 'Filter Coffee', 'Yoga'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
  },

  // 9. Candidate 8: Sneha Kulkarni
  {
    id: 'usr_cand_08',
    email: 'sneha.k@milanai.com',
    emailMasked: 'sn***@milanai.com',
    displayName: 'Sneha Kulkarni',
    age: 28,
    gender: 'female',
    city: 'Hyderabad',
    distanceBucket: '< 5 km away',
    bio: 'Neuroscientist researching memory consolidation. Passionate about mountain trekking, plant parenting, and culinary experiments.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 9,
      financialOutlook: 8,
      spontaneity: 8,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Trekking & Pilates',
      pets: 'Loves Dogs',
    },
    interests: ['Neuroscience', 'Plant Parenting', 'Mountain Hiking', 'Cooking', 'Podcasts'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
  },

  // 10. Candidate 9: Radhika Nair
  {
    id: 'usr_cand_09',
    email: 'radhika.nair@milanai.com',
    emailMasked: 'ra***@milanai.com',
    displayName: 'Radhika Nair',
    age: 29,
    gender: 'female',
    city: 'Bengaluru',
    distanceBucket: '< 9 km away',
    bio: 'Civil Rights Lawyer & documentary filmmaker. Seeking a thoughtful, ambitious partner who values deep conversations and empathy.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 9,
      financialOutlook: 8,
      spontaneity: 7,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Ashtanga Yoga',
      pets: 'Loves Dogs',
    },
    interests: ['Legal Reform', 'Documentaries', 'Literature', 'Classical Art', 'Chai'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'vip',
  },

  // 11. Candidate 10: Aditi Chawla
  {
    id: 'usr_cand_10',
    email: 'aditi.chawla@milanai.com',
    emailMasked: 'ad***@milanai.com',
    displayName: 'Aditi Chawla',
    age: 27,
    gender: 'female',
    city: 'Mumbai',
    distanceBucket: '< 11 km away',
    bio: 'Brand Strategist & ceramic artist. High energy, loves exploring street food joints and curating Spotify playlists.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 8,
      financialOutlook: 7,
      spontaneity: 9,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Dance & Cardio',
      pets: 'Cat person',
    },
    interests: ['Branding', 'Ceramics', 'Street Food', 'Vinyl Records', 'Travel'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
  }
];

export async function seedDatabase() {
  const connected = await connectDB();
  if (!connected) {
    console.warn('⚠️ [Seed] Skipping MongoDB seed as database is not reachable.');
    return;
  }

  console.log('🌱 [Seed] Populating rich MongoDB demo collections with multi-city profiles...');

  // 1. Seed User & Candidate Profiles
  for (const p of SEED_PROFILES) {
    await Profile.findOneAndUpdate({ id: p.id }, p, { upsert: true, returnDocument: 'after' });
  }

  // 2. Seed Privacy Settings for Main User
  await PrivacySettings.findOneAndUpdate(
    { userId: 'usr_me_01' },
    {
      userId: 'usr_me_01',
      hideExactLocation: true,
      maskEmail: true,
      blurPhotosUntilMatch: false,
      blockContactSync: true,
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 3. Seed Algorithm Weights
  await AlgorithmWeight.findOneAndUpdate(
    {},
    {
      valuesWeight: 0.40,
      goalsWeight: 0.30,
      lifestyleWeight: 0.20,
      interestsWeight: 0.10,
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 4. Seed Active Subscription
  await Subscription.findOneAndUpdate(
    { userId: 'usr_me_01' },
    {
      id: 'sub_demo_01',
      userId: 'usr_me_01',
      planTier: 'gold',
      status: 'active',
      transactionId: 'txn_milan_gold_sandbox_01',
      expiresAt: new Date(Date.now() + 30 * 86400 * 1000),
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 5. Seed Mutual Matches
  const matchesToSeed = [
    {
      id: 'match_01',
      userId1: 'usr_me_01',
      userId2: 'usr_cand_01',
      candidateId: 'usr_cand_01',
      compatibilityScore: 94,
      scoreBreakdown: {
        valuesScore: 96,
        goalsScore: 92,
        lifestyleScore: 95,
        interestsScore: 92,
        explanation: 'Deep alignment on Family Values, Long-term Marriage vision, and shared passion for trekking & specialty coffee.',
      },
      status: 'accepted',
    },
    {
      id: 'match_02',
      userId1: 'usr_me_01',
      userId2: 'usr_cand_04',
      candidateId: 'usr_cand_04',
      compatibilityScore: 92,
      scoreBreakdown: {
        valuesScore: 94,
        goalsScore: 93,
        lifestyleScore: 90,
        interestsScore: 91,
        explanation: 'Shared creative focus on design, mindfulness, and healthy active lifestyle.',
      },
      status: 'accepted',
    },
    {
      id: 'match_03',
      userId1: 'usr_me_01',
      userId2: 'usr_cand_07',
      candidateId: 'usr_cand_07',
      compatibilityScore: 91,
      scoreBreakdown: {
        valuesScore: 95,
        goalsScore: 90,
        lifestyleScore: 92,
        interestsScore: 88,
        explanation: 'Strong compatibility on career drive, cultural values, and love for morning runs and filter coffee.',
      },
      status: 'accepted',
    },
  ];

  for (const m of matchesToSeed) {
    await Match.findOneAndUpdate({ id: m.id }, m, { upsert: true, returnDocument: 'after' });
  }

  // 6. Seed Sample Messages with Privacy Shield Examples
  const messagesToSeed = [
    {
      id: 'msg_01',
      matchId: 'match_01',
      senderId: 'usr_cand_01',
      content: 'Hi Aarav! Nice to connect. I saw that you also love trekking around Nandi Hills and specialty coffee!',
      timestamp: '10:30 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_02',
      matchId: 'match_01',
      senderId: 'usr_me_01',
      content: 'Hey Ananya! Yes, absolutely. Saturday morning trail hikes and pour-overs are my weekend ritual 😊',
      timestamp: '10:32 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_03',
      matchId: 'match_01',
      senderId: 'usr_cand_01',
      content: 'That sounds wonderful. Would love to exchange recommendations on good beans!',
      timestamp: '10:35 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_04',
      matchId: 'match_02',
      senderId: 'usr_cand_04',
      content: 'Hello Aarav! Great to connect with a fellow designer in Bengaluru.',
      timestamp: 'Yesterday',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_05',
      matchId: 'match_03',
      senderId: 'usr_cand_07',
      content: 'Hey Aarav! Love your focus on mindful tech and design. Are you usually exploring new roasteries on weekends?',
      timestamp: '2 hours ago',
      isRead: false,
      safetyFlagged: false,
    },
  ];

  for (const msg of messagesToSeed) {
    await Message.findOneAndUpdate({ id: msg.id }, msg, { upsert: true, returnDocument: 'after' });
  }

  console.log('✅ [Seed] MongoDB database successfully populated with 11 profiles across India, 3 mutual matches, messages, and settings!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().then(() => {
    console.log('Seed execution completed.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
