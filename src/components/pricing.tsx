"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    href: "/sign-up",
    price: { monthly: "$0" },
    description: "Perfect for getting started with code analysis.",
    features: [
      "Up to 5 repositories",
      "Basic code analysis",
      "Standard support",
      "Community access",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/sign-up",
    price: { monthly: "$29" },
    description: "Advanced features for professional developers.",
    features: [
      "Unlimited repositories",
      "Advanced code analysis",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
      "API access",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "/contact",
    price: { monthly: "Custom" },
    description: "Custom solutions for large organizations.",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "Dedicated support",
      "SLA guarantees",
      "On-premise deployment",
      "Custom training",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <div id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-base font-semibold leading-7 text-primary"
          >
            Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Choose the right plan for you
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Start with our free plan and upgrade as you grow.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={cn(
                "flex flex-col justify-between rounded-3xl border bg-card p-8 ring-1 ring-muted-foreground/10 xl:p-10",
                tier.featured && "border-primary/50 ring-primary/50"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className="text-lg font-semibold leading-8"
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
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
                    {tier.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    /month
                  </span>
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
                asChild
                className={cn(
                  "mt-8",
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Link href={tier.href}>
                  Get started
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
