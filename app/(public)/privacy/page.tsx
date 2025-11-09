import Header from "@/components/header";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: October 22, 2025
        </p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to NorthStar. We respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our GenAI role-play platform for interview preparation.
            </p>
            <p className="mb-4">
              Please read this Privacy Policy carefully. By using NorthStar, you
              agree to the collection and use of information in accordance with
              this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mb-2">
              2.1 Personal Information
            </h3>
            <p className="mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>University and graduation year (optional)</li>
              <li>Career interests and target roles</li>
              <li>Account credentials (password is encrypted)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.2 Voice Data</h3>
            <p className="mb-4">
              When you use our AI interview simulation features, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Voice recordings of your interview responses</li>
              <li>Transcriptions of your spoken answers</li>
              <li>Speech patterns, pace, and delivery metrics</li>
              <li>Pauses and filler word analysis</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.3 Usage Data</h3>
            <p className="mb-4">We automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Interview session history and performance metrics</li>
              <li>Questions practiced and feedback received</li>
              <li>Time spent on the platform</li>
              <li>Feature usage patterns</li>
              <li>Progress and improvement tracking data</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.4 Technical Data</h3>
            <p className="mb-4">We collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log data and error reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">We use the collected information for:</p>

            <h3 className="text-xl font-semibold mb-2">3.1 Service Delivery</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Providing AI-powered interview simulations</li>
              <li>Generating personalized feedback on your performance</li>
              <li>Analyzing speech content and delivery</li>
              <li>Tracking your progress over time</li>
              <li>
                Recommending relevant interview questions and practice sessions
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              3.2 Service Improvement
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Improving our AI algorithms and feedback quality</li>
              <li>Developing new features and functionalities</li>
              <li>Understanding user behavior and preferences</li>
              <li>Conducting research and analysis</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">3.3 Communication</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Sending account-related notifications</li>
              <li>Providing customer support</li>
              <li>Sending marketing communications (with your consent)</li>
              <li>
                Notifying you of updates, new features, or changes to our
                service
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              3.4 Security and Legal
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Protecting against fraud and abuse</li>
              <li>Enforcing our Terms of Service</li>
              <li>Complying with legal obligations</li>
              <li>Resolving disputes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. How We Share Your Information
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your
              information with:
            </p>

            <h3 className="text-xl font-semibold mb-2">
              4.1 Service Providers
            </h3>
            <p className="mb-4">
              Third-party vendors who perform services on our behalf, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Supabase (database and authentication)</li>
              <li>AI processing services for speech analysis</li>
              <li>Cloud storage providers</li>
              <li>Analytics providers</li>
              <li>Payment processors (if applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              4.2 Legal Requirements
            </h3>
            <p className="mb-4">
              We may disclose your information if required by law or in response
              to valid requests by public authorities.
            </p>

            <h3 className="text-xl font-semibold mb-2">
              4.3 Business Transfers
            </h3>
            <p className="mb-4">
              In connection with any merger, sale of company assets, financing,
              or acquisition of all or a portion of our business.
            </p>

            <h3 className="text-xl font-semibold mb-2">4.4 Aggregated Data</h3>
            <p className="mb-4">
              We may share aggregated, anonymized data that does not identify
              you personally for research, analytics, or marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Voice Data Processing
            </h2>
            <p className="mb-4">Special considerations for voice data:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Voice recordings are processed by our AI systems to generate
                feedback
              </li>
              <li>Recordings are stored securely and encrypted</li>
              <li>
                You can request deletion of your voice recordings at any time
              </li>
              <li>
                Voice data may be used to improve our AI models (in anonymized
                form)
              </li>
              <li>
                We retain voice recordings for [specified period] unless you
                request earlier deletion
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication via Supabase</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mb-4">
              However, no method of transmission over the Internet is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Your Rights and Choices
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                associated data
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing
                communications
              </li>
              <li>
                <strong>Data Portability:</strong> Request your data in a
                portable format
              </li>
              <li>
                <strong>Restriction:</strong> Request limitation of processing
                in certain circumstances
              </li>
              <li>
                <strong>Object:</strong> Object to processing based on
                legitimate interests
              </li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us at
              privacy@northstar.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide you with our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="mb-4">
              When you delete your account, we will delete or anonymize your
              personal information within 30 days, except where retention is
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Cookies and Tracking
            </h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our service</li>
              <li>Provide personalized content</li>
              <li>Analyze site traffic and usage patterns</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings. Note that
              disabling cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Children's Privacy
            </h2>
            <p className="mb-4">
              Our Service is not intended for users under 13 years of age. We do
              not knowingly collect personal information from children under 13.
              If you become aware that a child has provided us with personal
              information, please contact us, and we will take steps to delete
              such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. International Data Transfers
            </h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. By using our Service, you consent
              to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for significant changes)</li>
            </ul>
            <p className="mb-4">
              Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <p className="mb-2">Email: privacy@northstar.com</p>
            <p className="mb-2">Data Protection Officer: dpo@northstar.com</p>
            <p>Address: [Your Company Address]</p>
          </section> */}

          <section className="mt-8 p-8 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Privacy Matters</h2>
            <p>
              At NorthStar, we are committed to transparency and protecting your
              privacy. We will never sell your personal data, and we only use
              your information to provide and improve our interview preparation
              platform.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
