import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-background text-on-background antialiased font-sans">
      {/* Sticky Navigation */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant shadow-sm h-16 flex items-center px-6 lg:px-margin-desktop justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-display-lg font-bold text-primary">PlaceIT</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-on-surface-variant text-body-md hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-on-surface-variant text-body-md hover:text-primary transition-colors" href="#how-it-works">How it works</a>
            <a className="text-on-surface-variant text-body-md hover:text-primary transition-colors" href="#about">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-primary text-title-md font-semibold hover:bg-surface-container-low rounded-lg transition-all active:scale-95">Sign In</Link>
          <Link to="/login" className="px-6 py-2 bg-primary-container text-on-primary-container text-title-md font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95">Get Started</Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden px-6 lg:px-margin-desktop max-w-container-max mx-auto text-center flex flex-col items-center">
          <div className="max-w-3xl space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-md font-medium">
              <span className="material-symbols-outlined text-[16px] mr-2">school</span>
              Campus Placement, Reimagined
            </div>
            <h1 className="text-[48px] leading-[1.1] font-extrabold tracking-tight text-on-surface">
              Automate your entire <span className="gradient-text">placement process.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto">
              The all-in-one platform for Training &amp; Placement Offices (TPOs), recruiters, and students to manage listings, eligibility, and offers seamlessly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/login" className="px-8 py-4 bg-primary text-white text-title-md font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
                Get started <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <a href="#features" className="px-8 py-4 bg-white border border-outline-variant text-on-surface text-title-md font-semibold rounded-xl hover:bg-surface-container-low transition-all">
                See how it works
              </a>
            </div>
            <div className="pt-8 border-t border-outline-variant flex flex-wrap gap-8 justify-center w-full">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                <span className="text-label-md font-medium text-on-surface">5 User Roles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="text-label-md font-medium text-on-surface">Eligibility Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-label-md font-medium text-on-surface">Single-Offer Policy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-surface-container-low py-12 border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-6 lg:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '5', label: 'Specialized Roles' },
                { num: '6', label: 'Pipeline Stages' },
                { num: '100%', label: 'Auto-Eligibility' },
                { num: '1-Click', label: 'Bulk Offer Updates' },
              ].map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <p className="text-[32px] font-bold text-primary">{s.num}</p>
                  <p className="text-on-surface-variant text-label-md">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 lg:px-margin-desktop max-w-container-max mx-auto" id="features">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg font-semibold mb-4">Enterprise-grade Placement Tools</h2>
            <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">Everything your institution needs to manage careers, from student onboarding to post-placement analytics.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'person_search', title: 'Student Profiling', desc: 'Verified profile creation with document vault for degrees, certifications, and project portfolios.' },
              { icon: 'corporate_fare', title: 'Company CRM', desc: 'Manage relationships with recruiters, past hiring history, and upcoming campus drive calendars.' },
              { icon: 'rule', title: 'Eligibility Engine', desc: 'Set complex rules for CGPA, backlogs, and branches. Auto-filter candidates in seconds.' },
              { icon: 'track_changes', title: 'Application Tracking', desc: 'Real-time funnel tracking from initial application to final interview rounds with status tags.' },
              { icon: 'assignment_turned_in', title: 'Offer Management', desc: 'Handle multi-company offers and enforce "Dream Job" policies with automated logic.' },
              { icon: 'bar_chart', title: 'Analytics Dashboard', desc: 'Instant visualization of placement data, branch performance, and salary trends for stakeholders.' },
            ].map((f) => (
              <div key={f.title} className="p-8 rounded-2xl bg-white border border-outline-variant hover:border-primary hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-on-primary-fixed-variant group-hover:text-white">{f.icon}</span>
                </div>
                <h3 className="text-title-lg font-semibold mb-3">{f.title}</h3>
                <p className="text-on-surface-variant text-body-md">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stakeholder Section */}
        <section className="py-24 bg-surface-container-low overflow-hidden" id="how-it-works">
          <div className="max-w-container-max mx-auto px-6 lg:px-margin-desktop">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3">
                <h2 className="text-headline-lg font-semibold mb-6">Designed for every stakeholder</h2>
                <p className="text-on-surface-variant text-body-lg mb-8">PlaceIT provides dedicated interfaces tailored for specific roles in the ecosystem.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-outline-variant">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-title-md font-semibold">Intuitive Workflows</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-outline-variant">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-title-md font-semibold">Role-based Access Control</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/3 grid md:grid-cols-3 gap-6">
                <div className="bg-primary text-white p-8 rounded-[2rem] flex flex-col justify-between min-h-[360px] shadow-lg">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-[48px]">admin_panel_settings</span>
                    <h4 className="text-title-lg font-semibold">TPO Office</h4>
                    <p className="text-body-sm opacity-90">Centralized control, bulk notifications, and report generation for the entire institute.</p>
                  </div>
                  <button className="mt-8 text-left text-label-md uppercase tracking-widest flex items-center gap-2 group">
                    Learn More <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
                <div className="bg-tertiary text-white p-8 rounded-[2rem] flex flex-col justify-between min-h-[360px] shadow-lg">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-[48px]">person</span>
                    <h4 className="text-title-lg font-semibold">Students</h4>
                    <p className="text-body-sm opacity-90">One-click applications, real-time interview updates, and automated profile building.</p>
                  </div>
                  <button className="mt-8 text-left text-label-md uppercase tracking-widest flex items-center gap-2 group">
                    Learn More <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
                <div className="bg-secondary-container text-on-secondary-container p-8 rounded-[2rem] flex flex-col justify-between min-h-[360px] shadow-lg">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-[48px]">handshake</span>
                    <h4 className="text-title-lg font-semibold">Recruiters</h4>
                    <p className="text-body-sm opacity-90">Candidate filtering, schedule management, and instant shortlist submission portal.</p>
                  </div>
                  <button className="mt-8 text-left text-label-md uppercase tracking-widest flex items-center gap-2 group">
                    Learn More <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="bg-inverse-surface py-20 px-6 lg:px-margin-desktop" id="about">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-white text-display-lg font-bold">Ready to streamline your campus placements?</h2>
            <p className="text-white/60 text-body-lg">Join 500+ top institutions modernizing their career services with PlaceIT Pro.</p>
            <div className="pt-4">
              <Link to="/login" className="inline-block px-10 py-5 bg-primary-container text-white text-title-lg font-semibold rounded-full hover:bg-primary transition-all shadow-xl active:scale-95">
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-20 border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-6 lg:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <span className="text-display-lg font-bold text-primary">PlaceIT</span>
              <p className="text-on-surface-variant text-body-md max-w-xs">Defining the future of campus recruitment through intelligent automation and data-driven insights.</p>
            </div>
            <div>
              <h4 className="text-title-md font-semibold text-on-surface mb-6">Product</h4>
              <ul className="space-y-4 text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Enterprise</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-title-md font-semibold text-on-surface mb-6">Resources</h4>
              <ul className="space-y-4 text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">Placement Guide</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">API Docs</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-title-md font-semibold text-on-surface mb-6">Company</h4>
              <ul className="space-y-4 text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-label-md text-on-surface-variant">© 2024 PlaceIT Technologies Inc. All rights reserved.</p>
            <div className="flex gap-8 text-label-md text-on-surface-variant">
              <a className="hover:text-primary" href="#">Terms of Service</a>
              <a className="hover:text-primary" href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
