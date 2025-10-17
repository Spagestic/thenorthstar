export type JobPosition = {
  title: string;
  companyId: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  level: "entry" | "mid" | "senior" | "lead";
  department: string;
  location?: string;
  remote: boolean;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate?: Date;
};
