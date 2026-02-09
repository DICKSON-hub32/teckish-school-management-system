import React from 'react';
import { staffProfiles, users, leaveRequests } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  UserCircle, 
  Mail, 
  Phone, 
  Calendar, 
  Building,
  Clock
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

const StaffPage: React.FC = () => {
  const staffMembers = users.filter(u => u.role === 'staff');
  const pendingLeaves = leaveRequests.filter(lr => lr.status === 'pending').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Staff Management</h1>
        <p className="text-muted-foreground">View and manage staff members</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Staff"
          value={staffMembers.length}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Departments"
          value={new Set(staffProfiles.map(sp => sp.department)).size}
          icon={Building}
          variant="default"
        />
        <StatCard
          title="Pending Leave Requests"
          value={pendingLeaves}
          icon={Clock}
          variant={pendingLeaves > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Staff Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {staffMembers.map((staff) => {
          const profile = staffProfiles.find(sp => sp.userId === staff.id);
          const staffLeaves = leaveRequests.filter(lr => lr.staffId === staff.id);
          
          return (
            <Card key={staff.id} className="border-0 shadow-card overflow-hidden">
              <div className="gradient-primary p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white">
                    {staff.avatar}
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold font-display">{staff.name}</h3>
                    <p className="text-white/80">{profile?.designation || 'Staff'}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Schedule Preview */}
                {profile && profile.schedule.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Today's Schedule</p>
                    <div className="space-y-2">
                      {profile.schedule.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                          <span className="text-muted-foreground">{item.time}</span>
                          <Badge variant="outline">{item.subject}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leave Status */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Leave Requests</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {staffLeaves.filter(l => l.status === 'pending').length} pending
                    </Badge>
                    <Badge variant="secondary">
                      {staffLeaves.filter(l => l.status === 'approved').length} approved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leave Requests Table */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pending Leave Requests
          </CardTitle>
          <CardDescription>Review and manage staff leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          {leaveRequests.filter(lr => lr.status === 'pending').length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No pending leave requests</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.filter(lr => lr.status === 'pending').map((request) => {
                  const staff = users.find(u => u.id === request.staffId);
                  const startDate = new Date(request.startDate);
                  const endDate = new Date(request.endDate);
                  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-white text-xs font-bold">
                            {staff?.avatar}
                          </div>
                          <span className="font-medium">{staff?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{days} day{days > 1 ? 's' : ''}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                      <TableCell>
                        <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPage;
