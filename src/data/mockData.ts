// Mock Data for Teckish School Management System

export type UserRole = 'admin' | 'staff' | 'parent';

export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: UserRole;
  avatar?: string;
  childIds?: string[]; // For parents
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  parentId: string;
  avatar?: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export interface Attendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface ExamResult {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  maxScore: number;
  examDate: string;
  examType: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRoles: UserRole[];
  createdAt: string;
  createdBy: string;
  read: boolean;
}

export interface StaffProfile {
  userId: string;
  department: string;
  designation: string;
  joinDate: string;
  phone: string;
  schedule: { day: string; time: string; subject: string }[];
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Users
export const users: User[] = [
  {
    id: 'admin-1',
    email: 'admin@teckish.edu',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    avatar: 'SJ',
  },
  {
    id: 'staff-1',
    email: 'teacher1@teckish.edu',
    password: 'staff123',
    name: 'Mr. James Wilson',
    role: 'staff',
    avatar: 'JW',
  },
  {
    id: 'staff-2',
    email: 'teacher2@teckish.edu',
    password: 'staff123',
    name: 'Ms. Emily Davis',
    role: 'staff',
    avatar: 'ED',
  },
  {
    id: 'parent-1',
    email: 'parent1@gmail.com',
    password: 'parent123',
    name: 'Michael Brown',
    role: 'parent',
    avatar: 'MB',
    childIds: ['student-1', 'student-2'],
  },
  {
    id: 'parent-2',
    email: 'parent2@gmail.com',
    password: 'parent123',
    name: 'Linda Martinez',
    role: 'parent',
    avatar: 'LM',
    childIds: ['student-3'],
  },
];

// Students
export const students: Student[] = [
  {
    id: 'student-1',
    name: 'Alex Brown',
    rollNumber: 'TCK2024001',
    grade: '10-A',
    parentId: 'parent-1',
    avatar: 'AB',
    dateOfBirth: '2010-05-15',
    email: 'alex.b@teckish.edu',
    phone: '+1-555-0101',
  },
  {
    id: 'student-2',
    name: 'Sophie Brown',
    rollNumber: 'TCK2024002',
    grade: '8-B',
    parentId: 'parent-1',
    avatar: 'SB',
    dateOfBirth: '2012-08-22',
    email: 'sophie.b@teckish.edu',
    phone: '+1-555-0102',
  },
  {
    id: 'student-3',
    name: 'Carlos Martinez',
    rollNumber: 'TCK2024003',
    grade: '10-A',
    parentId: 'parent-2',
    avatar: 'CM',
    dateOfBirth: '2010-03-10',
    email: 'carlos.m@teckish.edu',
    phone: '+1-555-0103',
  },
  {
    id: 'student-4',
    name: 'Emma Thompson',
    rollNumber: 'TCK2024004',
    grade: '9-A',
    parentId: 'parent-3',
    avatar: 'ET',
    dateOfBirth: '2011-11-28',
    email: 'emma.t@teckish.edu',
    phone: '+1-555-0104',
  },
  {
    id: 'student-5',
    name: 'Ryan Chen',
    rollNumber: 'TCK2024005',
    grade: '10-B',
    parentId: 'parent-4',
    avatar: 'RC',
    dateOfBirth: '2010-01-05',
    email: 'ryan.c@teckish.edu',
    phone: '+1-555-0105',
  },
];

// Attendance Records (last 30 days for each student)
const generateAttendance = (): Attendance[] => {
  const records: Attendance[] = [];
  const statuses: ('present' | 'absent' | 'late')[] = ['present', 'present', 'present', 'present', 'absent', 'late'];
  
  students.forEach(student => {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        records.push({
          studentId: student.id,
          date: date.toISOString().split('T')[0],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
    }
  });
  
  return records;
};

export const attendanceRecords: Attendance[] = generateAttendance();

// Exam Results
export const examResults: ExamResult[] = [
  // Alex Brown
  { id: 'exam-1', studentId: 'student-1', subject: 'Mathematics', score: 85, maxScore: 100, examDate: '2024-01-15', examType: 'Mid-Term' },
  { id: 'exam-2', studentId: 'student-1', subject: 'English', score: 78, maxScore: 100, examDate: '2024-01-16', examType: 'Mid-Term' },
  { id: 'exam-3', studentId: 'student-1', subject: 'Science', score: 92, maxScore: 100, examDate: '2024-01-17', examType: 'Mid-Term' },
  { id: 'exam-4', studentId: 'student-1', subject: 'History', score: 88, maxScore: 100, examDate: '2024-01-18', examType: 'Mid-Term' },
  
  // Sophie Brown
  { id: 'exam-5', studentId: 'student-2', subject: 'Mathematics', score: 72, maxScore: 100, examDate: '2024-01-15', examType: 'Mid-Term' },
  { id: 'exam-6', studentId: 'student-2', subject: 'English', score: 88, maxScore: 100, examDate: '2024-01-16', examType: 'Mid-Term' },
  { id: 'exam-7', studentId: 'student-2', subject: 'Science', score: 76, maxScore: 100, examDate: '2024-01-17', examType: 'Mid-Term' },
  { id: 'exam-8', studentId: 'student-2', subject: 'Art', score: 95, maxScore: 100, examDate: '2024-01-18', examType: 'Mid-Term' },
  
  // Carlos Martinez
  { id: 'exam-9', studentId: 'student-3', subject: 'Mathematics', score: 90, maxScore: 100, examDate: '2024-01-15', examType: 'Mid-Term' },
  { id: 'exam-10', studentId: 'student-3', subject: 'English', score: 82, maxScore: 100, examDate: '2024-01-16', examType: 'Mid-Term' },
  { id: 'exam-11', studentId: 'student-3', subject: 'Science', score: 88, maxScore: 100, examDate: '2024-01-17', examType: 'Mid-Term' },
  { id: 'exam-12', studentId: 'student-3', subject: 'Spanish', score: 98, maxScore: 100, examDate: '2024-01-18', examType: 'Mid-Term' },
  
  // Emma Thompson
  { id: 'exam-13', studentId: 'student-4', subject: 'Mathematics', score: 78, maxScore: 100, examDate: '2024-01-15', examType: 'Mid-Term' },
  { id: 'exam-14', studentId: 'student-4', subject: 'English', score: 94, maxScore: 100, examDate: '2024-01-16', examType: 'Mid-Term' },
  { id: 'exam-15', studentId: 'student-4', subject: 'Science', score: 85, maxScore: 100, examDate: '2024-01-17', examType: 'Mid-Term' },
  { id: 'exam-16', studentId: 'student-4', subject: 'Music', score: 92, maxScore: 100, examDate: '2024-01-18', examType: 'Mid-Term' },
  
  // Ryan Chen
  { id: 'exam-17', studentId: 'student-5', subject: 'Mathematics', score: 96, maxScore: 100, examDate: '2024-01-15', examType: 'Mid-Term' },
  { id: 'exam-18', studentId: 'student-5', subject: 'English', score: 75, maxScore: 100, examDate: '2024-01-16', examType: 'Mid-Term' },
  { id: 'exam-19', studentId: 'student-5', subject: 'Science', score: 94, maxScore: 100, examDate: '2024-01-17', examType: 'Mid-Term' },
  { id: 'exam-20', studentId: 'student-5', subject: 'Computer Science', score: 99, maxScore: 100, examDate: '2024-01-18', examType: 'Mid-Term' },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'School Holiday Announcement',
    message: 'The school will be closed on February 15th for the annual sports day preparation. Classes will resume on February 17th.',
    targetRoles: ['admin', 'staff', 'parent'],
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'admin-1',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Staff Meeting Reminder',
    message: 'All staff members are requested to attend the quarterly review meeting on Friday at 3 PM in the conference room.',
    targetRoles: ['admin', 'staff'],
    createdAt: '2024-02-05T09:00:00Z',
    createdBy: 'admin-1',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Parent-Teacher Conference',
    message: 'The upcoming parent-teacher conference is scheduled for February 20th. Please book your slot through the school portal.',
    targetRoles: ['parent'],
    createdAt: '2024-02-03T14:00:00Z',
    createdBy: 'admin-1',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'New Curriculum Update',
    message: 'The updated curriculum for the spring semester has been published. Teachers please review and provide feedback by next week.',
    targetRoles: ['staff'],
    createdAt: '2024-02-04T11:00:00Z',
    createdBy: 'admin-1',
    read: true,
  },
];

// Staff Profiles
export const staffProfiles: StaffProfile[] = [
  {
    userId: 'staff-1',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    joinDate: '2018-08-15',
    phone: '+1-555-0201',
    schedule: [
      { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Math 10-A' },
      { day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Math 9-A' },
      { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Math 10-B' },
      { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Math 10-A' },
      { day: 'Thursday', time: '9:00 AM - 10:00 AM', subject: 'Math 8-B' },
      { day: 'Friday', time: '11:00 AM - 12:00 PM', subject: 'Math 9-A' },
    ],
  },
  {
    userId: 'staff-2',
    department: 'English',
    designation: 'Teacher',
    joinDate: '2020-01-10',
    phone: '+1-555-0202',
    schedule: [
      { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'English 10-A' },
      { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'English 8-B' },
      { day: 'Wednesday', time: '9:00 AM - 10:00 AM', subject: 'English 10-B' },
      { day: 'Thursday', time: '10:00 AM - 11:00 AM', subject: 'English 9-A' },
      { day: 'Friday', time: '9:00 AM - 10:00 AM', subject: 'English 10-A' },
    ],
  },
];

// Leave Requests
export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    staffId: 'staff-1',
    startDate: '2024-02-20',
    endDate: '2024-02-22',
    reason: 'Personal family event',
    status: 'pending',
    createdAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 'leave-2',
    staffId: 'staff-2',
    startDate: '2024-02-25',
    endDate: '2024-02-25',
    reason: 'Medical appointment',
    status: 'approved',
    createdAt: '2024-02-05T14:00:00Z',
  },
];

// Helper functions
export const getStudentAttendance = (studentId: string) => {
  const records = attendanceRecords.filter(r => r.studentId === studentId);
  const present = records.filter(r => r.status === 'present').length;
  const total = records.length;
  return {
    present,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    total,
    percentage: total > 0 ? Math.round((present / total) * 100) : 0,
  };
};

export const getStudentGrades = (studentId: string) => {
  return examResults.filter(r => r.studentId === studentId);
};

export const getStudentAverageGrade = (studentId: string) => {
  const grades = getStudentGrades(studentId);
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
  return Math.round(total / grades.length);
};

export const getUserNotifications = (role: UserRole) => {
  return notifications.filter(n => n.targetRoles.includes(role));
};

export const getChildrenForParent = (parentId: string) => {
  const parent = users.find(u => u.id === parentId);
  if (!parent?.childIds) return [];
  return students.filter(s => parent.childIds?.includes(s.id));
};
