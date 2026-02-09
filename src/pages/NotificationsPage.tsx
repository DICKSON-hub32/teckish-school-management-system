import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  notifications as initialNotifications, 
  Notification, 
  UserRole 
} from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bell, Plus, Send, Users, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useToast } from '@/hooks/use-toast';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRoles: [] as UserRole[],
  });
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';
  
  const userNotifications = notifications.filter(n => 
    n.targetRoles.includes(user?.role || 'parent')
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const handleCreateNotification = () => {
    if (!formData.title || !formData.message || formData.targetRoles.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields and select at least one recipient group.',
        variant: 'destructive',
      });
      return;
    }

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      targetRoles: formData.targetRoles,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'admin-1',
      read: false,
    };

    setNotifications([newNotification, ...notifications]);
    setIsCreateDialogOpen(false);
    setFormData({ title: '', message: '', targetRoles: [] });
    toast({
      title: 'Notification Sent',
      description: `Your notification has been sent to ${formData.targetRoles.join(', ')}.`,
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => 
      userNotifications.some(un => un.id === n.id) ? { ...n, read: true } : n
    ));
    toast({
      title: 'All Read',
      description: 'All notifications marked as read.',
    });
  };

  const roleConfig: Record<UserRole, { label: string; color: string }> = {
    admin: { label: 'Administrators', color: 'bg-primary text-primary-foreground' },
    staff: { label: 'Staff Members', color: 'bg-secondary text-secondary-foreground' },
    parent: { label: 'Parents', color: 'bg-accent text-accent-foreground' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important announcements</p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {isAdmin && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 gradient-primary">
                  <Plus className="h-4 w-4" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-display">Create Notification</DialogTitle>
                  <DialogDescription>Send an announcement to specific user groups.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Notification title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Send to</Label>
                    <div className="flex flex-wrap gap-4">
                      {(['admin', 'staff', 'parent'] as UserRole[]).map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={formData.targetRoles.includes(role)}
                            onCheckedChange={() => handleRoleToggle(role)}
                          />
                          <label htmlFor={role} className="text-sm font-medium cursor-pointer">
                            {roleConfig[role].label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateNotification} className="gap-2 gradient-primary">
                      <Send className="h-4 w-4" />
                      Send Notification
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Notifications"
          value={userNotifications.length}
          icon={Bell}
          variant="primary"
        />
        <StatCard
          title="Unread"
          value={unreadCount}
          icon={Clock}
          variant={unreadCount > 0 ? 'secondary' : 'default'}
        />
        <StatCard
          title="Read"
          value={userNotifications.length - unreadCount}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Notifications List */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Notifications
          </CardTitle>
          <CardDescription>
            {isAdmin ? 'All notifications sent by administrators' : 'Notifications for your role'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    notification.read 
                      ? 'bg-muted/30 border-border/50' 
                      : 'bg-primary/5 border-primary/20 hover:border-primary/40'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      notification.read ? 'bg-muted' : 'gradient-primary'
                    }`}>
                      <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="gradient-secondary border-0">New</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-1">
                          {notification.targetRoles.map(role => (
                            <Badge key={role} variant="outline" className="text-xs capitalize">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
