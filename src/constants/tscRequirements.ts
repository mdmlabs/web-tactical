import type { TSCPrincipleMeta } from "@/types/tsc";

/**
 * AICPA Trust Services Criteria (TSC) for SOC 2 audits.
 * Structured by principle: Security (Common Criteria), Availability,
 * Processing Integrity, Confidentiality, Privacy.
 */
export const TSC_PRINCIPLES: TSCPrincipleMeta[] = [
  {
    id: "Security",
    title: "Security Principle",
    description:
      "Information and systems are protected against unauthorized access, unauthorized disclosure of information, and damage to systems that could compromise the availability, integrity, confidentiality, or privacy of information or systems and affect the entity's ability to meet its objectives.",
    criteria: [
      { id: "CC1.1", title: "Commitment to integrity and ethical values", description: "The entity demonstrates a commitment to integrity and ethical values." },
      { id: "CC1.2", title: "Board of directors demonstrates independence", description: "The board of directors demonstrates independence from management and exercises oversight of the development and performance of internal control." },
      { id: "CC1.3", title: "Organizational structure and reporting lines", description: "Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives." },
      { id: "CC1.4", title: "Commitment to attract and retain competent individuals", description: "The entity demonstrates a commitment to attract, develop, and retain competent individuals in alignment with objectives." },
      { id: "CC1.5", title: "Accountability for control responsibilities", description: "The entity holds individuals accountable for their internal control responsibilities in the pursuit of objectives." },
      { id: "CC2.1", title: "Objectives for control", description: "The entity specifies objectives with sufficient clarity to enable the identification and assessment of risks relating to objectives." },
      { id: "CC2.2", title: "Risk identification and analysis", description: "The entity identifies risks to the achievement of its objectives across the entity and analyzes risks as a basis for determining how the risks should be managed." },
      { id: "CC2.3", title: "Fraud risk assessment", description: "The entity considers the potential for fraud in assessing risks to the achievement of objectives." },
      { id: "CC3.1", title: "Risk assessment integration", description: "The entity identifies and assesses changes that could significantly impact the system of internal control." },
      { id: "CC3.2", title: "Technology controls", description: "The entity selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels, including general controls over technology." },
      { id: "CC3.3", title: "Deployment and maintenance of controls", description: "The entity deploys control activities through policies that establish what is expected and in procedures that put policies into action." },
      { id: "CC4.1", title: "Quality information for control", description: "The entity obtains or generates and uses relevant, quality information to support the functioning of internal control." },
      { id: "CC4.2", title: "Internal communication for control", description: "The entity internally communicates information, including objectives and responsibilities for internal control, necessary to support the functioning of internal control." },
      { id: "CC5.1", title: "Ongoing and separate evaluations", description: "The entity selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning." },
      { id: "CC5.2", title: "Communication of deficiencies", description: "The entity evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors, as appropriate." },
      { id: "CC6.1", title: "Access to systems and data", description: "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives." },
      { id: "CC6.2", title: "Identification and authentication", description: "Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity." },
      { id: "CC6.3", title: "Restriction of logical access", description: "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles, responsibilities, or the system design and changes." },
      { id: "CC6.4", title: "Access to programs and data", description: "The entity restricts physical access to facilities and protected information assets to authorized personnel to meet the entity's objectives." },
      { id: "CC6.5", title: "Removal or adjustment of access", description: "The entity discontinues logical and physical protections over physical assets only after the ability to read or recover data and software from those assets has been diminished." },
      { id: "CC6.6", title: "Unauthorized software", description: "The entity implements logical access security measures to protect against threats from sources outside its system boundaries." },
      { id: "CC6.7", title: "Encryption of data in transit", description: "The entity restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission, movement, or removal to meet the entity's objectives." },
      { id: "CC6.8", title: "Encryption of data at rest", description: "The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software to meet the entity's objectives." },
      { id: "CC7.1", title: "Detection of security incidents", description: "To meet its objectives, the entity uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities, and susceptibilities to newly discovered vulnerabilities." },
      { id: "CC7.2", title: "Response to security incidents", description: "The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to meet its objectives; anomalies are analyzed to determine whether they represent security events." },
      { id: "CC7.3", title: "Protection against malicious code", description: "The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives (security incidents) and, if so, takes actions to prevent or address such failures." },
      { id: "CC7.4", title: "Security event monitoring", description: "The entity responds to identified security incidents by executing a defined incident response program to understand, contain, remediate, and communicate security incidents, as appropriate." },
      { id: "CC7.5", title: "Vulnerability management", description: "The entity identifies, develops, and implements activities to recover from identified security incidents." },
      { id: "CC8.1", title: "Authorized changes", description: "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives." },
      { id: "CC9.1", title: "Business continuity and disaster recovery", description: "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions." },
      { id: "CC9.2", title: "Third-party service provider risk", description: "The entity assesses and manages risks associated with vendors and business partners." },
    ],
  },
  {
    id: "Availability",
    title: "Availability Principle",
    description:
      "Information and systems are available for operation and use as committed or agreed.",
    criteria: [
      { id: "A1.1", title: "Capacity management", description: "The entity maintains, monitors, and evaluates current processing capacity and use of system components (infrastructure, data, and software) to manage capacity demand and to enable the implementation of additional capacity to help meet its objectives." },
      { id: "A1.2", title: "System recovery and continuity", description: "The entity authorizes, designs, develops or acquires, implements, operates, approves, maintains, and monitors environmental protections, software, data backup processes, and recovery infrastructure to meet its objectives." },
      { id: "A1.3", title: "Incident handling for availability", description: "The entity tests recovery plan procedures supporting system recovery to meet its objectives." },
      { id: "A1.4", title: "Monitoring and reporting of availability", description: "The entity implements, maintains, and monitors environmental protections and recovery infrastructure to meet its objectives." },
    ],
  },
  {
    id: "Processing Integrity",
    title: "Processing Integrity Principle",
    description:
      "System processing is complete, valid, accurate, timely, and authorized.",
    criteria: [
      { id: "PI1.1", title: "Data processing policies", description: "The entity obtains or generates, uses, and communicates relevant, quality information regarding the objectives related to processing, including definitions of data processed and product and service specifications, to support the use of products and services." },
      { id: "PI1.2", title: "Input completeness and accuracy", description: "The entity implements policies and procedures over system inputs, including controls over completeness and accuracy, to result in products, services, and reporting to meet the entity's objectives." },
      { id: "PI1.3", title: "Data validation", description: "The entity implements policies and procedures over system processing to result in products, services, and reporting to meet the entity's objectives." },
      { id: "PI1.4", title: "Output accuracy and completeness", description: "The entity implements policies and procedures to make available or deliver output completely, accurately, and timely in accordance with specifications to meet the entity's objectives." },
      { id: "PI1.5", title: "Processing timeliness", description: "The entity implements policies and procedures to store inputs, items in processing, and outputs completely, accurately, and timely in accordance with system specifications to meet the entity's objectives." },
      { id: "PI1.6", title: "Data processing security", description: "The entity implements policies and procedures to result in the creation and maintenance of records of system processing activities to meet the entity's objectives." },
    ],
  },
  {
    id: "Confidentiality",
    title: "Confidentiality Principle",
    description:
      "Information designated as confidential is protected as committed or agreed.",
    criteria: [
      { id: "C1.1", title: "Confidential information identification", description: "The entity identifies and maintains confidential information to meet the entity's objectives related to confidentiality." },
      { id: "C1.2", title: "Protection of confidential information", description: "The entity disposes of confidential information to meet the entity's objectives related to confidentiality." },
      { id: "C1.3", title: "Confidential information disposal", description: "The entity has procedures in place to dispose of confidential information after it is no longer needed to meet the entity's objectives." },
      { id: "C1.4", title: "Confidential information access controls", description: "The entity restricts access to confidential information to authorized personnel to meet the entity's objectives related to confidentiality." },
    ],
  },
  {
    id: "Privacy",
    title: "Privacy Principle",
    description:
      "Personal information is collected, used, retained, disclosed, and disposed of in conformity with the commitments in the entity's privacy notice and with criteria set forth in generally accepted privacy principles (GAPP).",
    criteria: [
      { id: "P1.1", title: "Personal information inventory and classification", description: "The entity provides notice to data subjects about its privacy practices to meet the entity's objectives related to privacy." },
      { id: "P1.2", title: "Consent and choice", description: "The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information to the data subjects." },
      { id: "P1.3", title: "Collection limitation", description: "The entity collects personal information only for the purposes identified in the notice to the data subject." },
      { id: "P1.4", title: "Use, retention, and disposal", description: "The entity limits the use of personal information to the purposes identified in the notice and for which the data subject has provided implicit or explicit consent." },
      { id: "P1.5", title: "Access and correction", description: "The entity provides data subjects with access to their personal information for review and correction (including updates) to meet the entity's objectives related to privacy." },
      { id: "P1.6", title: "Disclosure to third parties", description: "The entity discloses personal information to third parties with the consent of the data subject to meet the entity's objectives related to privacy." },
      { id: "P1.7", title: "Security for privacy", description: "The entity collects and maintains accurate, up-to-date, complete, and relevant personal information to meet the entity's objectives related to privacy." },
      { id: "P1.8", title: "Quality and accuracy", description: "The entity monitors compliance with its privacy policies and procedures and has procedures to address privacy-related complaints and disputes." },
      { id: "P1.9", title: "Monitoring and enforcement", description: "The entity monitors compliance with its privacy policies and procedures and has procedures to address privacy-related inquiries, complaints, and disputes." },
      { id: "P1.10", title: "Breach notification", description: "The entity provides notification of breaches and incidents to affected data subjects, regulators, and others to meet the entity's objectives related to privacy." },
    ],
  },
];

/**
 * Lookup a TSC criteria by its ID (e.g. "CC6.1", "A1.2", "P1.3").
 * Returns the title and description if found.
 */
export function lookupTSCCriteria(criteriaId: string): {
  title: string;
  description: string;
  principleTitle?: string;
} | null {
  for (const principle of TSC_PRINCIPLES) {
    if (!principle.criteria) continue;
    const criteria = principle.criteria.find((c) => c.id === criteriaId);
    if (criteria) {
      return {
        title: criteria.title,
        description: criteria.description,
        principleTitle: principle.title,
      };
    }
  }

  // Try to match by prefix to find the principle
  const principleId = getTSCPrinciple(criteriaId);
  if (principleId) {
    const principle = TSC_PRINCIPLES.find((p) => p.id === principleId);
    if (principle) {
      return {
        title: `Criteria ${criteriaId}`,
        description: `Criteria under: ${principle.title}`,
        principleTitle: principle.title,
      };
    }
  }

  return null;
}

/**
 * Get the TSC principle name from a criteria ID.
 * e.g. "CC6.1" -> "Security", "A1.2" -> "Availability", "PI1.3" -> "Processing Integrity"
 */
export function getTSCPrinciple(criteriaId: string): string {
  const prefix = criteriaId.split(/[0-9]/)[0].toUpperCase();
  const prefixMap: Record<string, string> = {
    CC: "Security",
    A: "Availability",
    PI: "Processing Integrity",
    C: "Confidentiality",
    P: "Privacy",
  };
  return prefixMap[prefix] ?? "Security";
}

/**
 * Get the parent group ID from a criteria ID.
 * e.g. "CC6.1" -> "CC6", "A1.2" -> "A1", "PI1.3" -> "PI1"
 */
export function getParentCriteriaGroup(criteriaId: string): string {
  // Extract prefix letters and first number
  const match = criteriaId.match(/^([A-Z]+)(\d+)/);
  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return criteriaId;
}

/**
 * Get all TSC controls as a flat array.
 */
export function getAllTSCControls(): Array<{
  id: string;
  description: string;
  principle: string;
}> {
  const controls: Array<{ id: string; description: string; principle: string }> =
    [];
  for (const principle of TSC_PRINCIPLES) {
    if (!principle.criteria) continue;
    for (const c of principle.criteria) {
      controls.push({
        id: c.id,
        description: c.description,
        principle: principle.id,
      });
    }
  }
  return controls;
}

/**
 * Get a principle by its name.
 */
export function getPrincipleByName(
  principleName: string,
): TSCPrincipleMeta | null {
  return TSC_PRINCIPLES.find((p) => p.id === principleName) ?? null;
}
