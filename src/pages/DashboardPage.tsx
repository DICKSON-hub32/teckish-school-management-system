import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Bell, 
  TrendingUp,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  students, 
  notifications, 
  attendanceRecords, 
  getStudentAverageGrade,
  getChildrenForParent,
  getStudentAttendance,
  getStudentGrades,
  getUserNotifications,
  staffProfiles,
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard: React.FC = () => {
  const totalStudents = students.length;
  const totalStaff = staffProfiles.length;
  const averageAttendance = Math.round(
    students.reduce((sum, s) => sum + getStudentAttendance(s.id).percentage, 0) / students.length
  );
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Mock attendance trend data
  const attendanceTrend = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 95 },
    { day: 'Thu', attendance: 91 },
    { day: 'Fri', attendance: 87 },
  ];

  // Grade distribution
  const gradeDistribution = [
    { grade: 'A', count: 12 },
    { grade: 'B', count: 18 },
    { grade: 'C', count: 8 },
    { grade: 'D', count: 3 },
    { grade: 'F', count: 1 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at Teckish.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Active enrollments"
          icon={GraduationCap}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Staff Members"
          value={totalStaff}
          subtitle="Teachers & admins"
          icon={Users}
          variant="secondary"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${averageAttendance}%`}
          subtitle="This month"
          icon={Calendar}
          variant="success"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Notifications"
          value={unreadNotifications}
          subtitle="Unread messages"
          icon={Bell}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Attendance Trend
            </CardTitle>
            <CardDescription>Average attendance percentage this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fill="url(#attendanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Award className="h-5 w-5 text-secondary" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Student performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Clock className="h-5 w-5 text-accent" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="default" className="text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const staffNotifications = getUserNotifications('staff');
  const averageAttendance = Math.round(
    students.reduce((sum, s) => sum + getStudentAttendance(s.id).percentage, 0) / students.length
  );
  const staffProfile = staffProfiles.find(sp => sp.userId === user?.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Staff Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Students"
          value={students.length}
          subtitle="In your classes"
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${averageAttendance}%`}
          subtitle="This month"
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Notifications"
          value={staffNotifications.filter(n => !n.read).length}
          subtitle="Unread messages"
          icon={Bell}
          variant="default"
        />
      </div>

      {/* Schedule */}
      {staffProfile && (
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <BookOpen className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffProfile.schedule.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.day} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const children = user ? getChildrenForParent(user.id) : [];
  const parentNotifications = getUserNotifications('parent');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Parent Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}! Track your children's progress.</p>
      </div>

      {/* Children Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {children.map((child) => {
          const attendance = getStudentAttendance(child.id);
          const avgGrade = getStudentAverageGrade(child.id);
          
          return (
            <Card key={child.id} className="border-0 shadow-card overflow-hidden">
              <div className="gradient-primary p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white">
                    {child.avatar}
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold font-display">{child.name}</h3>
                    <p className="text-white/80">Grade {child.grade} • {child.rollNumber}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-success/10">
                    <p className="text-3xl font-bold text-success">{attendance.percentage}%</p>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-primary/10">
                    <p className="text-3xl font-bold text-primary">{avgGrade}%</p>
                    <p className="text-sm text-muted-foreground">Avg. Grade</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Announcements */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Bell className="h-5 w-5 text-primary" />
            School Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parentNotifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read && (
                    <Badge>New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default DashboardPage;
