import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { useApiClient } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Mail, UserPlus, Clock, AlertCircle } from "lucide-react";

interface InvitationDetails {
  email: string;
  role: string;
  workspaceName: string;
  expiresAt: string;
}

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const api = useApiClient();
  
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setIsLoading(false);
      return;
    }

    verifyInvitation();
  }, [token]);

  const verifyInvitation = async () => {
    try {
      const data = await api.getInvitationByToken(token);
      setInvitation(data as InvitationDetails);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid or expired invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!token) return;
    
    setIsAccepting(true);
    setError(null);

    try {
      // If not signed in, redirect to sign in with the invitation token
      if (!isSignedIn) {
        // Store the token in session storage to use after sign in
        sessionStorage.setItem("pendingInvitation", token);
        
        // Redirect to sign in
        await signIn?.create({
          strategy: "oauth_google", // or whatever strategy you're using
          redirectUrl: `/invitation/accept?token=${token}`,
        });
        return;
      }

      // Accept the invitation
      const response = await api.acceptInvitation({ token });
      const typedResponse = response as { redirectUrl: string };

      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(typedResponse.redirectUrl || "/dashboard");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to accept invitation");
      setIsAccepting(false);
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate("/")} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>Invitation Accepted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Welcome to {invitation?.workspaceName}! Redirecting you to the dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            You've been invited to join {invitation?.workspaceName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {invitation && (
            <>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{invitation.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="secondary">{invitation.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expires</span>
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(invitation.expiresAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {!isSignedIn && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You'll need to sign in or create an account to accept this invitation.
                    Make sure to use the email address {invitation.email}.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  size="lg"
                  className="w-full"
                >
                  {isAccepting ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isSignedIn ? "Accept Invitation" : "Sign In to Accept"}
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Decline
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By accepting this invitation, you agree to join {invitation.workspaceName} 
                with the role of {invitation.role}.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}