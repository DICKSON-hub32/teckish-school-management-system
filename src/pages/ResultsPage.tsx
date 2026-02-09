import React, { useState } from 'react';
import { students, examResults as initialResults, ExamResult, getStudentAverageGrade } from '@/data/mockData';
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
import { Plus, Award, Search, BookOpen, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useToast } from '@/hooks/use-toast';

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>(initialResults);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    maxScore: '100',
    examType: '',
    examDate: '',
  });
  const { toast } = useToast();

  const subjects = ['all', ...new Set(results.map(r => r.subject))];
  const examTypes = [...new Set(results.map(r => r.examType))];

  const filteredResults = results.filter(result => {
    const student = students.find(s => s.id === result.studentId);
    const matchesStudent = selectedStudent === 'all' || result.studentId === selectedStudent;
    const matchesSubject = selectedSubject === 'all' || result.subject === selectedSubject;
    const matchesSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStudent && matchesSubject && matchesSearch;
  });

  const averageScore = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / filteredResults.length)
    : 0;

  const topPerformers = students
    .map(s => ({ student: s, avg: getStudentAverageGrade(s.id) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3);

  const handleAddResult = () => {
    const newResult: ExamResult = {
      id: `exam-${Date.now()}`,
      studentId: formData.studentId,
      subject: formData.subject,
      score: parseInt(formData.score),
      maxScore: parseInt(formData.maxScore),
      examType: formData.examType,
      examDate: formData.examDate,
    };
    
    setResults([...results, newResult]);
    setIsAddDialogOpen(false);
    setFormData({
      studentId: '',
      subject: '',
      score: '',
      maxScore: '100',
      examType: '',
      examDate: '',
    });
    toast({
      title: 'Result Added',
      description: 'Exam result has been recorded.',
    });
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', variant: 'default' as const };
    if (percentage >= 80) return { grade: 'A', variant: 'default' as const };
    if (percentage >= 70) return { grade: 'B', variant: 'secondary' as const };
    if (percentage >= 60) return { grade: 'C', variant: 'secondary' as const };
    if (percentage >= 50) return { grade: 'D', variant: 'outline' as const };
    return { grade: 'F', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Exam Results</h1>
          <p className="text-muted-foreground">View and manage student examination results</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="font-display">Add Exam Result</DialogTitle>
              <DialogDescription>Record a new examination result.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Input
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    placeholder="e.g., Mid-Term"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Score</Label>
                  <Input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="85"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Score</Label>
                  <Input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddResult} className="gradient-primary">Add Result</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Exams"
          value={results.length}
          icon={BookOpen}
          variant="primary"
        />
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Subjects"
          value={subjects.length - 1}
          icon={BookOpen}
          variant="default"
        />
        <StatCard
          title="Top Score"
          value={`${Math.max(...results.map(r => Math.round((r.score / r.maxScore) * 100)))}%`}
          icon={Award}
          variant="secondary"
        />
      </div>

      {/* Top Performers */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {topPerformers.map((item, index) => (
              <div key={item.student.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-white ${
                  index === 0 ? 'gradient-secondary' : index === 1 ? 'bg-muted-foreground' : 'bg-secondary/50'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.student.name}</p>
                  <p className="text-sm text-muted-foreground">{item.student.grade}</p>
                </div>
                <Badge variant="default">{item.avg}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Table */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="font-display">All Results</CardTitle>
              <CardDescription>Complete examination records</CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => {
                const student = students.find(s => s.id === result.studentId);
                const percentage = Math.round((result.score / result.maxScore) * 100);
                const { grade, variant } = getGradeBadge(percentage);
                
                return (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-white text-xs font-bold">
                          {student?.avatar}
                        </div>
                        <span className="font-medium">{student?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{result.subject}</TableCell>
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
    </div>
  );
};

export default ResultsPage;
