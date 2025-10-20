interface JobHeaderProps {
  jobTitle: string;
}

export function JobHeader({ jobTitle }: JobHeaderProps) {
  return (
    <div className="text-center mb-2">
      <p className="text-sm text-muted-foreground mb-1">Interview for</p>
      <h1 className="text-2xl font-bold text-primary">{jobTitle}</h1>
      <p className="text-sm text-muted-foreground">Position</p>
    </div>
  );
}
