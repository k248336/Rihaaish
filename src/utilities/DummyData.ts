import { icons, images } from './images';

export interface ClassData {
  id: number;
  classTitle: string;
  classDescription: string;
  date: string;
  time: string;
  classImage: any;
  category: string;
  duration: string;
  instructor: string;
  level: string;
  price?: string;
  isLive?: boolean;
  completed?: boolean;
}

export const classDummyData: ClassData[] = [
  {
    id: 1,
    classTitle: 'UI/UX Design Beginner Class',
    classDescription:
      'UI UX Design Course, Learn About UI And UX To Understand Their Processes, Tools, And The Difference Between Them.',
    date: 'July, 24 2025',
    time: '04:30 PM',
    classImage: images.class,
    category: 'UI/UX Design',
    duration: '2 hours',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    price: '$99',
    isLive: false,
  },
  {
    id: 2,
    classTitle: 'Full Stack Web Development',
    classDescription:
      'Master modern web development with React, Node.js, and MongoDB. Build real-world projects from scratch.',
    date: 'July, 26 2025',
    time: '02:00 PM',
    classImage: images.class1,
    category: 'Development',
    duration: '3 hours',
    instructor: 'Michael Chen',
    level: 'Intermediate',
    price: '$149',
    isLive: true,
  },
  {
    id: 3,
    classTitle: 'Real Estate Investment Mastery',
    classDescription:
      'Learn proven real estate investment strategies, market analysis, and property evaluation techniques.',
    date: 'July, 28 2025',
    time: '06:00 PM',
    classImage: images.class2,
    category: 'Real Estate',
    duration: '2.5 hours',
    instructor: 'David Kim',
    level: 'Advanced',
    price: '$199',
    isLive: false,
  },
];
export const classCompletedDummyData: ClassData[] = [
  {
    id: 1,
    classTitle: 'UI/UX Design Beginner Class',
    classDescription:
      'UI UX Design Course, Learn About UI And UX To Understand Their Processes, Tools, And The Difference Between Them.',
    date: 'July, 24 2025',
    time: '04:30 PM',
    completed: true,
    classImage: images.class,
    category: 'UI/UX Design',
    duration: '2 hours',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    price: '$99',
    isLive: false,
  },
];

// Filter functions for classes
export const getClassesByCategory = (category: string): ClassData[] => {
  if (category === 'All') {
    return classDummyData;
  }
  return classDummyData.filter(classItem => classItem.category === category);
};

export const getLiveClasses = (): ClassData[] => {
  return classDummyData.filter(classItem => classItem.isLive);
};

export const getClassesByLevel = (level: string): ClassData[] => {
  return classDummyData.filter(classItem => classItem.level === level);
};

export const getUpcomingClasses = (): ClassData[] => {
  // Return classes sorted by date (upcoming first)
  return classDummyData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};
export const topCommunity = [
  { id: 1, name: 'Deloitte.', label: 'Game Design', image: icons.community1 },
  { id: 2, name: 'Rockstar', label: 'Game Design', image: icons.community2 },
  { id: 3, name: 'Macoro', label: 'UI/UX Design', image: icons.community3 },
  { id: 4, name: 'Lincoln', label: 'UX Development', image: icons.community4 },
  { id: 5, name: 'UI8', label: 'Real Estate', image: icons.community5 },
];
export const JoinedCommunityData = [
  {
    id: 1,
    name: 'Apple Inc..',
    label: '155 People Joined Community',
    image: icons.jcommunity1,
  },
  {
    id: 2,
    name: 'Dipro',
    label: '155 People Joined Community',
    image: icons.jcommunity2,
  },
  {
    id: 3,
    name: 'Koin Oracle',
    label: '155 People Joined Community',
    image: icons.jcommunity3,
  },
  {
    id: 4,
    name: 'Lyon',
    label: '155 People Joined Community',
    image: icons.jcommunity4,
  },
  {
    id: 5,
    name: 'Circle Life',
    label: '155 People Joined Community',
    image: icons.jcommunity5,
  },
];

export const AllSessionsData = [
  {
    id: '3',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession1,
    Ongoing: true,
    headerTitle: 'Ongoing',
  },
  {
    id: '2',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession,
    upcoming: true,
    date: 'July, 24 2025 - 04:30 PM',
    headerTitle: 'Upcoming',
  },
  {
    headerTitle: 'Completed',
    id: '1',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.liveclass,
    completed: true,
  },
  // ... add more
];
export const DATA = [
  {
    id: '1',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  // Add as many items as needed
  {
    id: '2',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    id: '3',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    id: '4',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    id: '5',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    id: '6',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
];
export const communityPosts = [
  {
    id: '1',
    profileImage: icons.community4,
    userName: 'Kesha Matin',
    joinedText: '155 People Joined Community',
    timeAgo: '1 day ago',
    title: 'UI/UX Design Beginner Class',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece ',
    likes: 24,
    comments: 2,
    totalCommentsText: 'View all 52 comments',
  },
  {
    id: '2',
    profileImage: icons.community4,
    userName: 'John Doe',
    joinedText: '87 People Joined Community',
    timeAgo: '3 hours ago',
    title: 'UI/UX Design Beginner Class',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece ',
    likes: 10,
    comments: 1,
    totalCommentsText: 'View all 10 comments',
  },
  {
    id: '3',
    profileImage: icons.community4,
    userName: 'Sara Lee',
    joinedText: '200+ Joined This Week',
    timeAgo: '2 days ago',
    title: 'UI/UX Design Beginner Class',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece ',
    likes: 34,
    comments: 6,
    totalCommentsText: 'View all 22 comments',
  },
];

export const AllSessionsDataCompleted = [
  {
    id: '3',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession1,
    headerTitle: 'Ongoing',
  },
  {
    id: '2',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession,
    date: 'July, 24 2025 - 04:30 PM',
    headerTitle: 'Upcoming',
  },
  {
    headerTitle: 'Completed',
    id: '1',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.liveclass,
  },
  // ... add more
];
export const AllLiveClassData = [
  {
    id: '3',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession1,
    Ongoing: true,
  },
  {
    id: '2',
    title: 'Welcome to our new HR Hub',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession3,
    Ongoing: true,
    date: 'July, 24 2025 - 04:30 PM',
  },
  {
    headerTitle: 'Completed',
    id: '1',
    title: 'UK employee benefits and handbook',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.allsession2,
    Ongoing: true,
  },

  // ... add more
];

export const AllSessionsData1 = [
  {
    id: '3',
    title: 'Annual security',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession1,
    completed: true,
    headerTitle: 'Ongoing',
  },
  {
    id: '2',
    title: 'IT software',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession2,
    completed: true,
    date: 'July, 24 2025 - 04:30 PM',
    headerTitle: 'Upcoming',
  },
  {
    id: '1',
    title: 'Art Live Session',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession3,
    completed: true,
  },
  {
    id: '4',
    title: 'Art Live Session',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession4,
    completed: true,
  },
  {
    id: '5',
    title: 'Art Live Session',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession5,
    completed: true,
  },
  {
    id: '6',
    title: 'Art Live Session',
    description:
      'established fact that a reader will be distracted by the readable content',
    liveIcon: images.liveicon,
    liveImage: images.recordedsession6,
    completed: true,
  },
  // ... add more
];
export const categories = [
  'All',
  'Real Estate',
  'UI/UX Design',
  'Development',
  'Cooking',
  'Fitness',
];

// Comment data structure
export interface CommentData {
  id: string;
  userId: string;
  userName: string;
  userImage: any;
  comment: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies?: CommentData[];
  images?: any[];
}

export const commentsData: CommentData[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Jaxson Vaccaro',
    userImage: icons.dummyAvatar1,
    comment:
      'It is a long established fact that a reader will be distracted by the readable content',
    timeAgo: '4h',
    likes: 257000,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        userId: 'user2',
        userName: 'Jaydon Bator',
        userImage: icons.dummyAvatar2,
        comment: 'Reader Will Be Distracted By The Readable Content',
        timeAgo: '2h',
        likes: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Kierra Siphron',
    userImage: icons.dummyAvatar2,
    comment:
      'It is a long established fact that a reader will be distracted by the readable content',
    timeAgo: '3h',
    likes: 89,
    isLiked: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Rayna Dias',
    userImage: icons.dummyAvatar3,
    comment:
      'It is a long established fact that a reader will be distracted by the readable content',
    timeAgo: '2h',
    likes: 45,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        userId: 'user4',
        userName: 'Jaydon Bator',
        userImage: icons.dummyAvatar4,
        comment: 'Reader Will Be Distracted By The Readable Content',
        timeAgo: '1h',
        likes: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Jaydon Bator',
    userImage: icons.dummyAvatar4,
    comment:
      'It is a long established fact that a reader will be distracted by the readable content',
    timeAgo: '1h',
    likes: 156,
    isLiked: false,
  },
];

// Report reasons data
export const reportReasons = [
  { id: '1', title: 'Nudity' },
  { id: '2', title: 'Offensive Language' },
  { id: '3', title: 'Someone Else' },
  { id: '4', title: 'Other' },
];

export const profiledetail = [
  {
    education: {
      degree: 'Bachelor',
      university: 'Global Tech University',
      field: 'Software Engineering',
      duration: 'Sep 2015 – Jun 2019',
      location: 'San Francisco, CA, USA',
    },
    profession: {
      category: 'Media',
      company: 'PixelWave Media',
      position: 'Digital Marketing Specialist',
      location: 'New York, NY 10001, United States',
      duration: 'December 2020 - July 2021 - NY, USA',
      description:
        'Responsible for planning, executing, and optimizing digital campaigns across various platforms. Specialized in SEO, social media growth, and lead generation strategies.',
    },
    experience: {
      level: 'Expert',
      years: '10 years',
    },
    expertise: [
      { name: 'Marketing' },
      { name: 'Social Media Marketing' },
      { name: 'SEO Expert' },
      { name: 'Content Strategy' },
      { name: 'Google Ads' },
    ],
    availability: [
      { day: 'Mon', rate: 150, currency: 'USD', available: true },
      { day: 'Tue', rate: 150, currency: 'USD' },
      { day: 'Wed', rate: 150, currency: 'USD' },
      { day: 'Thu', rate: 150, currency: 'USD' },
      { day: 'Fri', rate: 150, currency: 'USD' },
    ],
    certifications: [
      { image: icons.certificate1 },
      { image: icons.certificate2 },
      { image: icons.certificate3 },
    ],
  },
];
export const reviewdata = [
  {
    id: 1,
    name: 'Tatiana Lubin',
    image: icons.dummyAvatar1,
    rating: 4,
    timeAgo: '2 days ago',
    reviewText:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  },
  {
    id: 2,
    name: 'Randy Vaccaro',
    image: icons.dummyAvatar2,
    rating: 5,
    timeAgo: '2 days ago',
    reviewText:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  },
  {
    id: 3,
    name: 'Ashlynn Franci',
    image: icons.dummyAvatar3,
    rating: 3,
    timeAgo: '2 days ago',
    reviewText:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.',
  },
];
