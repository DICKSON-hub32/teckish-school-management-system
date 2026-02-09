import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  staffProfiles, 
  leaveRequests as initialLeaveRequests, 
  LeaveRequest,
  users 
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useToast } from '@/hooks/use-toast';

const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const { toast } = useToast();

  const staffProfile = staffProfiles.find(sp => sp.userId === user?.id);
  const myRequests = leaveRequests.filter(lr => lr.staffId === user?.id);

  const pendingCount = myRequests.filter(lr => lr.status === 'pending').length;
  const approvedCount = myRequests.filter(lr => lr.status === 'approved').length;
  const rejectedCount = myRequests.filter(lr => lr.status === 'rejected').length;

  const handleSubmit = () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      staffId: user?.id || '',
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsDialogOpen(false);
    setFormData({ startDate: '', endDate: '', reason: '' });
    toast({
      title: 'Leave Request Submitted',
      description: 'Your request has been sent for approval.',
    });
  };

  const statusConfig = {
    pending: { 
      icon: Clock, 
      label: 'Pending', 
      badgeClass: 'bg-warning text-warning-foreground' 
    },
    approved: { 
      icon: CheckCircle, 
      label: 'Approved', 
      badgeClass: 'bg-success text-success-foreground' 
    },
    rejected: { 
      icon: XCircle, 
      label: 'Rejected', 
      badgeClass: 'bg-destructive text-destructive-foreground' 
    },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Leave Requests</h1>
          <p className="text-muted-foreground">Manage your leave applications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="font-display">Apply for Leave</DialogTitle>
              <DialogDescription>Submit a leave request for approval.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly explain the reason for your leave..."
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} className="gap-2 gradient-primary">
                  <Send className="h-4 w-4" />
                  Submit Request
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={myRequests.length}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          variant="default"
        />
      </div>

      {/* Leave Requests List */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            My Leave Requests
          </CardTitle>
          <CardDescription>Your submitted leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No leave requests yet</p>
              <p className="text-sm text-muted-foreground">Click "New Request" to apply for leave</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                const startDate = new Date(request.startDate);
                const endDate = new Date(request.endDate);
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <div 
                    key={request.id} 
                    className="p-5 rounded-xl border bg-card transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          request.status === 'pending' ? 'bg-warning/10' :
                          request.status === 'approved' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          <StatusIcon className={`h-6 w-6 ${
                            request.status === 'pending' ? 'text-warning' :
                            request.status === 'approved' ? 'text-success' : 'text-destructive'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">
                              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                              {' - '}
                              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <Badge variant="outline">{days} day{days > 1 ? 's' : ''}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        </div>
                      </div>
                      <Badge className={statusConfig[request.status].badgeClass}>
                        {statusConfig[request.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                      <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeavePage;
