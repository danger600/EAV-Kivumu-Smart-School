import { Department, LeadershipMember, Facility, SchoolAnnouncement, FAQItem } from '../types';

export const SCHOOL_INFO = {
  name: 'EAV Kivumu Smart School',
  frenchName: 'École Agro-Vétérinaire de Kivumu',
  motto: 'Excellence in Technical Innovation, Agriculture & Veterinary Sciences',
  location: {
    district: 'Rutsiro District',
    province: 'Western Province',
    country: 'Rwanda',
    sector: 'Kivumu',
  },
  established: 1982,
  developer: 'Remmy | L5 SWD',
  instagram: '@tigernsanz',
  contactPhone: '0795547233',
  contactEmail: 'eavkivumu.school@gmail.com',
  website: 'https://eavkivumu.ac.rw',
  stats: {
    totalStudents: 864,
    staffMembers: 52,
    tradesOffered: 4,
    employmentRate: '94%',
    modernLabs: 8,
    demonstrationFarms: 3,
  },
};

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-swd',
    code: 'SWD',
    name: 'Software Development',
    tagline: 'Engineering the digital future from Rwanda to the world',
    description:
      'A premier TVET Level 3 to Level 5 program preparing students with cutting-edge full-stack web engineering, mobile app creation, database architecture, network systems, and algorithmic problem-solving.',
    iconName: 'Code',
    levels: ['Level 3 (Foundation)', 'Level 4 (Intermediate)', 'Level 5 (Advanced Technical Diploma)'],
    careers: ['Full-Stack Software Engineer', 'Mobile App Developer', 'Database Administrator', 'Network & Security Specialist', 'Frontend UI/UX Developer'],
    workshops: ['Modern High-Speed PC Laboratory', 'Robotics & Embedded Hardware Bench', 'Server & Cloud Simulation Center'],
    headOfDepartment: {
      name: 'Eng. Patrick Habimana',
      qualification: 'MSc Computer Science, RTB Certified TVET Master Trainer',
      email: 'hod.swd@kivumu.edu.rw',
    },
    keyStats: {
      students: 260,
      teachers: 14,
      labs: 3,
    },
    highlights: [
      'Remmy | L5 SWD innovation showcase lab',
      'React, TypeScript, Node.js & PostgreSQL production-ready curriculum',
      'Direct linkage with Kigali tech hubs and regional software houses',
      'Annual Kivumu Tech Hackathon',
    ],
  },
  {
    id: 'dept-vet',
    code: 'VET',
    name: 'Veterinary Medicine & Animal Health',
    tagline: 'Preserving livestock vitality and food security across the region',
    description:
      'Comprehensive veterinary clinical and diagnostic education covering animal anatomy, pharmacology, artificial insemination, livestock disease diagnosis, surgical support, and modern farm animal care.',
    iconName: 'Stethoscope',
    levels: ['Level 3 (Animal Care)', 'Level 4 (Clinical Practice)', 'Level 5 (Veterinary Technician Diploma)'],
    careers: ['Certified Veterinary Technician', 'Livestock Health Officer', 'Dairy Production Specialist', 'Veterinary Pharmacy Manager', 'Artificial Insemination Officer'],
    workshops: ['Clinical Examination Ward', 'Parasitology & Microscopy Lab', 'EAV Kivumu Demonstration Dairy Cattle Unit'],
    headOfDepartment: {
      name: 'Dr. Jeanne Uwase',
      qualification: 'Doctor of Veterinary Medicine (DVM)',
      email: 'hod.vet@kivumu.edu.rw',
    },
    keyStats: {
      students: 240,
      teachers: 12,
      labs: 2,
    },
    highlights: [
      'Hands-on clinical internship in surrounding Rutsiro communities',
      'Modern dairy cattle, swine, and poultry teaching units',
      'Disease surveillance and rabies vaccination field campaigns',
    ],
  },
  {
    id: 'dept-agr',
    code: 'AGR',
    name: 'Agriculture & Crop Production',
    tagline: 'Advancing climate-smart farming, agronomy, and agro-processing',
    description:
      'Rigorous scientific and practical agronomy training covering soil science, precision horticulture, irrigation engineering, pest & disease control, post-harvest handling, and greenhouse operations.',
    iconName: 'Sprout',
    levels: ['Level 3 (Soil & Seeds)', 'Level 4 (Crop Management)', 'Level 5 (Agro-Enterprise Diploma)'],
    careers: ['Field Agronomist', 'Greenhouse Production Supervisor', 'Soil & Nutrient Analyst', 'Agri-Business Entrepreneur', 'Extension Officer'],
    workshops: ['Soil Analysis Laboratory', 'Automated Drip Greenhouse', 'Agro-processing & Food Preservation Unit'],
    headOfDepartment: {
      name: 'Agr. Emmanuel Niyonzima',
      qualification: 'BSc Agronomy & Soil Management',
      email: 'hod.agr@kivumu.edu.rw',
    },
    keyStats: {
      students: 210,
      teachers: 10,
      labs: 2,
    },
    highlights: [
      '5-hectare terraced demonstration farm overlooking Lake Kivu highlands',
      'Drip irrigation and organic bio-fertilizer production',
      'Coffee and high-value vegetable export quality cultivation',
    ],
  },
  {
    id: 'dept-gen',
    code: 'GEN',
    name: 'General Studies & Science Foundation',
    tagline: 'Solid academic foundation in STEM, languages, and ethics',
    description:
      'Lower secondary foundation (Senior 1 to Senior 3) equipping learners with strong fundamentals in Mathematics, Physics, Chemistry, Biology, English, French, and Kinyarwanda before specializing in TVET trades.',
    iconName: 'BookOpen',
    levels: ['Senior 1 (S1)', 'Senior 2 (S2)', 'Senior 3 (S3 - National Exam Year)'],
    careers: ['Transition to Advanced TVET (SWD/VET/AGR)', 'Advanced Sciences (MCB, PCB, MPC)', 'National Examination Excellence'],
    workshops: ['Physics & Chemistry Wet Lab', 'Language & Media Room', 'Central School Library'],
    headOfDepartment: {
      name: 'Mme. Claudine Mukamana',
      qualification: 'B.Ed. Science Education',
      email: 'hod.general@kivumu.edu.rw',
    },
    keyStats: {
      students: 154,
      teachers: 16,
      labs: 2,
    },
    highlights: [
      'Consistently 100% pass rate in National Examination (NESA)',
      'Debate and public speaking club',
      'Strong discipline and character building based on Rwandan cultural values',
    ],
  },
];

export const LEADERSHIP: LeadershipMember[] = [
  {
    name: 'Fr. Callixte Kabera',
    role: 'Legal Representative & Director',
    qualification: 'M.Ed. Educational Leadership & Administration',
    bio: 'Dedicated to fostering holistic character formation, academic excellence, and modern vocational training for Rwanda youth.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    contact: '0795547233',
  },
  {
    name: 'Mr. Jean Baptiste Munyaneza',
    role: 'Principal / Headmaster',
    qualification: 'BSc Engineering & TVET Leadership Certification',
    bio: 'Oversees day-to-day operations, curriculum alignment with Rwanda TVET Board (RTB), and industrial partnerships.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    contact: '0795547233',
  },
  {
    name: 'Mrs. Beatrice Uwimana',
    role: 'Dean of Studies (DOS)',
    qualification: 'MSc Applied Sciences & Educational Measurement',
    bio: 'Coordinates examinations, teacher evaluations, student academic records, and university/workforce transition.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Remmy (@tigernsanz)',
    role: 'Lead Systems Developer & L5 SWD Representative',
    qualification: 'Senior Software Developer (L5 SWD)',
    bio: 'Architect behind the EAV Kivumu Smart School digital transformation platform, unifying the public website, database, and portal.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    contact: '0795547233',
  },
];

export const FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Smart Software & Robotics Lab',
    category: 'Academics',
    description: 'High-performance workstations equipped with modern development IDEs, dual monitors, Linux servers, and microcontrollers.',
    equipment: ['65 Core i7 Workstations', 'High-speed Starlink / Fiber Internet', 'Smart Interactive Displays', 'Arduino & ESP32 Kits'],
    capacity: '70 Students concurrently',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fac-2',
    name: 'Veterinary Clinic & Teaching Barn',
    category: 'Practical',
    description: 'On-campus clinical diagnosis bay, operating theater for minor livestock surgeries, microscopy lab, and dairy animal pens.',
    equipment: ['Autoclaves & Sterilizers', 'Compound Microscopes', 'Surgical Packs', 'Ultrasound Scanner for Cattle'],
    capacity: '50 Students per session',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fac-3',
    name: 'Modern Greenhouse & Agro-Demonstration Unit',
    category: 'Practical',
    description: 'Automated temperature and humidity controlled greenhouse paired with terraced fields producing organic vegetables.',
    equipment: ['Drip Irrigation Systems', 'Soil PH & Moisture Meters', 'Seed germination racks', 'Solar dryer'],
    capacity: '100 Students in field shifts',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fac-4',
    name: 'Multimedia Digital Library & Reading Hall',
    category: 'Campus Life',
    description: 'Over 10,000 physical volumes complemented by digital e-library terminals with access to IEEE, Springer, and TVET journals.',
    equipment: ['E-Reader Kiosks', 'Quiet Study Pods', 'Reference Archives', 'High-capacity solar lighting'],
    capacity: '180 Readers',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
];

export const ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Academic Year 2026/2027 Online Admission Applications Now Open',
    category: 'Admissions',
    date: 'October 28, 2026',
    summary: 'Prospective students for Software Development (L3/L4/L5), Veterinary, and Agriculture can apply online with immediate tracking code.',
    content:
      'We welcome primary and O-Level graduates to join EAV Kivumu. Applications can be submitted through our new digital portal or by contacting Remmy on 0795547233. Boarding accommodation is guaranteed for early admitted candidates.',
    isImportant: true,
  },
  {
    id: 'ann-2',
    title: 'EAV Kivumu Students Triumph at Western Province Innovation Fair',
    category: 'Academic',
    date: 'October 15, 2026',
    summary: 'Our Level 5 SWD and Agriculture teams took 1st place with smart irrigation IoT sensors and cattle health surveillance.',
    content:
      'The inter-school competition held in Rubavu showcased remarkable talent from EAV Kivumu students, demonstrating the strength of practical TVET training in Rwanda.',
  },
  {
    id: 'ann-3',
    title: 'Phase 2 Smart School Management System Deployment Complete',
    category: 'Notice',
    date: 'October 30, 2026',
    summary: 'The new full-stack platform with PostgreSQL, Express, and React is live, developed by Remmy | L5 SWD (@tigernsanz).',
    content:
      'All administrative departments can now test health indicators, preview role dashboards, and verify admissions in real time.',
    isImportant: true,
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I apply for admission to EAV Kivumu Smart School?',
    answer:
      'You can apply directly on this website using our Online Admission form. Once submitted, you immediately receive a unique tracking code (e.g., KIV-2026-XXXX). For urgent assistance or guidance, call or WhatsApp our contact desk at 0795547233.',
    category: 'Admissions',
  },
  {
    question: 'What trades and levels are offered at EAV Kivumu?',
    answer:
      'We offer TVET programs accredited by the Rwanda TVET Board (RTB) in Software Development (SWD - Levels 3, 4, 5), Veterinary Medicine & Animal Health (VET - Levels 3, 4, 5), Crop Production / Agriculture (AGR - Levels 3, 4, 5), as well as Lower Secondary O-Level (S1 - S3).',
    category: 'Technical Trades',
  },
  {
    question: 'Does the school provide boarding facilities?',
    answer:
      'Yes! EAV Kivumu provides secure, modern on-campus boarding facilities with separate dormitories for male and female students, full dining hall meals, 24/7 security, healthcare infirmary, and evening supervised prep studies.',
    category: 'Boarding',
  },
  {
    question: 'How do students in Software Development (SWD) get practical experience?',
    answer:
      'SWD students spend over 65% of their training hours in our modern computing labs working on real-world projects with React, TypeScript, Node.js, databases, and mobile apps. Senior L5 students participate in industrial attachments with leading tech companies.',
    category: 'Academics',
  },
  {
    question: 'Who developed this smart school platform?',
    answer:
      'This smart school system was conceptualized and developed by Remmy | L5 SWD (Instagram: @tigernsanz, contact: 0795547233) as part of EAV Kivumu digital transformation initiative.',
    category: 'Technical Trades',
  },
];
