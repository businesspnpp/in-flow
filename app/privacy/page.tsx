export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {" "}
      <div className="max-w-2xl mx-auto">
        {" "}
        <div className="mb-10 border-b border-zinc-200 pb-6">
          {" "}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
            inFlow
          </p>{" "}
          <h1 className="text-2xl font-bold text-zinc-900">Privacy Policy</h1>{" "}
          <p className="text-sm text-zinc-500 mt-1">
            {" "}
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
          </p>{" "}
        </div>{" "}
        <div className="space-y-8 text-sm text-zinc-900 leading-relaxed">
          {" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              1. Introduction
            </h2>{" "}
            <p>
              {" "}
              InFlow ("we," "us," "our") operates the InFlow platform (the
              "Service"). This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              services. If you do not agree with our practices, please do not
              use our Service.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              2. Information We Collect
            </h2>{" "}
            <p className="font-semibold text-zinc-900 mb-1">
              A. Information you provide directly
            </p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>
                <strong className="text-zinc-900">Account information:</strong>{" "}
                Name, email, password, business name, phone, and profile
                details.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Business information:</strong>{" "}
                Address, industry, and operational details.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Payment information:</strong>{" "}
                Billing details via our payment processor. We do not store card
                numbers directly.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Communications:</strong>{" "}
                Messages and attachments you send us.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Customer data:</strong>{" "}
                Bookings, invoices, quotes, inventory, and business transactions
                you input.
              </li>{" "}
            </ul>{" "}
            <p className="font-semibold text-zinc-900 mt-4 mb-1">
              B. Information collected automatically
            </p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>Device type, OS, and unique device identifiers.</li>{" "}
              <li>
                Pages visited, time on page, features used, and actions taken.
              </li>{" "}
              <li>IP address and approximate location derived from IP.</li>{" "}
              <li>Cookies and similar tracking technologies.</li>{" "}
            </ul>{" "}
            <p className="font-semibold text-zinc-900 mt-4 mb-1">
              C. Information from third parties
            </p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>
                Data from integrated services (e.g. WhatsApp, payment
                processors) as required for integration.
              </li>{" "}
              <li>
                Publicly available information from linked social media
                accounts.
              </li>{" "}
            </ul>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              3. How We Use Your Information
            </h2>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>Providing, maintaining, and improving the Service</li>{" "}
              <li>Processing transactions and sending confirmations</li>{" "}
              <li>Creating and managing your account</li>{" "}
              <li>Sending service-related announcements and updates</li>{" "}
              <li>Responding to inquiries and support requests</li>{" "}
              <li>
                Sending marketing communications (with consent where required)
              </li>{" "}
              <li>Analytics and usage tracking to improve user experience</li>{" "}
              <li>Protecting against fraudulent or illegal activity</li>{" "}
              <li>
                Complying with legal obligations and enforcing our Terms of
                Service
              </li>{" "}
            </ul>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              4. Data Security
            </h2>{" "}
            <p>
              {" "}
              We implement SSL/TLS encryption for data in transit, encryption at
              rest, regular security audits, access controls, and employee
              training on data protection. No method of transmission over the
              internet is completely secure — you use the Service at your own
              risk.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              5. Your Rights
            </h2>{" "}
            <p className="mb-2">
              Depending on your jurisdiction, you may have the right to:
            </p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>
                <strong className="text-zinc-900">Access:</strong> Request a
                copy of your personal data.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Rectification:</strong>{" "}
                Correct inaccurate or incomplete information.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Erasure:</strong> Request
                deletion of your personal data, subject to legal requirements.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Portability:</strong> Receive
                your data in a structured, machine-readable format.
              </li>{" "}
              <li>
                <strong className="text-zinc-900">Opt-out:</strong> Withdraw
                consent for marketing communications at any time.
              </li>{" "}
            </ul>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              6. Cookies
            </h2>{" "}
            <p>
              {" "}
              We use cookies and similar technologies for authentication,
              preferences, analytics, and marketing. You can control cookies
              through your browser settings, though disabling them may affect
              Service functionality.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              7. Sharing Your Information
            </h2>{" "}
            <p className="mb-2">We share your information only with:</p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>
                Service providers operating on our behalf (hosting, analytics,
                payment processing)
              </li>{" "}
              <li>
                Legal authorities when required by law or to protect rights and
                safety
              </li>{" "}
              <li>
                Acquirers in the event of a merger, acquisition, or asset sale
              </li>{" "}
            </ul>{" "}
            <p className="mt-2">
              We do not sell your personal data to third parties.
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              8. Third-Party Services
            </h2>{" "}
            <p>
              {" "}
              Our Service may link to third-party websites. This policy does not
              apply to those sites. Review their privacy policies before
              providing information. Your use of integrated third-party services
              is governed by their terms.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              9. Data Retention
            </h2>{" "}
            <p>
              {" "}
              We retain your information as long as necessary to provide the
              Service, comply with legal obligations, and resolve disputes. You
              can request account deletion at any time by contacting us. Some
              data may be retained in backups for a limited period or as
              required by law.{" "}
            </p>{" "}
            <div className="mt-3 bg-red-50 border border-red-200 p-5">
              {" "}
              <p className="text-xs font-semibold text-red-800 mb-1">
                Meta Integration Data Deletion
              </p>{" "}
              <p className="text-zinc-900">
                {" "}
                To delete data retrieved via Meta integrations
                (WhatsApp/Instagram), email{" "}
                <a
                  href="mailto:privacy@inflow.app"
                  className="font-semibold text-red-700 underline"
                >
                  {" "}
                  privacy@inflow.app{" "}
                </a>{" "}
                . All connected platform data will be purged from active servers
                within 30 days. Confirmation will be sent upon completion.{" "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              10. Children's Privacy
            </h2>{" "}
            <p>
              {" "}
              The Service is not intended for individuals under 18. We do not
              knowingly collect personal information from children. If you
              believe we have, contact us immediately and we will delete it
              promptly.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              11. International Data Transfer
            </h2>{" "}
            <p>
              {" "}
              Your information may be transferred to and processed in countries
              with different data protection laws. By using the Service, you
              consent to such transfers. We implement appropriate safeguards
              including standard contractual clauses.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              12. California Residents (CCPA)
            </h2>{" "}
            <p className="mb-2">California residents have the right to:</p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>
                Know what personal information is collected, used, shared, or
                sold
              </li>{" "}
              <li>Delete personal information collected from you</li>{" "}
              <li>Opt-out of the sale or sharing of personal information</li>{" "}
              <li>Non-discrimination for exercising CCPA rights</li>{" "}
            </ul>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              13. Policy Changes
            </h2>{" "}
            <p>
              {" "}
              We may update this policy periodically. Material changes will be
              posted on our website with an updated date. Continued use of the
              Service after changes constitutes acceptance of the updated
              policy.{" "}
            </p>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              14. Contact Us
            </h2>{" "}
            <div className="border border-zinc-200 bg-zinc-50 p-5">
              {" "}
              <p className="font-semibold text-zinc-900 mb-2">InFlow</p>{" "}
              <p className="text-zinc-600 mb-1">
                {" "}
                Privacy inquiries and data subject requests:{" "}
                <a
                  href="mailto:privacy@inflow.app"
                  className="text-amber-700 font-semibold underline"
                >
                  {" "}
                  privacy@inflow.app{" "}
                </a>{" "}
              </p>{" "}
              <p className="text-zinc-600">
                {" "}
                General support:{" "}
                <a
                  href="mailto:support@inflow.app"
                  className="text-amber-700 font-semibold underline"
                >
                  {" "}
                  support@inflow.app{" "}
                </a>{" "}
              </p>{" "}
              <p className="text-zinc-500 text-xs mt-3">
                {" "}
                We will respond to requests within 30 days or as required by
                applicable law.{" "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section>
            {" "}
            <h2 className="text-base font-semibold text-zinc-900 mb-2">
              15. Legal Compliance
            </h2>{" "}
            <p className="mb-2">This policy is designed to comply with:</p>{" "}
            <ul className="space-y-1 pl-4 list-disc text-zinc-600">
              {" "}
              <li>GDPR — EU residents</li> <li>CCPA — California residents</li>{" "}
              <li>PIPEDA — Canadian residents</li>{" "}
              <li>POPIA — South African residents</li>{" "}
              <li>
                Other applicable state and international privacy laws
              </li>{" "}
            </ul>{" "}
          </section>{" "}
          <div className="border border-zinc-200 bg-zinc-50 p-5 text-xs text-zinc-500">
            {" "}
            By using the InFlow Service, you acknowledge that you have read this
            Privacy Policy and understand our privacy practices. If you do not
            agree with any part of this policy, please do not use our
            Service.{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
