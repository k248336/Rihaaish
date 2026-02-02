import { icons } from '../utilities';

export interface InstructorData {
  id: number;
  TopCommunity?: boolean;
  instructorName: string;
  instructorRole: string;
  rating: string;
  category: string;
  courseTitle: string;
  description: string;
  instructorImage: any;
  experience: string;
  studentsCount: string;
  price: string;
  isOnline?: boolean;
  Join?: boolean;
}
export interface CommunityData {
  id: number;
  TopCommunity?: boolean;
  instructorName: string;
  instructorRole: string;
  rating: string;
  category: string;
  courseTitle: string;
  description: string;
  instructorImage: any;
  experience: string;
  studentsCount: string;
  price: string;
  isOnline?: boolean;
  Join?: boolean;
}

export const instructorDummyData: InstructorData[] = [
  {
    id: 1,
    instructorName: 'Chance Aminoff',
    instructorRole: 'Instructor',
    rating: '4.8',
    category: 'UI/UX Design',
    courseTitle: 'UI/UX Design Course',
    description:
      'It Is A Long Established Fact That A Reader Will Be Distracted By The Readable',
    instructorImage: icons.dummyAvatar1,
    experience: '5+ Years',
    studentsCount: '2.5K Students',
    price: '$99',
    isOnline: true,
  },
  {
    id: 2,
    instructorName: 'Sarah Johnson',
    instructorRole: 'Senior Instructor',
    rating: '4.9',
    category: 'Development',
    courseTitle: 'Full Stack Web Development',
    description:
      'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects.',
    instructorImage: icons.dummyAvatar2,
    experience: '7+ Years',
    studentsCount: '3.2K Students',
    price: '$149',
    isOnline: false,
  },
  {
    id: 3,
    instructorName: 'Michael Chen',
    instructorRole: 'Expert Instructor',
    rating: '4.7',
    category: 'Real Estate',
    courseTitle: 'Real Estate Investment Mastery',
    description:
      'Master the art of real estate investing with proven strategies and market analysis.',
    instructorImage: icons.dummyAvatar3,
    experience: '10+ Years',
    studentsCount: '1.8K Students',
    price: '$199',
    isOnline: true,
  },
  {
    id: 4,
    instructorName: 'Emily Rodriguez',
    instructorRole: 'Lead Instructor',
    rating: '4.9',
    category: 'Fitness',
    courseTitle: 'Complete Fitness Transformation',
    description:
      'Transform your body and mind with our comprehensive fitness and nutrition program.',
    instructorImage: icons.dummyAvatar4,
    experience: '8+ Years',
    studentsCount: '4.1K Students',
    price: '$79',
    isOnline: true,
  },
  {
    id: 5,
    instructorName: 'David Kim',
    instructorRole: 'Master Chef',
    rating: '4.8',
    category: 'Cooking',
    courseTitle: 'Professional Cooking Techniques',
    description:
      'Learn professional cooking techniques from a master chef with international experience.',
    instructorImage: icons.videocalluser,
    experience: '15+ Years',
    studentsCount: '2.9K Students',
    price: '$129',
    isOnline: false,
  },
  {
    id: 6,
    instructorName: 'Lisa Thompson',
    instructorRole: 'Art Director',
    rating: '4.6',
    category: 'Artist',
    courseTitle: 'Digital Art & Illustration',
    description:
      'Create stunning digital artwork using industry-standard tools and techniques.',
    instructorImage: icons.dummyAvatar1,
    experience: '6+ Years',
    studentsCount: '1.5K Students',
    price: '$89',
    isOnline: true,
  },
  {
    id: 7,
    instructorName: 'James Wilson',
    instructorRole: 'Data Scientist',
    rating: '4.9',
    category: 'Development',
    courseTitle: 'Data Science & Machine Learning',
    description:
      'Master data science and machine learning with Python, TensorFlow, and real datasets.',
    instructorImage: icons.dummyAvatar2,
    experience: '9+ Years',
    studentsCount: '3.7K Students',
    price: '$179',
    isOnline: false,
  },
  {
    id: 8,
    instructorName: 'Maria Garcia',
    instructorRole: 'Marketing Expert',
    rating: '4.7',
    category: 'Marketing',
    courseTitle: 'Digital Marketing Mastery',
    description:
      'Learn digital marketing strategies that drive real results for your business.',
    instructorImage: icons.dummyAvatar3,
    experience: '12+ Years',
    studentsCount: '2.3K Students',
    price: '$119',
    isOnline: true,
  },
  {
    id: 9,
    instructorName: 'Alex Turner',
    instructorRole: 'Photography Expert',
    rating: '4.8',
    category: 'Photography',
    courseTitle: 'Professional Photography Course',
    description:
      'Capture stunning photos with professional techniques and composition rules.',
    instructorImage: icons.dummyAvatar4,
    experience: '11+ Years',
    studentsCount: '1.9K Students',
    price: '$109',
    isOnline: true,
  },
  {
    id: 10,
    instructorName: 'Rachel Brown',
    instructorRole: 'Language Expert',
    rating: '4.9',
    category: 'Language',
    courseTitle: 'Spanish Language Mastery',
    description:
      'Learn Spanish from beginner to advanced level with native speaker guidance.',
    instructorImage: icons.videocalluser,
    experience: '13+ Years',
    studentsCount: '2.8K Students',
    price: '$69',
    isOnline: false,
  },
];
export const TopCommunityDummyData: CommunityData[] = [
  {
    id: 1,
    instructorName: 'Deloitte.',
    instructorRole: '155 People Joined Community',
    rating: '4.8',
    category: 'UI/UX Design',
    courseTitle: 'UI/UX Design Course',
    description:
      'It Is A Long Established Fact That A Reader Will Be Distracted By The Readable',
    instructorImage: icons.community4,
    experience: '5+ Years',
    studentsCount: '2.5K Students',
    price: '$99',
    Join: true,
  },
  {
    id: 2,
    instructorName: 'Macoro',
    instructorRole: '155 People Joined Community',
    rating: '4.9',
    category: 'Development',
    courseTitle: 'Full Stack Web Development',
    description:
      'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects.',
    instructorImage: icons.community2,
    experience: '7+ Years',
    studentsCount: '3.2K Students',
    price: '$149',
    Join: false,
  },
  {
    id: 3,
    instructorName: 'UI8',
    instructorRole: '155 People Joined Community',
    rating: '4.7',
    category: 'Real Estate',
    courseTitle: 'Real Estate Investment Mastery',
    description:
      'Master the art of real estate investing with proven strategies and market analysis.',
    instructorImage: icons.community5,
    experience: '10+ Years',
    studentsCount: '1.8K Students',
    price: '$199',
    Join: true,
  },
  {
    id: 4,
    instructorName: 'Apple Inc.',
    instructorRole: '155 People Joined Community',
    rating: '4.9',
    category: 'Fitness',
    courseTitle: 'Complete Fitness Transformation',
    description:
      'Transform your body and mind with our comprehensive fitness and nutrition program.',
    instructorImage: icons.jcommunity1,
    experience: '8+ Years',
    studentsCount: '4.1K Students',
    price: '$79',
    Join: true,
  },
];
export const JoinedCommunityDummyData: CommunityData[] = [
  {
    id: 1,
    instructorName: 'Deloitte.',
    instructorRole: '155 People Joined Community',
    rating: '4.8',
    category: 'UI/UX Design',
    courseTitle: 'UI/UX Design Course',
    description:
      'It Is A Long Established Fact That A Reader Will Be Distracted By The Readable',
    instructorImage: icons.community4,
    experience: '5+ Years',
    studentsCount: '2.5K Students',
    price: '$99',
  },
  {
    id: 2,
    instructorName: 'Macoro',
    instructorRole: '155 People Joined Community',
    rating: '4.9',
    category: 'Development',
    courseTitle: 'Full Stack Web Development',
    description:
      'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects.',
    instructorImage: icons.community2,
    experience: '7+ Years',
    studentsCount: '3.2K Students',
    price: '$149',
  },
  {
    id: 3,
    instructorName: 'UI8',
    instructorRole: '155 People Joined Community',
    rating: '4.7',
    category: 'Real Estate',
    courseTitle: 'Real Estate Investment Mastery',
    description:
      'Master the art of real estate investing with proven strategies and market analysis.',
    instructorImage: icons.community5,
    experience: '10+ Years',
    studentsCount: '1.8K Students',
    price: '$199',
  },

];

// Filter functions for different categories
export const getInstructorsByCategory = (
  category: string,
): InstructorData[] => {
  if (category === 'All') {
    return instructorDummyData;
  }
  return instructorDummyData.filter(
    instructor => instructor.category === category,
  );
};

export const getFeaturedInstructors = (): InstructorData[] => {
  return instructorDummyData.filter(instructor => instructor.rating >= '4.8');
};

export const getOnlineInstructors = (): InstructorData[] => {
  return instructorDummyData.filter(instructor => instructor.isOnline);
};

export const getTopRatedInstructors = (): InstructorData[] => {
  return instructorDummyData
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);
};
