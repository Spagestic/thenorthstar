// @/app/(protected)/history/[id]/components/analysis-section.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export function AnalysisSection({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  const evaluationResults = analysis.evaluation_criteria_results;
  const dataCollection = analysis.data_collection_results;

  // If no analysis data exists, don't render the section
  if (!evaluationResults && !dataCollection) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detailed Evalutation
          </CardTitle>
          <CardDescription>
            Analysis of various criteria based on the interview data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluationResults ? (
            Object.entries(evaluationResults).map(
              ([key, item]: [string, any]) => (
                <div
                  key={key}
                  className="flex flex-col space-y-1 pb-3 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    {getStatusIcon(item.result)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.rationale}
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              No evaluation criteria found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusIcon(result: "success" | "failure" | "unknown") {
  switch (result) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "failure":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <HelpCircle className="h-5 w-5 text-yellow-500" />;
  }
}
