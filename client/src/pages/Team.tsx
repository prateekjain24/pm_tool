import { useState } from "react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { InviteTeamModal } from "@/components/team/InviteTeamModal";
import { InvitationsList } from "@/components/team/InvitationsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Shield } from "lucide-react";

export default function Team() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInviteSuccess = () => {
    // Trigger a refresh of the invitations list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and invitations
          </p>
        </div>
        
        <PermissionGate permission="manage_team" resource="invitation">
          <InviteTeamModal onInviteSuccess={handleInviteSuccess} />
        </PermissionGate>
      </div>

      <PermissionGate
        permission="manage_team"
        resource="team"
        fallback={
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You don't have permission to manage team members. Contact your admin for access.
            </AlertDescription>
          </Alert>
        }
      >
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Active members in your workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamMembersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationsList refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </PermissionGate>
    </div>
  );
}

function TeamMembersList() {
  // TODO: Implement actual team members list
  // This would fetch from /api/user endpoint with workspace filter
  
  const mockMembers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      joinedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "member",
      joinedAt: new Date("2024-02-20"),
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "viewer",
      joinedAt: new Date("2024-03-10"),
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      member: "bg-blue-100 text-blue-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  return (
    <div className="space-y-4">
      {mockMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
              {member.role}
            </span>
            <span className="text-sm text-muted-foreground">
              Joined {member.joinedAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}