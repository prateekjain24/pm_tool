import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApiClient } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Mail, UserX, RefreshCw, Loader2, Clock } from "lucide-react";
import type { User } from "@shared/types";

interface Invitation {
  id: string;
  email: string;
  role: User["role"];
  status: "pending" | "accepted" | "expired" | "revoked";
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

interface InvitationsListProps {
  refreshTrigger?: number;
}

export function InvitationsList({ refreshTrigger }: InvitationsListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const api = useApiClient();

  const fetchInvitations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getInvitations();
      setInvitations(data.invitations as any[]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [refreshTrigger]);

  const handleRevoke = async (invitationId: string) => {
    setActionLoading(invitationId);
    
    try {
      await api.revokeInvitation(invitationId);
      
      // Update local state
      setInvitations(invitations.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: "revoked" as const }
          : inv
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to revoke invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResend = async (invitationId: string) => {
    setActionLoading(invitationId);
    
    try {
      await api.resendInvitation(invitationId);
      
      // Show success message
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend invitation");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const pendingInvitations = invitations.filter(inv => inv.status === "pending");
  const otherInvitations = invitations.filter(inv => inv.status !== "pending");

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Invitations that haven't been accepted yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending invitations</p>
          ) : (
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onRevoke={handleRevoke}
                  onResend={handleResend}
                  isLoading={actionLoading === invitation.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Invitations */}
      {otherInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invitation History</CardTitle>
            <CardDescription>
              Previously sent invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {otherInvitations.map((invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onRevoke={handleRevoke}
                  onResend={handleResend}
                  isLoading={actionLoading === invitation.id}
                  isHistory
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InvitationItem({ 
  invitation, 
  onRevoke, 
  onResend, 
  isLoading,
  isHistory = false 
}: {
  invitation: Invitation;
  onRevoke: (id: string) => void;
  onResend: (id: string) => void;
  isLoading: boolean;
  isHistory?: boolean;
}) {
  const isExpired = new Date(invitation.expiresAt) < new Date();
  
  const getStatusBadge = () => {
    switch (invitation.status) {
      case "pending":
        return isExpired ? (
          <Badge variant="destructive">Expired</Badge>
        ) : (
          <Badge variant="secondary">Pending</Badge>
        );
      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "revoked":
        return <Badge variant="outline">Revoked</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = () => {
    const roleColors = {
      admin: "bg-purple-100 text-purple-800",
      member: "bg-blue-100 text-blue-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${roleColors[invitation.role]}`}>
        {invitation.role}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{invitation.email}</span>
          {getRoleBadge()}
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Invited by {invitation.invitedBy.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}</span>
          
          {invitation.status === "pending" && !isExpired && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
              </span>
            </>
          )}
          
          {invitation.acceptedAt && (
            <>
              <span>•</span>
              <span>Accepted {formatDistanceToNow(new Date(invitation.acceptedAt), { addSuffix: true })}</span>
            </>
          )}
        </div>
      </div>

      {!isHistory && invitation.status === "pending" && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onResend(invitation.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRevoke(invitation.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserX className="h-4 w-4 mr-1" />
                Revoke
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}