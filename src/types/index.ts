/**
 * EAV Kivumu Smart School - TypeScript Definitions
 * Developed by Remmy | L5 SWD
 * Instagram: @K.eed__ | Contact: 0795547233
 */

export type TradeCode = 'SWD' | 'VET' | 'AGR' | 'GEN';

export interface Department {
  id: string;
  code: TradeCode;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  levels: string[];
  careers: string[];
  workshops: string[];
  headOfDepartment: {
    name: string;
    qualification: string;
    email: string;
  };
  keyStats: {
    students: number;
    teachers: number;
    labs: number;
  };
  highlights: string[];
}

export interface LeadershipMember {
  name: string;
  role: string;
  qualification: string;
  bio: string;
  image: string;
  contact?: string;
}

export interface Facility {
  id: string;
  name: string;
  category: 'Academics' | 'Practical' | 'Campus Life' | 'Sports';
  description: string;
  equipment: string[];
  capacity: string;
  image: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  category: 'Academic' | 'Admissions' | 'Event' | 'Notice';
  date: string;
  summary: string;
  content: string;
  isImportant?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Admissions' | 'Academics' | 'Boarding' | 'Technical Trades';
}

export interface AdmissionApplication {
  id: string;
  trackingCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredTrade: TradeCode;
  levelApplied: number;
  previousSchool: string;
  aggregateScore: number;
  guardianName: string;
  guardianPhone: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
}

export interface ApiHealthResponse {
  status: string;
  app: string;
  version: string;
  timestamp: string;
  developer: string;
  instagram: string;
  contact: string;
  uptime: number;
}

export interface DatabaseHealthResponse {
  status: string;
  database: string;
  schema: string;
  provider: string;
  tables: string[];
  configured: boolean;
  message: string;
}
