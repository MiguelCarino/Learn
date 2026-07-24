/* =====================================================================
   Carino Learn — ISO 27001 template library (ported from ISO-27001 repo)
   Full template/document content, verbatim. Data only — no logic.
   ===================================================================== */
window.ISO27001_TEMPLATES =
[
  /* ── ISMS CORE ─────────────────────────────────────────────── */
  {
    id: 'isms-policy',
    cat: 'isms',
    name: 'Information Security Policy',
    desc: 'Top-level policy establishing management commitment and direction for information security.',
    annex: 'Clause 5.2',
    tier: 'mandatory',
    content: `INFORMATION SECURITY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-001
Version            : 2.0
Effective Date     : [DATE]
Owner              : CISO / Information Security Manager
Review Cycle       : Annual; immediate review on significant threat/regulatory change
Classification     : Public

1. PURPOSE
──────────
[ORGANIZATION NAME] is committed to protecting the confidentiality,
integrity, and availability of all information assets — including data,
systems, people, and processes — against evolving threats.

This policy establishes the framework for the Information Security Management
System (ISMS) in accordance with ISO/IEC 27001:2022 and reflects our commitment
to a risk-based, continuously improving approach to information security.

2. SCOPE
─────────
This policy applies to:
• All employees (permanent, fixed-term, part-time), contractors, consultants,
  interns, and third parties who access organisational information or systems.
• All information assets owned, managed, or processed by [ORGANIZATION NAME],
  regardless of format (digital, physical, verbal) or location (on-premises,
  cloud, remote work, third-party facilities).
• All subsidiaries and affiliates operating under [ORGANIZATION NAME] governance.

3. INFORMATION SECURITY PRINCIPLES
────────────────────────────────────
[ORGANIZATION NAME] applies the following core principles:

Confidentiality  : Information is accessible only to those authorised to access it.
Integrity        : Information and systems are accurate, complete, and protected
                   from unauthorised modification.
Availability     : Information and systems are accessible when needed by authorised
                   users, within agreed service levels.
Accountability   : All actions affecting information assets are attributable to
                   an identifiable individual or system.
Non-repudiation  : Actions cannot be denied after the fact; audit trails maintained.

4. STRATEGIC COMMITMENTS
──────────────────────────
[ORGANIZATION NAME] commits to:
a) Protecting personal data and privacy in compliance with [GDPR / applicable law].
b) Maintaining business continuity and minimising the impact of security incidents.
c) Complying with all applicable legal, regulatory, and contractual obligations.
d) Managing information security risks in proportion to their likelihood and impact.
e) Continually improving the effectiveness of the ISMS.
f) Integrating security into all projects, products, and operational processes.
g) Building a security-conscious culture where all staff understand their role.

5. TOPIC-SPECIFIC POLICY AREAS
────────────────────────────────
This overarching policy is supported by topic-specific policies. All staff
must comply with the relevant topic-specific policies for their role:

• Acceptable Use Policy              [ORG]-POL-002
• Access Control Policy              [ORG]-POL-003
• Data Classification Policy         [ORG]-POL-004
• Incident Response Policy           [ORG]-POL-005
• Business Continuity Policy         [ORG]-POL-006
• Cryptography Policy                [ORG]-POL-007
• Supplier Security Policy           [ORG]-POL-008
• Remote Working Policy              [ORG]-POL-009
• AI and Emerging Technology Policy  [ORG]-POL-010

6. ARTIFICIAL INTELLIGENCE AND GENERATIVE AI
──────────────────────────────────────────────
The use of AI tools (large language models, generative AI, AI-assisted coding)
introduces specific information security and data protection risks.
[ORGANIZATION NAME] adopts the following position:

Approved AI tools   : [List approved tools — e.g., Microsoft Copilot (M365),
                       GitHub Copilot, internal AI platform]
Prohibited uses     :
  ✗ Processing SECRET-classified data in any external AI/LLM service
  ✗ Processing personal data in external AI tools without DPA/DPO approval
  ✗ Submitting proprietary source code to non-approved AI coding assistants
  ✗ Using AI-generated code in production without human security review
  ✗ Automated AI-driven decision-making on individuals without human oversight
Requirements        :
  □ AI tool usage must be logged and auditable
  □ AI-generated content in official communications must be disclosed where required
  □ AI model outputs (code, policies, analyses) must be reviewed by a competent human
  □ Data sent to AI services must be classified and approved for that classification
  □ Supply chain: AI vendor security must be assessed as a Tier-1 supplier

Guidance            : NCSC UK "AI Security" guidance | ENISA AI Threat Landscape

7. CLOUD AND HYBRID ENVIRONMENTS
───────────────────────────────────
[ORGANIZATION NAME] operates in [cloud provider(s) / hybrid] environments.
The following principles apply:

Shared Responsibility : Understand and document what [ORGANIZATION NAME] is
  responsible for vs. what the cloud provider secures. Never assume cloud
  providers secure your data — they secure the infrastructure, you secure
  your data, identities, and configurations.

Cloud Security Baseline:
  □ All cloud resources tagged with owner, environment, and classification
  □ Cloud posture management tool deployed ([Defender CSPM / AWS Security Hub /
    Wiz / Prisma Cloud]) — alerts reviewed weekly
  □ No public S3 buckets / Azure Blobs without explicit business justification
    and CISO approval. Storage account access level audited monthly.
  □ Cloud management console access: MFA mandatory (FIDO2 preferred)
  □ Infrastructure-as-Code (IaC): all changes via version-controlled IaC;
    no manual console changes to production without change management approval
  □ Cloud audit logging: CloudTrail / Azure Activity Log / GCP Audit Log enabled,
    centralised in SIEM, retained minimum 12 months

Container and Kubernetes security:
  □ Container images scanned for CVEs in CI/CD pipeline before deployment
  □ No containers run as root in production
  □ Kubernetes RBAC enforced; default namespace not used in production
  □ Secrets managed by Vault or cloud-native secrets manager; not in ConfigMaps

8. SOFTWARE SUPPLY CHAIN SECURITY
────────────────────────────────────
Software supply chain attacks (SolarWinds, XZ Utils, Log4Shell) represent a
significant and growing threat. [ORGANIZATION NAME] adopts:

□ Software Bill of Materials (SBOM): generated for all software releases
  (SPDX or CycloneDX format); retained with each release artefact.
□ Dependency management: automated vulnerability scanning of all dependencies
  (Dependabot / Snyk / OWASP Dependency-Check) in every repository.
□ Third-party libraries: pinned versions with hash verification; no wild-card
  version ranges for production dependencies.
□ Package registry integrity: verify package signatures where available.
  npm provenance / PyPI attestations / Maven Central GPG.
□ Build provenance: SLSA Level 2 minimum for internal software (signed builds).
  Target SLSA Level 3 for customer-facing and critical internal software.
□ Typosquatting protection: registry allowlisting in CI/CD pipelines.
□ Vendor/open-source security assessment: treat active open-source dependencies
  as Tier-2 suppliers; assess maintainer responsiveness and security track record.

Reference: OpenSSF Scorecard (securityscorecards.dev) for open-source libraries.

9. ROLES AND RESPONSIBILITIES
──────────────────────────────
Role                    │ IS Accountability
────────────────────────┼──────────────────────────────────────────────────────
CEO / Board             │ Ultimate accountability; approve IS budget and risk appetite
CISO                    │ Own, maintain, and improve the ISMS; report to Board quarterly
IT Manager              │ Implement and operate technical controls
Data Protection Officer │ GDPR compliance; PII handling oversight
Legal / Compliance      │ Legal obligations; regulatory notification decisions
HR Manager              │ Security clauses in contracts; disciplinary process
Line Managers           │ Access reviews; policy enforcement within their teams
All Staff               │ Report incidents; comply with policies; complete training
Third Parties           │ Comply with Supplier Security Policy; notify of incidents

10. COMPLIANCE AND CONSEQUENCES
────────────────────────────────
Non-compliance with this policy or any topic-specific policies may result in:
• Formal verbal or written warning
• Suspension of system access privileges
• Disciplinary action up to and including dismissal
• Civil or criminal proceedings where applicable

Security violations involving criminal offences (unauthorised computer access,
data theft, fraud) will be reported to law enforcement.
Third-party violations: may result in contract termination and civil recovery.

11. REVIEW AND APPROVAL
────────────────────────
This policy is reviewed annually by the CISO and approved by Senior Management.
Immediate review is triggered by:
• A significant security incident (P1/P2)
• Material changes to the organisation or its operations
• New legal or regulatory requirements
• Significant changes to the threat landscape

─────────────────────────────────────────────────────────────────────
Approved by : _________________________________ Date : ___________
              [CEO / Managing Director / Board Sponsor]

Reviewed by : _________________________________ Date : ___________
              [CISO]

Next Review : ___________
`
  },
  {
    id: 'isms-scope',
    cat: 'isms',
    name: 'ISMS Scope Statement',
    desc: 'Defines the boundaries and applicability of the ISMS including locations, assets, and exclusions.',
    annex: 'Clause 4.3',
    tier: 'mandatory',
    content: `ISMS SCOPE STATEMENT
═══════════════════════════════════════
Document Reference : [ORG]-SCOPE-001
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO

1. ORGANIZATION OVERVIEW
─────────────────────────
[ORGANIZATION NAME] is a [TYPE OF ORGANIZATION] operating in the
[INDUSTRY SECTOR] sector. Headquarters: [ADDRESS].

2. SCOPE BOUNDARIES
────────────────────
The ISMS covers the following:

Locations:
• [PRIMARY SITE / OFFICE ADDRESS]
• [SECONDARY SITE / DATA CENTER / REMOTE WORKERS]
• Cloud infrastructure hosted on [CLOUD PROVIDER(S)]

Organizational Units:
• [LIST DEPARTMENTS / DIVISIONS IN SCOPE]

Information Assets:
• Customer data and personal information
• Financial and accounting records
• Intellectual property and trade secrets
• IT infrastructure (servers, networks, endpoints)
• Business applications: [LIST KEY SYSTEMS]

Business Processes:
• [PROCESS 1 — e.g., Customer Onboarding]
• [PROCESS 2 — e.g., Software Development & Deployment]
• [PROCESS 3 — e.g., Payment Processing]

3. EXCLUSIONS AND JUSTIFICATIONS
──────────────────────────────────
The following are explicitly excluded from the ISMS scope:

• [EXCLUDED UNIT / SYSTEM]
  Justification: [REASON — e.g., Managed entirely by third party under
  their own certified ISMS (Cert No. XXXX)]

4. INTERFACES AND DEPENDENCIES
───────────────────────────────
The ISMS interfaces with the following external parties:
• [SUPPLIER / PARTNER NAME] — [NATURE OF INTERFACE]
• [CLOUD / HOSTING PROVIDER] — Infrastructure as a Service

5. APPLICABLE STANDARDS AND REGULATIONS
─────────────────────────────────────────
• ISO/IEC 27001:2022
• [GDPR / HIPAA / PCI-DSS / LOCAL REGULATION]
• [INDUSTRY-SPECIFIC COMPLIANCE REQUIREMENT]

─────────────────────────────────────────────────────
Approved by: _________________________ Date: _________
`
  },
  {
    id: 'isms-soa',
    cat: 'isms',
    name: 'Statement of Applicability (SoA)',
    desc: 'Declares which Annex A controls are applicable, with justifications for inclusions and exclusions.',
    annex: 'Clause 6.1.3',
    tier: 'mandatory',
    content: `STATEMENT OF APPLICABILITY (SoA)
═══════════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-SOA-001
Version            : 1.0
Date               : [DATE]
Owner              : CISO
Approved by        : [NAME, TITLE]

COLUMN KEY
───────────
App  : A = Applicable  |  N/A = Not Applicable
Impl : Y = Yes (fully) |  P = Partial  |  N = No / not yet

Ref     Control Name                                              App   Impl  Justification / Evidence
──────────────────────────────────────────────────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5   ORGANIZATIONAL CONTROLS  (37 controls)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1     Policies for information security                         [   ] [   ]
5.2     Information security roles and responsibilities           [   ] [   ]
5.3     Segregation of duties                                     [   ] [   ]
5.4     Management responsibilities                               [   ] [   ]
5.5     Contact with authorities                                  [   ] [   ]
5.6     Contact with special interest groups                      [   ] [   ]
5.7     Threat intelligence                                       [   ] [   ]
5.8     Information security in project management                [   ] [   ]
5.9     Inventory of information and other associated assets      [   ] [   ]
5.10    Acceptable use of information and other associated assets  [   ] [   ]
5.11    Return of assets                                          [   ] [   ]
5.12    Classification of information                             [   ] [   ]
5.13    Labelling of information                                  [   ] [   ]
5.14    Information transfer                                      [   ] [   ]
5.15    Access control                                            [   ] [   ]
5.16    Identity management                                       [   ] [   ]
5.17    Authentication information                                [   ] [   ]
5.18    Access rights                                             [   ] [   ]
5.19    Information security in supplier relationships            [   ] [   ]
5.20    Addressing information security within supplier agreements [   ] [   ]
5.21    Managing IS in the ICT supply chain                       [   ] [   ]
5.22    Monitoring, review and change management of supplier svcs  [   ] [   ]
5.23    Information security for use of cloud services            [   ] [   ]
5.24    IS incident management planning and preparation           [   ] [   ]
5.25    Assessment and decision on information security events    [   ] [   ]
5.26    Response to information security incidents                [   ] [   ]
5.27    Learning from information security incidents              [   ] [   ]
5.28    Collection of evidence                                    [   ] [   ]
5.29    Information security during disruption                    [   ] [   ]
5.30    ICT readiness for business continuity                     [   ] [   ]
5.31    Legal, statutory, regulatory and contractual requirements  [   ] [   ]
5.32    Intellectual property rights                              [   ] [   ]
5.33    Protection of records                                     [   ] [   ]
5.34    Privacy and protection of personal identifiable info (PII) [   ] [   ]
5.35    Independent review of information security                [   ] [   ]
5.36    Compliance with policies, rules and standards for IS      [   ] [   ]
5.37    Documented operating procedures                           [   ] [   ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6   PEOPLE CONTROLS  (8 controls)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.1     Screening                                                 [   ] [   ]
6.2     Terms and conditions of employment                        [   ] [   ]
6.3     Information security awareness, education and training    [   ] [   ]
6.4     Disciplinary process                                      [   ] [   ]
6.5     Responsibilities after termination or change of employment [   ] [   ]
6.6     Confidentiality or non-disclosure agreements              [   ] [   ]
6.7     Remote working                                            [   ] [   ]
6.8     Information security event reporting                      [   ] [   ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7   PHYSICAL CONTROLS  (14 controls)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7.1     Physical security perimeters                              [   ] [   ]
7.2     Physical entry                                            [   ] [   ]
7.3     Securing offices, rooms and facilities                    [   ] [   ]
7.4     Physical security monitoring                              [   ] [   ]
7.5     Protecting against physical and environmental threats     [   ] [   ]
7.6     Working in secure areas                                   [   ] [   ]
7.7     Clear desk and clear screen                               [   ] [   ]
7.8     Equipment siting and protection                           [   ] [   ]
7.9     Security of assets off-premises                           [   ] [   ]
7.10    Storage media                                             [   ] [   ]
7.11    Supporting utilities                                      [   ] [   ]
7.12    Cabling security                                          [   ] [   ]
7.13    Equipment maintenance                                     [   ] [   ]
7.14    Secure disposal or re-use of equipment                    [   ] [   ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8   TECHNOLOGICAL CONTROLS  (34 controls)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8.1     User end point devices                                    [   ] [   ]
8.2     Privileged access rights                                  [   ] [   ]
8.3     Information access restriction                            [   ] [   ]
8.4     Access to source code                                     [   ] [   ]
8.5     Secure authentication                                     [   ] [   ]
8.6     Capacity management                                       [   ] [   ]
8.7     Protection against malware                                [   ] [   ]
8.8     Management of technical vulnerabilities                   [   ] [   ]
8.9     Configuration management                                  [   ] [   ]
8.10    Information deletion                                      [   ] [   ]
8.11    Data masking                                              [   ] [   ]
8.12    Data leakage prevention                                   [   ] [   ]
8.13    Information backup                                        [   ] [   ]
8.14    Redundancy of information processing facilities           [   ] [   ]
8.15    Logging                                                   [   ] [   ]
8.16    Monitoring activities                                     [   ] [   ]
8.17    Clock synchronization                                     [   ] [   ]
8.18    Use of privileged utility programs                        [   ] [   ]
8.19    Installation of software on operational systems           [   ] [   ]
8.20    Networks security                                         [   ] [   ]
8.21    Security of network services                              [   ] [   ]
8.22    Segregation of networks                                   [   ] [   ]
8.23    Web filtering                                             [   ] [   ]
8.24    Use of cryptography                                       [   ] [   ]
8.25    Secure development life cycle                             [   ] [   ]
8.26    Application security requirements                         [   ] [   ]
8.27    Secure system architecture and engineering principles     [   ] [   ]
8.28    Secure coding                                             [   ] [   ]
8.29    Security testing in development and acceptance            [   ] [   ]
8.30    Outsourced development                                    [   ] [   ]
8.31    Separation of development, test and production environments [   ] [   ]
8.32    Change management                                         [   ] [   ]
8.33    Test information                                          [   ] [   ]
8.34    Protection of information systems during audit testing    [   ] [   ]

──────────────────────────────────────────────────────────────────────────────
SUMMARY
──────────────────────────────────────────────────────────────────────────────
Total controls assessed  : 93  (5: 37 | 6: 8 | 7: 14 | 8: 34)
Applicable               : ___
Not Applicable           : ___  (justification required for each)
Implemented (Y)          : ___
Partially implemented (P): ___
Not yet implemented (N)  : ___

──────────────────────────────────────────────────────────────────────────────
Prepared by : _________________________________ Date : ___________
Reviewed by : _________________________________ Date : ___________
Approved by : _________________________________ Date : ___________
`
  },
  {
    id: 'isms-objectives',
    cat: 'isms',
    name: 'Information Security Objectives',
    desc: 'Measurable security objectives aligned with the IS policy, with owners, targets, and review dates.',
    annex: 'Clause 6.2',
    tier: 'mandatory',
    content: `INFORMATION SECURITY OBJECTIVES
═══════════════════════════════════════
Document Reference : [ORG]-OBJ-001
Version            : 1.0
Review Period      : [YEAR]
Owner              : CISO

Objectives are SMART: Specific, Measurable, Achievable, Relevant, Time-bound.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJ-01  REDUCE SECURITY INCIDENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective  : Reduce the number of confirmed security incidents by 25%
             compared to the previous 12-month period.
Owner      : CISO
Measure    : Number of confirmed incidents (from incident log)
Baseline   : [X incidents in previous period]
Target     : ≤ [X * 0.75] incidents
Review Date: [DATE]
Status     : [ ] On Track  [ ] At Risk  [ ] Achieved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJ-02  SECURITY AWARENESS TRAINING COMPLETION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective  : Achieve 100% security awareness training completion
             across all staff within 30 days of joining, and annual
             refresher for all staff by [DATE].
Owner      : HR / CISO
Measure    : % of staff completed training (from LMS records)
Target     : 100% completion
Review Date: [DATE]
Status     : [ ] On Track  [ ] At Risk  [ ] Achieved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJ-03  PATCH MANAGEMENT SLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective  : Ensure 100% of Critical/High CVE patches applied within
             SLA: Critical ≤ 24h, High ≤ 7 days, Medium ≤ 30 days.
Owner      : IT Manager
Measure    : % of patches applied within SLA (from vulnerability scanner)
Target     : ≥ 98% compliance
Review Date: Quarterly
Status     : [ ] On Track  [ ] At Risk  [ ] Achieved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJ-04  VENDOR SECURITY ASSESSMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective  : Complete security assessments for all Tier-1 suppliers
             by [DATE] and annually thereafter.
Owner      : Procurement / CISO
Measure    : % of Tier-1 suppliers assessed
Target     : 100%
Review Date: [DATE]
Status     : [ ] On Track  [ ] At Risk  [ ] Achieved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJ-05  BACKUP RECOVERY TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objective  : Successfully complete backup restore tests for all
             critical systems at least twice per year.
Owner      : IT Manager
Measure    : Test completion records
Target     : 2 successful tests per year per critical system
Review Date: [DATE]
Status     : [ ] On Track  [ ] At Risk  [ ] Achieved

─────────────────────────────────────────────────────
Approved by: _________________________ Date: _________
`
  },

  /* ── RISK MANAGEMENT ───────────────────────────────────────── */
  {
    id: 'risk-methodology',
    cat: 'risk',
    name: 'Risk Assessment Methodology',
    desc: 'Defines the approach, criteria, and scoring method used to identify and evaluate information security risks.',
    annex: 'Clause 6.1.2',
    tier: 'mandatory',
    content: `RISK ASSESSMENT METHODOLOGY
═══════════════════════════════════════
Document Reference : [ORG]-RAM-001
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO

1. PURPOSE
──────────
This document defines the methodology used by [ORGANIZATION NAME]
to identify, analyze, evaluate, and treat information security risks
in accordance with ISO/IEC 27001:2022 Clause 6.1.2.

2. RISK ASSESSMENT APPROACH
────────────────────────────
Approach    : Asset-based risk assessment
Frequency   : Annual, or triggered by significant change
Participants: CISO, IT Manager, Department Heads, Risk Owner

3. RISK IDENTIFICATION
───────────────────────
Step 1: Identify information assets within scope.
Step 2: Identify threats that could exploit vulnerabilities.
Step 3: Identify existing controls.
Step 4: Identify potential consequences.

4. RISK ANALYSIS — LIKELIHOOD
───────────────────────────────
Score  Label        Criteria
  1    Rare         May occur only in exceptional circumstances (<5% per year)
  2    Unlikely     Could occur at some time (5–25% per year)
  3    Possible     Might occur at some time (25–50% per year)
  4    Likely       Will probably occur in most circumstances (50–75%)
  5    Almost Certain Expected to occur in most circumstances (>75%)

5. RISK ANALYSIS — IMPACT
──────────────────────────
Score  Label        Criteria
  1    Negligible   Minimal impact; no service disruption
  2    Minor        Minor impact; short-term disruption, low financial loss
  3    Moderate     Moderate impact; recoverable, regulatory notification
  4    Major        Significant impact; major service disruption, high cost
  5    Catastrophic Critical impact; regulatory action, reputational damage

6. RISK SCORING MATRIX
────────────────────────
Risk Score = Likelihood × Impact

  Score 1–4   : LOW      (Accept / Monitor)
  Score 5–9   : MEDIUM   (Treat / Transfer)
  Score 10–16 : HIGH     (Treat urgently / Escalate)
  Score 17–25 : CRITICAL (Immediate treatment required)

7. RISK ACCEPTANCE CRITERIA
─────────────────────────────
• LOW    (1–4)  : Accepted by CISO; reviewed annually.
• MEDIUM (5–9)  : Treatment plan required; CISO sign-off.
• HIGH  (10–16) : Senior Management sign-off; treatment ≤ 90 days.
• CRITICAL (17+): Board notification; immediate treatment.

8. RESIDUAL RISK
─────────────────
After applying controls, residual risk is calculated using the
same L×I matrix. Residual risk above the accepted threshold
must be escalated to senior management.

─────────────────────────────────────────────────────
Approved by: _________________________ Date: _________
`
  },
  {
    id: 'risk-register',
    cat: 'risk',
    name: 'Risk Register',
    desc: 'Living record of identified risks, their scores, treatment decisions, owners, and residual risk.',
    annex: 'Clause 6.1.2',
    tier: 'mandatory',
    content: `INFORMATION SECURITY RISK REGISTER
═══════════════════════════════════════
Document Reference : [ORG]-RR-001
Version            : 1.0
Last Updated       : [DATE]
Owner              : CISO
Next Review        : [DATE + 12 months]

LEGEND
──────
Likelihood (L): 1=Rare  2=Unlikely  3=Possible  4=Likely  5=Almost Certain
Impact     (I): 1=Negligible  2=Minor  3=Moderate  4=Major  5=Catastrophic
Score = L × I  │  LOW=1-4  MEDIUM=5-9  HIGH=10-16  CRITICAL=17-25
Treatment  (T): A=Accept  M=Mitigate  T=Transfer  V=Avoid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Asset         : Email System
Threat        : Phishing / Social Engineering
Vulnerability : Staff susceptibility to phishing emails
Existing Ctrl : Spam filter, basic awareness training
L             : 4  I: 4  Score: 16  Rating: HIGH
Treatment (T) : M — Mitigate
Treatment Plan: Deploy advanced email security (DMARC/DKIM/SPF),
                conduct monthly phishing simulations,
                enhance security awareness training.
Owner         : IT Manager
Due Date      : [DATE]
Residual L    : 2  Residual I: 3  Residual Score: 6  Rating: MEDIUM
Accepted by   : [CISO NAME]  Date: [DATE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK-002
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Asset         : Customer Database
Threat        : Unauthorized access / Data breach
Vulnerability : Insufficient access controls, weak MFA
Existing Ctrl : Password policy, role-based access
L             : 3  I: 5  Score: 15  Rating: HIGH
Treatment (T) : M
Treatment Plan: Implement MFA for all admin access,
                conduct quarterly access reviews,
                encrypt database at rest and in transit.
Owner         : Database Admin / CISO
Due Date      : [DATE]
Residual L    : 2  Residual I: 5  Residual Score: 10  Rating: HIGH
Accepted by   : [SENIOR MANAGEMENT]  Date: [DATE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK-003
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Asset         : Cloud Infrastructure ([PROVIDER])
Threat        : Cloud provider outage / Data loss
Vulnerability : Single cloud provider dependency
Existing Ctrl : Basic backups, SLA agreement
L             : 2  I: 4  Score: 8  Rating: MEDIUM
Treatment (T) : T — Transfer (cyber insurance) + M
Treatment Plan: Obtain cyber liability insurance,
                implement multi-region backups,
                test restore procedures bi-annually.
Owner         : IT Manager
Due Date      : [DATE]
Residual L    : 2  Residual I: 3  Residual Score: 6  Rating: MEDIUM
Accepted by   : [CISO NAME]  Date: [DATE]

[CONTINUE FOR ALL IDENTIFIED RISKS]

─────────────────────────────────────────────────────
RISK SUMMARY
Total Risks   : [X]
Critical      : [X]
High          : [X]
Medium        : [X]
Low           : [X]
─────────────────────────────────────────────────────
`
  },
  {
    id: 'risk-treatment',
    cat: 'risk',
    name: 'Risk Treatment Plan',
    desc: 'Action plan for implementing controls to treat risks above the acceptance threshold.',
    annex: 'Clause 6.1.3',
    tier: 'mandatory',
    content: `RISK TREATMENT PLAN
═══════════════════════════════════════
Document Reference : [ORG]-RTP-001
Version            : 1.0
Date               : [DATE]
Owner              : CISO

1. PURPOSE
──────────
This plan documents the selected treatment options, controls to be
implemented, resource requirements, timelines, and owners for all
risks requiring treatment from the Risk Register.

2. TREATMENT ACTIONS
─────────────────────

ACTION-01 — Advanced Email Security
  Risk Ref    : RISK-001
  Control     : A.8.23 Web filtering / A.5.14 Information transfer
  Description : Deploy DMARC, DKIM, SPF enforcement; implement
                advanced threat protection; run quarterly phishing sims.
  Resources   : [TOOL / VENDOR], [BUDGET]
  Owner       : IT Manager
  Start Date  : [DATE]
  Target Date : [DATE]
  Status      : [ ] Not Started  [ ] In Progress  [ ] Complete
  Evidence    : Email gateway config, phishing test reports

ACTION-02 — Multi-Factor Authentication
  Risk Ref    : RISK-002
  Control     : A.8.5 Secure authentication
  Description : Enforce MFA for all privileged accounts and
                remote access; deploy authenticator app.
  Resources   : [MFA SOLUTION], [BUDGET]
  Owner       : IT Manager
  Start Date  : [DATE]
  Target Date : [DATE]
  Status      : [ ] Not Started  [ ] In Progress  [ ] Complete
  Evidence    : MFA policy, enrollment records

ACTION-03 — Database Encryption
  Risk Ref    : RISK-002
  Control     : A.8.24 Use of cryptography
  Description : Enable at-rest encryption for customer database;
                enforce TLS 1.3 for all database connections.
  Resources   : [TOOL], [BUDGET]
  Owner       : Database Administrator
  Start Date  : [DATE]
  Target Date : [DATE]
  Status      : [ ] Not Started  [ ] In Progress  [ ] Complete
  Evidence    : Encryption configuration, key management docs

ACTION-04 — Cyber Insurance
  Risk Ref    : RISK-003
  Control     : Risk transfer
  Description : Obtain cyber liability insurance policy covering
                data breach response, ransomware, and business interruption.
  Resources   : [BROKER], [BUDGET]
  Owner       : CFO / CISO
  Start Date  : [DATE]
  Target Date : [DATE]
  Status      : [ ] Not Started  [ ] In Progress  [ ] Complete
  Evidence    : Insurance policy document

[CONTINUE FOR ALL TREATMENT ACTIONS]

─────────────────────────────────────────────────────
Approved by: _________________________ Date: _________
`
  },
  {
    id: 'risk-asset-register',
    cat: 'risk',
    name: 'Asset Register',
    desc: 'Inventory of all information assets within ISMS scope with classification, owner, and location.',
    annex: 'A.5.9',
    tier: 'mandatory',
    content: `INFORMATION ASSET REGISTER
═══════════════════════════════════════
Document Reference : [ORG]-AR-001
Version            : 1.0
Last Updated       : [DATE]
Owner              : CISO / IT Manager
Review Cycle       : Annual + on change

CLASSIFICATION LEVELS
─────────────────────
  PUBLIC       : Information approved for public release
  INTERNAL     : Internal use only; no external distribution
  CONFIDENTIAL : Restricted to specific roles; NDA required
  SECRET       : Highly sensitive; strict need-to-know

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HARDWARE ASSETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID      : HW-001
Name    : Primary File Server
Type    : Physical Server
Location: [DATA CENTER / RACK LOCATION]
Owner   : IT Manager
Class   : CONFIDENTIAL
Value   : HIGH
Controls: Physical access control, encryption, backup
Notes   : Hosts customer data; subject to GDPR

ID      : HW-002
Name    : Employee Laptops (x[N])
Type    : Endpoint
Location: Various / Remote
Owner   : IT Manager (by asset tag)
Class   : CONFIDENTIAL
Value   : MEDIUM
Controls: Full-disk encryption, MDM, AV, VPN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOFTWARE ASSETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID      : SW-001
Name    : [ERP / CRM SYSTEM]
Type    : Business Application
Location: [CLOUD / ON-PREM]
Owner   : [DEPARTMENT HEAD]
Class   : CONFIDENTIAL
Value   : CRITICAL
Controls: RBAC, MFA, audit logging, encrypted backups

ID      : SW-002
Name    : Customer Database
Type    : Database
Location: [SERVER / CLOUD]
Owner   : IT Manager / [DATA CONTROLLER]
Class   : SECRET
Value   : CRITICAL
Controls: Encryption at rest, access restricted to [ROLES],
          quarterly access review, DB activity monitoring

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA ASSETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID      : DA-001
Name    : Customer Personal Data
Type    : Personal Data (PII)
Location: Customer Database, CRM
Owner   : Data Protection Officer
Class   : SECRET
Value   : CRITICAL
Controls: Encryption, access control, retention policy,
          GDPR compliance, DPA agreements with processors

DA-002  : Financial Records
DA-003  : Source Code Repository
DA-004  : Staff HR Records

[CONTINUE FOR ALL ASSETS]
`
  },

  /* ── POLICIES ──────────────────────────────────────────────── */
  {
    id: 'pol-aup',
    cat: 'policy',
    name: 'Acceptable Use Policy',
    desc: 'Rules governing acceptable use of organizational IT systems, devices, and data by staff and contractors.',
    annex: 'A.5.10',
    tier: 'mandatory',
    content: `ACCEPTABLE USE POLICY
═══════════════════════════════════════
Document Reference : [ORG]-POL-002
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO / HR
Review Cycle       : Annual

1. PURPOSE
──────────
This policy defines the acceptable use of [ORGANIZATION NAME]'s
information technology resources to protect the organization and
its employees from legal risk and security threats.

2. SCOPE
────────
Applies to all employees, contractors, consultants, and third parties
who use [ORGANIZATION NAME]'s IT systems, networks, or data.

3. ACCEPTABLE USE
─────────────────
Permitted activities include:
• Work-related communication and collaboration.
• Accessing systems and data required for your role.
• Limited, non-disruptive personal use during breaks.
• Use of approved cloud services on the approved list.

4. PROHIBITED ACTIVITIES
─────────────────────────
The following are strictly prohibited:
a) Accessing, storing, or transmitting illegal content.
b) Installing unauthorized software or applications.
c) Bypassing or attempting to bypass security controls (VPN, firewall).
d) Sharing login credentials with colleagues or third parties.
e) Using organizational resources for commercial gain or competitive activities.
f) Storing organizational data on personal devices without MDM enrollment.
g) Accessing systems or data beyond your authorized scope.
h) Using AI/LLM tools to process confidential or secret data without
   explicit approval from the CISO.
i) Connecting unauthorized devices to the corporate network.

5. PERSONAL DEVICES (BYOD)
───────────────────────────
Personal devices may only access organizational systems if:
• Enrolled in the Mobile Device Management (MDM) system.
• Running approved security controls (AV, encryption, screen lock).
• Compliant with the Remote Working Policy.

6. MONITORING
─────────────
[ORGANIZATION NAME] reserves the right to monitor network traffic,
email, and endpoint activity for security purposes. Users have no
expectation of privacy on organizational systems.

7. VIOLATIONS
─────────────
Violations may result in disciplinary action including termination.
Criminal violations will be reported to law enforcement.

─────────────────────────────────────────────────────
I acknowledge I have read and understood this policy.

Name: _____________________ Signature: _______________
Role: _____________________ Date: ___________________
`
  },
  {
    id: 'pol-access',
    cat: 'policy',
    name: 'Access Control Policy',
    desc: 'Principles and rules for managing user access to information systems based on need-to-know and least privilege.',
    annex: 'A.5.15 / A.5.18',
    tier: 'mandatory',
    content: `ACCESS CONTROL POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-003
Version            : 2.0
Effective Date     : [DATE]
Owner              : CISO / IT Manager

1. CORE PRINCIPLES
───────────────────
• Least Privilege    : Grant minimum access required for the specific role.
• Need-to-Know       : Access justified by a documented business need.
• Segregation of Duties: No single user controls a complete sensitive process.
• Default Deny       : All access denied unless explicitly authorised.
• Zero-Trust         : Never trust, always verify — every request authenticated
                       and authorised regardless of network location.
• Explicit Verification: Access decisions use identity + device health +
                       location + behavioural context — not just a password.
• Assume Breach      : Design limits blast radius. No implicit lateral movement.

2. AUTHENTICATION STANDARDS
────────────────────────────
2a. Multi-Factor Authentication (MFA) — MANDATORY for:
  • All remote access (VPN, ZTNA, RDP, SSH, VDI)
  • All privileged and administrator accounts
  • Cloud consoles (AWS, Azure, GCP, etc.)
  • Email, collaboration, and productivity tools
  • Any SaaS or web application handling CONFIDENTIAL+ data

  MFA Strength Hierarchy (strongest first):
    1. FIDO2 hardware key (YubiKey / Titan) ← PHISHING-RESISTANT ← Required for Tier-0/1
    2. Device-bound passkey (platform TPM authenticator)
    3. TOTP authenticator app (Microsoft / Google / Aegis Authenticator)
    4. Push notification (educate users about MFA fatigue / prompt bombing)
    5. SMS OTP — PROHIBITED for privileged access; phase out for all uses by [DATE+12m]
    Note: Security questions and knowledge-based authentication are PROHIBITED.

2b. Passwordless Authentication Roadmap (Target: [DATE+24m])
  Phase 1 [DATE+6m]  : FIDO2 keys deployed to all IT staff and privileged accounts.
  Phase 2 [DATE+12m] : Passkeys for all cloud console and SaaS authentication.
  Phase 3 [DATE+18m] : Passkeys for all internal web application authentication.
  Phase 4 [DATE+24m] : Passwords become recovery-only mechanism for all services.

2c. Password Requirements (where passwords remain necessary)
  Minimum length     : 16 characters (14 absolute minimum)
  Complexity         : Length drives security; avoid mandatory complexity that
                       encourages predictable substitutions (P@ssw0rd, etc.)
  Breach checking    : Verify against HIBP API at every set/reset event
  Reuse prohibition  : Last 24 passwords cannot be reused
  Mandatory rotation : ONLY on confirmed or suspected compromise (not periodic)
                       Note: NIST SP 800-63B explicitly discourages periodic rotation
                       without evidence of compromise — it drives weaker passwords.
  Password managers  : Approved organisational vault required (1Password / Bitwarden /
                       KeePassXC + synced vault). Personal browser storage prohibited
                       for work credentials.

3. USER ACCESS LIFECYCLE
──────────────────────────
ONBOARDING (before Day 1 login):
  □ Line manager submits Access Request Form (ARF) with business justification.
  □ IT provisions role-based group membership — no individual permissions.
  □ MFA device enrolled before any account is activated.
  □ User signs Acceptable Use Policy and receives security briefing.
  □ Credentials communicated via separate out-of-band channel (never email).
  □ Access provisioned within [1] business day; privileged within [2] business days.

ROLE CHANGES / TRANSFERS:
  □ HR notifies IT minimum [3] business days before effective date.
  □ Previous role access removed on effective date — access not carried forward.
  □ New role access requires fresh ARF; not assumed from old role.
  □ Change logged in Access Management Register with manager authorisation.

OFFBOARDING (zero tolerance for delays):
  Within 1 hour of notification (immediate for involuntary terminations):
  □ All accounts disabled across ALL systems (IdP, AD, SaaS, VPN, cloud)
  □ MFA tokens revoked; hardware keys deregistered
  □ Active sessions terminated (SSO session invalidation)
  □ Cloud API keys and personal access tokens revoked
  □ Email auto-forward set to manager; no direct forwarding to personal email

  Within 24 hours:
  □ Removed from all distribution groups and shared inboxes
  □ Shared account passwords rotated if user had access
  □ Device remotely wiped or retrieved and securely wiped
  □ Physical access badge and keys returned

  Within 30 days:
  □ Data migrated per manager direction; personal data deleted per GDPR/policy
  □ Account disabled (retained for 90 days before deletion for audit trail)
  □ Access Management Register signed and filed

4. PRIVILEGED ACCESS MANAGEMENT (PAM)
────────────────────────────────────────
4a. Tiered Admin Model
  Tier 0 (Highest) : Domain controllers, identity infrastructure, HSMs, PKI
  Tier 1           : Servers, databases, network infrastructure
  Tier 2           : Workstations, end-user managed systems
  Rule: Tier N admin accounts must NEVER authenticate to Tier N+1 resources.

4b. Just-In-Time (JIT) Access — Required for all privileged human access
  No standing privileged access for humans in production:
  Request → Approve → Grant (time-limited) → Auto-expire → Audit
  • Standard privileged ops: self-service JIT with automated approval
  • High-risk / unusual changes: manager + peer approval required
  • Maximum grant window: 8 hours (production); 4 hours (Tier-0)
  • All JIT sessions: session recording enabled; logs retained 3 years
  Recommended PAM tools: [CyberArk / BeyondTrust / HashiCorp Vault / Teleport]

4c. Break-Glass (Emergency) Accounts
  • 2 break-glass accounts per critical system/environment
  • Credentials in physical sealed envelope in locked safe (not in password manager)
  • Access triggers automated SIEM alert to CISO within 1 minute
  • Use documented and justified in the incident log; reviewed post-use
  • Credentials rotated immediately after use

4d. Service Account Standards
  • Every service account has a named human owner (not a team/role)
  • No interactive login; no personal email; no MFA exemptions
  • Password rotation: automated every 30 days via vault/PAM
  • Workload identity (OIDC / SPIFFE / Managed Identity) preferred over
    long-lived passwords for cloud and Kubernetes workloads
  • Quarterly recertification by named owner

4e. Session Controls
  Standard user sessions   : 30-minute idle timeout; 12-hour hard limit
  Privileged sessions      : 10-minute idle timeout; 8-hour hard limit
  Production server access : Session recording required (video + keylog)
  Session termination      : Immediate on account disable / JIT expiry

5. ZERO-TRUST NETWORK ACCESS (ZTNA)
──────────────────────────────────────
Target state: Replace legacy perimeter VPN with ZTNA by [DATE+18m].

ZTNA Requirement              │ Implementation
──────────────────────────────┼──────────────────────────────────────────────
Strong identity               │ FIDO2 MFA on every access request
Device health verification    │ MDM compliance checked before access granted
Least-privilege network access│ Per-application; no full network tunnel
Micro-segmentation            │ East-west traffic denied by default; explicit allow
Continuous evaluation         │ Re-challenge on risk signal (location, device change)
Logging and analytics         │ All access logged, correlated in SIEM

Recommended tooling: Cloudflare Access / Zscaler ZPA / Microsoft Entra ID + Conditional Access
Interim: Enforce existing VPN + MFA + Network Access Control (NAC) until ZTNA deployed.

6. API KEYS AND SECRETS MANAGEMENT
────────────────────────────────────
• All API keys and tokens classified as CONFIDENTIAL; managed as credentials.
• Storage: Approved secrets manager ONLY — [HashiCorp Vault / AWS Secrets Manager /
  Azure Key Vault / GCP Secret Manager]. Never in code, config files, or VCS.
• Rotation: Maximum validity 90 days; automated rotation required for services.
• Per-environment: separate keys for dev / staging / production — never shared.
• Secret scanning: pre-commit hooks + CI/CD pipeline scan mandatory.
  Tools: Trufflehog / Gitleaks / GitHub Advanced Security / GitLab SAST.
  If a secret is committed to VCS: treat as compromised; rotate immediately.

7. MACHINE IDENTITY AND WORKLOAD AUTH
──────────────────────────────────────
• Containers / cloud services: OIDC workload identity federation or SPIFFE/SPIRE.
• Short-lived certificates (≤24h TTL) from internal CA preferred over long-lived keys.
• No hardcoded credentials in container images, IaC, or Helm charts.
• Kubernetes: Pod identity via IRSA (AWS) / Workload Identity (GKE) / AAD Pod Identity.
• Mutual TLS (mTLS) for all service-to-service calls in microservice environments.

8. ACCESS REVIEWS
──────────────────
Scope                    │ Frequency │ Owner             │ SLA to Complete
─────────────────────────┼───────────┼───────────────────┼─────────────────
Standard user accounts   │ Quarterly │ Line manager      │ 10 business days
Privileged accounts      │ Monthly   │ CISO / IT Manager │ 5 business days
Service accounts         │ Quarterly │ Account owner     │ 10 business days
Third-party / vendor     │ 6-monthly │ CISO / Procurement│ 10 business days
Dormant accounts (>30d)  │ Monthly   │ IT Manager        │ 5 business days (disable or justify)
Emergency break-glass    │ After each use │ CISO         │ Within 48 hours of use

Dormant account policy: accounts inactive > 30 days automatically disabled;
inactive > 90 days flagged for deletion review.

9. REMOTE WORKING
──────────────────
• Remote access: ZTNA client or VPN with FIDO2 MFA (no SMS MFA for remote).
• Managed devices only — BYOD requires MDM enrolment and compliance policy.
• Split tunnelling: PROHIBITED for access to CONFIDENTIAL+ data.
• Screen lock: Automatic after 5 minutes (remote) / 10 minutes (office).
• Public Wi-Fi: VPN/ZTNA mandatory before any corporate resource access.
• Home networks: router firmware current; WPA3 recommended; separate SSID for work devices.

RECOMMENDATIONS
─────────────────
• Deploy a PAM platform in Year 1. JIT access reduces standing privilege and
  limits breach blast radius more effectively than any other single control.
  Even with stolen credentials, attackers cannot assume standing admin access.

• FIDO2 hardware keys (YubiKey 5 Series) cost ~$50 each and eliminate phishing
  as an attack vector for privileged users. The ROI from a single prevented
  compromise is enormous. Mandate for all IT staff and executives in Year 1.

• Conditional Access / ZTNA policies are often free within existing Microsoft
  Entra / Google Workspace / Okta licences. Implement device compliance and
  named location policies before investing in additional tooling.

• Implement a just-in-time (JIT) access model even without a PAM tool:
  temporary AD group membership via a self-service request/approval workflow
  (Azure PIM, AWS IAM Identity Center, or even a Slack-based approval flow).

• Secrets scanning pre-commit hooks take 1 hour to deploy and prevent the most
  common source of credential exposure. Install Trufflehog or Gitleaks today.

• Use role-based access control (RBAC) with role mining — analyse actual access
  patterns to identify and remove excess permissions that accumulate over time.
  Saviynt, SailPoint, or even spreadsheet-based role matrix for smaller orgs.
`
  },
  {
    id: 'pol-classification',
    cat: 'policy',
    name: 'Data Classification Policy',
    desc: 'Defines how information should be classified, labeled, and handled based on sensitivity and criticality.',
    annex: 'A.5.12 / A.5.13',
    tier: 'mandatory',
    content: `DATA CLASSIFICATION POLICY
═══════════════════════════════════════
Document Reference : [ORG]-POL-004
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO / Data Protection Officer

1. CLASSIFICATION LEVELS
─────────────────────────

LEVEL 1 — PUBLIC
  Definition  : Approved for public release; no harm if disclosed.
  Examples    : Marketing materials, published reports, press releases.
  Handling    : No restrictions. May be shared freely.
  Label       : [PUBLIC] or no label required.

LEVEL 2 — INTERNAL
  Definition  : For internal use only. Disclosure would cause minor harm.
  Examples    : Internal memos, procedures, org charts, project docs.
  Handling    : Do not share externally without approval.
               Encrypt when sending outside the organization.
  Label       : [INTERNAL] on header/footer of documents.

LEVEL 3 — CONFIDENTIAL
  Definition  : Restricted. Disclosure would cause significant harm.
  Examples    : Business strategies, contracts, customer PII, financials.
  Handling    : Need-to-know basis only. Encrypt at rest and in transit.
               NDA required for third-party access.
               Print only when necessary; shred after use.
  Label       : [CONFIDENTIAL] header/footer; watermark on printed copies.

LEVEL 4 — SECRET
  Definition  : Strictly restricted. Unauthorized disclosure would be
               catastrophic to the organization.
  Examples    : Board-level strategy, M&A plans, security architecture,
               encryption keys, law enforcement-sensitive data.
  Handling    : Approved list of individuals only.
               Encrypted with approved algorithms (AES-256 / RSA-4096).
               No cloud storage without specific approval.
               Physical copies locked in a safe.
               Destruction: cross-cut shredding or certified destruction.
  Label       : [SECRET] – RESTRICTED ACCESS.

2. RECLASSIFICATION
────────────────────
Information owners may reclassify assets. Changes must be documented
and previous labels updated within [5] business days.

3. PERSONAL DATA
─────────────────
Personal data (PII) is classified as CONFIDENTIAL minimum.
Special category data (health, biometric) is classified as SECRET.
All personal data handling must comply with [GDPR / applicable law].
`
  },
  {
    id: 'pol-incident',
    cat: 'policy',
    name: 'Incident Response Policy',
    desc: 'Defines how the organization detects, reports, manages, and learns from information security incidents.',
    annex: 'A.5.24 – A.5.28',
    tier: 'mandatory',
    content: `INFORMATION SECURITY INCIDENT RESPONSE POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-005
Version            : 2.0
Effective Date     : [DATE]
Owner              : CISO
Review Cycle       : Annual; immediate review after any P1 incident

1. DEFINITION AND SCOPE
────────────────────────
An information security incident is any event that:
• Compromises or threatens the confidentiality, integrity, or availability
  of information assets owned or processed by [ORGANIZATION NAME].
• Violates this policy or related security policies.
• Causes or could cause reputational, financial, legal, or regulatory harm.

Incident types include (not exhaustive):
  Ransomware / malware infection      Phishing / business email compromise
  Unauthorised access or data breach  Insider threat / data exfiltration
  DDoS / service disruption           Supply chain compromise
  Cloud misconfiguration exposure     Physical theft of devices or media
  Accidental data disclosure          Identity theft / credential abuse

2. INCIDENT SEVERITY CLASSIFICATION
─────────────────────────────────────
P1 — CRITICAL (immediate response within 1 hour, 24/7)
  • Active ransomware encryption in progress or suspected
  • Confirmed personal data breach affecting > [500] individuals
  • Confirmed exfiltration of SECRET-classified data
  • Complete service outage of Tier-1 critical systems
  • Compromise of identity infrastructure (AD, IdP, CA)
  • Credible threat to physical safety of staff or customers
  Response: CISO + CEO notified immediately. Incident Command activated.

P2 — HIGH (initial response within 4 hours)
  • Confirmed intrusion; attacker present in environment
  • Ransomware precursor activity (lateral movement, credential dumping)
  • Data breach confirmed; scale unknown
  • Significant service disruption (Tier-1 degraded; Tier-2 outage)
  • Compromise of privileged account
  Response: CISO notified immediately. IR team assembled within 2 hours.

P3 — MEDIUM (initial response within 24 hours)
  • Suspected breach under investigation
  • Isolated malware infection (contained to single endpoint)
  • Phishing email clicked; credentials potentially compromised
  • Policy violation with potential security impact
  • Moderate service degradation
  Response: Security team notified during business hours; on-call for evenings.

P4 — LOW (response within 5 business days)
  • Near-miss / suspicious activity (no confirmed impact)
  • Single user policy violation (non-malicious)
  • Minor security misconfiguration (no active exploitation)
  Response: Security team during normal business hours.

3. REPORTING CHANNELS
──────────────────────
All staff and contractors MUST report suspected incidents immediately.
Do not delay to investigate yourself — report first, then await guidance.

  Email (non-urgent)  : security@[ORGANIZATION].com
  Phone (urgent/P1/P2): [24/7 SECURITY HOTLINE — e.g., +1 XXX XXX XXXX]
  Portal              : [ITSM tool / security portal URL]
  Teams/Slack channel : #security-incidents (monitored business hours)

Suspected P1/P2 incidents: Call the hotline AND email simultaneously.
Staff must NOT attempt independent investigation, containment, or remediation
without explicit instruction from the Security Team — this can destroy evidence
or alert the attacker.

4. INCIDENT RESPONSE PHASES
─────────────────────────────
PHASE 1 — DETECTION AND TRIAGE
  □ Verify the alert is a genuine incident (vs. false positive).
  □ Classify P1–P4 per section 2 above.
  □ Assign Incident Commander (CISO or designated deputy for P1/P2).
  □ Open incident ticket; record timestamp, source, initial scope.
  □ Notify stakeholders per escalation matrix (see section 6).
  □ Activate Incident Response Team if P1/P2.

PHASE 2 — CONTAINMENT
  Short-term (minutes to hours):
  □ Isolate affected systems from the network (firewall rule, VLAN, or unplug).
  □ DO NOT power off — memory contains forensic evidence (except ransomware
    exception: see Ransomware Playbook section 5).
  □ Revoke or change compromised credentials IMMEDIATELY.
  □ Block malicious IPs, domains, and file hashes at perimeter and EDR.
  □ Notify business owners of affected systems.
  □ Preserve all available logs (SIEM, firewall, endpoint, cloud trail).

  Long-term (hours to days):
  □ Apply temporary compensating controls (firewall rules, WAF rules).
  □ Identify and close the initial access vector.
  □ Increase monitoring on adjacent / related systems.
  □ Preserve forensic copies per Evidence Preservation (section 8).

PHASE 3 — ERADICATION
  □ Identify and remove root cause:
      Malware     : Full EDR scan + manual verification; reimage if in doubt.
      Backdoors   : Full credentials reset; revoke all sessions; audit accounts.
      Vulnerability: Emergency patch or isolate until patch available.
      Insider     : Immediate account termination; preserve evidence for HR/legal.
  □ Verify all threat actor artefacts removed (persistence mechanisms, tools).
  □ Conduct compromise assessment on adjacent systems.
  □ Rotate ALL credentials that may have been exposed (not just confirmed).
  □ Generate new certificates/keys for affected services.

PHASE 4 — RECOVERY
  □ Restore systems from known-good, clean backups (verify backup integrity first).
  □ Bring systems up in an isolated environment; verify before reconnecting.
  □ Monitor restored systems closely for 72 hours minimum (watch for reinfection).
  □ Staged restoration: restore critical systems first; validate each stage.
  □ Confirm with business owners that services are operating normally.
  □ Document all systems restored, timestamps, and personnel involved.

PHASE 5 — POST-INCIDENT REVIEW (PIR)
  P1/P2: Within 5 business days. CISO presents to Senior Management.
  P3/P4: Within 15 business days.
  PIR report must include:
  □ Executive summary (1 page) — what happened, impact, status
  □ Full incident timeline with timestamps
  □ Root cause analysis (5-Why or fishbone)
  □ What worked well in the response
  □ What could be improved
  □ Corrective actions: owner, timeline, success criteria
  □ Was the incident preventable? What control failed?
  Corrective actions entered in Corrective Action Register ([ORG]-CAR-001).

5. RANSOMWARE-SPECIFIC PLAYBOOK
─────────────────────────────────
Ransomware is the highest-probability P1 scenario. Follow these steps in order.

STEP 1 — INITIAL DETECTION (first 15 minutes)
  □ Source: user report / EDR alert / SIEM alert / monitoring system
  □ DO NOT reboot affected machines (destroys encryption keys in memory)
  □ DO NOT pay any ransom without legal and executive sign-off
  □ Immediately call the security hotline — do NOT use email (may be monitored)
  □ Isolate the affected machine from the network (disconnect cable / disable Wi-Fi)
  □ Identify the patient zero (first infected machine)

STEP 2 — SCOPE ASSESSMENT (first 30 minutes)
  □ How many systems are encrypted? (check EDR dashboard, file server alerts)
  □ Have backups been touched? (check backup system immediately — before attacker)
  □ Is Active Directory / domain controllers affected? (highest severity if yes)
  □ Are cloud environments affected? (check cloud console for anomalous activity)
  □ Has data been exfiltrated? (check DLP logs, firewall egress, cloud storage)
  □ Identify ransom note — do NOT click any links or QR codes in the note

STEP 3 — CONTAINMENT (first 60 minutes)
  □ Network isolation: segment affected VLANs; block lateral movement
  □ Domain-wide forced password reset if domain credentials are suspected compromised
  □ Disable all VPN and remote access temporarily
  □ Revoke all cloud API keys and service account tokens
  □ Take forensic memory images of live systems before powering off
      (Use: WinPMEM, Magnet RAM Capture, or FTK Imager for Windows)
  □ Shut down affected systems after forensic imaging is complete
  □ Notify cyber insurer immediately — most policies require prompt notification
  □ Engage external IR retainer if available: [RETAINER PROVIDER + CONTACT]

STEP 4 — INVESTIGATION (hours 2–24)
  □ Determine initial access vector (phishing? RDP exposure? vulnerable VPN?)
  □ Trace lateral movement from patient zero using SIEM / EDR telemetry
  □ Identify data exfiltration indicators (large outbound transfers, staging dirs)
  □ Identify ransomware variant (upload sample to ID Ransomware: id-ransomware.malwarehunterteam.com)
  □ Check for free decryption tools: NoMoreRansom.org
  □ Identify persistence mechanisms (scheduled tasks, registry keys, new accounts)
  □ Assess backup integrity: Are offline/immutable backups intact?

STEP 5 — EXTERNAL NOTIFICATIONS
  □ GDPR/DPA authority (e.g., ICO): within 72 hours if personal data affected
  □ Law enforcement: [national CIRT/CERT + local police cyber unit]
  □ Cyber insurer: immediately (before significant remediation spend)
  □ Customers/partners: if their data was exfiltrated or services disrupted
  □ Press/communications: coordinate with CEO; do not confirm details prematurely

STEP 6 — RECOVERY DECISION
  Decision tree:
    Are offline/immutable backups clean? → YES → Restore from backup (preferred)
    Are backups compromised?             → Assess scope of data loss
    Is a decryptor available?            → Test on isolated copy only
    Ransom payment consideration?        → Last resort; legal/executive approval;
                                           law enforcement consultation required;
                                           no guarantee of decryption; may be illegal

  Restoration sequence (prioritise):
    1. Identity infrastructure (AD, LDAP, IdP) — restores authentication
    2. Core infrastructure (DNS, DHCP, NTP, file shares)
    3. Tier-1 business systems (per BCP recovery priorities)
    4. Secondary systems

6. ESCALATION AND NOTIFICATION MATRIX
─────────────────────────────────────────
Severity │ Notify Within   │ Who                                │ Channel
─────────┼─────────────────┼────────────────────────────────────┼──────────────────
P1       │ Immediately     │ CISO, CEO, Legal, Cyber Insurer    │ Phone call
P1       │ 72 hours        │ [ICO / DPA] (if personal data)     │ Formal notification
P1       │ As required     │ Law enforcement                    │ Report
P2       │ Within 2 hours  │ CISO, Affected department heads    │ Phone + email
P3       │ Within 4 hours  │ CISO                               │ Email + ticket
P4       │ Next business day│ Security Team                     │ Ticket

7. EVIDENCE PRESERVATION
──────────────────────────
CRITICAL: Premature system shutdown or wipe destroys forensic evidence.
Always consult the Security Team before modifying or wiping affected systems.

Preserve in order of volatility (most volatile first):
  1. Network connections (active sessions, listening ports): netstat -an
  2. Running processes: tasklist / ps aux
  3. Memory: image with WinPMEM / LiME (Linux kernel module)
  4. Disk image: dd / FTK Imager / Magnet AXIOM — bitwise copy
  5. System logs: Windows Event Logs, syslog, application logs
  6. Cloud audit trails: AWS CloudTrail, Azure Activity Log, GCP Audit Log
  7. SIEM data: export and preserve relevant time window
  8. Network captures: pcap from firewall/IDS if available

Evidence chain of custody:
  • Document who collected what, when, and how
  • Hash all forensic images (SHA-256) immediately after collection
  • Store originals on isolated, write-protected media
  • Do not conduct forensic analysis on originals — work from copies

8. SECURITY OPERATIONS AND TOOLING
─────────────────────────────────────
Core toolset (recommended minimum):
  EDR           : [CrowdStrike / Microsoft Defender XDR / SentinelOne]
  SIEM          : [Microsoft Sentinel / Splunk / Elastic SIEM]
  Threat Intel  : [MISP / VirusTotal Enterprise / Recorded Future]
  IR Platform   : [TheHive / JIRA Service Management / PagerDuty]
  Log retention : Minimum 12 months online; 3 years archived (audit requirement)

SOAR automation recommendations:
  • Auto-isolate endpoints on critical EDR alert (no manual step required)
  • Auto-block IOCs (IPs, hashes, domains) across firewall, proxy, and EDR
  • Auto-create ITSM ticket with evidence bundle on P1/P2 SIEM trigger
  • Auto-notify on-call via PagerDuty/OpsGenie on P1 detection

RECOMMENDATIONS
─────────────────
• Run a tabletop ransomware exercise annually. Walk through this playbook with
  executives, IT, legal, and comms. Identify gaps before a real incident.
  External red team or simulated attack exercises are ideal.

• Maintain an offline, air-gapped, immutable backup of critical systems.
  Cloud backup (Azure Blob immutable / AWS S3 Object Lock) is acceptable.
  Ransomware groups specifically target and destroy backup systems first.

• Establish an IR retainer with a specialist firm before an incident.
  Response time in a live ransomware event can be hours vs. days with a retainer.
  Typical retainer cost: [£5,000–£20,000/year] depending on scope.

• Register with your national CERT/CIRT to receive sector threat intelligence.
  UK: NCSC (report.ncsc.gov.uk) | US: CISA (report.cisa.gov) | EU: ENISA

• MITRE ATT&CK Navigator is free and invaluable for mapping attacker TTPs
  detected during an incident to known techniques and suggested mitigations.
  Reference: https://attack.mitre.org

• Test your backups. An untested backup is not a backup. Schedule quarterly
  restore drills for at least one critical system.
`
  },
  {
    id: 'pol-bcp',
    cat: 'policy',
    name: 'Business Continuity Policy',
    desc: 'Commitment and framework for maintaining critical business operations during and after disruption.',
    annex: 'A.5.29 / A.5.30',
    tier: 'recommended',
    content: `BUSINESS CONTINUITY POLICY
═══════════════════════════════════════
Document Reference : [ORG]-POL-006
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO / Business Continuity Manager

1. PURPOSE
──────────
To ensure [ORGANIZATION NAME] can continue to deliver critical
services during and after disruptive incidents, and recover within
defined timeframes.

2. OBJECTIVES
─────────────
• Protect staff safety as the primary priority.
• Maintain delivery of critical services during disruption.
• Achieve recovery within agreed RTO (Recovery Time Objective)
  and RPO (Recovery Point Objective) targets.
• Comply with legal, regulatory, and contractual obligations.

3. KEY TARGETS
──────────────
Critical System  │ RTO    │ RPO
─────────────────┼────────┼──────────
[SYSTEM A]       │ 4 hrs  │ 1 hr
[SYSTEM B]       │ 24 hrs │ 4 hrs
[SYSTEM C]       │ 72 hrs │ 24 hrs

4. BCP GOVERNANCE
──────────────────
• Business Continuity Manager: [NAME/ROLE]
• BCDR Steering Committee    : [MEMBERS]
• Plan testing               : Minimum once per year (tabletop) +
                               full DR test every [2] years.

5. BACKUP STRATEGY
───────────────────
• Daily incremental backups; weekly full backups.
• Backups stored off-site / in separate cloud region.
• Backup encryption: AES-256.
• Retention: [90] days online; [7] years for compliance data.

6. RECOVERY PRIORITIES
───────────────────────
Tier 1 (Critical — recover within RTO):
  • [LIST CRITICAL SYSTEMS / SERVICES]

Tier 2 (Important — recover within 24-72 hrs):
  • [LIST SECONDARY SYSTEMS]

Tier 3 (Normal — recover within 7 days):
  • [LIST NON-CRITICAL SYSTEMS]
`
  },
  {
    id: 'pol-crypto',
    cat: 'policy',
    name: 'Cryptography Policy',
    desc: 'Standards for the use of cryptographic controls, key management, and approved algorithms.',
    annex: 'A.8.24',
    tier: 'recommended',
    content: `CRYPTOGRAPHY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-007
Version            : 2.0
Effective Date     : [DATE]
Owner              : CISO
Review Cycle       : Annual — immediate review on new NIST/ENISA/NCSC guidance

1. PURPOSE
──────────
This policy establishes requirements for cryptographic controls, key
management, and the protection of information at rest and in transit.
It includes a mandatory Post-Quantum Cryptography (PQC) migration roadmap
to address the emerging threat of cryptographically-relevant quantum computers.

2. APPROVED ALGORITHMS — CLASSICAL
────────────────────────────────────
Purpose               │ Algorithm              │ Min Key/Param   │ Notes
──────────────────────┼────────────────────────┼─────────────────┼────────────────────
Symmetric Encryption  │ AES-GCM                │ 256-bit         │ Preferred mode
Symmetric Encryption  │ ChaCha20-Poly1305       │ 256-bit         │ Where no AES hardware
Asymmetric (encrypt)  │ RSA-OAEP               │ 4096-bit        │ Legacy interop only
Key Exchange          │ ECDH (X25519 / X448)   │ Curve25519+     │ Prefer X448
Digital Signatures    │ Ed448 / Ed25519         │ —               │ Preferred new systems
Digital Signatures    │ ECDSA                  │ P-384           │ Where Ed448 not supported
Hash Functions        │ SHA-384 / SHA-512       │ —               │ For digital signatures
Hash Functions        │ SHA-256 / SHA3-256      │ —               │ For integrity/checksums
TLS Protocol          │ TLS 1.3                │ —               │ Required for new systems
TLS Protocol (legacy) │ TLS 1.2 (ECDHE only)  │ —               │ Deprecate by [DATE+18m]
SSH                   │ OpenSSH ≥ 8.0          │ Ed448/ECDSA P-384│ RSA ≥4096 if required
Password Hashing      │ Argon2id               │ m≥64MB, t≥3     │ Preferred
Password Hashing      │ bcrypt / scrypt        │ cost ≥ 12       │ Acceptable fallback

PROHIBITED (zero tolerance — immediate ban):
  ✗ MD5 and SHA-1 (any use), DES, 3DES, RC4, RC2, Blowfish, IDEA
  ✗ SSL 2.0 / SSL 3.0 / TLS 1.0 / TLS 1.1
  ✗ RSA key sizes < 2048-bit (deprecate 2048/3072 for encryption)
  ✗ Diffie-Hellman groups < 2048-bit
  ✗ ECDSA/ECDH below P-256 (P-192 and below prohibited)
  ✗ ECB mode for any block cipher
  ✗ Hard-coded keys or IVs in source code

DEPRECATED — plan migration by [DATE+24m]:
  ⚠ RSA encryption (replace with ECDH + hybrid KEM for new systems)
  ⚠ TLS 1.2 (migrate to TLS 1.3; TLS 1.2 only for legacy system compat)
  ⚠ RSA-2048 signing (migrate to Ed448, ECDSA P-384, or ML-DSA)
  ⚠ SHA-256 for long-lived document signing (use SHA-384 minimum)

3. POST-QUANTUM CRYPTOGRAPHY (PQC)
────────────────────────────────────
BACKGROUND
Current public-key algorithms (RSA, ECDH, ECDSA) are vulnerable to Shor's
algorithm running on a cryptographically-relevant quantum computer (CRQC).
The primary immediate risk is "harvest now, decrypt later" (HNDL): adversaries
collect encrypted traffic today to decrypt once a CRQC becomes available.
Data with confidentiality requirements exceeding 5–10 years is at risk NOW.
NIST finalised the first PQC standards in August 2024 (FIPS 203/204/205).

3a. NIST PQC STANDARDS (2024)
──────────────────────────────
Standard │ Algorithm           │ Based On    │ Type                  │ Primary Use
─────────┼─────────────────────┼─────────────┼───────────────────────┼──────────────────────
FIPS 203 │ ML-KEM (Kyber)      │ Lattice     │ Key Encapsulation     │ Replace ECDH/RSA KEX
FIPS 204 │ ML-DSA (Dilithium)  │ Lattice     │ Digital Signatures    │ Replace ECDSA/RSA sig
FIPS 205 │ SLH-DSA (SPHINCS+)  │ Hash-based  │ Digital Signatures    │ Stateless backup sig
FIPS 206 │ FN-DSA (FALCON)     │ Lattice     │ Digital Signatures    │ Compact signatures

Additional candidates (NIST Round 4 / alternate diversity):
  • ML-KEM-1024 : Highest security level (equivalent ~256-bit classical)
  • BIKE / HQC  : Code-based KEMs — under evaluation for redundancy
  • XMSS/LMS    : Stateful hash-based signatures (firmware/software signing)

Recommended parameter levels:
  • ML-KEM-768 (Level 3) for general TLS key exchange hybrid
  • ML-DSA-65  (Level 3) for general digital signatures
  • ML-KEM-1024 / ML-DSA-87 for SECRET-classified data and long-lived keys

3b. PQC MIGRATION PHASES (MANDATORY)
──────────────────────────────────────
PHASE 1 — CRYPTOGRAPHIC INVENTORY (Complete by [DATE+6m])
  □ Catalogue every cryptographic use case: protocols, libraries, hardware.
  □ Classify data by confidentiality lifetime (< 5yr / 5–10yr / > 10yr).
  □ Flag all RSA and ECC-based key exchanges as quantum-vulnerable.
  □ Audit TLS configurations using SSL Labs or similar tooling.
  □ Inventory all certificates (CA, server, code signing, device).
  □ Identify HSMs and verify PQC firmware roadmap with vendor.
  □ Assess PKI infrastructure for PQC readiness (CA software, HSM support).

PHASE 2 — HYBRID CLASSICAL + PQC (Complete by [DATE+18m])
  Purpose: Hybrid provides classical security now AND quantum-resistance.
  If PQC algorithm is broken, classical component still protects. Vice versa.
  □ TLS: Deploy X25519 + ML-KEM-768 hybrid (IETF draft-ietf-tls-hybrid-design)
         Supported in: OpenSSL 3.x + oqs-provider, BoringSSL, AWS-LC.
  □ Signatures: Dual-sign with ECDSA-P384 + ML-DSA-65 for code/firmware.
  □ SSH: Enable sntrup761x25519-sha512 KEX (OpenSSH 9.0+ default).
  □ Secrets Manager / KMS: Verify PQC key type support; upgrade if needed.
  □ Email encryption (S/MIME): Migrate to hybrid PQC+ECDH key wrapping.

PHASE 3 — PRIMARY PQC DEPLOYMENT (Complete by [DATE+36m])
  □ Replace standalone RSA/ECC key exchange with ML-KEM primary.
  □ Migrate code signing certificates to ML-DSA or SLH-DSA.
  □ Update PKI root and intermediate CAs to ML-DSA (requires CA software upgrade).
  □ Retire legacy RSA TLS certificates as they expire; replace with PQC hybrid.
  □ Update mobile SDK / embedded clients to support PQC cipher suites.
  □ Validate supplier/partner TLS endpoints support PQC negotiation.

PHASE 4 — FULL MIGRATION (Complete by [DATE+60m])
  □ All new systems deploy PQC-only (classical as fallback for legacy compat only).
  □ All long-lived data re-encrypted with PQC-protected keys.
  □ Certificate infrastructure fully PQC-native.
  □ Legacy classical-only algorithms sunset; exceptions require CISO approval.

3c. CRYPTO-AGILITY REQUIREMENTS
──────────────────────────────────
All new systems and significant upgrades MUST:
• Store algorithm identifier alongside ciphertext/signatures (not hard-coded).
• Support algorithm selection at configuration level without code changes.
• Be tested with algorithm swap (verify graceful migration without data loss).
• Use modular cryptographic libraries (OpenSSL, BouncyCastle, libsodium).
• Reject deprecated algorithms via configuration, not remove-and-rebuild.
• Reference CISA/NSA CNSA 2.0 for NSS/government system timelines.

4. KEY MANAGEMENT LIFECYCLE
──────────────────────────────
Stage        │ Requirement
─────────────┼────────────────────────────────────────────────────────────────
Generation   │ FIPS 140-2/3 Level 2+ HSM or OS CSPRNG (/dev/urandom, CryptGenRandom)
Storage      │ Encrypted key vault: [HashiCorp Vault / AWS KMS / Azure Key Vault]
Distribution │ Never in plaintext. AES-256 key wrapping (RFC 3394) or TLS-protected.
Purpose      │ One key per purpose. No multi-purpose key reuse.
Rotation     │ Per schedule below. Must not cause availability impact.
Revocation   │ Immediate on suspected compromise; CRL/OCSP update ≤ 1 hour.
Destruction  │ Cryptographic erasure (NIST SP 800-88 Rev 1); witnessed; documented.

Key Rotation Schedule:
  Symmetric data keys              → Every 12 months (on breach: immediate)
  TLS server certificates          → Renew ≥ 30 days before expiry (auto-managed)
  Code signing certificates        → Renew ≥ 60 days before expiry
  Root / Intermediate CA certs     → Per CA/B Forum Baseline Requirements
  SSH host keys                    → Annually or on server rebuild
  SSH user keys                    → Annually or on role/employment change
  API keys / service tokens        → Every 90 days; automated via vault
  Master/KEK keys                  → Every 3 years; dual-control ceremony required

Key Custodian Requirements:
  • Master keys: dual-control (minimum 2-of-N key custodians, N ≥ 3).
  • Custodian list reviewed and updated quarterly.
  • Key ceremony for root CA operations: recorded, witnessed, minimum 3 custodians.
  • Backup custodians identified; capability tested annually.

5. CERTIFICATE MANAGEMENT
──────────────────────────
• Use publicly trusted CA certificates for all externally reachable services.
• Self-signed certificates: PROHIBITED in production. Permitted in isolated dev/test.
• Certificate inventory maintained in [CLM tool / Vault PKI / spreadsheet]:
    - Common name, SAN, expiry date, responsible team, renewal SLA.
• Automated renewal: cert-manager (Kubernetes), ACME protocol, or Vault PKI.
• Expiry monitoring: Alert at 60, 30, 14, and 7 days before expiry.
• Certificate Transparency (CT) logging: required for all public TLS certs.
• OCSP Stapling: enabled on all TLS-terminating servers.
• Certificate Pinning: required for mobile apps and high-value APIs.
• Wildcard certificates: discouraged; if used, scope to single subdomain level.

6. TLS / HTTPS HARDENING
──────────────────────────
TLS 1.3 Required for new deployments:
  Cipher suites: TLS_AES_256_GCM_SHA384 (preferred), TLS_CHACHA20_POLY1305_SHA256
  Key exchange: X25519 (primary), P-384, X448; add ML-KEM-768 hybrid when available

TLS 1.2 (legacy systems only — deprecate by [DATE+18m]):
  REQUIRED: ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-RSA-AES256-GCM-SHA384
  PROHIBITED: All CBC suites, RSA key exchange, NULL/EXPORT/anon ciphers, RC4

HTTP headers (all HTTPS services):
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: [configured per application]
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

7. SSH HARDENING
────────────────
Host Keys   : Ed25519 (primary), ECDSA P-384 (compatibility fallback)
User Auth   : Ed25519 keys (minimum); FIDO2-backed SSH keys strongly preferred
             Password authentication: DISABLED (PasswordAuthentication no)
             Challenge-Response: DISABLED (ChallengeResponseAuthentication no)
MACs        : hmac-sha2-512-etm@openssh.com, hmac-sha2-256-etm@openssh.com
KEX         : curve25519-sha256, ecdh-sha2-nistp384, sntrup761x25519-sha512 (PQC)
Ciphers     : chacha20-poly1305@openssh.com, aes256-gcm@openssh.com
Directives  : PermitRootLogin no | AllowUsers [explicit list] | MaxAuthTries 3
              ClientAliveInterval 300 | ClientAliveCountMax 2

8. CODE AND SUPPLY CHAIN SIGNING
──────────────────────────────────
• All software releases, container images, and IaC must be signed before deploy.
• Container signing: Sigstore / Cosign with Ed448 or ML-DSA keys.
  Verification enforced by admission controller (Kyverno, Gatekeeper, OPA).
• Release binaries: code signing certificate from accredited CA.
• Git commits: signed with GPG / SSH key (hardware-backed preferred).
• CI/CD pipelines: verify all signatures before promoting artifacts.
• SBOM (Software Bill of Materials): generated for all releases (SPDX or CycloneDX).
• Supply chain integrity: SLSA Level 2+ for internal software; Level 3 for critical.

9. ENCRYPTION AT REST
──────────────────────
Asset Type                │ Requirement
──────────────────────────┼──────────────────────────────────────────────────────
Laptops / Endpoints       │ Full-disk: BitLocker (TPM 2.0+PIN) / FileVault / LUKS2
Server OS volumes         │ LUKS2 or encrypted LVM; key stored in HSM/Vault
Databases (CONF/SECRET)   │ TDE: AES-256-GCM; customer-managed keys in KMS
Cloud object storage      │ SSE-KMS with CMK (AES-256); key in same region
Backups                   │ AES-256; key stored separately from backup data
Portable / removable media│ Hardware-encrypted USB (FIPS 140-2 Level 3) or AES-256 sw
Application secrets/config│ Vault / KMS only. NEVER in code, config files, or VCS
Archived records (>5yr)   │ Re-encrypt with current algorithm before archive

10. ENCRYPTION IN TRANSIT
──────────────────────────
• All external HTTP: HTTPS only. Redirect HTTP → HTTPS. HSTS enforced.
• Email: SMTP over TLS (STARTTLS); DMARC + DKIM + SPF enforced.
• API: TLS 1.3 required; certificate pinning for mobile / IoT clients.
• Internal service-to-service: mTLS (mutual TLS) for microservices.
  Use Istio / Linkerd service mesh or manual certificate rotation.
• VPN / Remote access: IKEv2/IPsec or WireGuard; TLS-based ZTNA preferred.
• Database connections: TLS required; verify server certificate.
• Message queues: TLS with authentication (SASL/SCRAM or mTLS).

RECOMMENDATIONS
─────────────────
• Start PQC inventory NOW. HNDL attacks are present-day risks for data with
  multi-year confidentiality requirements. The migration takes 3–5 years.

• Deploy hybrid X25519+ML-KEM-768 TLS immediately — it's already in OpenSSL
  3.x (oqs-provider), Go 1.23+, and Chrome/Firefox. Zero user impact.

• Adopt FIDO2 hardware security keys (YubiKey 5/Bio, Google Titan) for all
  key custodians and privileged users. These resist phishing AND can serve
  as FIDO2-backed SSH keys, eliminating separate key management.

• Use automated certificate lifecycle management (cert-manager + Let's Encrypt
  or Vault PKI) to eliminate manual certificate renewal as a failure mode.
  Expired certificates are the most common avoidable security outage.

• Evaluate HSM-as-a-Service (AWS CloudHSM / Azure Dedicated HSM / Thales DPoD)
  to meet FIPS 140-2/3 Level 3 without on-prem hardware costs.

• Implement secrets scanning in every repository pre-commit and in CI/CD.
  Tools: Trufflehog, Gitleaks, GitHub Advanced Security, GitLab SAST.
  Hard-coded credentials are found in > 60% of repository audits.

• Adopt SLSA (Supply-chain Levels for Software Artifacts) framework.
  Start at Level 1 (signed builds) and target Level 3 for critical software.
  Reference: https://slsa.dev

• Subscribe to:
    NIST PQC: https://csrc.nist.gov/projects/post-quantum-cryptography
    CISA CNSA 2.0: https://media.nsa.gov/NSADocuments/CNSA_2.0.pdf
    ENISA PQC: https://www.enisa.europa.eu/topics/post-quantum-cryptography
    NCSC UK guidance: https://www.ncsc.gov.uk/collection/pqc-migration-preparation
`
  },
  {
    id: 'pol-supplier',
    cat: 'policy',
    name: 'Supplier Security Policy',
    desc: 'Security requirements for suppliers and third parties who process organizational data or access systems.',
    annex: 'A.5.19 / A.5.20',
    tier: 'recommended',
    content: `SUPPLIER SECURITY POLICY
═══════════════════════════════════════
Document Reference : [ORG]-POL-008
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO / Procurement

1. PURPOSE
──────────
To ensure that information security risks arising from supplier
relationships are identified, assessed, and appropriately managed.

2. SUPPLIER TIERS
──────────────────
Tier 1 (Critical) : Access to SECRET / CONFIDENTIAL data; processing
                    of personal data; critical infrastructure support.
Tier 2 (Significant): Limited data access; non-critical service providers.
Tier 3 (Standard) : No data access; general goods/services suppliers.

3. PRE-ENGAGEMENT REQUIREMENTS
────────────────────────────────
• Security questionnaire completion (Tier 1 & 2).
• Evidence of ISO 27001 / SOC 2 / equivalent certification (Tier 1).
• Data Processing Agreement (DPA) signed before data sharing.
• Security clauses included in all contracts.

4. CONTRACTUAL REQUIREMENTS
─────────────────────────────
All supplier contracts must include:
• Right to audit (or equivalent third-party audit evidence).
• Incident notification within [24 / 48] hours.
• Data return / destruction obligations at contract end.
• Subprocessor notification and approval requirements.
• Compliance with applicable data protection laws.

5. ONGOING MONITORING
──────────────────────
• Tier 1: Annual security assessment + review of certifications.
• Tier 2: Bi-annual questionnaire review.
• Tier 3: Risk-based; reviewed on contract renewal.
• Security incidents by suppliers must be reported per the
  Incident Response Policy.

6. OFFBOARDING
───────────────
• Access revoked within [24] hours of contract termination.
• Data returned / destroyed and certificated within [30] days.
• Documented confirmation retained.
`
  },

  /* ── PROCEDURES ────────────────────────────────────────────── */
  {
    id: 'proc-incident',
    cat: 'procedure',
    name: 'Incident Management Procedure',
    desc: 'Step-by-step procedure for reporting, triaging, containing, eradicating, and reviewing security incidents.',
    annex: 'A.5.24 – A.5.28',
    tier: 'mandatory',
    content: `INCIDENT MANAGEMENT PROCEDURE
═══════════════════════════════════════
Document Reference : [ORG]-PROC-001
Version            : 1.0
Effective Date     : [DATE]
Owner              : CISO

STEP 1 — DETECTION & REPORTING
───────────────────────────────
1.1 Any employee who suspects or discovers a security incident
    must report it immediately via:
    • Email: security@[ORG].com
    • Phone: [HOTLINE]
    • Ticketing: [ITSM TOOL] → Category: Security Incident

1.2 The Security Team acknowledges within:
    • P1/P2: 30 minutes (24/7 on-call)
    • P3/P4: 2 business hours

1.3 Incident Coordinator assigned from the Security Team.

STEP 2 — INITIAL TRIAGE
─────────────────────────
2.1 Confirm whether the event is a genuine incident or false positive.
2.2 Classify severity (P1–P4) per Incident Response Policy.
2.3 Record in the Incident Log (Form [ORG]-FORM-007):
    • Date/time detected and reported
    • Systems/data affected
    • Estimated scope and impact
    • Initial classification

STEP 3 — CONTAINMENT
─────────────────────
3.1 SHORT-TERM (immediate):
    • Isolate affected systems from the network if necessary.
    • Revoke or block compromised credentials.
    • Preserve all logs and evidence BEFORE making changes.
    • Alert affected business owners.

3.2 LONG-TERM (stabilization):
    • Apply temporary mitigations (firewall rules, patches).
    • Maintain business operations where possible.
    • Implement enhanced monitoring on adjacent systems.

STEP 4 — ERADICATION
─────────────────────
4.1 Identify and remove root cause:
    • Malware: Full scan + removal using approved AV/EDR tools.
    • Unauthorized access: Revoke all access; rotate all credentials.
    • Vulnerability: Apply patches; reimage if necessary.
4.2 Document all actions taken with timestamps.

STEP 5 — RECOVERY
──────────────────
5.1 Restore systems from known-good backups.
5.2 Verify system integrity before reconnecting to network.
5.3 Gradually restore services; monitor closely for [48] hours.
5.4 Confirm with business owner that normal operations resumed.

STEP 6 — POST-INCIDENT REVIEW
───────────────────────────────
6.1 Conduct PIR within [5] business days for P1/P2; [15] days for P3.
6.2 PIR Report must include:
    • Timeline of events
    • Root cause analysis
    • Effectiveness of response
    • Lessons learned
    • Corrective actions with owners and due dates
6.3 CISO presents PIR findings to Senior Management for P1/P2.
6.4 Corrective actions entered in the Corrective Action Register.
`
  },
  {
    id: 'proc-access',
    cat: 'procedure',
    name: 'User Access Management Procedure',
    desc: 'Procedure for provisioning, modifying, and deprovisioning user access across all systems.',
    annex: 'A.5.15 – A.5.18',
    tier: 'mandatory',
    content: `USER ACCESS MANAGEMENT PROCEDURE
═══════════════════════════════════════
Document Reference : [ORG]-PROC-002
Version            : 1.0
Effective Date     : [DATE]
Owner              : IT Manager / CISO

1. ACCESS PROVISIONING (NEW USER / ROLE CHANGE)
────────────────────────────────────────────────
Trigger: New hire start date / role change notification from HR.

Step 1: HR notifies IT and CISO of new user or role change via
        [HR SYSTEM / EMAIL] at least [3] business days in advance.

Step 2: Line Manager completes Access Request Form (ARF):
        • User name and employee ID
        • Systems and access level required
        • Business justification
        • Manager signature

Step 3: IT reviews request against Access Control Policy:
        • Verify least-privilege principle is applied.
        • Flag conflicts with segregation of duties.
        • CISO approval required for privileged access.

Step 4: IT provisions access:
        • Create account with standard naming: [firstname.lastname]
        • Assign to role-based access group(s)
        • Configure MFA enrollment
        • Set initial password (communicated securely)

Step 5: IT notifies user and line manager of access granted.
        User signs AUP before first login.

Step 6: Log provisioning in the Access Management Log.

SLA: Standard access within [1] business day.
     Privileged access within [2] business days (requires CISO approval).

2. ACCESS MODIFICATION
───────────────────────
Trigger: Role change, project assignment, business need.

Step 1: Line manager submits ARF with updated requirements.
Step 2: IT modifies access; excess permissions removed.
Step 3: User notified of changes. Log updated.

3. ACCESS DEPROVISIONING (LEAVERS)
────────────────────────────────────
Trigger: Resignation, termination, or end of contract.

HR Notification: On last working day (immediately for terminations).

Step 1 (Within 4 hours of departure):
        • Disable all user accounts (do not delete).
        • Revoke MFA tokens and certificates.
        • Terminate active sessions (VPN, remote desktop).
        • Forward email to line manager (per policy / legal advice).

Step 2 (Within 24 hours):
        • Remove from all distribution groups and shared inboxes.
        • Retrieve corporate devices (laptop, phone, tokens).
        • Revoke physical access badges.

Step 3 (Within 30 days):
        • Review and reallocate data/files as directed by manager.
        • Formally disable accounts; retain for [90] days before deletion.
        • Update Access Management Log.

4. QUARTERLY ACCESS REVIEW
────────────────────────────
IT distributes access reports to line managers quarterly.
Managers confirm, modify, or revoke access within [10] business days.
Results signed and filed for audit.
`
  },
  {
    id: 'proc-change',
    cat: 'procedure',
    name: 'Change Management Procedure',
    desc: 'Controls for requesting, assessing, approving, and reviewing changes to IT systems and infrastructure.',
    annex: 'A.8.32',
    tier: 'recommended',
    content: `CHANGE MANAGEMENT PROCEDURE
═══════════════════════════════════════
Document Reference : [ORG]-PROC-003
Version            : 1.0
Effective Date     : [DATE]
Owner              : IT Manager

CHANGE TYPES
─────────────
Standard  : Pre-approved, low-risk, frequently performed. No CAB required.
Normal    : Requires planning, risk assessment, and CAB approval.
Emergency : Urgent; retrospective CAB review within [48] hours.

CHANGE ADVISORY BOARD (CAB)
────────────────────────────
Members: IT Manager, CISO, [DEPARTMENT HEADS], Service Desk Lead.
Meets  : Weekly (Tuesdays [TIME]) + emergency ad-hoc.

PROCEDURE — NORMAL CHANGE
──────────────────────────
Step 1: RAISE REQUEST
  Requester submits Change Request Form (CRF) in [ITSM TOOL]:
  • Description of change and business justification
  • Systems/services affected
  • Risk assessment (High/Medium/Low)
  • Rollback plan
  • Test plan
  • Proposed implementation window

Step 2: TECHNICAL REVIEW
  IT Manager reviews for technical completeness within [3] days.
  Security impact assessed by CISO if change affects:
  • Security controls / firewall rules
  • Authentication or access mechanisms
  • Data storage or encryption
  • External-facing systems

Step 3: CAB APPROVAL
  CRF presented at weekly CAB meeting.
  Approved, rejected, or deferred with documented reasons.
  High-risk changes require written sign-off from IT Manager and CISO.

Step 4: IMPLEMENTATION
  Change implemented in approved maintenance window.
  Implementation log maintained with timestamps.
  Rollback executed if implementation fails.

Step 5: POST-IMPLEMENTATION REVIEW
  Verify change successful within [24] hours.
  Update CMDB and asset register.
  Close CRF with outcome documented.

EMERGENCY CHANGE
─────────────────
Step 1: Verbal approval from IT Manager (and CISO if security-related).
Step 2: Implement with senior technical resource.
Step 3: Raise CRF retrospectively within [4] hours.
Step 4: Emergency CAB review within [48] hours.
Step 5: Document all actions and outcomes.
`
  },
  {
    id: 'proc-vulnerability',
    cat: 'procedure',
    name: 'Vulnerability Management Procedure',
    desc: 'Process for identifying, assessing, prioritizing, and remediating vulnerabilities in IT systems.',
    annex: 'A.8.8',
    tier: 'recommended',
    content: `VULNERABILITY MANAGEMENT PROCEDURE
═══════════════════════════════════════
Document Reference : [ORG]-PROC-004
Version            : 1.0
Effective Date     : [DATE]
Owner              : IT Manager / CISO

1. SCANNING SCHEDULE
─────────────────────
External attack surface : Weekly automated scan
Internal network        : Monthly authenticated scan
Web applications        : Monthly + after every major release
Endpoints               : Continuous via EDR / agent-based scanner
Penetration testing     : Annual external + internal (by approved firm)

Tools: [VULNERABILITY SCANNER — e.g., Tenable, Qualys, OpenVAS]

2. SEVERITY CLASSIFICATION (CVSS-based)
────────────────────────────────────────
Critical (CVSS 9.0–10.0) : Patch within 24 hours.
High     (CVSS 7.0–8.9)  : Patch within 7 days.
Medium   (CVSS 4.0–6.9)  : Patch within 30 days.
Low      (CVSS 0.1–3.9)  : Patch within 90 days / risk-accept.
Informational             : Log; address in next maintenance cycle.

3. REMEDIATION PROCESS
────────────────────────
Step 1: Scan results imported to vulnerability management platform.
Step 2: Deduplicated; assigned to system owner.
Step 3: Owner assesses exploitability in context.
Step 4: Patch / mitigate within SLA:
        a) Apply vendor patch (preferred).
        b) Deploy compensating control if patch unavailable.
        c) Accept risk with CISO sign-off (low severity only).
Step 5: Rescan to confirm remediation.
Step 6: Close ticket; update vulnerability log.

4. EXCEPTIONS AND RISK ACCEPTANCE
───────────────────────────────────
• Patch exceptions require written justification and CISO approval.
• Exceptions documented with compensating controls and expiry date.
• Critical exceptions require Senior Management sign-off.
• All exceptions reviewed quarterly.

5. REPORTING
─────────────
• Weekly vulnerability status report to IT Manager.
• Monthly dashboard to CISO with SLA compliance metrics.
• Quarterly trend report to Senior Management.
• Annual penetration test report to Board.
`
  },

  /* ── RECORDS & CHECKLISTS ──────────────────────────────────── */
  {
    id: 'rec-audit',
    cat: 'record',
    name: 'Internal Audit Checklist',
    desc: 'Structured checklist for conducting ISO 27001 internal audits across all ISMS clauses and Annex A controls.',
    annex: 'Clause 9.2',
    tier: 'mandatory',
    content: `ISO 27001:2022 INTERNAL AUDIT CHECKLIST
═══════════════════════════════════════
Document Reference : [ORG]-AUD-001
Audit Reference    : [AUDIT-YYYY-NN]
Audit Date         : [DATE]
Auditor            : [NAME] (Internal / External)
Area Audited       : [DEPARTMENT / SYSTEM / PROCESS]
Auditee            : [NAME, ROLE]

FINDINGS LEGEND
───────────────
✓ Conformant   ✗ Non-conformance (Major)   ! Observation / Minor NC
N/A Not Applicable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 4 — CONTEXT OF THE ORGANIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 4.1 Internal/external issues identified and documented?
[ ] 4.2 Interested parties and their requirements defined?
[ ] 4.3 ISMS scope documented and approved?
[ ] 4.4 ISMS established, implemented, and maintained?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 5 — LEADERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 5.1 Management demonstrates commitment to ISMS?
[ ] 5.2 IS Policy established, communicated, and available?
[ ] 5.3 Roles, responsibilities, and authorities assigned?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 6 — PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 6.1.1 Risk and opportunity process defined?
[ ] 6.1.2 Risk assessment performed and documented?
[ ] 6.1.3 Risk treatment plan in place? SoA current?
[ ] 6.2   IS objectives defined, measurable, and monitored?
[ ] 6.3   Changes to ISMS planned systematically?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 7 — SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 7.1 Resources provided for ISMS operation?
[ ] 7.2 Staff competence documented?
[ ] 7.3 Staff aware of IS policy, objectives, and their contribution?
[ ] 7.4 IS communication plan in place?
[ ] 7.5 Documents controlled and retained per requirements?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 8 — OPERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 8.1 Operational controls planned and implemented?
[ ] 8.2 Risk assessment results maintained?
[ ] 8.3 Risk treatment results maintained?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 9 — PERFORMANCE EVALUATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 9.1 Monitoring and measurement performed?
[ ] 9.2 Internal audit program established and conducted?
[ ] 9.3 Management review held; results documented?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUSE 10 — IMPROVEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 10.1 Nonconformities identified and corrective actions taken?
[ ] 10.2 Continual improvement activities evident?
Evidence: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNEX A CONTROLS — TABLE A.1 (ISO/IEC 27001:2022)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Note: Audit only applicable controls (per SoA). Mark N/A for excluded controls.

─── 5. ORGANIZATIONAL CONTROLS ──────────────────────
[ ] 5.1   Policies for information security — documented, approved, communicated, reviewed?
[ ] 5.2   Information security roles and responsibilities — defined and allocated?
[ ] 5.3   Segregation of duties — conflicting duties identified and segregated?
[ ] 5.4   Management responsibilities — management requiring IS compliance evidenced?
[ ] 5.5   Contact with authorities — relevant contacts established and maintained?
[ ] 5.6   Contact with special interest groups — memberships/contacts in place?
[ ] 5.7   Threat intelligence — threat info collected and analysed for relevance?
[ ] 5.8   IS in project management — IS integrated into project frameworks?
[ ] 5.9   Inventory of information and other associated assets — register current and owned?
[ ] 5.10  Acceptable use of information and other assets — rules documented and enforced?
[ ] 5.11  Return of assets — process for asset return on exit documented and followed?
[ ] 5.12  Classification of information — scheme defined and applied consistently?
[ ] 5.13  Labelling of information — labelling procedures implemented?
[ ] 5.14  Information transfer — transfer rules/agreements in place for all channels?
[ ] 5.15  Access control — topic-specific policy established and implemented?
[ ] 5.16  Identity management — full identity lifecycle managed?
[ ] 5.17  Authentication information — managed via controlled process; staff advised?
[ ] 5.18  Access rights — provisioned, reviewed, modified, removed per policy?
[ ] 5.19  IS in supplier relationships — processes to manage supplier IS risks?
[ ] 5.20  Addressing IS within supplier agreements — IS requirements in all contracts?
[ ] 5.21  IS in the ICT supply chain — ICT supply chain IS risks managed?
[ ] 5.22  Monitoring, review and change mgmt of supplier services — regularly reviewed?
[ ] 5.23  IS for use of cloud services — cloud acquisition/management/exit processes?
[ ] 5.24  IS incident management planning and preparation — plan documented and communicated?
[ ] 5.25  Assessment and decision on IS events — events assessed and categorised?
[ ] 5.26  Response to information security incidents — responded per documented procedures?
[ ] 5.27  Learning from IS incidents — knowledge used to improve controls?
[ ] 5.28  Collection of evidence — procedures for evidence identification/preservation?
[ ] 5.29  IS during disruption — IS maintained at appropriate level during disruption?
[ ] 5.30  ICT readiness for business continuity — ICT continuity planned, tested?
[ ] 5.31  Legal, statutory, regulatory and contractual requirements — identified, documented?
[ ] 5.32  Intellectual property rights — procedures to protect IPR implemented?
[ ] 5.33  Protection of records — records protected from loss, falsification, unauthorised access?
[ ] 5.34  Privacy and protection of PII — PII requirements identified and met?
[ ] 5.35  Independent review of IS — IS approach independently reviewed at planned intervals?
[ ] 5.36  Compliance with policies, rules and standards — regularly reviewed?
[ ] 5.37  Documented operating procedures — available to personnel who need them?

─── 6. PEOPLE CONTROLS ──────────────────────────────
[ ] 6.1   Screening — background checks conducted pre-hire and ongoing where required?
[ ] 6.2   Terms and conditions of employment — IS responsibilities stated in contracts?
[ ] 6.3   IS awareness, education and training — all staff trained per their role?
[ ] 6.4   Disciplinary process — formalised and communicated for IS policy violations?
[ ] 6.5   Responsibilities after termination — post-employment IS duties enforced?
[ ] 6.6   Confidentiality or non-disclosure agreements — signed by relevant parties?
[ ] 6.7   Remote working — security measures implemented for remote workers?
[ ] 6.8   IS event reporting — reporting mechanism available and communicated to all?

─── 7. PHYSICAL CONTROLS ────────────────────────────
[ ] 7.1   Physical security perimeters — secure areas defined and protected?
[ ] 7.2   Physical entry — entry controls prevent unauthorised physical access?
[ ] 7.3   Securing offices, rooms and facilities — physical security designed/implemented?
[ ] 7.4   Physical security monitoring — premises monitored for unauthorised access?
[ ] 7.5   Protecting against physical and environmental threats — protection designed?
[ ] 7.6   Working in secure areas — security measures for working in secure areas?
[ ] 7.7   Clear desk and clear screen — rules defined and enforced?
[ ] 7.8   Equipment siting and protection — equipment sited and protected securely?
[ ] 7.9   Security of assets off-premises — off-site assets protected?
[ ] 7.10  Storage media — managed through full lifecycle per classification scheme?
[ ] 7.11  Supporting utilities — facilities protected from power and utility failures?
[ ] 7.12  Cabling security — cables protected from interception, interference, damage?
[ ] 7.13  Equipment maintenance — equipment maintained to ensure availability/integrity?
[ ] 7.14  Secure disposal or re-use of equipment — sensitive data removed prior to disposal?

─── 8. TECHNOLOGICAL CONTROLS ───────────────────────
[ ] 8.1   User end point devices — info on endpoints protected per policy?
[ ] 8.2   Privileged access rights — allocation and use restricted and managed?
[ ] 8.3   Information access restriction — access restricted per access control policy?
[ ] 8.4   Access to source code — read/write access to source code appropriately managed?
[ ] 8.5   Secure authentication — authentication technologies implemented per policy?
[ ] 8.6   Capacity management — resources monitored and adjusted for capacity needs?
[ ] 8.7   Protection against malware — malware protection implemented with user awareness?
[ ] 8.8   Management of technical vulnerabilities — vulnerabilities identified and treated?
[ ] 8.9   Configuration management — security configurations documented and maintained?
[ ] 8.10  Information deletion — data deleted when no longer required per policy?
[ ] 8.11  Data masking — data masking used per access control and business requirements?
[ ] 8.12  Data leakage prevention — DLP measures applied to sensitive data systems?
[ ] 8.13  Information backup — backups maintained and regularly tested?
[ ] 8.14  Redundancy of information processing facilities — redundancy meets availability?
[ ] 8.15  Logging — logs produced, stored, protected and analysed?
[ ] 8.16  Monitoring activities — networks/systems/apps monitored for anomalous behaviour?
[ ] 8.17  Clock synchronisation — system clocks synchronised to approved time sources?
[ ] 8.18  Use of privileged utility programs — use restricted and tightly controlled?
[ ] 8.19  Installation of software on operational systems — procedures in place and followed?
[ ] 8.20  Networks security — networks secured, managed and controlled?
[ ] 8.21  Security of network services — service levels and security reqs identified?
[ ] 8.22  Segregation of networks — groups of services/users/systems segregated?
[ ] 8.23  Web filtering — access to external websites managed to reduce exposure?
[ ] 8.24  Use of cryptography — cryptographic rules and key management implemented?
[ ] 8.25  Secure development life cycle — secure development rules established and applied?
[ ] 8.26  Application security requirements — IS requirements identified and approved?
[ ] 8.27  Secure system architecture and engineering principles — documented and applied?
[ ] 8.28  Secure coding — secure coding principles applied in development?
[ ] 8.29  Security testing in development and acceptance — testing processes defined?
[ ] 8.30  Outsourced development — outsourced development directed, monitored, reviewed?
[ ] 8.31  Separation of development, test and production environments — separated/secured?
[ ] 8.32  Change management — changes to IS facilities subject to change mgmt procedures?
[ ] 8.33  Test information — test data appropriately selected, protected and managed?
[ ] 8.34  Protection of IS during audit testing — audit tests planned and agreed?

Evidence / Notes: ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT FINDINGS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Major Non-conformances  : ___
Minor Non-conformances  : ___
Observations            : ___

Finding 1: ___________________________________________
Clause/Control: ___  Type: [ ] Major  [ ] Minor  [ ] Obs
Evidence: ___________________________________________
Corrective Action Required by: [DATE]

Auditor Signature: _____________________ Date: _______
Auditee Signature: _____________________ Date: _______
`
  },
  {
    id: 'rec-management-review',
    cat: 'record',
    name: 'Management Review Minutes',
    desc: 'Template for recording management review meetings covering ISMS performance, risks, and improvement actions.',
    annex: 'Clause 9.3',
    tier: 'mandatory',
    content: `ISMS MANAGEMENT REVIEW MINUTES
═══════════════════════════════════════
Document Reference : [ORG]-MR-[YYYY]-[NN]
Date               : [DATE]
Location           : [VENUE / VIDEO CALL]
Chair              : [CEO / MANAGEMENT SPONSOR]
Minutes by         : [CISO / SECRETARY]

ATTENDEES
─────────
Name                  │ Role                    │ Present
──────────────────────┼─────────────────────────┼────────
[NAME]                │ CEO                     │ [ ]
[NAME]                │ CISO                    │ [ ]
[NAME]                │ IT Manager              │ [ ]
[NAME]                │ Legal / Compliance      │ [ ]
[NAME]                │ HR Manager              │ [ ]
[NAME]                │ [OTHER DEPT HEAD]       │ [ ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENDA ITEM 1 — STATUS OF PREVIOUS ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ref    │ Action                  │ Owner  │ Due    │ Status
───────┼─────────────────────────┼────────┼────────┼─────────
[ACT1] │ [Description]           │ [NAME] │ [DATE] │ [Open/Closed]
Notes: ________________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENDA ITEM 2 — CHANGES TO CONTEXT AND INTERESTED PARTIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Changes to organizational context: ___________________
• Regulatory/legal changes: ____________________________
• New/changed interested parties: ______________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENDA ITEM 3 — ISMS PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3a. Security Objectives Status:
  OBJ-01 Reduce incidents 25%      : [ON TRACK / AT RISK / ACHIEVED]
  OBJ-02 Training 100% completion  : [%] completed
  OBJ-03 Patch SLA compliance      : [%] within SLA
  OBJ-04 Vendor assessments        : [X] of [Y] complete
  OBJ-05 Backup restore tests      : [X] of [Y] complete

3b. Security Incidents:
  Total incidents (period)         : [N]
  P1 Critical                      : [N] — [SUMMARY]
  P2 High                          : [N] — [SUMMARY]
  Trend vs previous period         : [IMPROVING / STABLE / WORSENING]

3c. Audit Results:
  Internal audit finding           : [N] major, [N] minor, [N] obs
  Status of corrective actions     : [X] open, [Y] closed

3d. Supplier Performance:
  Issues identified                : [SUMMARY]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENDA ITEM 4 — RISK REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• New risks identified: _________________________________
• Risk register changes: ________________________________
• Risks above acceptance threshold: _____________________
• Treatment plan status: ________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENDA ITEM 5 — CONTINUAL IMPROVEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Improvement opportunities identified: _________________
• Resource requirements: ________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DECISIONS AND ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ref  │ Action                           │ Owner  │ Due
─────┼──────────────────────────────────┼────────┼────────
MR01 │ [Action description]             │ [NAME] │ [DATE]
MR02 │ [Action description]             │ [NAME] │ [DATE]

ISMS SUITABILITY STATEMENT
───────────────────────────
The ISMS is assessed as:
[ ] Suitable, Adequate, and Effective — no major changes required.
[ ] Requires improvement — actions noted above.

Next Management Review: [DATE]

Chair Signature: _________________________ Date: _______
`
  },
  {
    id: 'rec-corrective-action',
    cat: 'record',
    name: 'Corrective Action Register',
    desc: 'Log for tracking nonconformities, root causes, corrective actions, and their effectiveness.',
    annex: 'Clause 10.1',
    tier: 'mandatory',
    content: `CORRECTIVE ACTION REGISTER
═══════════════════════════════════════
Document Reference : [ORG]-CAR-001
Owner              : CISO
Last Updated       : [DATE]

PURPOSE
───────
Records all nonconformities raised through audits, incidents,
management reviews, or other sources, together with root cause
analysis and corrective actions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAR-2024-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date Raised         : [DATE]
Source              : Internal Audit / Incident / Management Review / Other
Clause / Control    : [e.g., A.6.3 — Security Awareness Training]
Description of NC   : Security awareness training was not completed
                      by 23% of staff within the required timeframe.
Severity            : [ ] Major  [X] Minor  [ ] Observation
Assigned to         : HR Manager / CISO
Root Cause Analysis :
  Why 1: Staff not completing training on time.
  Why 2: Training not assigned within onboarding workflow.
  Why 3: LMS integration with HR onboarding system not configured.
  Root Cause: LMS not integrated with HR onboarding platform,
              causing manual steps to be missed.

Immediate Action    : Manually enroll all outstanding staff in training.
                      Complete by [DATE].
Corrective Action   : Integrate LMS with HR system to auto-enroll
                      new starters on Day 1. Deploy automated
                      reminders at 7, 14, and 28 days.
Target Date         : [DATE]
Evidence Required   : LMS integration config, completion report
                      showing 100% after integration.

Status              : [ ] Open  [ ] In Progress  [ ] Closed
Date Closed         : [DATE]
Effectiveness Review: [RESULT — e.g., 100% completion achieved
                      for next cohort; no recurring NCs]
Closed by           : [CISO NAME]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAR-2024-002
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date Raised         : [DATE]
Source              : Incident (INC-2024-015)
Clause / Control    : A.5.15 — Access Control
Description of NC   : Former employee account still active 14 days
                      after departure date.
Severity            : [X] Major  [ ] Minor  [ ] Observation
Root Cause          : IT not notified by HR until 2 weeks post-departure.
                      No automated deprovisioning process exists.
Corrective Action   : Implement automated HR-IT integration to trigger
                      deprovisioning workflow on leaver date.
                      Establish weekly HR-IT reconciliation report.
Target Date         : [DATE]
Status              : [ ] Open  [ ] In Progress  [ ] Closed
`
  },
  {
    id: 'rec-training',
    cat: 'record',
    name: 'Security Awareness Training Register',
    desc: 'Record of staff security training completion, dates, and acknowledgements.',
    annex: 'A.6.3',
    tier: 'mandatory',
    content: `SECURITY AWARENESS TRAINING REGISTER
═══════════════════════════════════════
Document Reference : [ORG]-TR-001
Period             : [YEAR]
Owner              : HR / CISO
Last Updated       : [DATE]

TRAINING PROGRAMMES
────────────────────
CODE  │ Name                           │ Duration │ Frequency │ Mandatory
──────┼────────────────────────────────┼──────────┼───────────┼──────────
T-001 │ Information Security Induction │ 1 hr     │ Onboarding│ Yes (all)
T-002 │ Annual IS Refresher            │ 45 min   │ Annual    │ Yes (all)
T-003 │ Phishing Awareness             │ 20 min   │ Quarterly │ Yes (all)
T-004 │ Data Protection / GDPR         │ 1 hr     │ Annual    │ Yes (all)
T-005 │ Privileged User Security       │ 2 hrs    │ Annual    │ Priv users
T-006 │ Secure Development (SSDLC)     │ 4 hrs    │ Annual    │ Dev team

COMPLETION RECORD
──────────────────
Name            │ Role       │ T-001 │ T-002 │ T-003 │ T-004 │ T-005
────────────────┼────────────┼───────┼───────┼───────┼───────┼───────
[EMPLOYEE NAME] │ [ROLE]     │[DATE] │[DATE] │[DATE] │[DATE] │  N/A
[EMPLOYEE NAME] │ [ROLE]     │[DATE] │[DATE] │[DATE] │[DATE] │[DATE]
[EMPLOYEE NAME] │ Dev        │[DATE] │[DATE] │[DATE] │[DATE] │  N/A

Note: Date = completion date. Blank = not yet completed.

PHISHING SIMULATION RESULTS
────────────────────────────
Simulation Date : [DATE]
Conducted by    : [VENDOR / INTERNAL]
Emails Sent     : [N]
Click Rate      : [%]   (Target: < 5%)
Report Rate     : [%]   (Target: > 80%)
Actions Taken   : [Repeat training for clickers / Additional awareness]

COMPLETION STATISTICS ([PERIOD])
──────────────────────────────────
T-001 Induction     : [N] of [N] new starters complete ([%])
T-002 Annual Refresh: [N] of [N] total staff complete ([%])
T-003 Phishing Q[N] : [N] of [N] staff complete ([%])
T-004 GDPR          : [N] of [N] staff complete ([%])
T-005 Privileged    : [N] of [N] privileged users complete ([%])

Reported by: [CISO NAME]  Date: [DATE]
`
  },
  {
    id: 'rec-supplier',
    cat: 'record',
    name: 'Supplier Security Assessment Form',
    desc: 'Questionnaire for assessing the information security posture of suppliers and third parties.',
    annex: 'A.5.19 / A.5.21',
    tier: 'recommended',
    content: `SUPPLIER SECURITY ASSESSMENT QUESTIONNAIRE
═══════════════════════════════════════
Document Reference : [ORG]-SSA-001
Supplier Name      : [SUPPLIER NAME]
Assessment Date    : [DATE]
Completed by       : [SUPPLIER CONTACT, ROLE]
Reviewed by        : [CISO / PROCUREMENT]
Next Review        : [DATE + 12 months]

SECTION 1 — CERTIFICATIONS & COMPLIANCE
─────────────────────────────────────────
1.1 Does your organization hold ISO 27001 certification?
    [ ] Yes — Certificate No: _______ Expiry: _______  Scope: _______
    [ ] No  — Alternative: SOC 2  [ ]  Cyber Essentials  [ ]  Other: _____

1.2 Are you subject to any relevant regulations? (GDPR, HIPAA, PCI-DSS)
    [ ] Yes — List: _______________________________________________
    [ ] No

1.3 Date of last external security audit: _______________________
    Auditor: ________________________ Outcome: ___________________

SECTION 2 — INFORMATION SECURITY MANAGEMENT
─────────────────────────────────────────────
2.1 Do you have a documented Information Security Policy?  [ ] Yes  [ ] No
2.2 Is there a designated CISO or equivalent security role? [ ] Yes  [ ] No
2.3 Do you conduct annual risk assessments?                [ ] Yes  [ ] No
2.4 Is security awareness training mandatory for all staff?[ ] Yes  [ ] No
2.5 Do you have an incident response plan?                 [ ] Yes  [ ] No
    If yes, what is your notification SLA for incidents affecting our data? ___

SECTION 3 — ACCESS CONTROL & AUTHENTICATION
─────────────────────────────────────────────
3.1 Is multi-factor authentication enforced for access to systems
    that store/process our data?                           [ ] Yes  [ ] No
3.2 Is access granted on a least-privilege / need-to-know basis?  [ ] Yes  [ ] No
3.3 Are access rights reviewed at least annually?          [ ] Yes  [ ] No
3.4 Are privileged accounts separately managed and monitored?      [ ] Yes  [ ] No

SECTION 4 — DATA PROTECTION
─────────────────────────────
4.1 Is data encrypted at rest using AES-256 or equivalent? [ ] Yes  [ ] No
4.2 Is data encrypted in transit using TLS 1.2+?           [ ] Yes  [ ] No
4.3 Where will our data be processed and stored? (countries/regions):
    ____________________________________________________________
4.4 Do you use subprocessors to handle our data?           [ ] Yes  [ ] No
    If yes, provide list: ______________________________________

SECTION 5 — BUSINESS CONTINUITY
─────────────────────────────────
5.1 Do you have a Business Continuity / Disaster Recovery plan? [ ] Yes  [ ] No
5.2 What is your RTO for services provided to us? ___________
5.3 How frequently are DR tests conducted?        ___________

SECTION 6 — VULNERABILITY & PATCH MANAGEMENT
──────────────────────────────────────────────
6.1 How frequently are systems patched?           ___________
6.2 Are vulnerability scans conducted regularly?  [ ] Yes  [ ] No
    Frequency: _____________________________________________
6.3 Has a penetration test been conducted in the last 12 months?
    [ ] Yes — Summary available on request?  [ ] Yes  [ ] No
    [ ] No

SECTION 7 — SUBCONTRACTORS
────────────────────────────
7.1 Do subcontractors have access to our data or systems?  [ ] Yes  [ ] No
    If yes, how is their security assessed? ____________________

DECLARATION
────────────
I confirm the above information is accurate to the best of my knowledge.

Signed: _________________________ Date: _________________
Name:   _________________________ Title: _________________
`
  },

  /* ── NEW ANNEX A POLICIES ──────────────────────────────── */

  {
    id: 'pol-info-transfer', cat: 'policy',
    name: 'Information Transfer Policy',
    desc: 'Rules for securely transferring information via email, removable media, cloud, and other channels.',
    annex: 'A.5.14', tier: 'mandatory',
    content: `INFORMATION TRANSFER POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-011
Version            : 1.0   Effective Date : [DATE]   Owner : CISO

1. PURPOSE
──────────
Define the rules and minimum security controls for transferring information
between [ORGANIZATION NAME] and external parties, or between internal systems,
to protect confidentiality, integrity, and accountability.

2. SCOPE
─────────
All employees, contractors, and third parties transferring organisational
information via any channel: email, cloud storage, USB/media, API, fax, post.

3. GENERAL PRINCIPLES
──────────────────────
• Information transferred must be classified and handled per the Data
  Classification Policy. CONFIDENTIAL and SECRET require encryption.
• The minimum necessary data principle applies — do not send more than needed.
• All transfer mechanisms must be approved by IT before use.
• Transfers of personal data require a legal basis (GDPR Art. 6 / Art. 9).
• Cross-border transfer of personal data requires additional safeguards.

4. APPROVED TRANSFER CHANNELS
───────────────────────────────
Channel              │ Max Classification │ Required Controls
─────────────────────┼────────────────────┼──────────────────────────────────
Corporate email      │ CONFIDENTIAL       │ TLS enforced; no bulk PII unencrypted
Encrypted email      │ SECRET             │ S/MIME or PGP; recipient key verified
Approved cloud share │ CONFIDENTIAL       │ MFA-protected link; expiry ≤ 30 days
Secure file transfer │ SECRET             │ SFTP/FTPS/SCP; key-based auth
Removable USB        │ INTERNAL           │ Hardware-encrypted USB ONLY (FIPS 140-2)
Physical post        │ CONFIDENTIAL       │ Signed-for delivery; sealed envelope
API (TLS 1.3)        │ CONFIDENTIAL       │ API key + mutual TLS for SECRET

PROHIBITED:
  ✗ Personal email (Gmail, Yahoo, etc.) for INTERNAL+ data
  ✗ Consumer file sharing (personal Google Drive, Dropbox personal, WeTransfer)
  ✗ Unencrypted USB drives for any classified data
  ✗ Fax for CONFIDENTIAL+ data (unless encrypted fax / PSTN secure mode)
  ✗ SMS/WhatsApp for CONFIDENTIAL+ data

5. EMAIL SECURITY
──────────────────
• Large attachments (> [25 MB]): use approved file transfer platform, not email.
• Misdirected email: if sent to wrong recipient, report to Security Team within
  1 hour. Mark as potential data breach; begin containment.
• Email DMARC/DKIM/SPF must be enforced on all sending domains.
• External recipients of CONFIDENTIAL data: use encrypted email or secure portal.

6. DATA SHARING AGREEMENTS
────────────────────────────
• All regular transfers of CONFIDENTIAL+ data to third parties require a signed
  Data Sharing Agreement (DSA) or Data Processing Agreement (DPA).
• One-off transfers: business justification approved by line manager + CISO.
• Personal data to processors: DPA mandatory (GDPR Art. 28).

7. TRANSFER LOGGING
────────────────────
• SFTP / secure file transfer: log all transfers (file, user, timestamp, destination).
• Logs retained for [12] months; audited quarterly.
• Mass export of customer data triggers SIEM alert for review.

RECOMMENDATIONS
─────────────────
• Deploy a Data Loss Prevention (DLP) tool to automatically block or quarantine
  sensitive data transferred via unapproved channels (email, cloud, USB).
• Use a managed file transfer (MFT) platform for regular business-to-business
  data exchange — it provides encryption, logging, and audit trails automatically.
• Implement email data classification plugins (Microsoft Purview / Titus) so
  staff see the classification level and receive prompts before external send.
`
  },
  {
    id: 'pol-cloud', cat: 'policy',
    name: 'Cloud Security Policy',
    desc: 'Security requirements for procuring, configuring, and exiting cloud services.',
    annex: 'A.5.23', tier: 'recommended',
    content: `CLOUD SECURITY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-012
Version            : 1.0   Effective Date : [DATE]   Owner : CISO

1. PURPOSE
──────────
Establish security requirements for the acquisition, configuration, use,
monitoring, and exit of cloud services, consistent with A.5.23.

2. CLOUD PROCUREMENT REQUIREMENTS
───────────────────────────────────
Before any new cloud service is approved:
□ Business owner identified and accountable for the service.
□ Data classification of data that will be stored/processed determined.
□ Supplier security assessment completed (Tier 1 if handling SECRET/PII).
□ Data residency confirmed — data must remain in [APPROVED REGIONS].
□ GDPR/legal basis confirmed for any personal data processed.
□ Security questionnaire and DPA/Terms of Service reviewed by CISO + Legal.
□ Offboarding/exit procedure documented before sign-up.
Shadow IT is prohibited: staff must not create cloud accounts for org data
without IT and CISO approval.

3. SHARED RESPONSIBILITY
─────────────────────────
Cloud providers secure the INFRASTRUCTURE. [ORGANIZATION NAME] is responsible for:
  • Identity and access management (who can log in)
  • Data classification and protection within the service
  • Configuration of security settings (not relying on defaults)
  • Monitoring and logging of activity within the service
  • Encryption keys (where customer-managed keys are used)
  • Compliance with data protection laws for data you store

4. CONFIGURATION BASELINE
──────────────────────────
All cloud environments must meet the following baseline:
  □ MFA enforced for all admin and user accounts (FIDO2 preferred)
  □ Cloud Security Posture Management (CSPM) tool deployed and active
  □ No public storage buckets or shares without explicit CISO approval
  □ Audit logging enabled and centralised in SIEM (CloudTrail / Activity Log)
  □ Infrastructure-as-Code (IaC) for all infrastructure; no untracked manual changes
  □ Least-privilege IAM: no standing root/global admin for operational use
  □ Break-glass accounts: 2 accounts per environment; alert on use
  □ Default VPC/virtual network configuration reviewed and hardened
  □ Security groups / NSGs: default deny; explicit allow only
  □ Key Management: customer-managed keys (CMK) for SECRET data; rotation enabled

5. DATA PROTECTION IN CLOUD
─────────────────────────────
• Storage encryption: SSE-KMS with CMK for CONFIDENTIAL+; SSE with provider key acceptable for INTERNAL.
• Data in transit: TLS 1.3 required for all API and user access.
• Backup: enabled per Backup Policy; retention and restore tested quarterly.
• Data sovereignty: production data must remain in [APPROVED_REGION(S)]; logging may be replicated.

6. CLOUD EXIT / OFFBOARDING
─────────────────────────────
Before decommissioning any cloud service:
□ Export/migrate all required data to approved storage.
□ Obtain written confirmation of data deletion from provider.
□ Revoke all access credentials and API keys.
□ Terminate billing and remove payment methods.
□ Archive audit logs per retention requirements before deletion.
□ Update asset register and risk register.

RECOMMENDATIONS
─────────────────
• Adopt the CIS Benchmarks for your cloud providers (AWS, Azure, GCP) as your
  hardening baseline. They are free: https://www.cisecurity.org/cis-benchmarks
• Deploy a CSPM tool (Microsoft Defender CSPM / Wiz / Prisma Cloud / free:
  AWS Security Hub) to continuously monitor for misconfigurations.
• Enforce IaC-only changes to production via CI/CD pipeline; no console exceptions.
  This makes configuration drift impossible and provides change audit trail.
`
  },
  {
    id: 'pol-privacy', cat: 'policy',
    name: 'Privacy & PII Protection Policy',
    desc: 'Obligations for handling personal data lawfully, minimally, and securely in compliance with data protection laws.',
    annex: 'A.5.34', tier: 'mandatory',
    content: `PRIVACY AND PERSONAL DATA PROTECTION POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-013
Version            : 1.0   Effective Date : [DATE]
Owner              : Data Protection Officer (DPO) / CISO

1. LEGAL BASIS AND SCOPE
──────────────────────────
[ORGANIZATION NAME] processes personal data subject to [GDPR / UK GDPR /
CCPA / LGPD / applicable local law]. This policy applies to all personal
data (PII) processed by or on behalf of [ORGANIZATION NAME].

Personal data means any information relating to an identified or
identifiable natural person (data subject).

Special category data (health, biometric, racial origin, religion, etc.)
is subject to additional restrictions — CISO and DPO approval required.

2. DATA PROTECTION PRINCIPLES (GDPR Art. 5)
─────────────────────────────────────────────
Lawfulness, Fairness, Transparency : Process only with a valid legal basis; inform subjects.
Purpose Limitation                 : Collect for specified purposes; no incompatible reuse.
Data Minimisation                  : Collect only what is necessary for the stated purpose.
Accuracy                           : Keep data accurate and up to date.
Storage Limitation                 : Retain only as long as necessary; enforce retention.
Integrity and Confidentiality      : Apply appropriate technical and organisational controls.
Accountability                     : Document processing activities; demonstrate compliance.

3. LEGAL BASES FOR PROCESSING
───────────────────────────────
[ORGANIZATION NAME] relies on the following legal bases:
  • Contract (Art. 6(1)(b))   : Processing necessary to fulfil customer/employee contracts.
  • Legal obligation (Art. 6(1)(c)): Payroll, tax, employment law compliance.
  • Legitimate interests (Art. 6(1)(f)): Security monitoring, fraud prevention (IAB assessed).
  • Consent (Art. 6(1)(a))    : Marketing, optional analytics (withdrawable at any time).

4. DATA SUBJECT RIGHTS
────────────────────────
[ORGANIZATION NAME] must respond to data subject rights within 30 days:
  Right of Access (Art. 15)         : Provide copy of data held.
  Right to Rectification (Art. 16)  : Correct inaccurate data.
  Right to Erasure (Art. 17)        : Delete data where no overriding grounds.
  Right to Restriction (Art. 18)    : Limit processing where contested.
  Right to Portability (Art. 20)    : Export data in machine-readable format.
  Right to Object (Art. 21)         : Object to processing based on legitimate interests.
  Rights re automated decisions (Art. 22): Humans must review significant automated decisions.

Requests received by any channel (email, web form, verbal) must be directed
to [dpo@organization.com / privacy portal] and logged immediately.
Identity verification required before fulfilling access or erasure requests.

5. DATA RETENTION
──────────────────
Data type                  │ Retention Period     │ Justification
───────────────────────────┼──────────────────────┼──────────────────────────────
Customer records           │ [7] years            │ Contract + tax law
Employee HR records        │ [7] years post-exit  │ Employment law
Job applicant data         │ [6] months           │ Recruitment process
Marketing consent records  │ [3] years post-consent│ Accountability
Audit logs                 │ [12] months online, [3] years archive │ Security
CCTV footage               │ [30] days            │ Minimum necessary
Financial records          │ [7] years            │ Tax law

6. DATA BREACHES
─────────────────
Any suspected personal data breach must be reported to the DPO within 24 hours.
The DPO assesses risk and determines:
  • Whether [ICO / DPA] notification required (within 72 hours, GDPR Art. 33).
  • Whether data subjects must be notified (Art. 34 — high risk).
  • Whether cyber insurer notification is required.

RECOMMENDATIONS
─────────────────
• Conduct a Data Protection Impact Assessment (DPIA) for any new high-risk
  processing activity (large-scale profiling, special category data, etc.).
  DPIA is mandatory under GDPR Art. 35 in many cases.
• Maintain a Record of Processing Activities (RoPA) per GDPR Art. 30 —
  this is mandatory for organisations with > 250 employees or high-risk processing.
• Appoint a formal DPO if required (public authority, large-scale special category
  processing, or large-scale monitoring of individuals).
`
  },
  {
    id: 'pol-hr-security', cat: 'policy',
    name: 'HR Security Policy',
    desc: 'Security obligations during recruitment screening, employment, role changes, and termination.',
    annex: 'A.6.1 / A.6.2 / A.6.5', tier: 'mandatory',
    content: `HR SECURITY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-014
Version            : 1.0   Effective Date : [DATE]   Owner : HR / CISO

1. PURPOSE
──────────
Define security obligations across the full employee and contractor lifecycle
to protect [ORGANIZATION NAME]'s information assets.

2. PRE-EMPLOYMENT SCREENING (A.6.1)
─────────────────────────────────────
All candidates offered positions must undergo screening proportionate to
the role's access to information assets and data sensitivity.

Screening for ALL roles:
  □ Identity verification (government-issued photo ID)
  □ Right to work verification
  □ Employment history verification (last [5] years)
  □ Professional qualifications (if role-critical)

Additional for CONFIDENTIAL/SECRET access roles:
  □ Criminal record check (DBS / applicable jurisdiction)
  □ Credit check (financial roles and those handling payments)
  □ Reference checks: minimum [2] professional references
  □ Social media screening (proportionate and documented)

Contractors and third parties: equivalent screening required before access granted.
Screening gaps: if screening cannot be completed before start, risk-accept with
CISO approval; access restricted until complete.

3. TERMS AND CONDITIONS OF EMPLOYMENT (A.6.2)
───────────────────────────────────────────────
All employment contracts and contractor agreements must include:
  • Information security responsibilities clause
  • Acceptable use of organisational systems
  • Confidentiality obligations (survive termination; see NDA policy)
  • Consequences of non-compliance (up to dismissal)
  • Obligation to report security incidents and policy violations
  • Reference to the Information Security Policy and related policies
  • BYOD terms if applicable

HR must ensure all new starters receive, read, and sign the IS Policy
and Acceptable Use Policy before being granted system access.

4. DURING EMPLOYMENT
─────────────────────
• Security awareness training: completed within 30 days of joining;
  annual refresher mandatory for all staff (see Training Register).
• Role changes: line manager notifies IT and HR minimum [3] days
  before change; access rights reviewed same day as change.
• Security incidents: staff have a duty to report per the Incident
  Response Policy. Victimisation for good-faith reports is prohibited.
• Disciplinary process (A.6.4): formal documented process for IS policy
  violations. Severity of violation determines outcome:
    Minor violation   : verbal/written warning; mandatory retraining
    Serious violation : formal disciplinary; potential dismissal
    Criminal activity : dismissal + law enforcement referral

5. TERMINATION AND ROLE CHANGE (A.6.5)
────────────────────────────────────────
Responsibilities that survive termination:
• Confidentiality obligations continue indefinitely for trade secrets
  and for [5] years for general CONFIDENTIAL information.
• Return of all assets: devices, badges, documents, keys.
• NDA remains enforceable; legal team to pursue violations.

HR offboarding checklist (coordinate with IT — see Access Control Policy):
  □ Exit interview conducted; security topics covered
  □ All devices returned and inventory signed
  □ Employee briefed on post-employment confidentiality obligations
  □ Reference to NDA and potential liability for breaches
  □ Access termination confirmed by IT (signed receipt)

RECOMMENDATIONS
─────────────────
• Automate the onboarding/offboarding workflow with HR system integration
  (ServiceNow, Workday, or even a simple Google Form that triggers IT tickets).
  Manual processes miss steps — especially access revocation for leavers.
• Implement a 90-day "buddy check" for new joiners: line manager confirms they
  have completed all mandatory training and understand their security duties.
`
  },
  {
    id: 'pol-nda', cat: 'policy',
    name: 'Confidentiality Agreement (NDA)',
    desc: 'Standard template for mutual and one-way non-disclosure agreements with employees, contractors, and partners.',
    annex: 'A.6.6', tier: 'mandatory',
    content: `NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT
═══════════════════════════════════════════════════════════════════════════
[Choose: MUTUAL / ONE-WAY]

This Agreement is entered into as of [DATE] between:

Disclosing Party : [ORGANIZATION NAME], [ADDRESS] ("the Company")
Receiving Party  : [NAME / ORGANISATION], [ADDRESS] ("the Recipient")

1. DEFINITION OF CONFIDENTIAL INFORMATION
───────────────────────────────────────────
"Confidential Information" means any non-public information disclosed by
the Company to the Recipient, in any form, that is designated confidential
or that reasonably should be understood to be confidential given the nature
of the information, including but not limited to:
  • Business plans, strategies, and financial projections
  • Technical specifications, source code, and system architecture
  • Customer lists, pricing, and commercial terms
  • Employee, contractor, and patient/user personal data
  • Security configurations, vulnerability assessments, and audit results
  • Any information classified CONFIDENTIAL or SECRET under the Company's
    Data Classification Policy

Exclusions: Information that (a) is or becomes publicly known through no
breach of this Agreement; (b) was rightfully in the Recipient's possession
prior to disclosure; (c) is independently developed by the Recipient
without reference to Confidential Information; (d) is required to be
disclosed by law (with prior written notice to the Company where permitted).

2. OBLIGATIONS OF THE RECIPIENT
────────────────────────────────
The Recipient agrees to:
a) Use Confidential Information solely for [PURPOSE — e.g., evaluation of
   a potential business relationship / performance of contracted services].
b) Maintain the confidentiality of the Confidential Information using at
   least the same standard of care as used to protect its own confidential
   information, but no less than reasonable care.
c) Not disclose Confidential Information to any third party without prior
   written consent of the Company.
d) Limit access to Confidential Information to those employees, contractors,
   and agents who have a need to know for the stated purpose and who are
   bound by obligations of confidentiality at least as protective as this Agreement.
e) Promptly notify the Company upon discovery of any unauthorised use or
   disclosure of Confidential Information.
f) Return or destroy (at the Company's election) all Confidential Information
   upon request or termination of the business relationship, and certify
   completion in writing.

3. TERM
───────
This Agreement shall remain in effect for [3] years from the date above,
except that obligations with respect to trade secrets shall survive indefinitely.

4. REMEDIES
────────────
The Recipient acknowledges that breach may cause irreparable harm for which
monetary damages are an inadequate remedy. The Company is therefore entitled
to seek injunctive relief without bond or other security.

5. GOVERNING LAW
─────────────────
This Agreement shall be governed by the laws of [JURISDICTION / England and Wales].

─────────────────────────────────────────────────────────────────────────
SIGNED for and on behalf of [ORGANIZATION NAME]:

Signature: ___________________  Name: _________________  Date: _________
Title:     ___________________

SIGNED by the Recipient:

Signature: ___________________  Name: _________________  Date: _________
Title:     ___________________
Organisation: _______________________________________________
`
  },
  {
    id: 'pol-remote-work', cat: 'policy',
    name: 'Remote Working Policy',
    desc: 'Security requirements for employees working remotely, including home office and travel.',
    annex: 'A.6.7', tier: 'mandatory',
    content: `REMOTE WORKING POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-015
Version            : 1.0   Effective Date : [DATE]   Owner : CISO / HR

1. SCOPE
─────────
Applies to all employees, contractors, and third parties who access
[ORGANIZATION NAME] systems or data from outside a company-controlled
office environment.

2. APPROVED DEVICES
────────────────────
• Work must be performed on company-owned or company-approved BYOD devices.
• Company devices: must be enrolled in MDM; full-disk encryption required.
• BYOD: must be enrolled in MDM; work profile separate from personal; AV installed.
• Personal devices with no MDM: PROHIBITED for accessing CONFIDENTIAL+ data.
• Printing confidential documents at home: PROHIBITED unless explicitly approved.

3. NETWORK SECURITY
────────────────────
• VPN/ZTNA mandatory before accessing any corporate resources (exceptions: approved
  public SaaS tools that enforce their own MFA).
• Home Wi-Fi: WPA2/WPA3 required; device must not be on same segment as IoT devices.
  Recommendation: use a separate SSID for work devices.
• Public Wi-Fi (cafes, hotels, airports): VPN/ZTNA mandatory at all times.
  Never connect to public networks without active VPN.
• Mobile hotspot: acceptable as primary connection; VPN still required for corporate resources.

4. PHYSICAL SECURITY AT HOME
──────────────────────────────
• Screen lock: automatic lock after 5 minutes of inactivity.
• Screen privacy: use privacy screen filter where household members or others may view.
• Confidential documents: store in lockable cabinet; do not leave visible.
• Visitors: do not allow visitors to view or access work screens or documents.
• End of work: log out of all work applications; lock workstation.

5. TRAVEL SECURITY
───────────────────
• High-risk countries: notify CISO before travelling with company devices.
  Additional controls (loaner device, encrypted partition) may apply.
• Border crossing: customs may demand device access in some jurisdictions.
  Notify CISO if device is accessed by authorities; treat as potential compromise.
• Hotel room: do not leave devices unattended; use hotel safe if available.
  Do not use hotel/conference Wi-Fi for corporate access without VPN.
• Lost or stolen device: report to IT Security within 1 hour for remote wipe.

6. DATA HANDLING
─────────────────
• Do not store work data on personal cloud storage or personal devices.
• Downloads to local device: only if necessary; delete when task is complete.
• Video calls: be aware of background — do not display whiteboards, screens,
  or physical documents visible to video participants.
• Physical documents: shred with approved shredder; do not place in household recycling.

7. ACCEPTABLE PERSONAL USE
────────────────────────────
Limited personal use of a company device is acceptable if it does not:
  • Compromise the security of the device
  • Access inappropriate or illegal content
  • Install unapproved software
  • Interfere with work performance

8. COMPLIANCE
─────────────
Employees must acknowledge this policy annually. Non-compliance may result in
revocation of remote working privileges and/or disciplinary action.

RECOMMENDATIONS
─────────────────
• Provide all remote workers with a hardware VPN token or FIDO2 key — this
  removes the password-over-VPN attack surface and improves compliance.
• Deploy endpoint detection and response (EDR) on all remote devices.
  Remote workers are the #1 initial access vector for attackers.
• Run quarterly phishing simulations targeting remote workers specifically —
  they face different threats (home delivery phishing, fake VPN portals).
`
  },
  {
    id: 'pol-physical-security', cat: 'policy',
    name: 'Physical Security Policy',
    desc: 'Controls for physical security perimeters, entry, secure areas, equipment protection, and visitor management.',
    annex: 'A.7.1 – A.7.6', tier: 'mandatory',
    content: `PHYSICAL SECURITY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-016
Version            : 1.0   Effective Date : [DATE]   Owner : Facilities / CISO

1. PHYSICAL SECURITY ZONES
────────────────────────────
[ORGANIZATION NAME] operates the following security zones:
  Zone 0 — Public       : Reception, lobby, public areas. No access controls.
  Zone 1 — Staff        : General office areas. Staff badge required.
  Zone 2 — Restricted   : Server rooms, network closets, HR, finance. Named access only.
  Zone 3 — Secure       : Any area holding SECRET data or critical infrastructure.
                          Biometric + badge access; visitor log mandatory.

2. PERIMETER CONTROLS (A.7.1)
───────────────────────────────
• All building entry/exit points: electronic access control (badge + PIN minimum).
• Server rooms and Zone 2/3: dual-factor entry (badge + PIN or biometric).
• Building exterior: adequate lighting; clear sightlines; CCTV coverage.
• Fencing/barriers as appropriate for site risk profile.

3. PHYSICAL ENTRY CONTROLS (A.7.2)
─────────────────────────────────────
• All staff must wear visible access badges at all times in the building.
• Tailgating is prohibited. Staff must not hold doors open for unverified persons.
• Visitors: signed in at reception; issued a dated visitor badge; escorted at all
  times in Zone 2/3; signed out on departure.
• Contractors: issued temporary access cards for duration of work; escorted in
  Zone 3; access revoked on completion of work.
• Lost badges: report within 2 hours; deactivate immediately.
• Badge review: access rights reviewed annually; revoked when no longer required.

4. SECURING OFFICES, ROOMS AND FACILITIES (A.7.3)
────────────────────────────────────────────────────
• Server rooms and network closets must be locked when unattended.
• Key/card inventory maintained and reviewed monthly.
• Environmental controls: UPS, air conditioning, fire suppression for server rooms.
• Access logs reviewed monthly; anomalies reported to CISO.

5. PHYSICAL SECURITY MONITORING (A.7.4)
─────────────────────────────────────────
• CCTV: installed at all entry/exit points and Zone 2/3 areas.
• Retention: CCTV footage retained for [30] days minimum.
• Monitoring: reviewed on request and following any incident.
• Signs: visible CCTV notification displayed at all entry points.
• Intrusion detection: on server rooms and after-hours office perimeter.

6. PROTECTION AGAINST PHYSICAL AND ENVIRONMENTAL THREATS (A.7.5)
────────────────────────────────────────────────────────────────────
• Fire: suppression system; fire extinguishers; evacuation plan tested annually.
• Flood: server equipment elevated; flood sensors in server room.
• Power: UPS for all critical servers; generator for data centre.
• Temperature: HVAC monitoring with alerting for server rooms.
• Natural disaster: business continuity and DR plan tested annually.

7. WORKING IN SECURE AREAS (A.7.6)
─────────────────────────────────────
• Solo working in Zone 3 is discouraged; buddy system for out-of-hours access.
• Cameras, audio recorders, and mobile phones: restricted in Zone 3
  (subject to local law and employee agreement).
• Work in secure areas must be supervised or logged; no unsupervised contractor access.

RECOMMENDATIONS
─────────────────
• Use anti-piggybacking/tailgating barriers (speed gates) at main office entry —
  tailgating is the most common physical security breach in offices.
• Implement a visitor management system with pre-registration and photo ID capture.
• Annual penetration test of physical security (red team physical assessment) is
  highly valuable — most organisations are surprised by how easy physical access is.
`
  },
  {
    id: 'pol-clear-desk', cat: 'policy',
    name: 'Clear Desk and Clear Screen Policy',
    desc: 'Rules requiring staff to secure physical documents and lock screens when unattended.',
    annex: 'A.7.7', tier: 'mandatory',
    content: `CLEAR DESK AND CLEAR SCREEN POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-017
Version            : 1.0   Effective Date : [DATE]   Owner : CISO / Facilities

1. PURPOSE
──────────
Prevent unauthorised access to information left visible on desks or screens
when workstations are unattended, reducing the risk of shoulder-surfing,
opportunistic data theft, and inadvertent data disclosure.

2. CLEAR DESK REQUIREMENTS
────────────────────────────
DURING THE WORKING DAY (when leaving a desk, even briefly):
  □ Lock workstation screen (Windows: Win+L / Mac: Ctrl+Cmd+Q)
  □ Turn papers face-down or place in a drawer if leaving for > 2 minutes
  □ Never leave access cards/keys on an unattended desk

END OF WORKING DAY (mandatory):
  □ All papers and portable media locked in a drawer or filing cabinet
  □ No printed documents left on printers or copiers
  □ Whiteboards containing sensitive information wiped clean
  □ Physical keys and access cards stored securely
  □ Workstation locked (log out for end of day)
  □ Laptop lid closed (physical barrier) — or laptop locked in drawer/secure cabinet

DOCUMENT CLASSIFICATION ON DESKS:
  PUBLIC / INTERNAL  : May be on desk during working hours; cleared at end of day
  CONFIDENTIAL       : Store face-down when not actively reading; locked away when absent
  SECRET             : Never left unattended; stored in locked safe when not in use

3. CLEAR SCREEN REQUIREMENTS
──────────────────────────────
• Automatic screen lock: configured on all workstations — [5] minutes idle lock.
• Manual lock: required whenever leaving workstation, even for 1 minute.
• Privacy screens: required for hot-desk areas, open-plan offices, and travel.
• External monitors: covered or turned off when not in use in shared spaces.
• Video calls: be aware of background; confidential content should not be visible
  to video participants without need-to-know.

4. PRINTING CONTROLS
──────────────────────
• CONFIDENTIAL+ documents: use Follow-Me / pull printing (collect at printer with badge).
• Uncollected print jobs: automatically deleted after [5] minutes.
• Printed documents: collected immediately upon printing; never left at printer.
• Disposal: cross-cut shredder or confidential waste bin (not regular recycling).

5. COMPLIANCE CHECKS
─────────────────────
• Compliance walk-arounds: conducted monthly (unannounced) by Security/Facilities.
• Results recorded and escalated to line manager for repeat violations.
• Clear desk compliance included in annual security awareness assessment.

RECOMMENDATIONS
─────────────────
• Implement Follow-Me printing across all office printers. This single control
  eliminates the printer as a confidential data exposure point.
• Make screen-lock shortcuts part of onboarding training — muscle memory is key.
  Consider a short awareness campaign: "Lock when you walk" (e.g., Win+L screensaver).
• Place confidential waste bins (cross-cut shredder bins) at regular intervals
  across the office floor so staff never have an excuse to use regular bins.
`
  },
  {
    id: 'pol-media-disposal', cat: 'policy',
    name: 'Storage Media & Secure Disposal Policy',
    desc: 'Lifecycle management of storage media from acquisition through secure sanitisation and certified disposal.',
    annex: 'A.7.10 / A.7.14', tier: 'mandatory',
    content: `STORAGE MEDIA AND SECURE DISPOSAL POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-018
Version            : 1.0   Effective Date : [DATE]   Owner : IT Manager / CISO

1. SCOPE
─────────
All storage media containing organisational data: HDDs, SSDs, USB drives,
tapes, optical media, mobile phones, tablets, laptops, printers (internal storage),
photocopiers, and cloud storage volumes.

2. MEDIA CLASSIFICATION AND LABELLING
───────────────────────────────────────
All removable media must be labelled with:
  • Owner/department
  • Classification level
  • Date of last use
  • Asset tag or unique ID

Unlabelled removable media found in the organisation is treated as CONFIDENTIAL
and referred to IT for identification and secure handling.

3. APPROVED MEDIA TYPES
────────────────────────
• Removable USB: hardware-encrypted USB drives ONLY (FIPS 140-2 Level 3 preferred).
  Unencrypted USB drives: PROHIBITED for any data transfer.
• External HDDs: encrypted; approved models listed at [IT asset catalogue].
• Cloud storage: approved services only (see Cloud Security Policy).
• Tapes (backup): encrypted with AES-256; stored off-site in locked container.

4. MEDIA IN USE CONTROLS
─────────────────────────
• Media inventory: all issued removable media recorded in the asset register.
• Media in transit: CONFIDENTIAL+ media transported in tamper-evident packaging.
• Loss/theft: report within 1 hour; treat as potential data breach.
• Borrowing: log any media taken off-site (user, date, return date).

5. SANITISATION STANDARDS
──────────────────────────
Before any media is reused, repurposed, repaired, returned, or disposed of,
data must be sanitised to the appropriate level:

Classification on Media │ Sanitisation Method                │ Standard
────────────────────────┼────────────────────────────────────┼────────────────────────
INTERNAL                │ NIST Purge (overwrite) or degauss   │ NIST SP 800-88 Rev.1
CONFIDENTIAL            │ Cryptographic erasure + verification│ NIST SP 800-88 Rev.1
SECRET                  │ Physical destruction (shredding)    │ NSA/CSS EPL; CESG listed

Cryptographic erasure: If full-disk encryption was in use from first use,
deleting/rotating the encryption key is an approved sanitisation method for
SSDs (where overwrite is unreliable).

SSD sanitisation: Overwriting is UNRELIABLE on SSDs due to wear levelling.
Use manufacturer Secure Erase command, cryptographic erasure, or physical destruction.

6. DISPOSAL AND DESTRUCTION
────────────────────────────
• INTERNAL media: clear data with approved tool; recycle through approved IT recycler.
• CONFIDENTIAL media: cryptographic erasure + certificate of destruction from approved supplier.
• SECRET media: physical shredding to DIN 66399 Level H-5 (particle size ≤ 30 mm²) or
  incineration; witnessed; certificate of destruction required.
• Approved destruction suppliers: [SUPPLIER NAME(S)] — ADISA-certified preferred.
• Certificate of destruction: retained for [7] years in the asset register.

7. DECOMMISSIONING CHECKLIST
──────────────────────────────
□ Data backup confirmed (if required)
□ Device removed from MDM/asset management
□ Sanitisation performed to correct level and documented
□ Certificate of destruction obtained (for CONFIDENTIAL+)
□ Asset register updated; device status set to "Disposed"
□ Serial number retained for audit trail

RECOMMENDATIONS
─────────────────
• Never donate or sell old IT equipment without verified data sanitisation.
  "Factory reset" on consumer devices does NOT securely erase data — always
  use a specialist tool (DBAN for HDDs, manufacturer Secure Erase for SSDs).
• Partner with an ADISA-certified (UK) or NAID-certified (US) IT asset
  disposition (ITAD) company for guaranteed chain-of-custody and certified destruction.
`
  },
  {
    id: 'pol-endpoint', cat: 'policy',
    name: 'Endpoint & Mobile Device Policy',
    desc: 'Security baseline for all user endpoint devices including laptops, desktops, tablets, and mobile phones.',
    annex: 'A.8.1', tier: 'mandatory',
    content: `ENDPOINT AND MOBILE DEVICE POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-019
Version            : 1.0   Effective Date : [DATE]   Owner : IT Manager / CISO

1. SCOPE
─────────
All devices used to access organisational systems or data: company-owned
laptops, desktops, tablets, smartphones; approved BYOD devices.

2. DEVICE PROCUREMENT AND CONFIGURATION
─────────────────────────────────────────
• All company devices procured through IT. No personal devices without MDM approval.
• Devices configured from a hardened image before issuance.
• Baseline configuration (all managed endpoints):
  □ Full-disk encryption: BitLocker (TPM+PIN) / FileVault / LUKS
  □ MDM enrolment: [Intune / Jamf / Kandji / ManageEngine]
  □ EDR agent: [CrowdStrike / Defender for Endpoint / SentinelOne]
  □ Auto-lock: 5 minutes (mobile), 10 minutes (laptop)
  □ Strong screen PIN/password: minimum 6-digit PIN (mobile); 16-char passphrase (laptop)
  □ Remote wipe capability: confirmed before device issued
  □ Automatic OS patching: enabled; critical patches applied within 24 hours
  □ Firewall: enabled and policy-locked
  □ Local admin access: disabled for standard users

3. APPROVED SOFTWARE
─────────────────────
• Only software from the approved software catalogue may be installed.
• Requests for new software: submit via IT request form; reviewed within [5] days.
• Unlicensed or personal software: PROHIBITED on company devices.
• Browser extensions: only from approved list (reviewed quarterly by IT).
• Development tools: additional approval required; reviewed for security implications.

4. MOBILE DEVICE SPECIFIC REQUIREMENTS
────────────────────────────────────────
• Work profile separate from personal (Android enterprise / Apple MDM supervised).
• Corporate data accessible only via MDM-managed apps.
• Jailbroken/rooted devices: PROHIBITED from accessing corporate resources.
• Lost or stolen phone: report immediately; remote wipe executed within 4 hours.

5. BYOD (BRING YOUR OWN DEVICE)
────────────────────────────────
BYOD devices may access corporate resources only if:
  □ MDM profile installed and maintained
  □ OS version current (maximum 1 major version behind current)
  □ Device PIN/biometric authentication enabled
  □ Remote wipe accepted (work profile data only, not personal data)
  □ Acceptable Use Policy signed with BYOD addendum
BYOD devices have no expectation of privacy on the work profile/container.

6. PATCH AND VULNERABILITY MANAGEMENT
───────────────────────────────────────
• Critical OS patches: applied within 24 hours of release.
• High patches: applied within 7 days.
• Patch compliance monitored via MDM dashboard weekly.
• Non-compliant devices: quarantined from network access after [7]-day grace period.

7. DEVICE LIFECYCLE
────────────────────
• All devices registered in the asset register on procurement.
• End-of-life: data sanitisation per Storage Media Policy before disposal.
• Lost/stolen: report to IT within 1 hour; remote wipe; update asset register; report if data loss.

RECOMMENDATIONS
─────────────────
• Deploy EDR (Endpoint Detection and Response) on every managed endpoint.
  EDR provides the telemetry needed to detect and respond to ransomware,
  lateral movement, and credential theft that AV alone cannot catch.
• Implement application allowlisting for high-security roles (finance, executives):
  only approved applications may execute — eliminates most malware delivery paths.
• Use Microsoft Defender for Business (included in M365 Business Premium at ~£20/user/month)
  for integrated MDM + EDR + Vulnerability Management if budget is tight.
`
  },
  {
    id: 'pol-malware', cat: 'policy',
    name: 'Malware Protection Policy',
    desc: 'Requirements for anti-malware controls, web filtering, and security awareness to prevent malicious code.',
    annex: 'A.8.7', tier: 'mandatory',
    content: `MALWARE PROTECTION POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-020
Version            : 1.0   Effective Date : [DATE]   Owner : IT Manager / CISO

1. PURPOSE
──────────
Protect [ORGANIZATION NAME]'s information systems from malware including
viruses, worms, ransomware, spyware, trojans, rootkits, and other malicious code,
through technical controls and user awareness.

2. ANTI-MALWARE CONTROLS
──────────────────────────
All endpoints, servers, and email gateways must have:
  □ Approved anti-malware / EDR solution deployed (see approved list)
  □ Real-time scanning: enabled; cannot be disabled by users
  □ Signature updates: automated; applied within [4] hours of release
  □ Scheduled full scan: weekly (off-hours)
  □ Quarantine: malicious files quarantined; IT alerted automatically

Approved solutions: [CrowdStrike / Microsoft Defender + Defender for Endpoint /
SentinelOne / Sophos Intercept X]

Exceptions: cannot disable anti-malware without CISO written approval and
compensating controls documented.

3. EMAIL SECURITY
──────────────────
• Advanced email security gateway deployed (spam, phishing, malware filtering).
• Attachment filtering: executable file types (.exe, .vbs, .bat, .ps1, etc.) blocked
  by default; exceptions require IT approval per request.
• URL rewriting and time-of-click analysis: enabled.
• Sandboxing for suspicious attachments: enabled.
• DMARC / DKIM / SPF enforced for all sending domains.

4. WEB FILTERING
─────────────────
• DNS-based or proxy-based web filtering deployed on all managed endpoints.
• Categories blocked by default: malware distribution, phishing, adult content,
  illegal content, anonymisation proxies.
• HTTPS inspection: deployed for managed devices where legally permissible;
  employees notified in Acceptable Use Policy.
• Policy review: blocked categories reviewed quarterly.

5. REMOVABLE MEDIA
───────────────────
• All removable media scanned before access (automatic on connection).
• Unapproved/unscanned media: blocked by endpoint policy.
• AutoRun/AutoPlay: disabled on all endpoints.

6. SOFTWARE AND PATCHING
──────────────────────────
• Only approved software installed (see Endpoint Policy).
• Vulnerabilities patched per the Vulnerability Management Procedure.
• Zero-day threats: CISO may invoke emergency patching without CAB approval.

7. USER RESPONSIBILITIES
──────────────────────────
All users must:
• Not attempt to disable or bypass anti-malware controls.
• Report suspected malware symptoms immediately (slow device, unexpected pop-ups,
  encrypted files, ransomware notes) — do not power off, call IT immediately.
• Not open attachments from unexpected or suspicious sources.
• Not download software from unofficial sources.

8. INCIDENT RESPONSE
─────────────────────
Malware detection triggers the Incident Response Policy.
Ransomware: follow the Ransomware Playbook in the IR Policy.
Endpoint isolation: IT may remotely isolate any endpoint suspected of malware
infection without prior approval from the user or their manager.

RECOMMENDATIONS
─────────────────
• Move from traditional AV to EDR. Signature-based AV misses most modern threats.
  EDR provides behavioural detection, ransomware rollback, and forensic telemetry.
• Implement phishing-resistant MFA (FIDO2) organisation-wide. Most malware delivery
  relies on credential theft via phishing — FIDO2 eliminates this attack path.
• Run quarterly phishing simulations (internal or via [KnowBe4 / Proofpoint /
  Cofense]). Click-through rate target: < 5%. Report rate target: > 75%.
`
  },
  {
    id: 'pol-backup', cat: 'policy',
    name: 'Information Backup Policy',
    desc: 'Requirements for backup frequency, retention, encryption, offsite storage, and restore testing.',
    annex: 'A.8.13', tier: 'mandatory',
    content: `INFORMATION BACKUP POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-021
Version            : 1.0   Effective Date : [DATE]   Owner : IT Manager / CISO

1. PURPOSE
──────────
Ensure that critical information and systems can be recovered within agreed
timeframes following data loss, corruption, ransomware, or disaster, by
maintaining secure, tested, and accessible backups.

2. SCOPE
─────────
All information assets within the ISMS scope, with priority on:
  Tier 1 (Critical) : Customer databases, financial data, identity infrastructure,
                      source code repositories, configuration management databases.
  Tier 2 (Important): Employee data, operational data, email, shared drives.
  Tier 3 (Standard) : Development/test environments, non-sensitive archives.

3. BACKUP REQUIREMENTS
───────────────────────
Schedule:
  Tier 1: Continuous replication OR hourly snapshots; daily full backup
  Tier 2: Daily incremental; weekly full backup
  Tier 3: Weekly incremental; monthly full backup

Retention:
  Tier 1: [90] days online; [7] years for compliance archives (financial, legal)
  Tier 2: [30] days online; [3] years archive
  Tier 3: [14] days online

Recovery Objectives (link to BCP):
  System     │ RTO      │ RPO
  ───────────┼──────────┼──────────────────
  [SYSTEM A] │ [4 hrs]  │ [1 hr]
  [SYSTEM B] │ [24 hrs] │ [4 hrs]
  [SYSTEM C] │ [72 hrs] │ [24 hrs]

4. BACKUP SECURITY
───────────────────
• Encryption: all backups encrypted at rest (AES-256) and in transit (TLS 1.3).
• Keys: backup encryption keys stored separately from backup data.
• Immutability: at least one backup copy must be immutable (cannot be deleted
  or modified for the retention period):
    - Cloud: AWS S3 Object Lock / Azure Blob immutable storage / GCP WORM
    - Tape: air-gapped off-site
  Rationale: ransomware groups specifically target and delete connected backups.
• Access: backup systems accessible only to authorised IT personnel.
  Backup console/admin access requires MFA and is JIT where possible.
• Off-site/separate region: at least one backup copy stored in a geographically
  separate location / cloud region from the primary environment.
• Segregation: backup infrastructure on separate network segment from production.

5. RESTORE TESTING
───────────────────
Untested backups are not backups. All Tier 1 and Tier 2 systems must have
restore tests conducted on the following schedule:
  Tier 1: Full restore test quarterly; spot restore test monthly
  Tier 2: Full restore test bi-annually

Restore test process:
  □ Identify target system/data for test
  □ Restore to isolated test environment (not production)
  □ Verify data integrity and completeness
  □ Measure actual restore time vs. RTO target
  □ Document results and any discrepancies
  □ Correct identified gaps; re-test if failures found

6. BACKUP MONITORING
─────────────────────
• All backup jobs: success/failure logged and reviewed daily.
• Failed backups: alert to IT manager within 1 hour; investigate and remediate.
• Backup completion report: reviewed weekly by IT Manager; monthly by CISO.

RECOMMENDATIONS
─────────────────
• Follow the 3-2-1-1-0 rule: 3 copies of data, on 2 different media types,
  1 off-site, 1 immutable/air-gapped, 0 errors on last restore test.
• The immutable backup is your ransomware insurance policy. Without it,
  backup deletion is the #1 attacker action before deploying ransomware.
• Test restore speed, not just restore success. Many organisations discover
  their 4-hour RTO is actually 48 hours only during a real incident.
`
  },
  {
    id: 'pol-logging', cat: 'policy',
    name: 'Logging and Monitoring Policy',
    desc: 'Requirements for generating, protecting, retaining, and reviewing security logs across all systems.',
    annex: 'A.8.15 / A.8.16', tier: 'mandatory',
    content: `LOGGING AND MONITORING POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-022
Version            : 1.0   Effective Date : [DATE]   Owner : CISO / IT Manager

1. PURPOSE
──────────
Ensure that security-relevant events are logged, protected from tampering,
retained for appropriate periods, and reviewed to detect threats and support
incident investigation.

2. WHAT MUST BE LOGGED
───────────────────────
All systems within ISMS scope must log the following:

Authentication events:
  • Successful and failed login attempts (user, timestamp, source IP)
  • MFA success and failure
  • Privilege escalation (sudo, RunAs, JIT access grant)
  • Account lockouts and unlocks

Access events:
  • Access to CONFIDENTIAL and SECRET data
  • Privileged account activity (all commands on Tier-0/1 infrastructure)
  • File access and modification on sensitive shares
  • Database queries accessing personal data or financial records

Network events:
  • Firewall permit and deny logs
  • VPN/ZTNA connection events
  • DNS queries (for threat detection)
  • Outbound connections to suspicious/new external destinations

System events:
  • System start/shutdown, service start/stop
  • Software installation and configuration changes
  • Patch application and failure
  • Backup success and failure

Cloud events:
  • All AWS CloudTrail / Azure Activity Log / GCP Audit Log events
  • IAM role assumption and permission changes
  • Storage access and public bucket creation
  • API Gateway calls to production endpoints

3. LOG PROTECTION
──────────────────
• Logs must be tamper-resistant: write-once or append-only where possible.
• Log forwarding: all logs centralised to SIEM within [5] minutes of generation.
• Access to raw logs: restricted to Security Team and IT Manager.
• Log integrity: SIEM detects log forwarding failures and gaps; alert on silence.
• Encryption: logs encrypted in transit and at rest in SIEM.

4. LOG RETENTION
─────────────────
Log Type                    │ Online (SIEM)  │ Archive
────────────────────────────┼────────────────┼────────────────
Security logs (auth, access)│ 12 months      │ 3 years
Cloud audit logs            │ 12 months      │ 3 years
Firewall/network logs       │ 6 months       │ 2 years
Application logs            │ 3 months       │ 1 year
Backup/system event logs    │ 3 months       │ 1 year
Incident-related logs       │ Preserved indefinitely until case closed

5. MONITORING AND ALERTING
────────────────────────────
The SIEM must generate alerts (reviewed by Security Team) for:
  □ Multiple failed login attempts (≥ [5] in [10] minutes)
  □ Login from new country or unusual location
  □ Access to SECRET data outside normal hours
  □ Bulk data export or download
  □ Privileged account usage without JIT request
  □ New admin account creation
  □ Mass file deletion (ransomware indicator)
  □ Outbound connection to known malicious IPs/domains (threat intel feed)
  □ Log forwarding gap or agent silence (> [15] minutes)

Alert review: P1/P2 alerts require acknowledgement within [30] minutes (24/7).
Monitoring schedule: SIEM dashboard reviewed daily by Security Team.

6. CLOCK SYNCHRONISATION (A.8.17)
───────────────────────────────────
• All systems must synchronise to approved NTP servers (Stratum 2 or better).
• NTP source: [organisation's NTP servers or public pool.ntp.org].
• Maximum drift: ± 1 second. Alerts on drift > 60 seconds.
• Consistent timezone: all logs in UTC; local display applied in SIEM.

RECOMMENDATIONS
─────────────────
• Deploy a SIEM before you need it — standing up a SIEM during an incident
  is too late. Microsoft Sentinel (pay-per-GB) or Elastic SIEM (free, self-hosted)
  are both viable options at different budget levels.
• Enable User and Entity Behaviour Analytics (UEBA) in your SIEM — it detects
  compromised accounts through anomalous behaviour (lateral movement, odd hours,
  bulk downloads) that rule-based alerting misses.
• Ingest threat intelligence feeds (MISP, Recorded Future, AlienVault OTX) into
  your SIEM to automatically flag connections to known bad infrastructure.
`
  },
  {
    id: 'pol-network', cat: 'policy',
    name: 'Network Security Policy',
    desc: 'Requirements for network architecture, segmentation, firewall rules, wireless security, and network monitoring.',
    annex: 'A.8.20 / A.8.21 / A.8.22', tier: 'mandatory',
    content: `NETWORK SECURITY POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-023
Version            : 1.0   Effective Date : [DATE]   Owner : IT Manager / CISO

1. NETWORK ARCHITECTURE PRINCIPLES
────────────────────────────────────
• Defence-in-depth: multiple independent layers; no single point of failure.
• Least privilege routing: systems communicate only on required ports to required destinations.
• Default deny: all network traffic is denied unless explicitly permitted.
• Segmentation: networks divided into zones by sensitivity and function.
• Zero-trust: network location does not grant implicit trust.

2. NETWORK SEGMENTATION (A.8.22)
──────────────────────────────────
Segment                 │ Systems                              │ Access
────────────────────────┼──────────────────────────────────────┼──────────────────────────────
Management (OOB)        │ Network devices, IPMI, console ports │ IT Admin via jump host only
Server (Production)     │ Application and database servers     │ App servers → DB; no direct user
Server (DMZ)            │ Web servers, load balancers, APIs    │ Internet-facing; no access to internal
Identity                │ AD/LDAP, PKI, PAM                   │ Strictly controlled; no direct internet
Endpoint                │ User workstations                   │ Access to services; internet via proxy
Guest / Visitor         │ Guest Wi-Fi                         │ Internet only; isolated from internal
OT / IoT (if applicable)│ Building systems, cameras, printers │ Isolated; no access to IT network

VLAN assignment enforced at network level; VLANs not the only control (also firewall).

3. FIREWALL AND ACCESS CONTROL
────────────────────────────────
• Stateful firewalls at all network zone boundaries.
• Next-Generation Firewall (NGFW) with application identification at internet boundary.
• Rule management:
  - All rules approved through Change Management before implementation.
  - "Any/Any" rules: PROHIBITED. All rules specify source, destination, port, and protocol.
  - Temporary rules: maximum 90-day validity; reviewed quarterly.
  - Annual rule review: all rules justified or removed.
• Inbound access: only explicitly required services exposed. All unnecessary ports closed.
• Outbound filtering: whitelist approach for server traffic; proxy for user traffic.

4. WIRELESS NETWORK SECURITY
──────────────────────────────
• Encryption: WPA3 required for all new deployments; WPA2-Enterprise minimum.
  WEP and WPA are PROHIBITED.
• Authentication: 802.1X (RADIUS) for corporate Wi-Fi. Certificate-based preferred.
• Separate SSIDs: corporate, guest, IoT/OT. Each on isolated VLAN.
• Guest Wi-Fi: no access to internal resources. Captive portal with legal notice.
• Access points: managed centrally; rogue AP detection enabled.
• Site survey: conducted on installation; rogue AP scan monthly.

5. REMOTE ACCESS (A.8.21 — Network services)
──────────────────────────────────────────────
• All remote access via ZTNA or VPN with MFA.
• No direct public-facing RDP/SSH on production servers.
• Jump host / bastion: required for all admin access to production systems.
• Split tunnelling: prohibited for corporate resources access.

6. DNS SECURITY
────────────────
• Internal DNS: do not expose internal zone data externally (split DNS).
• External DNS: DNSSEC enabled for all public domains.
• DNS filtering: enforced for all managed endpoints via DNS firewall / RPZ.
• DNS over HTTPS (DoH): managed via policy (not bypassing DNS filter).

7. NETWORK MONITORING
──────────────────────
• Network traffic analysis (NTA): deployed at key choke points.
• IDS/IPS: deployed at internet boundary; signatures updated daily.
• Flow data (NetFlow/IPFIX): collected from all routers and switches; retained 90 days.
• Anomaly detection: automated alerts on unusual traffic volumes or new connections.

RECOMMENDATIONS
─────────────────
• Conduct annual internal and external network penetration tests.
  External test: verify what attackers see from the internet.
  Internal test: verify segmentation and lateral movement controls.
• Implement network access control (NAC) — only devices that are managed and
  compliant can connect to the corporate network. Rogue/unmanaged devices blocked.
• Consider SASE (Secure Access Service Edge) for cloud-first organisations —
  combines ZTNA, SWG, CASB, and FWaaS in a single cloud-delivered platform.
`
  },
  {
    id: 'pol-ssdlc', cat: 'policy',
    name: 'Secure Development Policy',
    desc: 'Security requirements for the full software development lifecycle including design, coding, testing, and deployment.',
    annex: 'A.8.25 – A.8.29', tier: 'recommended',
    content: `SECURE DEVELOPMENT POLICY
═══════════════════════════════════════════════════════════════════════════
Document Reference : [ORG]-POL-024
Version            : 1.0   Effective Date : [DATE]   Owner : CISO / Engineering Lead

1. PURPOSE
──────────
Embed security into the software development lifecycle (SDLC) to prevent
security vulnerabilities from being introduced, detect them early, and
reduce the cost of remediation.

2. SECURE DESIGN PRINCIPLES (A.8.27)
──────────────────────────────────────
All new systems and significant changes must apply:
  • Least Privilege      : Applications request only permissions they need.
  • Defence in Depth     : Multiple independent security layers.
  • Fail Securely        : On error, default to secure state (deny, not permit).
  • Input Validation     : Validate and sanitise all external input.
  • Output Encoding      : Encode all output to prevent injection (XSS, SQL, etc.).
  • Separation of Duties : Admin functions separated from user functions.
  • Minimise Attack Surface: Disable features not in use; expose minimal interfaces.
  • OWASP Top 10        : Address all OWASP Top 10 vulnerabilities in design phase.

Threat modelling: conducted for all new systems and major changes. Document:
  threat actors, attack vectors, mitigations. STRIDE methodology recommended.

3. SECURITY REQUIREMENTS (A.8.26)
────────────────────────────────────
Security requirements must be defined before development begins:
  □ Authentication and authorisation requirements
  □ Data classification of data handled; encryption requirements
  □ Audit logging requirements
  □ Input validation and output encoding requirements
  □ Error handling (must not expose stack traces, credentials, or system info)
  □ Session management requirements
  □ API security requirements (authentication, rate limiting, input validation)
  □ Compliance requirements (GDPR, PCI-DSS, HIPAA as applicable)

4. SECURE CODING STANDARDS (A.8.28)
──────────────────────────────────────
All developers must follow:
  • OWASP Secure Coding Practices (https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
  • Language-specific security guidelines:
      Python  : Bandit; avoid eval(), use parameterised queries
      Java    : SpotBugs + FindSecBugs; avoid serialisation of untrusted data
      JS/TS   : ESLint security plugin; avoid innerHTML; use CSP
      Go      : gosec; avoid unsafe package; use crypto/rand
      C/C++   : Compiler hardening flags; avoid unsafe functions (strcpy, gets)

Prohibited practices:
  ✗ Hard-coded credentials (passwords, API keys, tokens) in source code
  ✗ SQL string concatenation (use parameterised queries / ORMs)
  ✗ Trusting client-side input without server-side validation
  ✗ Storing sensitive data in logs
  ✗ Using deprecated/broken cryptography (see Cryptography Policy)
  ✗ eval() with user-supplied input

5. SECURITY TESTING IN CI/CD (A.8.29)
─────────────────────────────────────────
All code must pass the following automated checks before merging to main/production:

  SAST (Static Analysis):
    • Run on every pull request and push
    • Tools: [Semgrep / Snyk Code / CodeQL / SonarQube]
    • Critical/High findings: block merge until resolved

  SCA (Software Composition Analysis):
    • Dependency vulnerability scanning on every build
    • Tools: [Dependabot / Snyk Open Source / OWASP Dependency-Check]
    • Critical CVEs in dependencies: block deployment until resolved

  Secret Scanning:
    • Pre-commit hooks + CI/CD scan on every push
    • Tools: [Trufflehog / Gitleaks / GitHub Advanced Security]
    • Any detected secret: block push; treat credential as compromised; rotate immediately

  DAST (Dynamic Analysis):
    • Run against staging environment before production deployment
    • Tools: [OWASP ZAP / Burp Suite Enterprise / Nuclei]
    • Frequency: every release; weekly automated scan

  Container Scanning:
    • Scan container images before pushing to registry
    • Tools: [Trivy / Snyk Container / Grype]
    • Admission controller: verify image signatures before deploying to Kubernetes

6. SECURITY REVIEW
───────────────────
Code review: all code changes reviewed by a peer. Security-relevant changes
(authentication, authorisation, cryptography, input handling) reviewed by a
security-aware engineer or CISO before merge.

Penetration testing:
  • New applications: pen test before production launch.
  • Annual: external pen test of all production web applications.
  • Significant changes: pen test if attack surface materially changes.

7. ENVIRONMENT SEPARATION (A.8.31)
────────────────────────────────────
• Development, test/staging, and production environments strictly separated.
• Production data must NOT be used in dev or test environments.
  Masking/synthetic data tools: [Faker / Mimesis / Databricks synthetic data]
• Developers have no standing access to production (JIT access for break-fix only).
• Configuration differences between environments are minimised; use
  environment variables / secret manager, not hard-coded config.

8. OUTSOURCED DEVELOPMENT (A.8.30)
────────────────────────────────────
External development teams must:
  • Comply with this policy and sign an NDA before code access.
  • Pass security awareness training before project start.
  • Deliver SBOM with each release.
  • Submit to code review by internal engineering or approved third-party auditor.
  • Have source code escrow arrangement if critical supplier.

RECOMMENDATIONS
─────────────────
• Adopt a "shift left" approach: security gates in PR review cost 10× less than
  post-release security fixes, and 100× less than breach remediation.
• GitHub Advanced Security or GitLab Ultimate includes SAST, SCA, secret scanning
  and DAST in one platform — evaluate vs. separate tooling.
• Implement SLSA (Supply-chain Levels for Software Artifacts) — even Level 1
  (signed builds) materially reduces supply chain risk.
  Reference: https://slsa.dev
• Run threat modelling workshops for developers using STRIDE or PASTA — it builds
  security culture and catches design flaws before a single line is written.
`
  }
];

window.ISO27001_ORDER =
{
  isms: [
    { id: 'isms-scope',       group: 'Clause 4 — Context of the Organisation' },
    { id: 'isms-policy',      group: 'Clause 5 — Leadership' },
    { id: 'isms-soa',         group: 'Clause 6 — Planning' },
    { id: 'isms-objectives',  group: 'Clause 6 — Planning' },
  ],
  risk: [
    { id: 'risk-methodology',    group: 'Clause 6.1.2 — Risk Assessment Process' },
    { id: 'risk-asset-register', group: 'Clause 6.1.2 — Risk Assessment Process' },
    { id: 'risk-register',       group: 'Clause 6.1.2 — Risk Assessment Process' },
    { id: 'risk-treatment',      group: 'Clause 6.1.3 — Risk Treatment' },
  ],
  policy: [
    // A.5 Organisational Controls
    { id: 'pol-aup',            group: 'A.5 — Organisational Controls' },
    { id: 'pol-classification', group: 'A.5 — Organisational Controls' },
    { id: 'pol-info-transfer',  group: 'A.5 — Organisational Controls' },
    { id: 'pol-access',         group: 'A.5 — Organisational Controls' },
    { id: 'pol-supplier',       group: 'A.5 — Organisational Controls' },
    { id: 'pol-cloud',          group: 'A.5 — Organisational Controls' },
    { id: 'pol-incident',       group: 'A.5 — Organisational Controls' },
    { id: 'pol-bcp',            group: 'A.5 — Organisational Controls' },
    { id: 'pol-privacy',        group: 'A.5 — Organisational Controls' },
    // A.6 People Controls
    { id: 'pol-hr-security',    group: 'A.6 — People Controls' },
    { id: 'pol-nda',            group: 'A.6 — People Controls' },
    { id: 'pol-remote-work',    group: 'A.6 — People Controls' },
    // A.7 Physical Controls
    { id: 'pol-physical-security', group: 'A.7 — Physical Controls' },
    { id: 'pol-clear-desk',     group: 'A.7 — Physical Controls' },
    { id: 'pol-media-disposal', group: 'A.7 — Physical Controls' },
    // A.8 Technological Controls
    { id: 'pol-endpoint',       group: 'A.8 — Technological Controls' },
    { id: 'pol-malware',        group: 'A.8 — Technological Controls' },
    { id: 'pol-backup',         group: 'A.8 — Technological Controls' },
    { id: 'pol-logging',        group: 'A.8 — Technological Controls' },
    { id: 'pol-network',        group: 'A.8 — Technological Controls' },
    { id: 'pol-crypto',         group: 'A.8 — Technological Controls' },
    { id: 'pol-ssdlc',          group: 'A.8 — Technological Controls' },
  ],
  procedure: [
    { id: 'proc-access',        group: 'Annex A.5 — Organisational Controls' },
    { id: 'proc-incident',      group: 'Annex A.5 — Organisational Controls' },
    { id: 'proc-change',        group: 'Annex A.8 — Technological Controls' },
    { id: 'proc-vulnerability', group: 'Annex A.8 — Technological Controls' },
  ],
  record: [
    { id: 'rec-training',          group: 'Clause 7 — Support' },
    { id: 'rec-supplier',          group: 'Clause 8 — Operation' },
    { id: 'rec-audit',             group: 'Clause 9 — Performance Evaluation' },
    { id: 'rec-management-review', group: 'Clause 9 — Performance Evaluation' },
    { id: 'rec-corrective-action', group: 'Clause 10 — Improvement' },
  ],
};
