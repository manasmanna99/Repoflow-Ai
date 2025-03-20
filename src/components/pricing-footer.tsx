"use client";

import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "50 free credits",
      "Basic repository analysis",
      "Community support",
      "Standard response time",
    ],
    cta: "Get Started",
    href: "/sign-up",
  },
  {
    name: "Pro",
    price: "9",
    description: "For professional developers",
    features: [
      "500 credits/month",
      "Advanced repository analysis",
      "Priority support",
      "Faster response time",
      "Custom integrations",
      "API access",
    ],
    cta: "Upgrade to Pro",
    href: "/pricing",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited credits",
      "Custom AI models",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Advanced analytics",
      "Team management",
      "SSO support",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export function PricingFooter() {
  return (
    <div className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Get started with our free plan or upgrade to unlock more features and
            credits.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-border xl:p-10",
                tier.popular && "ring-2 ring-primary"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={cn(
                      "text-lg font-semibold leading-8",
                      tier.popular ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.popular && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">
                      /month
                    </span>
                  )}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-6 w-5 flex-none text-primary"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className={cn(
                  "mt-8 w-full",
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
                asChild
              >
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 