export default function StatsSection() {
  return (
    <section className="pt-32 pb-2 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-accent-foreground text-sm">
              Join thousands of candidates who have successfully landed their
              dream roles after practicing with Ovoxa's comprehensive interview
              preparation platform.
            </p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-serif leading-tight">
              Built by industry experts for ambitious professionals.
            </h3>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">10K+</h4>
            <p className="text-accent-foreground text-sm">Users Trained</p>
          </div>
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">95%</h4>
            <p className="text-accent-foreground text-sm">
              Interview Success Rate
            </p>
          </div>
          <div className="bg-primary-foreground border border-accent-foreground/40 p-8 rounded-lg">
            <h4 className="text-4xl md:text-5xl font-serif mb-4">2.5K</h4>
            <p className="text-accent-foreground text-sm">
              Avg Hours Saved per User
            </p>
          </div>
        </div>

        <p className="text-accent-foreground text-sm">
          Measurable results. Real success stories. Start your transformation
          today.
        </p>
      </div>
    </section>
  );
}
