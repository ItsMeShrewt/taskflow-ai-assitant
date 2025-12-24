import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/index.d';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Shield, UserCog, User as UserIcon, Mail, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { alert } from '@/hooks/use-alert';
import { SharedData } from '@/types/index.d';
import { format } from 'date-fns';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';

interface UsersPageProps extends SharedData {
  users: User[];
}

export default function UsersIndex() {
  const { users: initialUsers, auth } = usePage<UsersPageProps>().props;
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const pageSize = 10;

  // Pagination
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Update local state when props change
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Smart auto-refresh: only reload when users list actually changes
  useAutoRefresh({
    endpoint: '/api/check-updates/users',
    onlyProps: ['users'],
    checkInterval: 2000, // Check every 2 seconds for faster updates
  });

  const getRoleBadge = (role: string | null) => {
    if (!role) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <UserIcon className="w-3 h-3 mr-1" />
          No Role Assigned
        </Badge>
      );
    }
    
    switch (role) {
      case 'superadmin':
      case 'project_manager':
        return (
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
            <Shield className="w-3 h-3 mr-1" />
            Project Manager
          </Badge>
        );
      case 'frontend_developer':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <UserIcon className="w-3 h-3 mr-1" />
            Frontend Developer
          </Badge>
        );
      case 'backend_developer':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <UserIcon className="w-3 h-3 mr-1" />
            Backend Developer
          </Badge>
        );
      case 'technical_writer':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            <UserIcon className="w-3 h-3 mr-1" />
            Technical Writer
          </Badge>
        );
      case 'system_analyst':
        return (
          <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
            <UserIcon className="w-3 h-3 mr-1" />
            System Analyst
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <UserIcon className="w-3 h-3 mr-1" />
            No Role Assigned
          </Badge>
        );
    }
  };

  const getRoleLabel = (role: string | null) => {
    if (!role) return 'No Role Assigned';
    
    switch (role) {
      case 'project_manager':
        return 'Project Manager';
      case 'frontend_developer':
        return 'Frontend Developer';
      case 'backend_developer':
        return 'Backend Developer';
      case 'technical_writer':
        return 'Technical Writer';
      case 'system_analyst':
        return 'System Analyst';
      default:
        return 'No Role Assigned';
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setLoading(userId);
    try {
      const response = await axios.patch(`/api/users/${userId}/role`, {
        role: newRole
      });
      
      alert.success('Role updated successfully!');
      
      // Force immediate reload to show the change
      router.reload({ only: ['users'] });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update role';
      alert.error(message);
    } finally {
      setLoading(null);
    }
  };

  const canManage = auth.user.role === 'superadmin' || auth.user.role === 'project_manager';

  const copyTeamCode = () => {
    if (auth.user.team?.code) {
      navigator.clipboard.writeText(auth.user.team.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      alert.success('Team code copied to clipboard!');
    }
  };

  if (!canManage) {
    return (
      <AppLayout
        breadcrumbs={[
          { title: 'Dashboard', href: '/' },
          { title: 'Team Members', href: '/users' }
        ]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Unauthorized Access</p>
            <p className="text-sm text-muted-foreground mt-2">Only project managers can access team management.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const projectManagers = users.filter(u => u.role === 'superadmin' || u.role === 'project_manager');
  const teamMembers = users.filter(u => 
    u.role === 'frontend_developer' || 
    u.role === 'backend_developer' || 
    u.role === 'technical_writer' || 
    u.role === 'system_analyst' ||
    u.role === null
  );

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Team Members', href: '/users' }
      ]}
    >
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">
              Manage team members and assign roles
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        {/* Team Code Card - Only for Project Managers */}
        {auth.user.team?.code && (
          <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                🔑 Team Join Code
              </CardTitle>
              <CardDescription>
                Share this code with team members to join your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border-2 border-green-300 dark:border-green-700 px-4 py-3">
                  <code className="text-2xl font-mono font-bold text-green-700 dark:text-green-400 tracking-wider">
                    {auth.user.team.code}
                  </code>
                </div>
                <Button
                  onClick={copyTeamCode}
                  variant="outline"
                  size="lg"
                  className="border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/30"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-5 h-5 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Team members need this code to request joining your team
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Project Managers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectManagers.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Can create and assign tasks
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-600" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Assigned to complete tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Table */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>All Team Members</CardTitle>
            <CardDescription>
              Manage roles and permissions for your team
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold py-4">Member</TableHead>
                  <TableHead className="font-semibold py-4">Contact</TableHead>
                  <TableHead className="font-semibold py-4">Role</TableHead>
                  <TableHead className="font-semibold py-4">Joined</TableHead>
                  <TableHead className="text-right font-semibold py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No team members found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.id === auth.user.id && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                                <CheckCircle className="h-3 w-3" />
                                You
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        {user.id !== auth.user.id ? (
                          user.role === 'project_manager' || user.role === 'superadmin' ? (
                            <Badge variant="outline" className="border-blue-600 text-blue-600 ml-auto">
                              <Shield className="w-3 h-3 mr-1" />
                              Project Manager
                            </Badge>
                          ) : (
                            <Select
                              value={user.role || undefined}
                              onValueChange={(value) => handleRoleChange(user.id, value)}
                              disabled={loading === user.id}
                            >
                              <SelectTrigger className="w-[200px] ml-auto">
                                <span className="text-xs truncate">{getRoleLabel(user.role)}</span>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="frontend_developer">
                                  <div className="flex items-center gap-2 py-1">
                                    <UserIcon className="w-4 h-4 text-purple-600" />
                                    <div className="font-medium">Frontend Developer</div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="backend_developer">
                                  <div className="flex items-center gap-2 py-1">
                                    <UserIcon className="w-4 h-4 text-green-600" />
                                    <div className="font-medium">Backend Developer</div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="technical_writer">
                                  <div className="flex items-center gap-2 py-1">
                                    <UserIcon className="w-4 h-4 text-orange-600" />
                                    <div className="font-medium">Technical Writer</div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="system_analyst">
                                  <div className="flex items-center gap-2 py-1">
                                    <UserIcon className="w-4 h-4 text-cyan-600" />
                                    <div className="font-medium">System Analyst</div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )
                        ) : (
                          <Badge variant="outline" className="border-blue-600 text-blue-600">
                            Current User
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {users.length > pageSize && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {currentPage * pageSize + 1} to{' '}
                  {Math.min((currentPage + 1) * pageSize, users.length)} of{' '}
                  {users.length} members
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex gap-4">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-sm">Role Permissions</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Project Managers</strong> can create tasks, assign them to team members, and manage all tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600 font-bold">•</span>
                    <span><strong>Developers and Specialists</strong> (Frontend, Backend, Technical Writer, System Analyst) can only view and update tasks assigned to them</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
