import React, { useState } from 'react';
import { 
  students as initialStudents, 
  Student, 
  getStudentAttendance, 
  getStudentAverageGrade 
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  GraduationCap,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useToast } from '@/hooks/use-toast';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    grade: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const { toast } = useToast();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + getStudentAttendance(s.id).percentage, 0) / students.length
  );
  
  const avgGrade = Math.round(
    students.reduce((sum, s) => sum + getStudentAverageGrade(s.id), 0) / students.length
  );

  const resetForm = () => {
    setFormData({
      name: '',
      rollNumber: '',
      grade: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    });
  };

  const handleAdd = () => {
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: formData.name,
      rollNumber: formData.rollNumber,
      grade: formData.grade,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      parentId: 'parent-1',
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    
    setStudents([...students, newStudent]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: 'Student Added',
      description: `${newStudent.name} has been added successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedStudent) return;
    
    const updatedStudents = students.map(s => 
      s.id === selectedStudent.id 
        ? { 
            ...s, 
            ...formData,
            avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          } 
        : s
    );
    
    setStudents(updatedStudents);
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
    resetForm();
    toast({
      title: 'Student Updated',
      description: 'Student information has been updated.',
    });
  };

  const handleDelete = (student: Student) => {
    setStudents(students.filter(s => s.id !== student.id));
    toast({
      title: 'Student Removed',
      description: `${student.name} has been removed.`,
      variant: 'destructive',
    });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      grade: student.grade,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
    });
    setIsEditDialogOpen(true);
  };

  const StudentForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            placeholder="TCK2024XXX"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            placeholder="e.g., 10-A"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="student@teckish.edu"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1-555-XXXX"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="gradient-primary">
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Student</DialogTitle>
              <DialogDescription>Enter the student's information below.</DialogDescription>
            </DialogHeader>
            <StudentForm onSubmit={handleAdd} submitLabel="Add Student" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          title="Classes"
          value={new Set(students.map(s => s.grade)).size}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${avgAttendance}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Avg. Grade"
          value={`${avgGrade}%`}
          icon={Award}
          variant="secondary"
        />
      </div>

      {/* Search and Table */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">Student Records</CardTitle>
              <CardDescription>A list of all enrolled students</CardDescription>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const attendance = getStudentAttendance(student.id);
                const avgScore = getStudentAverageGrade(student.id);
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-white text-sm font-bold">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{student.rollNumber}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full gradient-success rounded-full"
                            style={{ width: `${attendance.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{attendance.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'destructive'}
                      >
                        {avgScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(student)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Student</DialogTitle>
            <DialogDescription>Update the student's information.</DialogDescription>
          </DialogHeader>
          <StudentForm onSubmit={handleEdit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
