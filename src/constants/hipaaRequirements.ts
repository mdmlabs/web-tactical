import type { HIPAAStandardMeta } from "@/types/hipaa";

/**
 * HIPAA (Health Insurance Portability and Accountability Act) standard descriptions.
 * Based on 45 CFR Part 164 - Security Rule and Privacy Rule.
 * Used to display human-readable labels in the Compliance UI.
 */
export const HIPAA_STANDARDS: HIPAAStandardMeta[] = [
  {
    id: "164.308",
    title: "Administrative Safeguards",
    description:
      "Administrative actions, policies, and procedures to manage the selection, development, implementation, and maintenance of security measures to protect electronic protected health information (ePHI) and to manage the conduct of the covered entity's workforce.",
    subStandards: [
      { id: "164.308.a.1", title: "Security Management Process", description: "Implement policies and procedures to prevent, detect, contain, and correct security violations. Includes risk analysis and risk management." },
      { id: "164.308.a.2", title: "Assigned Security Responsibility", description: "Identify the security official who is responsible for the development and implementation of the policies and procedures required for the entity." },
      { id: "164.308.a.3", title: "Workforce Security", description: "Implement policies and procedures to ensure that all members of the workforce have appropriate access to ePHI, and to prevent those who do not have access from obtaining access. Includes authorization/supervision, workforce clearance, and termination procedures." },
      { id: "164.308.a.4", title: "Information Access Management", description: "Implement policies and procedures for authorizing access to ePHI. Includes isolating healthcare clearinghouse functions, access authorization, and access establishment and modification." },
      { id: "164.308.a.5", title: "Security Awareness and Training", description: "Implement a security awareness and training program for all members of the workforce. Includes security reminders, protection from malicious software, log-in monitoring, and password management." },
      { id: "164.308.a.6", title: "Security Incident Procedures", description: "Implement policies and procedures to address security incidents. Includes response and reporting procedures." },
      { id: "164.308.a.7", title: "Contingency Plan", description: "Establish and implement policies and procedures for responding to an emergency or other occurrence that damages systems containing ePHI. Includes data backup plan, disaster recovery plan, emergency mode operation plan, testing, and applications/data criticality analysis." },
      { id: "164.308.a.8", title: "Evaluation", description: "Perform a periodic technical and nontechnical evaluation, based initially upon the standards implemented under this rule and subsequently in response to environmental or operational changes." },
      { id: "164.308.b.1", title: "Business Associate Contracts and Other Arrangements", description: "A covered entity may permit a business associate to create, receive, maintain, or transmit ePHI on its behalf only if the covered entity obtains satisfactory assurances that the business associate will appropriately safeguard the information." },
    ],
  },
  {
    id: "164.310",
    title: "Physical Safeguards",
    description:
      "Physical measures, policies, and procedures to protect a covered entity's electronic information systems and related buildings and equipment from natural and environmental hazards and unauthorized intrusion.",
    subStandards: [
      { id: "164.310.a.1", title: "Facility Access Controls", description: "Implement policies and procedures to limit physical access to electronic information systems and the facilities in which they are housed. Includes contingency operations, facility security plan, access control and validation procedures, and maintenance records." },
      { id: "164.310.a.2", title: "Facility Security Plan", description: "Implement policies and procedures to safeguard the facility and the equipment therein from unauthorized physical access, tampering, and theft." },
      { id: "164.310.b", title: "Workstation Use", description: "Implement policies and procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access ePHI." },
      { id: "164.310.c", title: "Workstation Security", description: "Implement physical safeguards for all workstations that access ePHI, to restrict access to authorized users." },
      { id: "164.310.d.1", title: "Device and Media Controls - Disposal", description: "Implement policies and procedures to address the final disposition of ePHI and/or the hardware or electronic media on which it is stored." },
      { id: "164.310.d.2", title: "Device and Media Controls - Media Re-use", description: "Implement procedures for removal of ePHI from electronic media before the media are made available for re-use." },
    ],
  },
  {
    id: "164.312",
    title: "Technical Safeguards",
    description:
      "The technology and the policy and procedures for its use that protect electronic protected health information and control access to it.",
    subStandards: [
      { id: "164.312.a.1", title: "Access Control - Unique User Identification", description: "Assign a unique name and/or number for identifying and tracking user identity." },
      { id: "164.312.a.2", title: "Access Control - Emergency Access Procedure", description: "Establish and implement as needed procedures for obtaining necessary ePHI during an emergency." },
      { id: "164.312.b", title: "Audit Controls", description: "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI." },
      { id: "164.312.c.1", title: "Integrity - Mechanism to Authenticate ePHI", description: "Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner." },
      { id: "164.312.c.2", title: "Integrity Controls", description: "Implement policies and procedures to protect ePHI from improper alteration or destruction." },
      { id: "164.312.d", title: "Person or Entity Authentication", description: "Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed." },
      { id: "164.312.e.1", title: "Transmission Security - Integrity Controls", description: "Implement security measures to ensure that electronically transmitted ePHI is not improperly modified without detection until disposed of." },
      { id: "164.312.e.2", title: "Transmission Security - Encryption", description: "Implement a mechanism to encrypt ePHI whenever deemed appropriate." },
    ],
  },
  {
    id: "164.314",
    title: "Organizational Requirements",
    description:
      "Standards for business associate contracts and other arrangements, including requirements for group health plans.",
    subStandards: [
      { id: "164.314.a.1", title: "Business Associate Contracts - Written Contract", description: "The contract between a covered entity and a business associate must establish the permitted and required uses and disclosures of protected health information by the business associate." },
      { id: "164.314.a.2", title: "Business Associate Contracts - Implementation", description: "A covered entity is not in compliance if the covered entity knew of a pattern of activity or practice of the business associate that constituted a material breach or violation of the business associate's obligations." },
      { id: "164.314.b", title: "Requirements for Group Health Plans", description: "A group health plan must ensure that its plan documents provide that the plan sponsor will implement safeguards to protect ePHI." },
    ],
  },
  {
    id: "164.316",
    title: "Policies and Procedures and Documentation Requirements",
    description:
      "Implement reasonable and appropriate policies and procedures to comply with the standards, implementation specifications, and other requirements. Maintain written policies, procedures, actions, activities, or assessments in written or electronic form.",
    subStandards: [
      { id: "164.316.a", title: "Policies and Procedures", description: "Implement reasonable and appropriate policies and procedures to comply with the standards, implementation specifications, or other requirements of the Security Rule." },
      { id: "164.316.b.1", title: "Documentation - Retention Period", description: "Retain the documentation required for 6 years from the date of its creation or the date when it last was in effect, whichever is later." },
      { id: "164.316.b.2", title: "Documentation - Availability", description: "Make documentation available to those persons responsible for implementing the procedures to which the documentation pertains." },
      { id: "164.316.b.3", title: "Documentation - Updates", description: "Review documentation periodically and update as needed in response to environmental or operational changes affecting the security of ePHI." },
    ],
  },
  {
    id: "164.520",
    title: "Notice of Privacy Practices",
    description:
      "A covered entity must provide a notice of its privacy practices. The notice must describe how the covered entity may use and disclose protected health information.",
    subStandards: [
      { id: "164.520.a", title: "Right to Notice", description: "An individual has a right to adequate notice of the uses and disclosures of PHI that may be made by the covered entity." },
      { id: "164.520.b", title: "Content of Notice", description: "The covered entity must provide a notice that includes a description of uses and disclosures, individual rights, and the entity's legal duties." },
      { id: "164.520.c", title: "Implementation Requirements", description: "A covered entity must make the notice available on request and provide a copy to any individual who asks for one." },
    ],
  },
  {
    id: "164.524",
    title: "Access of Individuals to Protected Health Information",
    description:
      "An individual has a right of access to inspect and obtain a copy of protected health information about the individual in a designated record set.",
    subStandards: [
      { id: "164.524.a", title: "Right of Access", description: "An individual has a right of access to inspect and obtain a copy of PHI about the individual in a designated record set." },
      { id: "164.524.b", title: "Timely Access", description: "The covered entity must act on a request for access no later than 30 days after receipt of the request." },
      { id: "164.524.c", title: "Format of Access", description: "The covered entity must provide the individual with access to the PHI in the form or format requested by the individual, if readily producible." },
    ],
  },
  {
    id: "164.526",
    title: "Amendment of Protected Health Information",
    description:
      "An individual has the right to have a covered entity amend protected health information or a record about the individual in a designated record set.",
    subStandards: [
      { id: "164.526.a", title: "Right to Amend", description: "An individual has the right to have a covered entity amend PHI or a record about the individual in a designated record set for as long as the PHI is maintained." },
      { id: "164.526.b", title: "Timely Action", description: "The covered entity must act on the individual's request for an amendment no later than 60 days after receipt of such a request." },
    ],
  },
  {
    id: "164.530",
    title: "Administrative Requirements (Privacy Rule)",
    description:
      "A covered entity must comply with administrative requirements including designation of a privacy official, training of workforce members, safeguards, complaint procedures, and non-retaliation policies.",
    subStandards: [
      { id: "164.530.a", title: "Personnel Designations", description: "A covered entity must designate a privacy official responsible for the development and implementation of the policies and procedures of the entity." },
      { id: "164.530.b", title: "Training", description: "A covered entity must train all members of its workforce on the policies and procedures with respect to PHI as necessary and appropriate." },
      { id: "164.530.c", title: "Safeguards", description: "A covered entity must have in place appropriate administrative, technical, and physical safeguards to protect the privacy of PHI." },
      { id: "164.530.d", title: "Complaints", description: "A covered entity must provide a process for individuals to make complaints concerning the covered entity's policies and procedures." },
      { id: "164.530.e", title: "Sanctions", description: "A covered entity must have and apply appropriate sanctions against members of its workforce who fail to comply with the privacy policies and procedures." },
      { id: "164.530.f", title: "Non-intimidation and Non-retaliation", description: "A covered entity may not intimidate, threaten, coerce, discriminate against, or take other retaliatory action against any individual for exercising rights under the Privacy Rule." },
      { id: "164.530.i", title: "Policies and Procedures", description: "A covered entity must implement policies and procedures with respect to PHI that are designed to comply with the Privacy Rule." },
    ],
  },
];

/**
 * Lookup a HIPAA standard or sub-standard by its ID (e.g. "164.312.a.1", "164.308").
 * Returns the title and description if found.
 */
export function lookupHIPAAStandard(standardId: string): {
  title: string;
  description: string;
  parentTitle?: string;
} | null {
  // Try to find as a top-level standard
  const topLevel = HIPAA_STANDARDS.find((s) => s.id === standardId);
  if (topLevel) {
    return { title: topLevel.title, description: topLevel.description };
  }

  // Try to find as a sub-standard
  for (const standard of HIPAA_STANDARDS) {
    const sub = standard.subStandards?.find((s) => s.id === standardId);
    if (sub) {
      return {
        title: sub.title,
        description: sub.description,
        parentTitle: standard.title,
      };
    }
  }

  // Try to match by prefix (e.g., "164.312.a.1" -> parent "164.312")
  const parentId = getParentStandardId(standardId);
  const parent = HIPAA_STANDARDS.find((s) => s.id === parentId);
  if (parent) {
    return {
      title: `Standard ${standardId}`,
      description: `Sub-standard of: ${parent.title}`,
      parentTitle: parent.title,
    };
  }

  return null;
}

/**
 * Get the parent standard ID from a sub-standard ID.
 * e.g. "164.312.a.1" -> "164.312", "164.308.a.5" -> "164.308"
 * The parent ID is the first two dot-separated segments: "164.XXX"
 */
export function getParentStandardId(standardId: string): string {
  const parts = standardId.split(".");
  if (parts.length >= 2) {
    return `${parts[0]}.${parts[1]}`;
  }
  return standardId;
}
