import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { getCompanyLogo } from "@/lib/company-logos";

interface JobCardProps {
  job: any;
  getLevelColor: (level: string) => string;
  onStartInterview: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  getLevelColor,
  onStartInterview,
}) => {
  // Get company logo dynamically
  const companyImage = getCompanyLogo(job.company);

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-lg"
      key={job._id}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl border-2 border-accent ">
              <Image
                width={60}
                height={60}
                src={companyImage}
                alt={job.company + " logo"}
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-md transition-colors group-hover:text-blue-600">
                {job.title}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center">
                <Building2 className="mr-1 h-3 w-3" />
                {job.company}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
          {job.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="mr-1 h-3 w-3" />
            {job.location} {job.remote && "• Remote"}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="mr-1 h-3 w-3" />
            {job.department}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="mr-1 h-3 w-3" />
            {job.postedDate}
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-sm">Key Skills:</p>
          <div className="flex flex-wrap gap-1">
            {job.requirements
              .slice(0, 3)
              .map((skill: string, index: number) => (
                <Badge className="text-xs" key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            {job.requirements.length > 3 && (
              <Badge className="text-xs" variant="secondary">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() => onStartInterview(job._id)}
            size="sm"
          >
            Start Practice Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
