"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, CircleX } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export type ScraperStep = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  details?: string[]; // Extra info like "Found 5 links"
};

interface ScraperProgressProps {
  steps: ScraperStep[];
}

export function ScraperProgress({ steps }: ScraperProgressProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  // Auto-expand steps when they become "in-progress"
  useEffect(() => {
    const activeStep = steps.find((s) => s.status === "in-progress");
    if (activeStep && !expandedSteps.includes(activeStep.id)) {
      setExpandedSteps((prev) => [...prev, activeStep.id]);
    }
  }, [steps]);

  const toggleExpansion = (id: string) => {
    setExpandedSteps((prev) =>
      prev.includes(id) ? prev.filter((stepId) => stepId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <LayoutGroup>
          <div className="p-2">
            <ul className="space-y-1">
              {steps.map((step) => {
                const isExpanded = expandedSteps.includes(step.id);
                const isCompleted = step.status === "completed";
                const isFailed = step.status === "failed";
                const isInProgress = step.status === "in-progress";

                return (
                  <motion.li
                    key={step.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md overflow-hidden bg-background"
                  >
                    <motion.div
                      layout
                      onClick={() => toggleExpansion(step.id)}
                      className={`flex items-center px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        isInProgress ? "bg-muted/30" : ""
                      }`}
                    >
                      {/* Icon Section */}
                      <div className="mr-3 flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : isFailed ? (
                          <CircleX className="h-5 w-5 text-red-500" />
                        ) : isInProgress ? (
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Title Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${
                              isCompleted
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {step.title}
                          </span>
                          {/* Status Badge */}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${
                              isCompleted
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : isInProgress
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : isFailed
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "text-muted-foreground bg-muted"
                            }`}
                          >
                            {step.status === "in-progress"
                              ? "Running"
                              : step.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Expandable Content (Description & Details) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pl-12 pt-0 text-sm text-muted-foreground">
                            <p className="mb-2">{step.description}</p>

                            {/* Render extracted details or logs if available */}
                            {step.details && step.details.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {step.details.map((detail, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs font-mono bg-muted/50 p-1.5 rounded"
                                  >
                                    <span className="text-blue-500">→</span>
                                    <span>{detail}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
