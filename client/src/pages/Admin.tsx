import { useState } from "react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Shield, Activity, Settings } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <PermissionGate 
      role="admin"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need administrator privileges to access this page.
            </AlertDescription>
          </Alert>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, permissions, and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value="124"
            icon={<Users className="h-4 w-4" />}
            description="Active users in the system"
          />
          <StatsCard
            title="Admin Users"
            value="8"
            icon={<Shield className="h-4 w-4" />}
            description="Users with admin privileges"
          />
          <StatsCard
            title="Active Sessions"
            value="47"
            icon={<Activity className="h-4 w-4" />}
            description="Currently active user sessions"
          />
          <StatsCard
            title="Pending Invites"
            value="12"
            icon={<Settings className="h-4 w-4" />}
            description="Invitations awaiting response"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Configure role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RoleCard
                    role="Admin"
                    description="Full system access including user management"
                    permissions={["All permissions"]}
                    userCount={8}
                  />
                  <RoleCard
                    role="Member"
                    description="Standard user with read and write access"
                    permissions={["Read", "Write", "Create experiments"]}
                    userCount={98}
                  />
                  <RoleCard
                    role="Viewer"
                    description="Read-only access to all resources"
                    permissions={["Read only"]}
                    userCount={18}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Team Invitations</CardTitle>
                <CardDescription>
                  Manage pending invitations to your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Invitation management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>
                  Track all administrative actions and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Audit log interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGate>
  );
}

function StatsCard({ title, value, icon, description }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function RoleCard({ role, description, permissions, userCount }: {
  role: string;
  description: string;
  permissions: string[];
  userCount: number;
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{role}</h3>
        <span className="text-sm text-muted-foreground">{userCount} users</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {permissions.map((permission) => (
          <span
            key={permission}
            className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
          >
            {permission}
          </span>
        ))}
      </div>
    </div>
  );
}