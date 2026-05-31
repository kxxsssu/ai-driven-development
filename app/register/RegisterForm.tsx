"use client";

import { SignUp } from "@clerk/nextjs";

export function RegisterForm() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-2 shadow-2xl">
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none",
            card: "bg-transparent shadow-none border-0 p-6 gap-4",
            headerTitle: "text-foreground text-xl font-semibold",
            headerSubtitle: "text-muted-foreground text-sm",
            socialButtonsBlockButton:
              "h-12 border-border bg-background text-foreground hover:bg-accent",
            socialButtonsBlockButtonText: "text-sm font-medium",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground text-xs",
            formFieldLabel: "text-foreground text-sm font-medium",
            formFieldInput:
              "h-12 border-border bg-background text-foreground focus:ring-primary",
            formButtonPrimary:
              "h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium",
            footerActionLink: "text-primary hover:text-primary/90 font-medium",
            footerActionText: "text-muted-foreground text-sm",
            identityPreviewText: "text-foreground",
            formFieldInputShowPasswordButton: "text-muted-foreground",
            alertText: "text-sm",
          },
          variables: {
            colorPrimary: "hsl(252 100% 68%)",
            colorBackground: "hsl(220 13% 12%)",
            colorInputBackground: "hsl(220 14% 7%)",
            colorInputText: "hsl(0 0% 98%)",
            colorText: "hsl(0 0% 98%)",
            colorTextSecondary: "hsl(220 10% 60%)",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
}
