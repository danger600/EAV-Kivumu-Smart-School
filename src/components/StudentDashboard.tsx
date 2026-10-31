/**
 * EAV Kivumu Smart School - Secure Student Dashboard
 * Displays Personal Academic Progress, Enrolled Courses, and Grade Notifications
 * Uses Firebase Auth for User Identification and Firestore for Persistence
 * 
 * Developed by Remmy | L5 SWD
 * Instagram: @K.eed__ | Contact: 0795547233
 */

import React, { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  handleFirestoreError,
  OperationType,
  FirebaseUser,
} from '../firebase';
import {
  GraduationCap,
  Award,
  BookOpen,
  Bell,
  CheckCircle2,
  Clock,
  TrendingUp,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  Calendar,
  MapPin,
  FileText,
  Printer,
  ChevronRight,
  Filter,
  Check,
  AlertCircle,
  Sparkles,
  Calculator,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  calculateCumulativeGPA,
  calculateProgressPercentage,
  getRTBCompetencyLevel,
  filterGradeNotifications,
} from '../utils/schoolLogic';

export interface StudentProfile {
  userId: string;
  studentId: string;
  fullName: string;
  email: string;
  tradeCode: 'SWD' | 'VET' | 'AGR' | 'GEN';
  tradeName: string;
  level: number;
  gpa: number;
  creditsEarned: number;
  totalCredits: number;
  attendanceRate: number;
  term: string;
  classRank: string;
  conduct: string;
  academicAdvisor: string;
  updatedAt: string;
}

export interface EnrolledCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  credits: number;
  progressPercent: number;
  currentGrade: string;
  score: number;
  maxScore: number;
  schedule: string;
  room: string;
  syllabusModules: string[];
  nextAssessment: {
    title: string;
    dueDate: string;
  };
}

export interface GradeNotification {
  id: string;
  userId: string;
  courseCode: string;
  courseTitle: string;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  gradeLetter: string;
  feedback: string;
  isRead: boolean;
  createdAt: string;
  instructor: string;
  category: 'CAT' | 'PRACTICAL' | 'EXAM' | 'PROJECT';
}

interface StudentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial default curriculum for EAV Kivumu L5 Software Development
const DEFAULT_COURSES: EnrolledCourse[] = [
  {
    id: 'course-1',
    code: 'SWD501',
    title: 'Web & Distributed Systems Architecture',
    instructor: 'Remmy (L5 Lead)',
    credits: 6,
    progressPercent: 85,
    currentGrade: 'A',
    score: 88,
    maxScore: 100,
    schedule: 'Mon, Wed 08:30 - 10:30',
    room: 'Lab 1 (High-Speed Fiber)',
    syllabusModules: [
      'Microservices Design',
      'React 19 & TypeScript',
      'REST & GraphQL APIs',
      'Docker Deployment',
    ],
    nextAssessment: {
      title: 'Distributed State Project',
      dueDate: 'Nov 12, 2026',
    },
  },
  {
    id: 'course-2',
    code: 'SWD502',
    title: 'Advanced Database Systems & Prisma ORM',
    instructor: 'Mr. Emmanuel Munyaneza',
    credits: 5,
    progressPercent: 90,
    currentGrade: 'A',
    score: 92,
    maxScore: 100,
    schedule: 'Tue, Thu 10:45 - 12:45',
    room: 'Computer Lab 2',
    syllabusModules: [
      'PostgreSQL Relational Design',
      'Prisma Schema Migrations',
      'Query Optimization & Indexing',
      'ACID Transactions',
    ],
    nextAssessment: {
      title: 'Schema Normalization Lab',
      dueDate: 'Nov 15, 2026',
    },
  },
  {
    id: 'course-3',
    code: 'SWD503',
    title: 'Agricultural IoT & Smart Sensor Telemetry',
    instructor: 'Eng. Patrick Habimana',
    credits: 5,
    progressPercent: 78,
    currentGrade: 'A-',
    score: 85,
    maxScore: 100,
    schedule: 'Wed, Fri 14:00 - 16:00',
    room: 'Agro-Tech Hardware Workshop',
    syllabusModules: [
      'ESP32 & Arduino Telemetry',
      'Soil Moisture & Weather Nodes',
      'MQTT Protocol Bridges',
      'Solar Power Optimization',
    ],
    nextAssessment: {
      title: 'Greenhouse Sensor Calibration',
      dueDate: 'Nov 18, 2026',
    },
  },
  {
    id: 'course-4',
    code: 'SWD504',
    title: 'Software Quality Assurance & Node Testing',
    instructor: 'Ms. Clarisse Uwase',
    credits: 4,
    progressPercent: 92,
    currentGrade: 'A',
    score: 95,
    maxScore: 100,
    schedule: 'Monday 14:00 - 17:00',
    room: 'Software QA Lab',
    syllabusModules: [
      'TDD & Node.js Native Test Runner',
      'Security Penetration Testing',
      'CI/CD Pipelines',
      'Code Quality Benchmarks',
    ],
    nextAssessment: {
      title: 'Automated Suite Submission',
      dueDate: 'Nov 22, 2026',
    },
  },
  {
    id: 'course-5',
    code: 'SWD505',
    title: 'TVET Professional Entrepreneurship & Ethics',
    instructor: 'Dr. Jean de Dieu Bizimana',
    credits: 4,
    progressPercent: 80,
    currentGrade: 'B+',
    score: 79,
    maxScore: 100,
    schedule: 'Friday 08:30 - 11:30',
    room: 'Main Lecture Hall A',
    syllabusModules: [
      'Rwanda TVET Policy & RTB Guidelines',
      'Tech Startup Business Models',
      'Intellectual Property & Licensing',
      'Financial Management',
    ],
    nextAssessment: {
      title: 'AgriTech Business Plan Pitch',
      dueDate: 'Nov 25, 2026',
    },
  },
];

const DEFAULT_NOTIFICATIONS: GradeNotification[] = [
  {
    id: 'notif-1',
    userId: 'default',
    courseCode: 'SWD504',
    courseTitle: 'Software Quality Assurance',
    assessmentTitle: 'Continuous Assessment 2: Pure Function Unit Testing',
    score: 29,
    maxScore: 30,
    gradeLetter: 'A',
    feedback: 'Flawless test coverage using Node test runner. All edge cases rigorously handled.',
    isRead: false,
    createdAt: '2 hours ago',
    instructor: 'Ms. Clarisse Uwase',
    category: 'CAT',
  },
  {
    id: 'notif-2',
    userId: 'default',
    courseCode: 'SWD501',
    courseTitle: 'Web & Distributed Systems',
    assessmentTitle: 'Mid-Term Architecture Defense & API Benchmark',
    score: 47,
    maxScore: 50,
    gradeLetter: 'A',
    feedback: 'Outstanding mastery of Express middleware and Vite client integration. Excellent defense.',
    isRead: false,
    createdAt: 'Yesterday at 16:30',
    instructor: 'Remmy (L5 Lead)',
    category: 'PRACTICAL',
  },
  {
    id: 'notif-3',
    userId: 'default',
    courseCode: 'SWD502',
    courseTitle: 'Database Systems & Prisma',
    assessmentTitle: 'Practical Lab 4: Relational Foreign Key Integrity',
    score: 28,
    maxScore: 30,
    gradeLetter: 'A',
    feedback: 'Well-structured Prisma schema with appropriate indexes and cascade constraints.',
    isRead: true,
    createdAt: '3 days ago',
    instructor: 'Mr. Emmanuel Munyaneza',
    category: 'PRACTICAL',
  },
  {
    id: 'notif-4',
    userId: 'default',
    courseCode: 'SWD503',
    courseTitle: 'Agricultural IoT Telemetry',
    assessmentTitle: 'Field Test 1: Kivumu Soil Moisture Sensor Array',
    score: 25.5,
    maxScore: 30,
    gradeLetter: 'B+',
    feedback: 'Good telemetry packet transmission. Ensure calibration offset is verified in muddy terrain.',
    isRead: true,
    createdAt: 'Oct 24, 2026',
    instructor: 'Eng. Patrick Habimana',
    category: 'PROJECT',
  },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'progress' | 'courses' | 'notifications' | 'transcript' | 'simulator'>('progress');
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'high_priority'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Student Academic State
  const [profile, setProfile] = useState<StudentProfile>({
    userId: 'default-student',
    studentId: 'KIV-2026-L5-042',
    fullName: 'Remmy Scholar (Student Profile)',
    email: 'remmy.student@kivumu.edu.rw',
    tradeCode: 'SWD',
    tradeName: 'Software Development (Level 5 TVET)',
    level: 5,
    gpa: 3.86,
    creditsEarned: 48,
    totalCredits: 60,
    attendanceRate: 96.8,
    term: 'Term 2 (2025/2026 Academic Year)',
    classRank: '2nd out of 42 Students',
    conduct: 'Exemplary / 100%',
    academicAdvisor: 'Remmy | L5 SWD (@K.eed__)',
    updatedAt: new Date().toISOString(),
  });

  const [courses, setCourses] = useState<EnrolledCourse[]>(DEFAULT_COURSES);
  const [notifications, setNotifications] = useState<GradeNotification[]>(DEFAULT_NOTIFICATIONS);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);

  // GPA Simulator State
  const [simDesiredGpa, setSimDesiredGpa] = useState<number>(3.9);
  const [simTargetCourse, setSimTargetCourse] = useState<string>('SWD501');

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        loadStudentDataFromFirestore(user);
      } else {
        // Fallback to local default state
        setProfile((prev) => ({
          ...prev,
          userId: 'guest-student',
          fullName: 'Remmy Scholar (Student Demo)',
          email: 'remmy.student@kivumu.edu.rw',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Load student records from Firestore
  const loadStudentDataFromFirestore = async (user: FirebaseUser) => {
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const studentDocRef = doc(db, 'students', user.uid);
      const studentSnap = await getDoc(studentDocRef);

      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setProfile({
          userId: user.uid,
          studentId: data.studentId || 'KIV-2026-L5-042',
          fullName: data.fullName || user.displayName || 'Remmy Student',
          email: data.email || user.email || 'student@kivumu.edu.rw',
          tradeCode: data.tradeCode || 'SWD',
          tradeName: data.tradeCode === 'VET' ? 'Veterinary Technology' : data.tradeCode === 'AGR' ? 'Agricultural Production' : 'Software Development (Level 5 TVET)',
          level: data.level || 5,
          gpa: data.gpa || 3.86,
          creditsEarned: data.creditsEarned || 48,
          totalCredits: data.totalCredits || 60,
          attendanceRate: data.attendanceRate || 96.8,
          term: data.term || 'Term 2 (2025/2026 Academic Year)',
          classRank: '2nd out of 42 Students',
          conduct: 'Exemplary / 100%',
          academicAdvisor: 'Remmy | L5 SWD (@K.eed__)',
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      } else {
        // Initialize student document in Firestore for this user
        const newProfileData = {
          userId: user.uid,
          studentId: `KIV-2026-${user.uid.slice(0, 6).toUpperCase()}`,
          fullName: user.displayName || 'EAV Kivumu Student',
          email: user.email || 'student@kivumu.edu.rw',
          tradeCode: 'SWD' as const,
          level: 5,
          gpa: 3.86,
          creditsEarned: 48,
          totalCredits: 60,
          attendanceRate: 96.8,
          term: 'Term 2 (2025/2026 Academic Year)',
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(studentDocRef, newProfileData);
        } catch (e) {
          // If Firestore permission prevents or offline, continue with local state
          console.warn('Initial student Firestore seed deferred:', e);
        }

        setProfile({
          ...newProfileData,
          tradeName: 'Software Development (Level 5 TVET)',
          classRank: '2nd out of 42 Students',
          conduct: 'Exemplary / 100%',
          academicAdvisor: 'Remmy | L5 SWD (@K.eed__)',
        });
      }

      // Load enrolled courses from subcollection
      try {
        const coursesRef = collection(db, 'students', user.uid, 'courses');
        const coursesSnap = await getDocs(coursesRef);
        if (!coursesSnap.empty) {
          const loadedCourses: EnrolledCourse[] = [];
          coursesSnap.forEach((docSnap) => {
            loadedCourses.push({ id: docSnap.id, ...docSnap.data() } as EnrolledCourse);
          });
          setCourses(loadedCourses);
        }
      } catch (err) {
        console.warn('Subcollection courses load fallback to defaults', err);
      }

      // Load notifications from subcollection
      try {
        const notifsRef = collection(db, 'students', user.uid, 'notifications');
        const notifsSnap = await getDocs(notifsRef);
        if (!notifsSnap.empty) {
          const loadedNotifs: GradeNotification[] = [];
          notifsSnap.forEach((docSnap) => {
            loadedNotifs.push({ id: docSnap.id, ...docSnap.data() } as GradeNotification);
          });
          setNotifications(loadedNotifs);
        }
      } catch (err) {
        console.warn('Subcollection notifications load fallback to defaults', err);
      }
    } catch (error) {
      console.error('Error syncing student data:', error);
      setErrorMessage('Could not sync with cloud database. Running in secure authenticated session.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      await loadStudentDataFromFirestore(result.user);
    } catch (error: unknown) {
      console.error('Google Sign In Error:', error);
      const msg = error instanceof Error ? error.message : 'Authentication could not be completed.';
      setErrorMessage(`Sign-in failed: ${msg}. You can continue viewing student progress in offline student preview mode.`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setProfile((prev) => ({
        ...prev,
        userId: 'guest-student',
        fullName: 'Remmy Scholar (Student Demo)',
        email: 'remmy.student@kivumu.edu.rw',
      }));
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  // Toggle notification read status
  const handleToggleNotification = async (notificationId: string) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: !n.isRead } : n
    );
    setNotifications(updated);

    if (currentUser) {
      try {
        const notifDocRef = doc(db, 'students', currentUser.uid, 'notifications', notificationId);
        const item = updated.find((n) => n.id === notificationId);
        if (item) {
          await updateDoc(notifDocRef, { isRead: item.isRead });
        }
      } catch {
        // Ignored in offline/demo mode
      }
    }
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    if (currentUser) {
      for (const n of notifications) {
        if (!n.isRead) {
          try {
            const notifDocRef = doc(db, 'students', currentUser.uid, 'notifications', n.id);
            await updateDoc(notifDocRef, { isRead: true });
          } catch {
            // Ignored in offline mode
          }
        }
      }
    }
  };

  // Computed values
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = filterGradeNotifications(notifications, notificationFilter);
  const competency = getRTBCompetencyLevel(profile.gpa);
  const completionPct = calculateProgressPercentage(profile.creditsEarned, profile.totalCredits);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Student Portal Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 border-b border-emerald-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  EAV Kivumu Student Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RTB Accredited
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Personal Academic Progress & Grades
              </h2>
              <p className="text-slate-400 text-xs">
                École Agro-Vétérinaire de Kivumu • Ngororero District, Western Province
              </p>
            </div>
          </div>

          {/* User Auth Identification Badge */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl px-3 py-1.5 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Student'}
                    className="w-7 h-7 rounded-full border border-emerald-400 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                    {(currentUser.displayName || currentUser.email || 'S')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-white text-xs truncate max-w-[130px]">
                    {currentUser.displayName || profile.fullName}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono truncate max-w-[130px]">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
                  title="Sign out of Firebase Auth"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>{isAuthLoading ? 'Authenticating...' : 'Sign In with Google'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close student dashboard"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-xs text-amber-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              {errorMessage}
            </span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 gap-1 sm:gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'progress'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Academic Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'courses'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Enrolled Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition shrink-0 relative ${
              activeTab === 'notifications'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Grade Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'transcript'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'simulator'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Target GPA Calculator</span>
          </button>
        </div>

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ACADEMIC PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Student Header Profile Card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 rounded-2xl p-5 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-600/20">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {currentUser?.displayName || profile.fullName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                        L{profile.level} {profile.tradeCode}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${competency.badgeClass}`}>
                        {competency.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
                      <span>ID: <strong className="text-slate-900">{profile.studentId}</strong></span>
                      <span>•</span>
                      <span>Campus: <strong>Kivumu Main, Ngororero</strong></span>
                      <span>•</span>
                      <span>Term: <strong>{profile.term}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-medium block">Lead Academic Advisor:</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    {profile.academicAdvisor}
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono block mt-0.5">
                    Instagram: @K.eed__
                  </span>
                </div>
              </div>

              {/* 4 Major Progress Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* GPA Card */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Cumulative GPA
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {profile.gpa.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ 4.00</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    Top 5% in Level 5 Cohort
                  </p>
                </div>

                {/* Credits Completed */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Modular Credits
                    </span>
                    <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {profile.creditsEarned}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ {profile.totalCredits}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{completionPct}% towards RTB Diploma</p>
                </div>

                {/* Term Attendance Rate */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Term Attendance
                    </span>
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {profile.attendanceRate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700 font-semibold mt-1">
                    182 / 188 Sessions Present
                  </p>
                </div>

                {/* Cohort Standing */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Class Rank
                    </span>
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {profile.classRank}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Discipline: <strong className="text-emerald-700">{profile.conduct}</strong>
                  </p>
                </div>
              </div>

              {/* TVET Competencies Grid */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Competency-Based Assessment (CBT/CBA) Breakdown
                    </h4>
                    <p className="text-xs text-slate-500">
                      Evaluated according to Rwanda TVET Board (RTB) modular criteria
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    All Modules Cleared
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3.5">
                  {[
                    {
                      module: 'Web & Distributed Architecture (SWD501)',
                      score: 92,
                      level: 'Distinction',
                      skills: 'React 19, TypeScript, RESTful Services, Cloud Deployments',
                    },
                    {
                      module: 'PostgreSQL & Prisma Data Modeling (SWD502)',
                      score: 90,
                      level: 'Distinction',
                      skills: 'Relational Schemas, Indexing, Transactions, ACID Compliance',
                    },
                    {
                      module: 'Agro-Veterinary Sensor Telemetry (SWD503)',
                      score: 85,
                      level: 'Credit',
                      skills: 'ESP32 Microcontrollers, Soil Moisture Sensor Interfaces, MQTT',
                    },
                    {
                      module: 'Node Test Automation & QA (SWD504)',
                      score: 95,
                      level: 'Distinction',
                      skills: 'Node:test Suite, Security Auditing, Performance Benchmarking',
                    },
                  ].map((comp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{comp.module}</span>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {comp.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        <strong className="text-slate-700">Key competencies:</strong> {comp.skills}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENROLLED COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Current Term Enrolled Courses ({courses.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Academic Year 2025/2026 • Term 2 • Level 5 Software Development
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-xs font-extrabold">
                          {course.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 font-medium">Current CAT:</span>
                          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {course.currentGrade} ({course.score}%)
                          </span>
                        </div>
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm leading-snug">
                        {course.title}
                      </h5>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{course.instructor}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.credits} RTB Credits</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{course.schedule}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{course.room}</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Syllabus Completion:</span>
                        <span className="font-bold text-slate-800 font-mono">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Next Due Assessment:</span>
                          <span className="font-bold text-slate-800 text-[11px]">{course.nextAssessment.title}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold shrink-0">
                          {course.nextAssessment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GRADE NOTIFICATIONS & ALERTS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span>Grade Notifications & Lecturer Feedback</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Real-time alerts for published CAT marks, lab scores, and term examinations
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter Pills */}
                  <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setNotificationFilter('all')}
                      className={`px-3 py-1 rounded-lg transition ${
                        notificationFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotificationFilter('unread')}
                      className={`px-3 py-1 rounded-lg transition ${
                        notificationFilter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      onClick={() => setNotificationFilter('high_priority')}
                      className={`px-3 py-1 rounded-lg transition ${
                        notificationFilter === 'high_priority' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      High Priority
                    </button>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsAsRead}
                      className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <h5 className="font-bold text-slate-800 text-sm">No Notifications Found</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You are up to date on all continuous assessment publications.
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        notif.isRead
                          ? 'bg-white border-slate-200/90'
                          : 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-200/60'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                            {notif.courseCode}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {notif.courseTitle}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-mono">
                            {notif.createdAt}
                          </span>
                          {!notif.isRead && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                              NEW
                            </span>
                          )}
                        </div>

                        <h5 className="font-bold text-slate-900 text-sm">
                          {notif.assessmentTitle}
                        </h5>

                        <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed italic">
                          "{notif.feedback}"
                          <span className="block not-italic text-[11px] font-semibold text-slate-700 mt-1">
                            — Evaluator: {notif.instructor}
                          </span>
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2.5 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-2xl font-extrabold font-mono text-emerald-700">
                              {notif.score}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">/ {notif.maxScore}</span>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                            Grade: {notif.gradeLetter} ({Math.round((notif.score / notif.maxScore) * 100)}%)
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleNotification(notif.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{notif.isRead ? 'Mark Unread' : 'Mark as Read'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Official TVET Academic Progress Transcript
                  </h4>
                  <p className="text-xs text-slate-500">
                    Certified EAV Kivumu electronic academic summary record
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Print Official Transcript</span>
                </button>
              </div>

              {/* Printable Transcript Document Paper */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 text-slate-900 font-serif">
                {/* School Header Seal */}
                <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                    École Agro-Vétérinaire de Kivumu
                  </h3>
                  <p className="text-xs font-sans text-slate-600 uppercase tracking-widest font-bold">
                    Republic of Rwanda • Ministry of Education • RTB & NESA Certified
                  </p>
                  <p className="text-xs font-sans text-slate-500">
                    Ngororero District, Western Province • Email: kivumu.eav@gmail.com
                  </p>
                  <h4 className="text-sm font-sans font-bold uppercase tracking-widest text-emerald-800 pt-2">
                    Official Student Academic Progress Transcript
                  </h4>
                </div>

                {/* Student Record Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans py-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Student Name:</span>
                    <strong className="text-slate-900">{currentUser?.displayName || profile.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Student ID Number:</span>
                    <strong className="font-mono text-slate-900">{profile.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department / Trade:</span>
                    <strong className="text-slate-900">{profile.tradeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Academic Term:</span>
                    <strong className="text-slate-900">{profile.term}</strong>
                  </div>
                </div>

                {/* Course Modules Table */}
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-300">
                      <tr>
                        <th className="py-2.5 px-3">Module Code</th>
                        <th className="py-2.5 px-3">Module Title</th>
                        <th className="py-2.5 px-3">Credits</th>
                        <th className="py-2.5 px-3">Score (%)</th>
                        <th className="py-2.5 px-3">Grade Point</th>
                        <th className="py-2.5 px-3">Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {courses.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.code}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{c.title}</td>
                          <td className="py-2.5 px-3 font-mono">{c.credits}</td>
                          <td className="py-2.5 px-3 font-mono font-bold">{c.score}%</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{c.currentGrade}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">Competent</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
                  <div>
                    <p><strong className="text-slate-900">Total Credits Earned:</strong> {profile.creditsEarned} / {profile.totalCredits}</p>
                    <p><strong className="text-slate-900">Cumulative GPA:</strong> {profile.gpa.toFixed(2)} / 4.00</p>
                  </div>
                  <div>
                    <p><strong className="text-slate-900">Academic Standing:</strong> Good Standing (Distinction Standard)</p>
                    <p><strong className="text-slate-900">Attendance:</strong> {profile.attendanceRate}%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block">Document Verification Hash:</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700">
                      KIV-AUTH-{profile.studentId}-2026
                    </span>
                  </div>
                </div>

                {/* Sign-off Stamps */}
                <div className="grid grid-cols-2 pt-6 font-sans text-xs border-t border-slate-200">
                  <div>
                    <p className="font-bold text-slate-900">Dean of Studies (DOS)</p>
                    <p className="text-slate-500 text-[11px]">Academic Registrar Office</p>
                    <div className="mt-4 border-b border-dashed border-slate-400 w-44"></div>
                    <span className="text-[10px] text-slate-400 italic">Signature & Date</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">Principal / Headmaster</p>
                    <p className="text-slate-500 text-[11px]">École Agro-Vétérinaire de Kivumu</p>
                    <div className="mt-4 border-b border-dashed border-slate-400 w-44 ml-auto"></div>
                    <span className="text-[10px] text-slate-400 italic">Official School Stamp</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TARGET GPA SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="max-w-2xl mx-auto space-y-5 bg-white p-6 rounded-2xl border border-slate-200">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Academic Target GPA Simulator
                </h4>
                <p className="text-xs text-slate-500">
                  Calculate the final exam and practical project marks required to hit your academic goals
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Course:
                  </label>
                  <select
                    value={simTargetCourse}
                    onChange={(e) => setSimTargetCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.title} (Current CAT: {c.score}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Desired Term Cumulative GPA:</span>
                    <span className="font-mono text-emerald-700 text-sm">{simDesiredGpa.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="4.0"
                    step="0.05"
                    value={simDesiredGpa}
                    onChange={(e) => setSimDesiredGpa(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>3.00 (Credit)</span>
                    <span>3.50 (Honors)</span>
                    <span>4.00 (Max Distinction)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Target Recommendation for {simTargetCourse}:
                  </h5>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    To maintain a term GPA of <strong>{simDesiredGpa.toFixed(2)}</strong>, you must score at least{' '}
                    <strong className="font-mono text-sm underline">
                      {Math.max(75, Math.min(98, Math.round(simDesiredGpa * 23)))}%
                    </strong>{' '}
                    in your upcoming practical defense and final exam module for {simTargetCourse}.
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    💡 Tip: Practical labs contribute 60% of total marks in the TVET CBT framework. Consult{' '}
                    <strong>{profile.academicAdvisor}</strong> for one-on-one code review in Lab 1.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Modal Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            Platform Developer: <strong className="text-slate-900">Remmy | L5 SWD</strong> • Instagram: <strong className="text-amber-600">@K.eed__</strong> • Hotline: <strong className="text-emerald-700">0795547233</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
