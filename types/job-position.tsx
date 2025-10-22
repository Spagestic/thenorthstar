export type JobPosition = {
  id: string;
  title: string;
  category: string;
  seniorityLevel?: "entry" | "mid" | "senior" | "lead" | string | null;
  typicalRequirements?: string[] | null;
  typicalResponsibilities?: string[] | null;
  salaryRangeMin?: number | null;
  salaryRangeMax?: number | null;
  salaryCurrency?: string | null; // DB default: 'USD'
  createdAt?: Date | null;
  updatedAt?: Date | null;
  companyId?: string | null;
  industryId?: string | null;
};
