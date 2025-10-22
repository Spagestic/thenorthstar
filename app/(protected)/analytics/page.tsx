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

export default function AnalyticsPage() {
  // Dummy data
  const stats = [
    {
      title: "Total Interviews",
      value: "24",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Average Score",
      value: "78%",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Practice Hours",
      value: "18.5",
      change: "+3h",
      trend: "up",
    },
    {
      title: "Success Rate",
      value: "82%",
      change: "-2%",
      trend: "down",
    },
  ];

  const skillsProgress = [
    { name: "Technical Questions", score: 85 },
    { name: "Behavioral Questions", score: 72 },
    { name: "Communication", score: 88 },
    { name: "Problem Solving", score: 76 },
    { name: "Cultural Fit", score: 90 },
  ];

  const recentInterviews = [
    {
      company: "Google",
      position: "Software Engineer",
      date: "2025-10-20",
      score: 82,
    },
    {
      company: "Microsoft",
      position: "Product Manager",
      date: "2025-10-18",
      score: 75,
    },
    {
      company: "Amazon",
      position: "Data Analyst",
      date: "2025-10-15",
      score: 88,
    },
    {
      company: "Meta",
      position: "Frontend Developer",
      date: "2025-10-12",
      score: 79,
    },
  ];

  return (
    <div className="container mx-auto flex flex-col h-screen">
      <Header nav={["Analytics"]} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Badge
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Your performance across different interview categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillsProgress.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.score}%
                    </span>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>
                Your latest interview practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{interview.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {interview.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={interview.score >= 80 ? "default" : "secondary"}
                    >
                      {interview.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                AI-generated feedback and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Strengths</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Excellent communication skills and clarity</li>
                  <li>Strong cultural fit responses</li>
                  <li>Good technical knowledge demonstration</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Areas to Improve</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Reduce filler words (um, uh, like)</li>
                  <li>
                    Provide more specific examples in behavioral questions
                  </li>
                  <li>Work on structuring longer responses</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Recommended Focus</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Behavioral Questions</Badge>
                  <Badge variant="outline">STAR Method</Badge>
                  <Badge variant="outline">Problem Solving</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
