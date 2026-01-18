// @/app/(protected)/history/[id]/components/analysis-section.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  Target,
  ChevronDown,
  Code,
  Mic,
  Users,
} from "lucide-react";
import { Feedback } from "@/app/api/ai/feedback/route";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function AnalysisSection({
  analysis,
  feedback,
}: {
  analysis: any;
  feedback?: Feedback | null;
}) {
  if (!analysis && !feedback) return null;

  return (
    <div className="space-y-6">
      {" "}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Detailed Evaluation</CardTitle>
          <CardDescription>{feedback?.summary}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {/* ITEM 1: TECHNICAL */}
            <AccordionItem value="technical" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <BadgeIcon score={feedback?.technical_score || 0} />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-sm">
                      Technical Deep Dive
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Concepts, Comparisons, Trade-offs
                    </span>
                  </div>
                  <div className="ml-auto mr-4 text-sm font-medium text-muted-foreground">
                    {feedback?.technical_score}/10
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                {feedback?.stage_feedback.technical}
              </AccordionContent>
            </AccordionItem>

            {/* ITEM 2: COMMUNICATION */}
            <AccordionItem value="communication" className="border-b">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <BadgeIcon score={feedback?.communication_score || 0} />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-sm">
                      Introduction & Clarity
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      Articulation, Pacing, Structure
                    </span>
                  </div>
                  <div className="ml-auto mr-4 text-sm font-medium text-muted-foreground">
                    {feedback?.communication_score}/10
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                {feedback?.stage_feedback.introduction}
              </AccordionContent>
            </AccordionItem>

            {/* ITEM 3: BEHAVIORAL */}
            <AccordionItem value="behavioral" className="border-b-0">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <BadgeIcon score={feedback?.behavioral_score || 0} />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-sm">
                      Behavioral Scenarios
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      STAR Method, Conflict Resolution
                    </span>
                  </div>
                  <div className="ml-auto mr-4 text-sm font-medium text-muted-foreground">
                    {feedback?.behavioral_score}/10
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                {feedback?.stage_feedback.behavioral}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      {feedback && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="text-foreground/90">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Target className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.improvements.map((im, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="text-foreground/90">{im}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function BadgeIcon({ score }: { score: number }) {
  if (score >= 8) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (score >= 5) return <MinusCircle className="h-5 w-5 text-yellow-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
}
