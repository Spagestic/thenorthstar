// @/app/(protected)/analytics/page.tsx
import React from "react";
import Header from "../Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Target,
  Mic,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AnalyticsPage() {
  // Mock Data: In a real app, this would be aggregated from your database
  // derived from the 'numeric_scores' and 'data_collection_results'

  const stats = [
    {
      title: "Total Sessions",
      value: "24",
      change: "+4 this week",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Avg. Tech Score",
      value: "7.8/10",
      change: "+0.5",
      trend: "up",
      icon: <BrainCircuit className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Avg. Comm. Score",
      value: "8.5/10",
      change: "+0.2",
      trend: "up",
      icon: <Mic className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "STAR Method Usage",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  // Derived from aggregating individual 'technical_score' and 'communication_score'
  const competencyProgress = [
    { name: "Technical Fundamentals", score: 78, color: "bg-blue-600" },
    { name: "Communication Clarity", score: 85, color: "bg-green-600" },
    { name: "Behavioral Structuring (STAR)", score: 68, color: "bg-amber-600" },
    { name: "Identity & Hygiene Checks", score: 100, color: "bg-slate-600" },
  ];

  // Mocking the "Success Criteria" results we defined earlier
  const recentInterviews = [
    {
      company: "Google",
      position: "Software Engineer",
      date: "2025-10-20",
      techScore: 9,
      commScore: 8,
      starUsed: true,
      passed: true,
    },
    {
      company: "Microsoft",
      position: "Product Manager",
      date: "2025-10-18",
      techScore: 6,
      commScore: 9,
      starUsed: true,
      passed: false, // Maybe failed technical threshold
    },
    {
      company: "Amazon",
      position: "Data Analyst",
      date: "2025-10-15",
      techScore: 8,
      commScore: 7,
      starUsed: false, // Missed STAR method
      passed: true,
    },
    {
      company: "Meta",
      position: "Frontend Developer",
      date: "2025-10-12",
      techScore: 7,
      commScore: 8,
      starUsed: true,
      passed: true,
    },
  ];

  // Aggregated from 'technical_strengths_list' and 'technical_gaps_list'
  const insights = {
    strengths: [
      "Consistently clear introductions (Hygiene Stage)",
      "Strong understanding of React/Frontend concepts",
      "Good tone and confidence in delivery",
    ],
    improvements: [
      "Often misses the 'Result' in STAR method answers",
      "Vague definitions of backend concepts (e.g. UDP vs TCP)",
      "Tendency to use buzzwords without deep explanation",
    ],
  };

  return (
    <div className="container mx-auto flex flex-col h-screen bg-muted/5">
      <Header nav={[{ label: "Analytics" }]} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* 1. High Level Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}{" "}
                    {stat.trend === "up" ? (
                      <TrendingUp className="inline h-3 w-3 ml-1 text-green-500" />
                    ) : (
                      ""
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
            {/* 2. Competency Breakdown */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Core Competencies</CardTitle>
                <CardDescription>
                  Average performance across all evaluated dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {competencyProgress.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {skill.name}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {skill.score}/100
                      </span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3. AI Insights Summary */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>AI Coach Insights</CardTitle>
                <CardDescription>
                  Aggregated feedback from recent sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600">
                    <Trophy className="h-4 w-4" /> Top Strengths
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {insights.strengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-600">
                    <Target className="h-4 w-4" /> Focus Areas
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {insights.improvements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. Recent Session History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Detailed breakdown of your last 4 interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    {/* Company Info */}
                    <div className="space-y-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {interview.company}
                        </p>
                        {interview.passed ? (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50"
                          >
                            Pass
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-200 bg-amber-50"
                          >
                            Review
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {interview.position} •{" "}
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Scores Grid */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-1">
                          Tech
                        </span>
                        <Badge
                          variant={
                            interview.techScore >= 7 ? "default" : "secondary"
                          }
                        >
                          {interview.techScore}/10
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-1">
                          Comm
                        </span>
                        <Badge
                          variant={
                            interview.commScore >= 7 ? "default" : "secondary"
                          }
                        >
                          {interview.commScore}/10
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-1">
                          STAR
                        </span>
                        {interview.starUsed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
