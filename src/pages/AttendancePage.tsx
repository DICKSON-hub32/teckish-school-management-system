import React, { useState } from 'react';
import { students, attendanceRecords, Attendance, getStudentAttendance } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, CheckCircle, XCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useToast } from '@/hooks/use-toast';

const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [attendance, setAttendance] = useState<Attendance[]>(attendanceRecords);
  const { toast } = useToast();

  const grades = ['all', ...new Set(students.map(s => s.grade))];

  const filteredStudents = selectedGrade === 'all' 
    ? students 
    : students.filter(s => s.grade === selectedGrade);

  const getAttendanceForDate = (studentId: string, date: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === date);
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === studentId && a.date === selectedDate
    );

    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], status };
      setAttendance(updated);
    } else {
      setAttendance([...attendance, { studentId, date: selectedDate, status }]);
    }

    toast({
      title: 'Attendance Updated',
      description: `Marked as ${status}`,
    });
  };

  const todayStats = {
    present: filteredStudents.filter(s => getAttendanceForDate(s.id, selectedDate)?.status === 'present').length,
    absent: filteredStudents.filter(s => getAttendanceForDate(s.id, selectedDate)?.status === 'absent').length,
    late: filteredStudents.filter(s => getAttendanceForDate(s.id, selectedDate)?.status === 'late').length,
  };

  const totalMarked = todayStats.present + todayStats.absent + todayStats.late;
  const attendanceRate = totalMarked > 0 ? Math.round((todayStats.present / totalMarked) * 100) : 0;

  const statusConfig = {
    present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', badge: 'bg-success text-success-foreground' },
    absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', badge: 'bg-destructive text-destructive-foreground' },
    late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', badge: 'bg-warning text-warning-foreground' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Attendance</h1>
        <p className="text-muted-foreground">Track and manage student attendance records</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-border bg-card"
          />
        </div>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map(grade => (
              <SelectItem key={grade} value={grade}>
                {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Present"
          value={todayStats.present}
          subtitle={`${attendanceRate}% attendance`}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Absent"
          value={todayStats.absent}
          icon={XCircle}
          variant="default"
        />
        <StatCard
          title="Late"
          value={todayStats.late}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Total Students"
          value={filteredStudents.length}
          icon={Users}
          variant="primary"
        />
      </div>

      {/* Attendance Table */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
          <CardDescription>Mark attendance for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Overall Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Mark Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const dayAttendance = getAttendanceForDate(student.id, selectedDate);
                const overallAttendance = getStudentAttendance(student.id);
                const currentStatus = dayAttendance?.status;
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-white text-sm font-bold">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full gradient-success rounded-full"
                            style={{ width: `${overallAttendance.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{overallAttendance.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {currentStatus ? (
                        <Badge className={statusConfig[currentStatus].badge}>
                          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not marked</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant={currentStatus === 'present' ? 'default' : 'outline'}
                          size="sm"
                          className={currentStatus === 'present' ? 'gradient-success border-0' : ''}
                          onClick={() => markAttendance(student.id, 'present')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={currentStatus === 'late' ? 'default' : 'outline'}
                          size="sm"
                          className={currentStatus === 'late' ? 'bg-warning text-warning-foreground border-0' : ''}
                          onClick={() => markAttendance(student.id, 'late')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={currentStatus === 'absent' ? 'default' : 'outline'}
                          size="sm"
                          className={currentStatus === 'absent' ? 'bg-destructive text-destructive-foreground border-0' : ''}
                          onClick={() => markAttendance(student.id, 'absent')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
