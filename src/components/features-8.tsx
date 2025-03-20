"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  LineChart, 
  MessageSquare, 
  Shield, 
  Zap 
} from "lucide-react";
import { cn } from "~/lib/utils";

const features = [
  {
    name: "AI-Powered Analysis",
    description: "Advanced AI algorithms analyze your codebase to provide intelligent insights and recommendations.",
    icon: Brain,
    className: "md:col-span-2",
  },
  {
    name: "Smart Commit Analysis",
    description: "Automatically analyze commit messages and code changes to understand project evolution.",
    icon: GitCommit,
    className: "md:col-span-1",
  },
  {
    name: "Branch Management",
    description: "Track and manage branch relationships with intelligent visualization and insights.",
    icon: GitBranch,
    className: "md:col-span-1",
  },
  {
    name: "Pull Request Insights",
    description: "Get detailed analysis of pull requests to improve code review efficiency.",
    icon: GitPullRequest,
    className: "md:col-span-2",
  },
  {
    name: "Performance Metrics",
    description: "Track key performance indicators and project health metrics over time.",
    icon: LineChart,
    className: "md:col-span-1",
  },
  {
    name: "Team Collaboration",
    description: "Enhanced team communication with AI-powered code discussions and suggestions.",
    icon: MessageSquare,
    className: "md:col-span-1",
  },
  {
    name: "Security Analysis",
    description: "Identify potential security issues and vulnerabilities in your codebase.",
    icon: Shield,
    className: "md:col-span-2",
  },
  {
    name: "Lightning Fast",
    description: "Optimized performance ensures quick analysis and instant insights.",
    icon: Zap,
    className: "md:col-span-1",
  },
];

export function Features8() {
  return (
    <div id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-base font-semibold leading-7 text-primary"
          >
            Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything you need to understand your codebase
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Powerful features to help you analyze, understand, and improve your codebase with AI.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-6 hover:border-primary/50 hover:bg-card/50",
                  feature.className
                )}
              >
                <div className="flex items-center gap-x-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold leading-7">{feature.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
