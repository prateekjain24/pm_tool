import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold">PM Tools</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Start improving your experiments in minutes
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
          signInUrl="/sign-in"
          afterSignUpUrl="/onboarding"
        />
      </div>
    </div>
  );
}