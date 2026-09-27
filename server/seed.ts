import { connectDB } from './config/db';
import { Profile } from './models/Profile';
import { PrivacySettings } from './models/PrivacySettings';
import { AlgorithmWeight } from './models/AlgorithmWeight';
import { Match } from './models/Match';
import { Message } from './models/Message';
import { Subscription } from './models/Subscription';
import { Post } from './models/Post';

const SEED_PROFILES = [
  // 1. Current Active User: Aman Sharma (Male)
  {
    id: 'usr_me_01',
    email: 'aman.sharma@milanai.com',
    emailMasked: 'am***@milanai.com',
    displayName: 'Aman Sharma',
    age: 28,
    gender: 'male',
    city: 'Delhi NCR',
    distanceBucket: '< 5 km',
    bio: 'Product Designer who loves acoustic guitar, specialty coffee, and road trips. Seeking a thoughtful, mindful partner to explore life with.',
    avatarUrl: '/avatars/user_me.jpg',
    photos: [
      '/avatars/user_me.jpg',
      '/avatars/user_me_alt.jpg'
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
    interests: ['UI/UX Design', 'Acoustic Guitar', 'Specialty Coffee', 'Trekking', 'Podcasts'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
    lastActive: new Date(),
  },

  // 2. Candidate 1: Ananya Sharma (Female)
  {
    id: 'usr_cand_01',
    email: 'ananya.sharma@milanai.com',
    emailMasked: 'an***@milanai.com',
    displayName: 'Ananya Sharma',
    age: 26,
    gender: 'female',
    city: 'Delhi NCR',
    distanceBucket: '< 3 km away',
    bio: 'Architect passionate about sustainable spaces, indie music, and monsoon walks. Always up for discovering quaint cafes and sincere conversations.',
    avatarUrl: '/avatars/ananya_sharma.jpg',
    photos: [
      '/avatars/ananya_sharma.jpg',
      '/avatars/ananya_roy.jpg'
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
      fitness: 'Active (3-4x week)',
      pets: 'Loves Dogs',
    },
    interests: ['Architecture', 'Monsoon Walks', 'Indie Music', 'Specialty Coffee', 'Street Photography'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
    lastActive: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago -> Online
  },

  // 3. Candidate 2: Riya Kapoor (Female)
  {
    id: 'usr_cand_02',
    email: 'riya.kapoor@milanai.com',
    emailMasked: 'ri***@milanai.com',
    displayName: 'Riya Kapoor',
    age: 27,
    gender: 'female',
    city: 'Delhi NCR',
    distanceBucket: '< 4 km away',
    bio: 'UX Researcher & history buff exploring Delhi monuments, art galleries, and indie bookstores. Looking for genuine emotional depth and shared laughs.',
    avatarUrl: '/avatars/riya_kapoor.jpg',
    photos: [
      '/avatars/riya_kapoor.jpg',
      '/avatars/riya_kapoor_alt.jpg'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 8,
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
    interests: ['Heritage Walks', 'UX Research', 'Bookstores', 'Cinema', 'Jazz & Classical'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'vip',
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },

  // 4. Candidate 3: Aditi Chawla (Female)
  {
    id: 'usr_cand_03',
    email: 'aditi.chawla@milanai.com',
    emailMasked: 'ad***@milanai.com',
    displayName: 'Aditi Chawla',
    age: 26,
    gender: 'female',
    city: 'Mumbai',
    distanceBucket: '< 6 km away',
    bio: 'Clinical Psychologist dedicated to mindfulness, family celebrations, and watercolor botanical art. Believer in sincerity, warmth, and mutual respect.',
    avatarUrl: '/avatars/aditi_chawla.jpg',
    photos: [
      '/avatars/aditi_chawla.jpg',
      '/avatars/aditi_chawla_alt.jpg'
    ],
    coreValues: {
      familyValues: 10,
      careerAmbition: 8,
      financialOutlook: 8,
      spontaneity: 6,
      emotionalExpressiveness: 9,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Non-drinker',
      fitness: 'Yoga & Pilates',
      pets: 'Loves Dogs',
    },
    interests: ['Psychology', 'Botanical Art', 'Festive Traditions', 'Nature Walks', 'Gardening'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
    lastActive: new Date(Date.now() - 1000 * 60 * 45),
  },

  // 5. Candidate 4: Kabir Malhotra (Male)
  {
    id: 'usr_cand_04',
    email: 'kabir.malhotra@milanai.com',
    emailMasked: 'ka***@milanai.com',
    displayName: 'Kabir Malhotra',
    age: 28,
    gender: 'male',
    city: 'Bengaluru',
    distanceBucket: '< 7 km away',
    bio: 'Fintech Entrepreneur rooted in Indian cultural traditions. Passionate about continuous learning, fitness, and building a grounded, ambitious life together.',
    avatarUrl: '/avatars/kabir_malhotra.jpg',
    photos: [
      '/avatars/kabir_malhotra.jpg',
      '/avatars/rohan_singhania.jpg'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 9,
      financialOutlook: 9,
      spontaneity: 7,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Strength Training',
      pets: 'Loves Dogs',
    },
    interests: ['Fintech', 'Classical Music', 'Festivals & Culture', 'Weightlifting', 'Philosophy'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'vip',
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
  },

  // 6. Candidate 5: Diya Mehta (Female)
  {
    id: 'usr_cand_05',
    email: 'diya.mehta@milanai.com',
    emailMasked: 'di***@milanai.com',
    displayName: 'Diya Mehta',
    age: 27,
    gender: 'female',
    city: 'Mumbai',
    distanceBucket: '< 8 km away',
    bio: 'Software engineer by day, amateur pastry chef by night. Big fan of sci-fi novels, board games, and weekend road trips.',
    avatarUrl: '/avatars/diya_mehta.jpg',
    photos: [
      '/avatars/diya_mehta.jpg',
      '/avatars/diya_mehta_alt.jpg'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 8,
      financialOutlook: 7,
      spontaneity: 9,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Non-drinker',
      fitness: 'Badminton & Gym',
      pets: 'No pets',
    },
    interests: ['Baking', 'Board Games', 'Sci-Fi Books', 'Travel', 'Badminton'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
    lastActive: new Date(Date.now() - 1000 * 60 * 120),
  },

  // 7. Candidate 6: Rohan Singhania (Male)
  {
    id: 'usr_cand_06',
    email: 'rohan.singhania@milanai.com',
    emailMasked: 'ro***@milanai.com',
    displayName: 'Rohan Singhania',
    age: 29,
    gender: 'male',
    city: 'Pune',
    distanceBucket: '< 9 km away',
    bio: 'Data Scientist & marathon runner. Passionate about AI research, trekking in the Sahyadris, and filter coffee.',
    avatarUrl: '/avatars/rohan_singhania.jpg',
    photos: [
      '/avatars/rohan_singhania.jpg',
      '/avatars/kabir_malhotra.jpg'
    ],
    coreValues: {
      familyValues: 8,
      careerAmbition: 9,
      financialOutlook: 9,
      spontaneity: 6,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Marathon Running',
      pets: 'Cat person',
    },
    interests: ['Data Science', 'Sahyadri Treks', 'Marathons', 'Filter Coffee', 'Documentaries'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },

  // 8. Candidate 7: Kavya Iyer (Female)
  {
    id: 'usr_cand_07',
    email: 'kavya.iyer@milanai.com',
    emailMasked: 'ka***@milanai.com',
    displayName: 'Kavya Iyer',
    age: 27,
    gender: 'female',
    city: 'Chennai',
    distanceBucket: '< 10 km away',
    bio: 'Fintech Product Lead & Carnatic vocalist. Love morning beach runs, south Indian filter coffee, and exploring indie art galleries.',
    avatarUrl: '/avatars/kavya_venkat.jpg',
    photos: [
      '/avatars/kavya_venkat.jpg',
      '/avatars/kavya_venkat_alt.jpg'
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
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },

  // 9. Candidate 8: Sneha Kulkarni (Female)
  {
    id: 'usr_cand_08',
    email: 'sneha.k@milanai.com',
    emailMasked: 'sn***@milanai.com',
    displayName: 'Sneha Kulkarni',
    age: 28,
    gender: 'female',
    city: 'Hyderabad',
    distanceBucket: '< 5 km away',
    bio: 'Neuroscientist researching memory systems. Passionate about mountain trekking, plant parenting, and culinary experiments.',
    avatarUrl: '/avatars/sneha_kulkarni.jpg',
    photos: [
      '/avatars/sneha_kulkarni.jpg',
      '/avatars/sneha_kulkarni_alt.jpg'
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
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },

  // 10. Candidate 9: Devansh Joshi (Male)
  {
    id: 'usr_cand_09',
    email: 'devansh.joshi@milanai.com',
    emailMasked: 'de***@milanai.com',
    displayName: 'Devansh Joshi',
    age: 28,
    gender: 'male',
    city: 'Jaipur',
    distanceBucket: '< 12 km away',
    bio: 'Clean Energy Engineer & acoustic musician. Passionate about sustainable living, heritage architecture, and weekend road trips.',
    avatarUrl: '/avatars/aman_verma.jpg',
    photos: [
      '/avatars/aman_verma.jpg',
      '/avatars/user_me.jpg'
    ],
    coreValues: {
      familyValues: 9,
      careerAmbition: 8,
      financialOutlook: 8,
      spontaneity: 8,
      emotionalExpressiveness: 8,
    },
    relationshipGoals: 'Marriage / Long-term',
    lifestyle: {
      dietary: 'Vegetarian',
      smoking: 'Never',
      drinking: 'Socially',
      fitness: 'Swimming & Running',
      pets: 'Loves Dogs',
    },
    interests: ['Clean Energy', 'Guitar', 'Heritage Architecture', 'Road Trips', 'Astronomy'],
    verificationStatus: 'verified',
    isPremium: true,
    premiumTier: 'gold',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },

  // 11. Candidate 10: Pooja Sharma (Female)
  {
    id: 'usr_cand_10',
    email: 'pooja.sharma@milanai.com',
    emailMasked: 'po***@milanai.com',
    displayName: 'Pooja Sharma',
    age: 26,
    gender: 'female',
    city: 'Kolkata',
    distanceBucket: '< 11 km away',
    bio: 'Robotics Engineer & classical vocalist. Love exploring historical landmarks, indie cinema, and evening conversations over darjeeling tea.',
    avatarUrl: '/avatars/pooja_sharma.jpg',
    photos: [
      '/avatars/pooja_sharma.jpg',
      '/avatars/pooja_sharma_alt.jpg'
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
      fitness: 'Yoga & Badminton',
      pets: 'Loves Dogs',
    },
    interests: ['Robotics', 'Classical Music', 'Literature', 'Documentaries', 'Tea Tasting'],
    verificationStatus: 'verified',
    isPremium: false,
    premiumTier: 'free',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
  }
];

export async function seedDatabase() {
  const connected = await connectDB();
  if (!connected) {
    console.warn('⚠️ [Seed] Skipping MongoDB seed as database is not reachable.');
    return;
  }

  console.log('🌱 [Seed] Populating rich MongoDB demo collections with authentic Indian profiles & photos...');

  // Prune any legacy test accounts so only the 11 authentic seeded profiles exist
  const officialSeedIds = SEED_PROFILES.map((p) => p.id);
  await Profile.deleteMany({ id: { $nin: officialSeedIds } });

  // 1. Seed User & Candidate Profiles
  for (const p of SEED_PROFILES) {
    const enriched = {
      ...p,
      isLiveCameraVerified: true,
      cameraFilterUsed: 'ai_beautify',
    };
    await Profile.findOneAndUpdate({ id: p.id }, enriched, { upsert: true, returnDocument: 'after' });
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
      compatibilityScore: 95,
      scoreBreakdown: {
        valuesScore: 96,
        goalsScore: 94,
        lifestyleScore: 95,
        interestsScore: 94,
        explanation: 'Deep alignment on Family Values, Long-term Marriage vision, and shared passion for indie music, design & monsoon walks.',
      },
      status: 'accepted',
    },
    {
      id: 'match_02',
      userId1: 'usr_me_01',
      userId2: 'usr_cand_02',
      candidateId: 'usr_cand_02',
      compatibilityScore: 93,
      scoreBreakdown: {
        valuesScore: 95,
        goalsScore: 92,
        lifestyleScore: 92,
        interestsScore: 93,
        explanation: 'Shared creative focus on design research, Delhi heritage walks, and mindful living.',
      },
      status: 'accepted',
    },
    {
      id: 'match_03',
      userId1: 'usr_me_01',
      userId2: 'usr_cand_03',
      candidateId: 'usr_cand_03',
      compatibilityScore: 92,
      scoreBreakdown: {
        valuesScore: 98,
        goalsScore: 90,
        lifestyleScore: 92,
        interestsScore: 89,
        explanation: 'Strong compatibility on family values, emotional clarity, and sincere mutual respect.',
      },
      status: 'accepted',
    },
  ];

  await Match.deleteMany({ id: { $nin: matchesToSeed.map((m) => m.id) } });
  for (const m of matchesToSeed) {
    await Match.findOneAndUpdate({ id: m.id }, m, { upsert: true, returnDocument: 'after' });
  }

  // 6. Seed Sample Messages
  const messagesToSeed = [
    {
      id: 'msg_01',
      matchId: 'match_01',
      senderId: 'usr_cand_01',
      content: 'Hi Aman! Nice to connect. I saw that you also love indie music and monsoon walks around Delhi!',
      timestamp: '10:30 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_02',
      matchId: 'match_01',
      senderId: 'usr_me_01',
      content: 'Hey Ananya! Yes, absolutely. Saturday morning cafe trails and acoustic sessions are my favorite weekend ritual 😊',
      timestamp: '10:32 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_03',
      matchId: 'match_01',
      senderId: 'usr_cand_01',
      content: 'That sounds wonderful. Would love to share playlists and cafe recommendations!',
      timestamp: '10:35 AM',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_04',
      matchId: 'match_02',
      senderId: 'usr_cand_02',
      content: 'Hello Aman! Great to connect with a fellow designer in Delhi NCR.',
      timestamp: 'Yesterday',
      isRead: true,
      safetyFlagged: false,
    },
    {
      id: 'msg_05',
      matchId: 'match_03',
      senderId: 'usr_cand_03',
      content: 'Hey Aman! Love your focus on mindful living. How is your weekend going?',
      timestamp: '2 hours ago',
      isRead: false,
      safetyFlagged: false,
    },
  ];

  await Message.deleteMany({ id: { $nin: messagesToSeed.map((msg) => msg.id) } });
  for (const msg of messagesToSeed) {
    await Message.findOneAndUpdate({ id: msg.id }, msg, { upsert: true, returnDocument: 'after' });
  }

  // 7. Seed Posts / Moments Feed
  const postsToSeed = [
    {
      id: 'post_seed_01',
      userId: 'usr_cand_01',
      imageUrl: '/avatars/ananya_sharma.jpg',
      caption: 'Monsoon walks and peaceful evenings 🌧️✨',
      likes: ['usr_me_01', 'usr_cand_02'],
    },
    {
      id: 'post_seed_02',
      userId: 'usr_cand_02',
      imageUrl: '/avatars/riya_kapoor.jpg',
      caption: 'Exploring the rich architecture of Qutub Minar on a sunny morning 🏛️☀️',
      likes: ['usr_me_01', 'usr_cand_04'],
    },
    {
      id: 'post_seed_03',
      userId: 'usr_cand_03',
      imageUrl: '/avatars/aditi_chawla.jpg',
      caption: 'Festive vibes, mehendi, and fresh blooms 🌸💙',
      likes: ['usr_me_01', 'usr_cand_01', 'usr_cand_05'],
    },
    {
      id: 'post_seed_04',
      userId: 'usr_cand_04',
      imageUrl: '/avatars/kabir_malhotra.jpg',
      caption: 'Traditional celebrations and festive floral rangoli 🪔🌸',
      likes: ['usr_me_01', 'usr_cand_03'],
    },
    {
      id: 'post_seed_05',
      userId: 'usr_me_01',
      imageUrl: '/avatars/user_me.jpg',
      caption: 'Acoustic evening vibes and slow coffee brewing ☕🎵',
      likes: ['usr_cand_01', 'usr_cand_02', 'usr_cand_03'],
    },
  ];

  await Post.deleteMany({ id: { $nin: postsToSeed.map((p) => p.id) } });
  for (const post of postsToSeed) {
    await Post.findOneAndUpdate({ id: post.id }, post, { upsert: true, returnDocument: 'after' });
  }

  console.log('✅ [Seed] MongoDB database successfully populated with real Indian profiles, photos, matches, chats, and posts!');
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
