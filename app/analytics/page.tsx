"use client";

import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Book, Clock, TrendingUp, Award, CheckCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to view your analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Learning Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and see how far you&apos;ve come
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Lessons Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Book className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">12</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Challenges Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold">8</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Time Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-accent" />
                <span className="text-3xl font-bold">4.5h</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold">5 days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress by Track */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Java Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lessons</span>
                  <span>9/12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Challenges</span>
                  <span>6/8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Go Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: "20%" }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lessons</span>
                  <span>2/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Challenges</span>
                  <span>0/1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { lesson: "Variables & Types", time: "2 hours ago", completed: true },
                { lesson: "Operators", time: "5 hours ago", completed: true },
                { lesson: "Control Flow", time: "1 day ago", completed: true },
                { lesson: "Arrays", time: "2 days ago", completed: false },
                { lesson: "Methods", time: "3 days ago", completed: false },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {activity.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Book className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{activity.lesson}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-primary" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card variant="elevated" className="mt-8">
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Complete 3 lessons", current: 2, target: 3 },
                { label: "Solve 5 challenges", current: 3, target: 5 },
                { label: "Study 8 hours", current: 4.5, target: 8 },
              ].map((goal, idx) => (
                <div key={idx} className="text-center p-4 bg-background rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    {goal.label}
                  </div>
                  <div className="text-2xl font-bold">
                    {goal.current} / {goal.target}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
