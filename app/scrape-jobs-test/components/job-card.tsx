import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, MapPin } from "lucide-react";
import { JobPosting } from "@/app/api/ai/extract/details/schema";

export function JobCard({ job }: { job: JobPosting }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg font-semibold flex-1">
              {job.title}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-1 justify-start">
            {job.jobLocation?.rawAddress && (
              <Badge variant="secondary" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {job.jobLocation.rawAddress}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {job.workMode}
            </Badge>
          </div>
          {job.baseSalary && (
            <div className="text-sm font-semibold text-green-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.baseSalary.currency}{" "}
              {job.baseSalary.minValue?.toLocaleString()} -{" "}
              {job.baseSalary.maxValue?.toLocaleString()} /{" "}
              {job.baseSalary.unitText}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 line-clamp-3">
          {job.rawDescription?.replace(/<[^>]*>?/gm, "").substring(0, 200)}...
        </div>
        {(job.responsibilities?.length || 0) > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700">
              Responsibilities:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {job.responsibilities?.slice(0, 3).map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span className="line-clamp-1">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {job.directApplyUrl && (
          <Button className="w-full" size="sm" asChild>
            <a
              href={job.directApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
