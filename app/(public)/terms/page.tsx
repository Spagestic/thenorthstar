import Header from "@/components/header";
import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last Updated: October 22, 2025
        </p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using NorthStar ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to these Terms of Service, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p className="mb-4">
              NorthStar is a GenAI role-play platform that provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Voice-based interview simulations powered by artificial
                intelligence
              </li>
              <li>Personalized feedback on interview performance</li>
              <li>
                Access to a curated database of interview questions for various
                companies, roles, and industries
              </li>
              <li>Progress tracking and performance analytics</li>
            </ul>
            <p>
              The Service is primarily designed for university students
              preparing for job interviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Registration</h3>
            <p className="mb-4">
              To access certain features of the Service, you must register for
              an account. You agree to provide accurate, current, and complete
              information during registration and to update such information to
              keep it accurate, current, and complete.
            </p>
            <h3 className="text-xl font-semibold mb-2">3.2 Account Security</h3>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized
              use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Use the Service for any illegal purpose or in violation of any
                applicable laws
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks
                connected to the Service
              </li>
              <li>Share your account credentials with others</li>
              <li>
                Use automated systems or software to extract data from the
                Service ("scraping")
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any aspect of the
                Service
              </li>
              <li>Use the Service to harass, abuse, or harm another person</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Intellectual Property
            </h2>
            <h3 className="text-xl font-semibold mb-2">5.1 Our Content</h3>
            <p className="mb-4">
              All content, features, and functionality of the Service, including
              but not limited to text, graphics, logos, interview questions,
              feedback algorithms, and software, are owned by NorthStar or its
              licensors and are protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <h3 className="text-xl font-semibold mb-2">5.2 Your Content</h3>
            <p className="mb-4">
              You retain ownership of any voice recordings, responses, and other
              content you submit through the Service ("User Content"). By
              submitting User Content, you grant NorthStar a worldwide,
              non-exclusive, royalty-free license to use, reproduce, process,
              and analyze such content for the purpose of providing and
              improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. AI-Generated Content
            </h2>
            <p className="mb-4">
              The feedback and analysis provided by NorthStar is generated by
              artificial intelligence. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                AI-generated feedback should be used as guidance only and not as
                definitive career advice
              </li>
              <li>
                We do not guarantee the accuracy, completeness, or usefulness of
                any AI-generated content
              </li>
              <li>
                You should use your own judgment when applying feedback to real
                interview situations
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Payment and Subscriptions
            </h2>
            <p className="mb-4">
              Certain features of the Service may require payment. By purchasing
              a subscription or paid feature:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You agree to pay all fees associated with your selected plan
              </li>
              <li>
                Subscriptions automatically renew unless cancelled before the
                renewal date
              </li>
              <li>All fees are non-refundable except as required by law</li>
              <li>
                We reserve the right to change pricing with notice to existing
                subscribers
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT
              THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NORTHSTAR SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
              GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account at any
              time, with or without notice, for any reason, including if we
              believe you have violated these Terms of Service. Upon
              termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to Terms
            </h2>
            <p className="mb-4">
              We may modify these Terms of Service at any time. We will notify
              users of material changes via email or through the Service. Your
              continued use of the Service after such modifications constitutes
              acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the jurisdiction in which NorthStar
              operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* <section>
            <h2 className="text-2xl font-semibold mb-4">
              13. Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p className="mb-2">Email: legal@northstar.com</p>
            <p>Address: [Your Company Address]</p>
          </section> */}
        </div>
      </main>
    </div>
  );
}
