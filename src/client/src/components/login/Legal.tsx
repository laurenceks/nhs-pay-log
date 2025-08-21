import LoginWrapper from "./LoginWrapper";
import { Link } from "@tanstack/react-router";

const Legal = () => (
    <div>
        <LoginWrapper></LoginWrapper>
        <div className="mx-auto" style={{ maxWidth: "45rem" }}>
            <p className="mb-5">
                <Link to={"/register"}>Back to register</Link>
            </p>
            <h1>Legal Information</h1>
            <p>
                This page contains the Privacy Policy and Terms and Conditions
                for NHS Pay Log {"('the app')"}. Both include a{" "}
                <strong>Quick Summary</strong> (easy to read) followed by the{" "}
                <strong>Full Version</strong> (legally complete).
            </p>

            <hr />

            <h2>Privacy Policy – Quick Summary</h2>
            <ul>
                <li>
                    <strong>What We Collect</strong> – Email addresses, hashed
                    passwords, salary and shift data.
                </li>
                <li>
                    <strong>How We Use It</strong> – To run the app, show your
                    shifts and calculations, and keep your account secure.
                </li>
                <li>
                    <strong>Who Can See It</strong> – Only you can see your
                    account info; we do <strong>not</strong> share your data
                    with third parties or other users.
                </li>
                <li>
                    <strong>Access for Maintenance</strong> – The app creator
                    may access your data for legitimate purposes (debugging,
                    maintenance, auditing, or upgrades).
                </li>
                <li>
                    <strong>Data Storage and Security</strong> – Stored
                    securely; passwords are hashed. Data may sometimes be
                    downloaded temporarily for maintenance but will be deleted
                    once the task is done.
                </li>
                <li>
                    <strong>Your Rights</strong> – You can access or request
                    deletion of your data anytime by emailing{" "}
                    <strong>[placeholder@example.com]</strong>.
                </li>
                <li>
                    <strong>Third-Party Services</strong> – We use only Google
                    Fonts; no other third-party analytics or trackers are used.
                </li>
                <li>
                    <strong>Children</strong> – The app is{" "}
                    <strong>not intended for children under 16</strong>.
                </li>
                <li>
                    <strong>Changes</strong> – We may update this policy;
                    continued use means you accept the updated policy.
                </li>
                <li>
                    <strong>Contact</strong> – For questions, contact{" "}
                    <strong>[placeholder@example.com]</strong>.
                </li>
            </ul>

            <hr />

            <h2>Privacy Policy – Full Version</h2>
            <p>
                <strong>Effective Date:</strong> 21 August 2025{" "}
            </p>
            <p>
                This Privacy Policy explains how your personal information is
                collected, used, and protected when you use this web app.{" "}
            </p>

            <h3>1. Information We Collect</h3>
            <ul>
                <li>Email addresses and hashed passwords</li>
                <li>Salary and shift/work hour information</li>
            </ul>

            <h3>2. How We Use Your Data</h3>
            <ul>
                <li>Provide and maintain the app</li>
                <li>Allow you to log in and manage your shifts and salaries</li>
                <li>Ensure account security</li>
            </ul>
            <p>
                We do <strong>not</strong> sell or market your data.{" "}
            </p>

            <h3>3. Data Sharing and Disclosure</h3>
            <p>
                We do not share your personal data with third parties, except as
                required by law.{" "}
            </p>

            <h3>4. Data Security</h3>
            <ul>
                <li>
                    Passwords are stored securely using industry-standard
                    hashing.
                </li>
                <li>
                    While we use reasonable security measures, no system is
                    completely secure.
                </li>
            </ul>

            <h3>5. Access for Maintenance and Support</h3>
            <ul>
                <li>
                    The app creator may access your data for legitimate
                    purposes, including debugging, maintenance, upgrades,
                    auditing, and troubleshooting.
                </li>
                <li>
                    User data may be temporarily downloaded to local systems for
                    these purposes and will be deleted once the task is
                    completed.
                </li>
                <li>
                    Data is never accessed for personal, commercial, or
                    unrelated purposes.
                </li>
            </ul>

            <h3>6. Your Rights</h3>
            <ul>
                <li>Access the data we hold about you</li>
                <li>Request deletion of your data</li>
                <li>Correct inaccurate data</li>
            </ul>
            <p>
                Contact <strong>[placeholder@example.com]</strong> to exercise
                these rights.{" "}
            </p>

            <h3>7. Third-Party Services</h3>
            <p>
                The app uses <strong>Google Fonts</strong> only. No analytics,
                tracking, or advertising services are used.
            </p>

            <h3>8. Children</h3>
            <p>The app is not intended for children under 13.</p>

            <h3>9. Data Retention</h3>
            <p>
                Data is kept only as long as necessary to provide the
                service.{" "}
            </p>

            <h3>10. Changes</h3>
            <p>We may update this policy from time to time.</p>

            <h3>11. Governing Law</h3>
            <p>This policy is governed by the laws of England and Wales.</p>

            <h3>12. Contact</h3>
            <p>
                Questions? Contact <strong>[placeholder@example.com]</strong>
                .{" "}
            </p>

            <hr />

            <h2>Terms and Conditions – Quick Summary</h2>
            <ul>
                <li>
                    <strong>Free to Use</strong> – The app is provided at no
                    cost.
                </li>
                <li>
                    <strong>Use Responsibly</strong> – Don’t commit fraud or
                    access other people’s data.
                </li>
                <li>
                    <strong>Your Account</strong> – Keep your login secure and
                    enter accurate information.
                </li>
                <li>
                    <strong> Financial Calculations Are Guidance Only </strong>{" "}
                    – Accuracy is <strong>not guaranteed</strong>.
                </li>
                <li>
                    <strong>No Warranty / “As Is”</strong> – The app is provided
                    as-is without guarantees.
                </li>
                <li>
                    <strong>No Liability</strong> – The app creator isn’t
                    responsible for downtime, errors, or financial losses.
                </li>
                <li>
                    <strong>Maintenance Access</strong> – The app creator may
                    access your data (and download it temporarily) for
                    debugging, upgrades, auditing, or maintenance.
                </li>
                <li>
                    <strong>Indemnity</strong> – You agree to cover claims or
                    losses caused by misuse of the app.
                </li>
                <li>
                    <strong>Third-Party Services</strong> – We’re not
                    responsible for third-party services.
                </li>
                <li>
                    <strong>Termination</strong> – Access may be suspended or
                    ended at any time.
                </li>
                <li>
                    <strong>Governing Law</strong> – Terms are under the laws of
                    England and Wales.
                </li>
                <li>
                    <strong>Updates</strong> – Continued use means you accept
                    updated terms.
                </li>
                <li>
                    <strong>Contact</strong> – Questions? Email{" "}
                    <strong>[placeholder@example.com]</strong>.
                </li>
            </ul>

            <hr />

            <h2>Terms and Conditions – Full Version</h2>
            <p>
                <strong>Effective Date:</strong> 21 August 2025{" "}
            </p>
            <p>By using this web app, you agree to the following terms:</p>

            <h3>1. Use of the App</h3>
            <ul>
                <li>The app is free to use.</li>
                <li>
                    You may not use it to commit fraud or illegal activity
                    (e.g., creating false payslips).
                </li>
            </ul>

            <h3>2. Account Responsibility</h3>
            <ul>
                <li>You are responsible for your login credentials.</li>
                <li>You must provide accurate information.</li>
            </ul>

            <h3>3. Data and Privacy</h3>
            <ul>
                <li>
                    Your data is stored securely but the app is provided “as
                    is.”
                </li>
                <li>No guarantee of complete security is given.</li>
            </ul>

            <h3>4. Financial Calculations</h3>
            <ul>
                <li>All projections are for guidance only.</li>
                <li>Accuracy is not guaranteed.</li>
                <li>
                    The creator is not liable for financial decisions based on
                    the app.
                </li>
            </ul>

            <h3>5. Intellectual Property</h3>
            <p>The app and its content belong to the creator.</p>

            <h3>6. No Warranty / “As Is”</h3>
            <p>The app is provided without warranties of any kind.</p>

            <h3>7. Limitation of Liability</h3>
            <p>
                To the fullest extent permitted by law, the creator is not
                liable for losses, downtime, errors, or consequences from using
                the app.{" "}
            </p>

            <h3>8. Indemnity</h3>
            <p>
                You agree to indemnify and hold the creator harmless from
                claims, damages, or losses caused by misuse.{" "}
            </p>

            <h3>9. Third-Party Services</h3>
            <p>We are not responsible for third-party services or content. </p>

            <h3>10. Maintenance, Debugging, and Auditing</h3>
            <ul>
                <li>
                    The app creator may access your data for legitimate reasons,
                    including debugging, maintenance, upgrades, and audits.
                </li>
                <li>
                    This may include downloading the database (in part or in
                    full) to local systems for technical purposes.
                </li>
                <li>
                    Any such data will be handled securely and deleted once no
                    longer needed.
                </li>
            </ul>

            <h3>11. Termination</h3>
            <p>Access may be suspended or terminated without notice.</p>

            <h3>12. Governing Law / Jurisdiction</h3>
            <p>These terms are governed by the laws of England and Wales. </p>

            <h3>13. Changes</h3>
            <p>Terms may be updated; continued use means acceptance.</p>

            <h3>14. Contact</h3>
            <p>
                Questions? Contact <strong>[placeholder@example.com]</strong>
                .{" "}
            </p>
            <p className="mt-3">
                <Link to={"/register"}>Back to register</Link>
            </p>
        </div>
    </div>
);

export default Legal;
