"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  GitBranch,
  GitCommit,
  GitPullRequest,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { TextEffect } from "~/components/ui/text-effect";
import { AnimatedGroup } from "~/components/ui/animated-group";
import { HeroHeader } from "~/components/hero5-header";
import { motion } from "framer-motion";
import { Features8 } from "~/components/features-8";
import { Footer } from "~/components/footer";
import { Pricing } from "~/components/pricing";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function Home() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Modern animated background with RepoFlow elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Primary gradient blob */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-3xl"
            />
            {/* Secondary gradient blob */}
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -360],
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-secondary/20 via-secondary/5 to-transparent blur-3xl"
            />
            {/* Additional accent blob */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/10 via-secondary/10 to-transparent blur-3xl"
            />
          </motion.div>

          {/* Grid overlay with theme-aware opacity */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] dark:opacity-[0.02]" />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/dashboard"
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border bg-muted/50 p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 hover:bg-muted dark:border-white/5 dark:shadow-zinc-950/50"
                  >
                    <span className="text-sm text-foreground">
                      Powered by AI Code Analysis
                    </span>
                    <span className="block h-4 w-0.5 bg-border"></span>
                    <div className="size-6 overflow-hidden rounded-full bg-background/50 duration-500 group-hover:bg-muted">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                {/* RepoFlow Logo Animation */}
                <div className="mx-auto mb-6 mt-12 flex items-center justify-center space-x-2 lg:mt-8">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex items-center justify-center rounded-full bg-primary/10 p-3 dark:bg-primary/20"
                  >
                    <img src="/logo.svg" className="size-8 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>

                {/* Title with gradient text - Fixed version */}
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  className="mt-4 text-balance text-6xl font-bold md:text-7xl lg:mt-6 xl:text-[5.25rem]"
                >
                  RepoFlow Ai
                </TextEffect>

                {/* Adding a gradient underline for visual effect instead */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="mx-auto mt-2 h-1.5 w-48 rounded-full bg-gradient-to-r from-primary to-secondary"
                />

                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground"
                >
                  Transform your GitHub repositories with AI-powered commit
                  analysis, smart code summaries, and intelligent repository
                  insights.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div className="rounded-[calc(var(--radius)+0.125rem)] bg-primary/10 p-0.5 dark:bg-primary/20">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-lg px-8 text-base"
                    >
                      <Link href="/create">Get Started</Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-lg px-8"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-16 overflow-hidden px-6 sm:mt-20 lg:mt-24">
                <div className="mx-auto max-w-6xl">
                  <div className="relative rounded-xl border bg-background/50 p-4 shadow-2xl shadow-black/5 backdrop-blur-sm">
                    <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 transform">
                      <div className="flex items-center space-x-1 rounded-full border bg-background px-4 py-1 shadow-lg">
                        <GitCommit className="size-4 text-primary" />
                        <span className="text-sm font-medium">RepoFlow</span>
                      </div>
                    </div>
                    <Image
                      className="aspect-[16/10] w-full rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
                      src="/main.jpg"
                      alt="RepoFlow AI Dashboard"
                      width={2880}
                      height={1800}
                      priority
                    />
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Features Section */}
        <Features8 />
      </main>
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
