// @/app/(protected)/history/[id]/components/analysis-section.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

export function AnalysisSection({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  const evaluationResults = analysis.evaluation_criteria_results;
  const dataCollection = analysis.data_collection_results;

  // If no analysis data exists, don't render the section
  if (!evaluationResults && !dataCollection) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Success Criteria Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Success Criteria
          </CardTitle>
          <CardDescription>Automated pass/fail checks</CardDescription>
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

      {/* Extracted Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Data
          </CardTitle>
          <CardDescription>Key details from the interview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataCollection ? (
            Object.entries(dataCollection).map(([key, item]: [string, any]) => (
              <div
                key={key}
                className="flex flex-col space-y-1 pb-3 border-b last:border-0 last:pb-0"
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {key.replace(/_/g, " ")}
                </span>
                <div className="mt-1">{renderDataValue(key, item.value)}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No data collected.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Helper Functions (Run on Server) ---

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

function renderDataValue(key: string, value: any) {
  if (typeof value === "boolean") {
    return value ? (
      <Badge className="bg-green-600">Yes</Badge>
    ) : (
      <Badge variant="destructive">No</Badge>
    );
  }

  // Handle 1-10 scores specifically if key contains "score"
  if (typeof value === "number" && key.toLowerCase().includes("score")) {
    return (
      <div className="flex items-center gap-2 w-full max-w-50">
        <span className="font-bold text-lg">{value}/10</span>
        <Progress value={value * 10} className="h-2" />
      </div>
    );
  }

  if (typeof value === "number") {
    return <span className="font-mono">{value}</span>;
  }

  return <span className="text-sm">{String(value)}</span>;
}
