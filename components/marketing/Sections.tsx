"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

// Inline SVG icons to avoid dependency on lucide-react
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function GitPullRequestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Now in beta — Start with Java
          </div>
          
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Learn programming with{" "}
            <span className="text-blue-600">real execution</span>,{" "}
            <span className="text-purple-600">community feedback</span>, and{" "}
            <span className="text-green-600">verifiable progress</span>.
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            A language-agnostic platform designed for mastering software engineering through 
            hands-on practice. Start your journey with Java, with more languages coming soon.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <SignedOut>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-8 py-4 text-base font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Start learning
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse curriculum
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-8 py-4 text-base font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Continue learning
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: CodeIcon,
    title: "Language-Agnostic Content",
    description: "Start with Java today. Our content model is designed to support multiple programming languages as we grow.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: TerminalIcon,
    title: "Real Test Execution",
    description: "Write code and run it immediately in our isolated sandbox environment. Get instant feedback on your solutions.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: TrophyIcon,
    title: "Progress & Certificates",
    description: "Track your learning journey with detailed progress metrics. Earn verifiable certificates you can share.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: UsersIcon,
    title: "Community Discussions",
    description: "Ask questions, share insights, and learn from others. Community-driven accepted answers help everyone grow.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: GitPullRequestIcon,
    title: "Contribution Workflow",
    description: "Contributors can propose improvements through a review process. Versioned publishing ensures quality content.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: FolderIcon,
    title: "Multi-File Projects",
    description: "Work on real-world projects with multiple files. Build portfolio pieces that demonstrate your skills.",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master programming
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A complete learning environment designed for serious learners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow"
            >
              <div className={`inline-flex rounded-lg ${feature.bgColor} p-3 mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Pick a track",
    description: "Choose from curated learning tracks designed to take you from beginner to proficient.",
  },
  {
    number: "02",
    title: "Learn & practice",
    description: "Read lessons, solve challenges, and run your code in our sandbox to verify your solutions.",
  },
  {
    number: "03",
    title: "Earn & verify",
    description: "Complete tracks to earn certificates with unique verification codes you can share anywhere.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A simple, effective approach to learning programming.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-200" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white text-xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const trustFeatures = [
  {
    icon: ShieldIcon,
    title: "Sandboxed Execution",
    description: "All code runs in isolated environments with no network access and resource limits for security.",
  },
  {
    icon: EyeIcon,
    title: "Auditable Progress",
    description: "Every certificate is cryptographically verifiable. Anyone can confirm your achievements.",
  },
  {
    icon: GithubIcon,
    title: "Open Source",
    description: "Built in the open. Community contributions and peer review keep content high-quality and current.",
  },
];

export function TrustSection() {
  return (
    <section id="community" className="w-full py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for trust and safety
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Your learning environment is secure, transparent, and community-driven.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustFeatures.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex rounded-lg bg-gray-800 p-4 mb-4">
                <feature.icon className="h-8 w-8 text-gray-200" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section id="certificates" className="w-full py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-16 sm:px-16 sm:py-24 text-center overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Ready to start your journey?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-8">
              Join thousands of learners mastering programming through hands-on practice. 
              Create your free account today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Create free account
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/learn"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Continue learning
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </SignedIn>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}
