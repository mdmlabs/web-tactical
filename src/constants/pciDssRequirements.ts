import type { PCIDSSRequirementMeta } from "@/types/pciDss";

/**
 * PCI DSS v3.2.1 requirement descriptions.
 * Used to display human-readable labels in the Compliance UI.
 */
export const PCI_DSS_REQUIREMENTS: PCIDSSRequirementMeta[] = [
  {
    id: "1",
    title: "Install and maintain a firewall configuration to protect cardholder data",
    description:
      "Firewalls are devices that control computer traffic allowed between an entity's networks (internal) and untrusted networks (external), as well as traffic into and out of more sensitive areas within an entity's internal trusted networks.",
    subRequirements: [
      { id: "1.1", title: "Establish and implement firewall and router configuration standards", description: "Establish and implement firewall and router configuration standards that include a formal process for approving and testing all network connections and changes to the firewall and router configurations." },
      { id: "1.2", title: "Build firewall and router configurations that restrict connections", description: "Build firewall and router configurations that restrict connections between untrusted networks and any system components in the cardholder data environment." },
      { id: "1.3", title: "Prohibit direct public access between the Internet and any system component", description: "Prohibit direct public access between the Internet and any system component in the cardholder data environment." },
      { id: "1.4", title: "Install personal firewall software", description: "Install personal firewall software or equivalent functionality on any portable computing devices that connect to the Internet when outside the network, and which are also used to access the CDE." },
    ],
  },
  {
    id: "2",
    title: "Do not use vendor-supplied defaults for system passwords and other security parameters",
    description:
      "Malicious individuals often use vendor default passwords and other vendor default settings to compromise systems. These passwords and settings are well known by hacker communities and are easily determined via public information.",
    subRequirements: [
      { id: "2.1", title: "Always change vendor-supplied defaults", description: "Always change vendor-supplied defaults and remove or disable unnecessary default accounts before installing a system on the network." },
      { id: "2.2", title: "Develop configuration standards", description: "Develop configuration standards for all system components. Assure that these standards address all known security vulnerabilities and are consistent with industry-accepted system hardening standards." },
      { id: "2.3", title: "Encrypt all non-console administrative access", description: "Encrypt all non-console administrative access using strong cryptography." },
    ],
  },
  {
    id: "3",
    title: "Protect stored cardholder data",
    description:
      "Protection methods such as encryption, truncation, masking, and hashing are critical components of cardholder data protection.",
    subRequirements: [
      { id: "3.1", title: "Keep cardholder data storage to a minimum", description: "Keep cardholder data storage to a minimum by implementing data retention and disposal policies, procedures and processes." },
      { id: "3.4", title: "Render PAN unreadable anywhere it is stored", description: "Render PAN unreadable anywhere it is stored by using any of the specified approaches." },
      { id: "3.5", title: "Document and implement procedures to protect keys", description: "Document and implement procedures to protect keys used to secure stored cardholder data against disclosure and misuse." },
    ],
  },
  {
    id: "4",
    title: "Encrypt transmission of cardholder data across open, public networks",
    description:
      "Sensitive information must be encrypted during transmission over networks that are easily accessed by malicious individuals.",
    subRequirements: [
      { id: "4.1", title: "Use strong cryptography and security protocols", description: "Use strong cryptography and security protocols to safeguard sensitive cardholder data during transmission over open, public networks." },
    ],
  },
  {
    id: "5",
    title: "Protect all systems against malware and regularly update anti-virus software or programs",
    description:
      "Malicious software, commonly referred to as malware, is software or firmware designed to infiltrate or damage a computer system without the owner's informed consent.",
    subRequirements: [
      { id: "5.1", title: "Deploy anti-virus software on all systems", description: "Deploy anti-virus software on all systems commonly affected by malicious software." },
      { id: "5.2", title: "Ensure anti-virus mechanisms are maintained", description: "Ensure that all anti-virus mechanisms are kept current, perform periodic scans, and generate audit logs." },
    ],
  },
  {
    id: "6",
    title: "Develop and maintain secure systems and applications",
    description:
      "Unscrupulous individuals use security vulnerabilities to gain privileged access to systems. Many of these vulnerabilities are fixed by vendor-provided security patches.",
    subRequirements: [
      { id: "6.1", title: "Establish a process to identify security vulnerabilities", description: "Establish a process to identify security vulnerabilities, using reputable outside sources for security vulnerability information." },
      { id: "6.2", title: "Ensure all system components are protected", description: "Ensure that all system components and software are protected from known vulnerabilities by installing applicable vendor-supplied security patches." },
      { id: "6.5", title: "Address common coding vulnerabilities", description: "Address common coding vulnerabilities in software development processes." },
      { id: "6.5.7", title: "Cross-site scripting (XSS)", description: "Address cross-site scripting (XSS) vulnerabilities in web applications." },
      { id: "6.5.8", title: "Improper access control", description: "Address improper access control such as insecure direct object references, failure to restrict URL access, directory traversal, failure to restrict user access to functions." },
      { id: "6.6", title: "Address new threats and vulnerabilities for public-facing web applications", description: "For public-facing web applications, address new threats and vulnerabilities on an ongoing basis and ensure these applications are protected against known attacks." },
    ],
  },
  {
    id: "7",
    title: "Restrict access to cardholder data by business need to know",
    description:
      "To ensure critical data can only be accessed by authorized personnel, systems and processes must be in place to limit access based on need to know and according to job responsibilities.",
    subRequirements: [
      { id: "7.1", title: "Limit access to system components and cardholder data", description: "Limit access to system components and cardholder data to only those individuals whose job requires such access." },
    ],
  },
  {
    id: "8",
    title: "Identify and authenticate access to system components",
    description:
      "Assigning a unique identification (ID) to each person with access ensures that each individual is uniquely accountable for their actions.",
    subRequirements: [
      { id: "8.1", title: "Define and implement policies and procedures", description: "Define and implement policies and procedures to ensure proper user identification management for non-consumer users and administrators on all system components." },
      { id: "8.1.8", title: "If a session has been idle for more than 15 minutes", description: "If a session has been idle for more than 15 minutes, require the user to re-authenticate to re-activate the terminal or session." },
      { id: "8.2", title: "Employ at least one method to authenticate all users", description: "In addition to assigning a unique ID, ensure proper user-authentication management for non-consumer users and administrators." },
    ],
  },
  {
    id: "9",
    title: "Restrict physical access to cardholder data",
    description:
      "Any physical access to data or systems that house cardholder data provides the opportunity for individuals to access devices or data and to remove systems or hardcopies.",
  },
  {
    id: "10",
    title: "Track and monitor all access to network resources and cardholder data",
    description:
      "Logging mechanisms and the ability to track user activities are critical in preventing, detecting, or minimizing the impact of a data compromise.",
    subRequirements: [
      { id: "10.1", title: "Implement audit trails to link all access to individual users", description: "Implement audit trails to link all access to system components to each individual user." },
      { id: "10.2", title: "Implement automated audit trails for all system components", description: "Implement automated audit trails for all system components to reconstruct events." },
      { id: "10.2.5", title: "Use of and changes to identification and authentication mechanisms", description: "Use of and changes to identification and authentication mechanisms, including creation of new accounts and elevation of privileges, and all changes, additions, or deletions to accounts with root or administrative privileges." },
      { id: "10.4", title: "Use time-synchronization technology", description: "Using time-synchronization technology, synchronize all critical system clocks and times." },
      { id: "10.5", title: "Secure audit trails so they cannot be altered", description: "Secure audit trails so they cannot be altered." },
      { id: "10.6", title: "Review logs and security events for all system components", description: "Review logs and security events for all system components to identify anomalies or suspicious activity." },
      { id: "10.6.1", title: "Review security events, logs of all system components daily", description: "Review the following at least daily: all security events, logs of all system components that store, process, or transmit CHD and/or SAD, logs of all critical system components, logs of all servers and system components that perform security functions." },
    ],
  },
  {
    id: "11",
    title: "Regularly test security systems and processes",
    description:
      "Vulnerabilities are being discovered continually by malicious individuals and researchers, and being introduced by new software. System components, processes, and custom software should be tested frequently.",
    subRequirements: [
      { id: "11.4", title: "Use intrusion-detection and/or intrusion-prevention techniques", description: "Use intrusion-detection and/or intrusion-prevention techniques to detect and/or prevent intrusions into the network." },
      { id: "11.5", title: "Deploy a change-detection mechanism", description: "Deploy a change-detection mechanism (for example, file integrity monitoring tools) to alert personnel to unauthorized modification of critical system files, configuration files, or content files; and configure the software to perform critical file comparisons at least weekly." },
    ],
  },
  {
    id: "12",
    title: "Maintain a policy that addresses information security for all personnel",
    description:
      "A strong security policy sets the security tone for the whole entity and informs personnel what is expected of them.",
    subRequirements: [
      { id: "12.1", title: "Establish, publish, maintain, and disseminate a security policy", description: "Establish, publish, maintain, and disseminate a security policy." },
      { id: "12.5", title: "Assign information security management responsibilities", description: "Assign to an individual or team information security management responsibilities." },
    ],
  },
];

/**
 * Lookup a PCI DSS requirement or sub-requirement by its ID (e.g. "11.5", "2.2").
 * Returns the title and description if found.
 */
export function lookupPCIDSSRequirement(reqId: string): {
  title: string;
  description: string;
  parentTitle?: string;
} | null {
  // Try to find as a top-level requirement
  const topLevel = PCI_DSS_REQUIREMENTS.find((r) => r.id === reqId);
  if (topLevel) {
    return { title: topLevel.title, description: topLevel.description };
  }

  // Try to find as a sub-requirement
  for (const req of PCI_DSS_REQUIREMENTS) {
    const sub = req.subRequirements?.find((s) => s.id === reqId);
    if (sub) {
      return {
        title: sub.title,
        description: sub.description,
        parentTitle: req.title,
      };
    }
  }

  // Try to match by prefix (e.g., "10.2.5" -> parent "10")
  const parentId = reqId.split(".")[0];
  const parent = PCI_DSS_REQUIREMENTS.find((r) => r.id === parentId);
  if (parent) {
    return {
      title: `Requirement ${reqId}`,
      description: `Sub-requirement of: ${parent.title}`,
      parentTitle: parent.title,
    };
  }

  return null;
}

/**
 * Get the parent requirement ID from a sub-requirement ID.
 * e.g. "10.2.5" -> "10", "2.2" -> "2"
 */
export function getParentRequirementId(reqId: string): string {
  return reqId.split(".")[0];
}
