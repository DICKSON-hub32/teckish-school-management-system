import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getChildrenForParent, 
  getStudentAttendance, 
  getStudentGrades,
  getUserNotifications 
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Bell
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

const MyChildrenPage: React.FC = () => {
  const { user } = useAuth();
  const children = user ? getChildrenForParent(user.id) : [];
  const announcements = getUserNotifications('parent').slice(0, 3);

  if (children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold font-display mb-2">No Children Found</h2>
        <p className="text-muted-foreground">No students are linked to your account.</p>
      </div>
    );
  }

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', variant: 'default' as const };
    if (percentage >= 80) return { grade: 'A', variant: 'default' as const };
    if (percentage >= 70) return { grade: 'B', variant: 'secondary' as const };
    if (percentage >= 60) return { grade: 'C', variant: 'secondary' as const };
    return { grade: 'D', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">My Children</h1>
        <p className="text-muted-foreground">Track your children's academic progress and attendance</p>
      </div>

      <Tabs defaultValue={children[0]?.id} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          {children.map((child) => (
            <TabsTrigger 
              key={child.id} 
              value={child.id}
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-white"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              {child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map((child) => {
          const attendance = getStudentAttendance(child.id);
          const grades = getStudentGrades(child.id);
          const avgGrade = grades.length > 0 
            ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)
            : 0;

          return (
            <TabsContent key={child.id} value={child.id} className="space-y-6">
              {/* Child Profile */}
              <Card className="border-0 shadow-card overflow-hidden">
                <div className="gradient-primary p-8">
                  <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
                      {child.avatar}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold font-display">{child.name}</h2>
                      <p className="text-white/80 mb-1">Roll Number: {child.rollNumber}</p>
                      <Badge className="bg-white/20 text-white border-0">Grade {child.grade}</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid gap-6 md:grid-cols-4">
                <StatCard
                  title="Attendance"
                  value={`${attendance.percentage}%`}
                  subtitle={`${attendance.present} present days`}
                  icon={Calendar}
                  variant="success"
                />
                <StatCard
                  title="Average Grade"
                  value={`${avgGrade}%`}
                  subtitle={getGradeBadge(avgGrade).grade + ' Grade'}
                  icon={Award}
                  variant="primary"
                />
                <StatCard
                  title="Days Present"
                  value={attendance.present}
                  subtitle={`${attendance.late} late arrivals`}
                  icon={CheckCircle}
                  variant="default"
                />
                <StatCard
                  title="Days Absent"
                  value={attendance.absent}
                  icon={XCircle}
                  variant="default"
                />
              </div>

              {/* Grades Table */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Exam Results
                  </CardTitle>
                  <CardDescription>Recent examination performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Exam Type</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((result) => {
                        const percentage = Math.round((result.score / result.maxScore) * 100);
                        const { grade, variant } = getGradeBadge(percentage);
                        
                        return (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.subject}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{result.examType}</Badge>
                            </TableCell>
                            <TableCell className="font-mono">{result.score}/{result.maxScore}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${percentage >= 60 ? 'gradient-success' : 'bg-destructive'}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm">{percentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={variant}>{grade}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(result.examDate).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Attendance Summary */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-success/10">
                      <CheckCircle className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-2xl font-bold">{attendance.present}</p>
                        <p className="text-sm text-muted-foreground">Days Present</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-warning/10">
                      <Clock className="h-8 w-8 text-warning" />
                      <div>
                        <p className="text-2xl font-bold">{attendance.late}</p>
                        <p className="text-sm text-muted-foreground">Late Arrivals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10">
                      <XCircle className="h-8 w-8 text-destructive" />
                      <div>
                        <p className="text-2xl font-bold">{attendance.absent}</p>
                        <p className="text-sm text-muted-foreground">Days Absent</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Announcements */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  {!announcement.read && <Badge>New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{announcement.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyChildrenPage;
