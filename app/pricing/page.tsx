"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Book, CheckCircle, Users, Heart, Zap } from "lucide-react";

const FREE_FEATURES = [
  {
    icon: Book,
    title: "All Lessons & Challenges",
    description: "Access to our complete curriculum with exercises",
  },
  {
    icon: CheckCircle,
    title: "Interactive Code Editor",
    description: "Write and run code directly in your browser",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Get help from fellow learners in our community",
  },
  {
    icon: Zap,
    title: "Real-time Feedback",
    description: "Instant test results and code execution",
  },
  {
    icon: Heart,
    title: "Completely Free",
    description: "No hidden fees, no subscriptions, ever",
  },
];

export default function PricingPage() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Completely Free
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to learn programming. No payment required.
          </p>
        </div>

        {/* Free Features Card */}
        <Card variant="elevated" className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl mb-2">
              OpenCamp is Free Forever
            </CardTitle>
            <CardDescription className="text-lg">
              All features available at no cost. We believe education should be accessible to everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {FREE_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Why Free Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why We&apos;re Free</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Open Source Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Our content is created and reviewed by a global community of educators and developers.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sustainable Model</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re funded by community contributions, not by selling access to learning materials.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Focus on Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Our resources go into creating better content and improving the learning experience, not monetization.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Equal Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Every learner has access to the same high-quality materials, regardless of their financial situation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                Start Learning Today
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of learners improving their programming skills for free.
              </p>
              <Link href="/learn">
                <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                  Browse Courses
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">
                Is OpenCamp really free?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes, completely free. No subscriptions, no credit card required, no hidden fees. All lessons, challenges, and features are available at no cost.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Will it stay free in the future?
              </h3>
              <p className="text-muted-foreground text-sm">
                We&apos;re committed to keeping OpenCamp free forever. Our sustainable community-based model allows us to operate without charging users.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How can I support OpenCamp?
              </h3>
              <p className="text-muted-foreground text-sm">
                You can contribute by creating lessons, reviewing content, reporting bugs, or spreading the word. See our contributing guide for details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What makes OpenCamp different from paid platforms?
              </h3>
              <p className="text-muted-foreground text-sm">
                We focus on community-driven content creation, open-source transparency, and equal access to education. Our content is as high-quality as any paid platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
