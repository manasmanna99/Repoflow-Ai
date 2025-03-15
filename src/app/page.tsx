"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { TextEffect } from "~/components/ui/text-effect";
import { AnimatedGroup } from "~/components/ui/animated-group";
import { HeroHeader } from "~/components/hero5-header";

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
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <div className="absolute inset-x-0 top-56 -z-20 hidden bg-gradient-to-b from-transparent via-background to-background dark:block lg:top-32" />
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/dashboard"
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border bg-muted p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 hover:bg-background dark:border-t-white/5 dark:shadow-zinc-950 dark:hover:border-t-border"
                  >
                    <span className="text-sm text-foreground">
                      Powered by AI Code Analysis
                    </span>
                    <span className="block h-4 w-0.5 border-l bg-white dark:border-background dark:bg-zinc-700"></span>

                    <div className="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-muted">
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

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Intelligent Repository Management
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
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
                  <div
                    key={1}
                    className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/dashboard">
                        <span className="text-nowrap">Get Started</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link
                      href="https://github.com/your-username/repoflow-ai"
                      target="_blank"
                    >
                      <span className="text-nowrap">View on GitHub</span>
                    </Link>
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
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-linear-to-b absolute inset-0 z-10 from-transparent from-35% to-background"
                />
                <div className="inset-shadow-2xs dark:inset-shadow-white/20 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background">
                  <Image
                    className="aspect-15/8 relative hidden rounded-2xl bg-background dark:block"
                    src="/light.jpg"
                    alt="RepoFlow AI Dashboard"
                    width="2700"
                    height="1440"
                    priority
                  />
                  <Image
                    className="z-2 aspect-15/8 relative rounded-2xl border border-border/25 dark:hidden"
                    src="/light.jpg"
                    alt="RepoFlow AI Dashboard"
                    width="2700"
                    height="1440"
                    priority
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="/features"
                className="block text-sm duration-150 hover:opacity-75"
              >
                <span>Explore Features</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/github.svg"
                  alt="GitHub"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/nextjs.svg"
                  alt="Next.js"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/typescript.svg"
                  alt="TypeScript"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/tailwind.svg"
                  alt="Tailwind CSS"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/prisma.svg"
                  alt="Prisma"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/trpc.svg"
                  alt="tRPC"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/vercel.svg"
                  alt="Vercel"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-8 w-auto dark:invert"
                  src="/tech/ai.svg"
                  alt="AI"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
