export default function StatsSection() {
  return (
    <section className="pt-32 pb-2 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-accent-foreground text-sm">
              2,000+ curated interview questions across 1000+ positions to help
              you ace your next interview.
            </p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-serif leading-tight">
              Why interview candidates trust NorthStar to prepare for their
              dream jobs.
            </h3>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">2,000+</h4>
            <p className="text-accent-foreground text-sm">
              Interview Questions
            </p>
          </div>
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">1,000+</h4>
            <p className="text-accent-foreground text-sm">Job Positions</p>
          </div>
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">40+</h4>
            <p className="text-accent-foreground text-sm">
              Companies & Industries
            </p>
          </div>
        </div>

        <p className="text-accent-foreground text-sm">
          AI-powered feedback on content and delivery. Get interview-ready
          faster.
        </p>
      </div>
    </section>
  );
}
