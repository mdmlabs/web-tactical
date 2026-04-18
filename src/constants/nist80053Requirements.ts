import type { NIST80053ControlFamilyMeta } from "@/types/nist80053";

/**
 * NIST SP 800-53 Revision 5 control families and controls.
 * Used to display human-readable labels in the Compliance UI.
 */
export const NIST_800_53_CONTROLS: NIST80053ControlFamilyMeta[] = [
  {
    id: "AC",
    title: "Access Control",
    description:
      "Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems) and to the types of transactions and functions that authorized users are permitted to exercise.",
    controls: [
      { id: "AC-1", title: "Policy and Procedures", description: "Develop, document, and disseminate access control policy and procedures." },
      { id: "AC-2", title: "Account Management", description: "Define and manage information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts." },
      { id: "AC-3", title: "Access Enforcement", description: "Enforce approved authorizations for logical access to information and system resources." },
      { id: "AC-4", title: "Information Flow Enforcement", description: "Enforce approved authorizations for controlling the flow of information within the system and between connected systems." },
      { id: "AC-5", title: "Separation of Duties", description: "Separate duties of individuals to prevent malevolent activity without collusion." },
      { id: "AC-6", title: "Least Privilege", description: "Employ the principle of least privilege, allowing only authorized accesses for users and processes." },
      { id: "AC-7", title: "Unsuccessful Logon Attempts", description: "Enforce a limit of consecutive invalid logon attempts by a user during a specified time period." },
      { id: "AC-8", title: "System Use Notification", description: "Display an approved system use notification message before granting access." },
      { id: "AC-9", title: "Previous Logon Notification", description: "Notify the user upon successful logon of the date and time of the last logon." },
      { id: "AC-10", title: "Concurrent Session Control", description: "Limit the number of concurrent sessions for each system account." },
      { id: "AC-11", title: "Device Lock", description: "Prevent further access to the system by initiating a device lock after a specified period of inactivity." },
      { id: "AC-12", title: "Session Termination", description: "Automatically terminate a user session after defined conditions." },
      { id: "AC-14", title: "Permitted Actions without Identification or Authentication", description: "Identify specific user actions that can be performed without identification or authentication." },
      { id: "AC-16", title: "Security and Privacy Attributes", description: "Provide the means to associate security and privacy attributes with information in storage, in process, and in transmission." },
      { id: "AC-17", title: "Remote Access", description: "Establish and document usage restrictions, configuration requirements, and implementation guidance for each type of remote access allowed." },
      { id: "AC-18", title: "Wireless Access", description: "Establish configuration requirements, connection requirements, and implementation guidance for wireless access." },
      { id: "AC-19", title: "Access Control for Mobile Devices", description: "Establish configuration requirements and implementation guidance for organization-controlled mobile devices." },
      { id: "AC-20", title: "Use of External Systems", description: "Establish terms and conditions for authorized individuals to access the system from external systems." },
      { id: "AC-21", title: "Information Sharing", description: "Enable authorized users to determine whether access authorizations assigned to a sharing partner match the information's access restrictions." },
      { id: "AC-22", title: "Publicly Accessible Content", description: "Designate individuals authorized to make information publicly accessible and review content for nonpublic information." },
      { id: "AC-23", title: "Data Mining Protection", description: "Employ data mining prevention and detection techniques for data storage objects." },
      { id: "AC-24", title: "Access Control Decisions", description: "Establish procedures to ensure access control decisions are applied to each access request prior to access enforcement." },
      { id: "AC-25", title: "Reference Monitor", description: "Implement a reference monitor that is tamperproof, always invoked, and small enough to be subject to analysis and testing." },
    ],
  },
  {
    id: "AT",
    title: "Awareness and Training",
    description:
      "Ensure that managers and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.",
    controls: [
      { id: "AT-1", title: "Policy and Procedures", description: "Develop, document, and disseminate awareness and training policy and procedures." },
      { id: "AT-2", title: "Literacy Training and Awareness", description: "Provide security and privacy literacy training to system users." },
      { id: "AT-3", title: "Role-based Training", description: "Provide role-based security and privacy training to personnel with assigned security roles and responsibilities." },
      { id: "AT-4", title: "Training Records", description: "Document and monitor information security and privacy training activities." },
      { id: "AT-5", title: "Contacts with Security Groups and Associations", description: "Establish contact with selected groups and associations within the security community." },
      { id: "AT-6", title: "Training Feedback", description: "Provide feedback on organizational training results." },
    ],
  },
  {
    id: "AU",
    title: "Audit and Accountability",
    description:
      "Create, protect, and retain information system audit records to the extent needed to enable monitoring, analysis, investigation, and reporting of unlawful, unauthorized, or inappropriate information system activity.",
    controls: [
      { id: "AU-1", title: "Policy and Procedures", description: "Develop, document, and disseminate audit and accountability policy and procedures." },
      { id: "AU-2", title: "Event Logging", description: "Identify the types of events that the system is capable of logging in support of the audit function." },
      { id: "AU-3", title: "Content of Audit Records", description: "Ensure that audit records contain information that establishes what type of event occurred, when it occurred, where it occurred, the source and outcome." },
      { id: "AU-4", title: "Audit Log Storage Capacity", description: "Allocate audit log storage capacity and configure auditing to reduce the likelihood of exceeding capacity." },
      { id: "AU-5", title: "Response to Audit Logging Process Failures", description: "Alert designated personnel in the event of an audit logging process failure and take defined additional actions." },
      { id: "AU-6", title: "Audit Record Review, Analysis, and Reporting", description: "Review and analyze system audit records for indications of inappropriate or unusual activity and report findings." },
      { id: "AU-7", title: "Audit Record Reduction and Report Generation", description: "Provide and implement an audit record reduction and report generation capability." },
      { id: "AU-8", title: "Time Stamps", description: "Use internal system clocks to generate time stamps for audit records." },
      { id: "AU-9", title: "Protection of Audit Information", description: "Protect audit information and audit logging tools from unauthorized access, modification, and deletion." },
      { id: "AU-10", title: "Non-repudiation", description: "Provide irrefutable evidence that an individual or process performed specific actions." },
      { id: "AU-11", title: "Audit Record Retention", description: "Retain audit records for a defined period to provide support for after-the-fact investigations and meet regulatory requirements." },
      { id: "AU-12", title: "Audit Record Generation", description: "Provide audit record generation capability for the events defined in AU-2 at system components." },
      { id: "AU-13", title: "Monitoring for Information Disclosure", description: "Monitor for evidence of unauthorized disclosure of organizational information." },
      { id: "AU-14", title: "Session Audit", description: "Provide and implement the capability to capture and log content related to a user session." },
      { id: "AU-16", title: "Cross-organizational Audit Logging", description: "Employ methods for coordinating audit information among external organizations when audit information is transmitted across organizational boundaries." },
    ],
  },
  {
    id: "CA",
    title: "Assessment, Authorization, and Monitoring",
    description:
      "Conduct assessments of the controls and risks to determine the extent to which the controls are implemented correctly, operating as intended, and producing the desired outcome with respect to meeting security and privacy requirements.",
    controls: [
      { id: "CA-1", title: "Policy and Procedures", description: "Develop, document, and disseminate assessment, authorization, and monitoring policy and procedures." },
      { id: "CA-2", title: "Control Assessments", description: "Assess the controls in the system and its environment of operation to determine the extent to which the controls are implemented correctly." },
      { id: "CA-3", title: "Information Exchange", description: "Approve and manage the exchange of information between the system and other systems using interconnection security agreements." },
      { id: "CA-5", title: "Plan of Action and Milestones", description: "Develop and update a plan of action and milestones to document planned remedial actions to correct weaknesses or deficiencies." },
      { id: "CA-6", title: "Authorization", description: "Assign a senior official to authorize the system before commencing operations and update the authorization on an ongoing basis." },
      { id: "CA-7", title: "Continuous Monitoring", description: "Develop a system-level continuous monitoring strategy and implement monitoring in accordance with the strategy." },
      { id: "CA-8", title: "Penetration Testing", description: "Conduct penetration testing on systems or system components." },
      { id: "CA-9", title: "Internal System Connections", description: "Authorize internal connections of system components and monitor/control the connections on an ongoing basis." },
    ],
  },
  {
    id: "CM",
    title: "Configuration Management",
    description:
      "Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.",
    controls: [
      { id: "CM-1", title: "Policy and Procedures", description: "Develop, document, and disseminate configuration management policy and procedures." },
      { id: "CM-2", title: "Baseline Configuration", description: "Develop, document, and maintain a current baseline configuration of the system." },
      { id: "CM-3", title: "Configuration Change Control", description: "Determine and document the types of changes to the system that are configuration-controlled." },
      { id: "CM-4", title: "Impact Analyses", description: "Analyze changes to the system to determine potential security and privacy impacts prior to change implementation." },
      { id: "CM-5", title: "Access Restrictions for Change", description: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to the system." },
      { id: "CM-6", title: "Configuration Settings", description: "Establish and document configuration settings for components employed within the system." },
      { id: "CM-7", title: "Least Functionality", description: "Configure the system to provide only mission-essential capabilities and prohibit or restrict the use of nonessential functions." },
      { id: "CM-8", title: "System Component Inventory", description: "Develop and document an inventory of system components that accurately reflects the system." },
      { id: "CM-9", title: "Configuration Management Plan", description: "Develop, document, and implement a configuration management plan for the system." },
      { id: "CM-10", title: "Software Usage Restrictions", description: "Use software and associated documentation in accordance with contract agreements and copyright laws." },
      { id: "CM-11", title: "User-installed Software", description: "Establish and enforce policies governing the installation of software by users." },
      { id: "CM-12", title: "Information Location", description: "Identify and document the location of information and the system components on which the information is processed and stored." },
      { id: "CM-13", title: "Data Action Mapping", description: "Develop and document a map of system data actions." },
      { id: "CM-14", title: "Signed Components", description: "Prevent the installation of software and firmware components without verification that the component has been digitally signed." },
    ],
  },
  {
    id: "CP",
    title: "Contingency Planning",
    description:
      "Establish, implement, and maintain plans for emergency response, backup operations, and post-disaster recovery for organizational systems to ensure the availability of critical information resources and continuity of operations.",
    controls: [
      { id: "CP-1", title: "Policy and Procedures", description: "Develop, document, and disseminate contingency planning policy and procedures." },
      { id: "CP-2", title: "Contingency Plan", description: "Develop a contingency plan that identifies essential missions and business functions and associated contingency requirements." },
      { id: "CP-3", title: "Contingency Training", description: "Provide contingency training to system users consistent with assigned roles and responsibilities." },
      { id: "CP-4", title: "Contingency Plan Testing", description: "Test the contingency plan to determine the effectiveness of the plan and the readiness to execute the plan." },
      { id: "CP-6", title: "Alternate Storage Site", description: "Establish an alternate storage site and initiate necessary agreements to permit storage and retrieval of system backup information." },
      { id: "CP-7", title: "Alternate Processing Site", description: "Establish an alternate processing site that provides security measures equivalent to the primary site." },
      { id: "CP-8", title: "Telecommunications Services", description: "Establish alternate telecommunications services including necessary agreements to permit resumption of system operations." },
      { id: "CP-9", title: "System Backup", description: "Conduct backups of user-level and system-level information contained in the system." },
      { id: "CP-10", title: "System Recovery and Reconstitution", description: "Provide for the recovery and reconstitution of the system to a known state within defined time period after disruption." },
      { id: "CP-11", title: "Alternate Communications Protocols", description: "Provide the capability to employ alternative communications protocols in support of maintaining continuity of operations." },
      { id: "CP-12", title: "Safe Mode", description: "Restrict the ability of the system to operate in a degraded mode when experiencing defined trigger conditions." },
      { id: "CP-13", title: "Alternative Security Mechanisms", description: "Employ alternative or supplemental security mechanisms when the primary means of implementing security are unavailable." },
    ],
  },
  {
    id: "IA",
    title: "Identification and Authentication",
    description:
      "Identify and authenticate users, processes, or devices as a prerequisite to allowing access to organizational information systems.",
    controls: [
      { id: "IA-1", title: "Policy and Procedures", description: "Develop, document, and disseminate identification and authentication policy and procedures." },
      { id: "IA-2", title: "Identification and Authentication (Organizational Users)", description: "Uniquely identify and authenticate organizational users and associate that unique identification with processes acting on behalf of those users." },
      { id: "IA-3", title: "Device Identification and Authentication", description: "Uniquely identify and authenticate devices before establishing a connection." },
      { id: "IA-4", title: "Identifier Management", description: "Manage system identifiers by receiving authorization, selecting, assigning, and preventing reuse of identifiers." },
      { id: "IA-5", title: "Authenticator Management", description: "Manage system authenticators by verifying identity before issuing, establishing initial content, and ensuring adequate strength." },
      { id: "IA-6", title: "Authentication Feedback", description: "Obscure feedback of authentication information during the authentication process to protect the information from possible exploitation." },
      { id: "IA-7", title: "Cryptographic Module Authentication", description: "Implement mechanisms for authentication to a cryptographic module that meet applicable requirements." },
      { id: "IA-8", title: "Identification and Authentication (Non-organizational Users)", description: "Uniquely identify and authenticate non-organizational users or processes acting on behalf of non-organizational users." },
      { id: "IA-9", title: "Service Identification and Authentication", description: "Uniquely identify and authenticate services before establishing communications with devices." },
      { id: "IA-10", title: "Adaptive Authentication", description: "Require users to provide additional authentication factors when accessing the system under defined circumstances." },
      { id: "IA-11", title: "Re-authentication", description: "Require users to re-authenticate when defined circumstances or situations require re-authentication." },
      { id: "IA-12", title: "Identity Proofing", description: "Identity proof users that require accounts for logical access to systems based on appropriate identity evidence." },
    ],
  },
  {
    id: "IR",
    title: "Incident Response",
    description:
      "Establish an operational incident handling capability for organizational systems that includes adequate preparation, detection, analysis, containment, recovery, and user response activities.",
    controls: [
      { id: "IR-1", title: "Policy and Procedures", description: "Develop, document, and disseminate incident response policy and procedures." },
      { id: "IR-2", title: "Incident Response Training", description: "Provide incident response training to system users consistent with assigned roles and responsibilities." },
      { id: "IR-3", title: "Incident Response Testing", description: "Test the effectiveness of the incident response capability using defined tests." },
      { id: "IR-4", title: "Incident Handling", description: "Implement an incident handling capability for incidents that includes preparation, detection and analysis, containment, eradication, and recovery." },
      { id: "IR-5", title: "Incident Monitoring", description: "Track and document incidents on an ongoing basis." },
      { id: "IR-6", title: "Incident Reporting", description: "Require personnel to report suspected incidents to the organizational incident response capability within defined time periods." },
      { id: "IR-7", title: "Incident Response Assistance", description: "Provide an incident response support resource integral to the organizational incident response capability." },
      { id: "IR-8", title: "Incident Response Plan", description: "Develop an incident response plan that provides a roadmap for implementing the incident response capability." },
      { id: "IR-9", title: "Information Spillage Response", description: "Respond to information spills by identifying and handling the specific information involved in the contamination." },
      { id: "IR-10", title: "Integrated Information Security Analysis Team", description: "Establish an integrated team of forensic/malware analysts, tool developers, and real-time operations personnel." },
    ],
  },
  {
    id: "MA",
    title: "Maintenance",
    description:
      "Perform maintenance on organizational systems effectively and efficiently while minimizing risk to organizational operations and assets.",
    controls: [
      { id: "MA-1", title: "Policy and Procedures", description: "Develop, document, and disseminate maintenance policy and procedures." },
      { id: "MA-2", title: "Controlled Maintenance", description: "Schedule, document, and review records of maintenance and repairs on system components." },
      { id: "MA-3", title: "Maintenance Tools", description: "Approve, control, and monitor the use of system maintenance tools." },
      { id: "MA-4", title: "Nonlocal Maintenance", description: "Approve and monitor nonlocal maintenance and diagnostic activities." },
      { id: "MA-5", title: "Maintenance Personnel", description: "Establish a process for maintenance personnel authorization and maintain a list of authorized maintenance organizations or personnel." },
      { id: "MA-6", title: "Timely Maintenance", description: "Obtain maintenance support and/or spare parts for system components within a defined time period of failure." },
      { id: "MA-7", title: "Field Maintenance", description: "Restrict or prohibit field maintenance on system components." },
    ],
  },
  {
    id: "MP",
    title: "Media Protection",
    description:
      "Protect information system media, both paper and digital, and limit access to information on media to authorized users.",
    controls: [
      { id: "MP-1", title: "Policy and Procedures", description: "Develop, document, and disseminate media protection policy and procedures." },
      { id: "MP-2", title: "Media Access", description: "Restrict access to digital and non-digital media to authorized individuals." },
      { id: "MP-3", title: "Media Marking", description: "Mark system media indicating the distribution limitations, handling caveats, and applicable security markings." },
      { id: "MP-4", title: "Media Storage", description: "Physically control and securely store digital and non-digital media within controlled areas." },
      { id: "MP-5", title: "Media Transport", description: "Protect and control digital and non-digital media during transport outside of controlled areas." },
      { id: "MP-6", title: "Media Sanitization", description: "Sanitize system media prior to disposal, release out of organizational control, or release for reuse." },
      { id: "MP-7", title: "Media Use", description: "Restrict or prohibit the use of specified types of system media on systems or system components." },
      { id: "MP-8", title: "Media Downgrading", description: "Establish a process for downgrading system media, employing downgrading mechanisms with defined strength and integrity." },
    ],
  },
  {
    id: "PE",
    title: "Physical and Environmental Protection",
    description:
      "Limit physical access to information systems, equipment, and the respective operating environments to authorized individuals.",
    controls: [
      { id: "PE-1", title: "Policy and Procedures", description: "Develop, document, and disseminate physical and environmental protection policy and procedures." },
      { id: "PE-2", title: "Physical Access Authorizations", description: "Develop, approve, and maintain a list of individuals with authorized access to the facility where the system resides." },
      { id: "PE-3", title: "Physical Access Control", description: "Enforce physical access authorizations at entry and exit points to the facility." },
      { id: "PE-4", title: "Access Control for Transmission", description: "Control physical access to system distribution and transmission lines within organizational facilities." },
      { id: "PE-5", title: "Access Control for Output Devices", description: "Control physical access to output from output devices to prevent unauthorized individuals from obtaining the output." },
      { id: "PE-6", title: "Monitoring Physical Access", description: "Monitor physical access to the facility where the system resides to detect and respond to physical security incidents." },
      { id: "PE-8", title: "Visitor Access Records", description: "Maintain visitor access records to the facility where the system resides." },
      { id: "PE-9", title: "Power Equipment and Cabling", description: "Protect power equipment and power cabling for the system from damage and destruction." },
      { id: "PE-10", title: "Emergency Shutoff", description: "Provide the capability of shutting off power to the system in emergency situations." },
      { id: "PE-11", title: "Emergency Power", description: "Provide an uninterruptible power supply to facilitate an orderly shutdown in the event of a power loss." },
      { id: "PE-12", title: "Emergency Lighting", description: "Employ and maintain automatic emergency lighting for the system that activates in the event of a power outage." },
      { id: "PE-13", title: "Fire Protection", description: "Employ fire detection and suppression systems that are supported by an independent energy source." },
      { id: "PE-14", title: "Environmental Controls", description: "Maintain temperature and humidity levels within the facility where the system resides at acceptable levels." },
      { id: "PE-15", title: "Water Damage Protection", description: "Protect the system from damage resulting from water leakage by providing master shutoff or isolation valves." },
      { id: "PE-16", title: "Delivery and Removal", description: "Authorize and control system components entering and exiting the facility and maintain records of the items." },
      { id: "PE-17", title: "Alternate Work Site", description: "Employ security controls at alternate work sites." },
      { id: "PE-18", title: "Location of System Components", description: "Position system components within the facility to minimize potential damage from physical and environmental hazards." },
      { id: "PE-19", title: "Information Leakage", description: "Protect the system from information leakage due to electromagnetic signals emanations." },
      { id: "PE-20", title: "Asset Monitoring and Tracking", description: "Employ asset location technologies to track and monitor the location and movement of organizational assets." },
      { id: "PE-21", title: "Electromagnetic Pulse Protection", description: "Employ protective measures against electromagnetic pulse damage for the system." },
      { id: "PE-22", title: "Component Marking", description: "Mark system hardware components indicating the impact or classification level of the information permitted to be processed." },
      { id: "PE-23", title: "Facility Location", description: "Plan the location of facilities processing sensitive data to reduce susceptibility to threats." },
    ],
  },
  {
    id: "PL",
    title: "Planning",
    description:
      "Develop, document, implement, and update security and privacy plans for organizational systems that describe the controls in place and rules of behavior for individuals accessing the systems.",
    controls: [
      { id: "PL-1", title: "Policy and Procedures", description: "Develop, document, and disseminate planning policy and procedures." },
      { id: "PL-2", title: "System Security and Privacy Plans", description: "Develop security and privacy plans for the system that are consistent with the organization's enterprise architecture." },
      { id: "PL-4", title: "Rules of Behavior", description: "Establish and provide to individuals requiring access to the system the rules that describe their responsibilities and expected behavior." },
      { id: "PL-7", title: "Concept of Operations", description: "Develop a security and privacy concept of operations for the system." },
      { id: "PL-8", title: "Security and Privacy Architectures", description: "Develop security and privacy architectures for the system that describe the requirements and approach to protecting information." },
      { id: "PL-9", title: "Central Management", description: "Centrally manage security and privacy controls and related processes." },
      { id: "PL-10", title: "Baseline Selection", description: "Select a control baseline for the system." },
      { id: "PL-11", title: "Baseline Tailoring", description: "Tailor the selected control baseline by applying specified tailoring actions." },
    ],
  },
  {
    id: "PM",
    title: "Program Management",
    description:
      "Manage the organization's information security program, including the provision of resources, plan of action and milestones, information system inventory, and measures of performance.",
    controls: [
      { id: "PM-1", title: "Information Security Program Plan", description: "Develop and disseminate an organization-wide information security program plan." },
      { id: "PM-2", title: "Information Security Program Leadership Role", description: "Appoint a senior information security officer with the mission and resources to coordinate and manage the security program." },
      { id: "PM-3", title: "Information Security and Privacy Resources", description: "Include the resources needed to implement the information security and privacy programs in capital planning." },
      { id: "PM-4", title: "Plan of Action and Milestones Process", description: "Implement a process to ensure that plans of action and milestones are developed and maintained." },
      { id: "PM-5", title: "System Inventory", description: "Develop and maintain an inventory of organizational systems." },
      { id: "PM-6", title: "Measures of Performance", description: "Develop, monitor, and report on the results of information security and privacy measures of performance." },
      { id: "PM-7", title: "Enterprise Architecture", description: "Develop and maintain an enterprise architecture with consideration for information security, privacy, and the resulting risk." },
      { id: "PM-8", title: "Critical Infrastructure Plan", description: "Address information security and privacy issues in the development of the critical infrastructure plan." },
      { id: "PM-9", title: "Risk Management Strategy", description: "Develop a comprehensive strategy to manage risk to organizational operations and assets." },
      { id: "PM-10", title: "Authorization Process", description: "Manage the security and privacy state of organizational systems through authorization processes." },
      { id: "PM-11", title: "Mission and Business Process Definition", description: "Define organizational mission and business processes with consideration for information security and privacy." },
      { id: "PM-12", title: "Insider Threat Program", description: "Implement an insider threat program that includes a cross-discipline insider threat incident handling team." },
      { id: "PM-13", title: "Security and Privacy Workforce", description: "Establish a security and privacy workforce development and improvement program." },
      { id: "PM-14", title: "Testing, Training, and Monitoring", description: "Implement a process for ensuring that organizational plans for conducting testing, training, and monitoring are developed and maintained." },
      { id: "PM-15", title: "Security and Privacy Groups and Associations", description: "Establish and institutionalize contact with selected groups and associations within the security and privacy communities." },
      { id: "PM-16", title: "Threat Awareness Program", description: "Implement a threat awareness program that includes a cross-organization information-sharing capability." },
    ],
  },
  {
    id: "PS",
    title: "Personnel Security",
    description:
      "Ensure that individuals occupying positions of responsibility within organizations are trustworthy and meet established security criteria.",
    controls: [
      { id: "PS-1", title: "Policy and Procedures", description: "Develop, document, and disseminate personnel security policy and procedures." },
      { id: "PS-2", title: "Position Risk Designation", description: "Assign a risk designation to all organizational positions and establish screening criteria for individuals filling those positions." },
      { id: "PS-3", title: "Personnel Screening", description: "Screen individuals prior to authorizing access to the system." },
      { id: "PS-4", title: "Personnel Termination", description: "Upon termination of individual employment, disable system access, terminate authenticators and credentials, and retrieve organizational property." },
      { id: "PS-5", title: "Personnel Transfer", description: "Review and confirm ongoing operational need for current access authorizations when individuals are reassigned or transferred." },
      { id: "PS-6", title: "Access Agreements", description: "Develop and document access agreements for organizational systems." },
      { id: "PS-7", title: "External Personnel Security", description: "Establish personnel security requirements including security roles and responsibilities for external providers." },
      { id: "PS-8", title: "Personnel Sanctions", description: "Employ a formal sanctions process for individuals failing to comply with established information security and privacy policies." },
      { id: "PS-9", title: "Position Descriptions", description: "Incorporate security and privacy role assignments into organizational position descriptions." },
    ],
  },
  {
    id: "PT",
    title: "Personally Identifiable Information Processing and Transparency",
    description:
      "Apply the principles of transparency and purpose specification to the processing of personally identifiable information.",
    controls: [
      { id: "PT-1", title: "Policy and Procedures", description: "Develop, document, and disseminate personally identifiable information processing and transparency policy and procedures." },
      { id: "PT-2", title: "Authority to Process Personally Identifiable Information", description: "Determine and document the legal authority that permits the processing of personally identifiable information." },
      { id: "PT-3", title: "Personally Identifiable Information Processing Purposes", description: "Identify and document the purposes for processing personally identifiable information." },
      { id: "PT-4", title: "Consent", description: "Implement tools or mechanisms for individuals to consent to the processing of their personally identifiable information." },
      { id: "PT-5", title: "Privacy Notice", description: "Provide notice to individuals about the processing of personally identifiable information." },
      { id: "PT-6", title: "System of Records Notice", description: "Publish system of records notices in the Federal Register." },
      { id: "PT-7", title: "Specific Categories of Personally Identifiable Information", description: "Apply specific processing conditions for categories of PII." },
      { id: "PT-8", title: "Computer Matching Requirements", description: "Comply with applicable computer matching requirements when processing PII for matching programs." },
    ],
  },
  {
    id: "RA",
    title: "Risk Assessment",
    description:
      "Assess the risk to organizational operations, organizational assets, individuals, other organizations, and the Nation resulting from the operation and use of information systems.",
    controls: [
      { id: "RA-1", title: "Policy and Procedures", description: "Develop, document, and disseminate risk assessment policy and procedures." },
      { id: "RA-2", title: "Security Categorization", description: "Categorize the system and information processed, stored, and transmitted by the system." },
      { id: "RA-3", title: "Risk Assessment", description: "Conduct an assessment of risk, including the likelihood and magnitude of harm from unauthorized access, use, disclosure, disruption, modification, or destruction." },
      { id: "RA-5", title: "Vulnerability Monitoring and Scanning", description: "Monitor and scan for vulnerabilities in the system and hosted applications." },
      { id: "RA-6", title: "Technical Surveillance Countermeasures Survey", description: "Employ a technical surveillance countermeasures survey at defined locations on a defined frequency." },
      { id: "RA-7", title: "Risk Response", description: "Respond to findings from security and privacy assessments, monitoring, and audits in accordance with organizational risk tolerance." },
      { id: "RA-8", title: "Privacy Impact Assessments", description: "Conduct privacy impact assessments for systems processing personally identifiable information." },
      { id: "RA-9", title: "Criticality Analysis", description: "Identify critical system components and functions by performing a criticality analysis." },
      { id: "RA-10", title: "Threat Hunting", description: "Establish and maintain a cyber threat hunting capability to search for indicators of compromise and detect threats." },
    ],
  },
  {
    id: "SA",
    title: "System and Services Acquisition",
    description:
      "Allocate sufficient resources to adequately protect organizational systems; employ system development life cycle processes that incorporate information security and privacy considerations.",
    controls: [
      { id: "SA-1", title: "Policy and Procedures", description: "Develop, document, and disseminate system and services acquisition policy and procedures." },
      { id: "SA-2", title: "Allocation of Resources", description: "Determine the high-level information security and privacy requirements for the system and allocate the resources." },
      { id: "SA-3", title: "System Development Life Cycle", description: "Acquire, develop, and manage the system using a system development life cycle methodology that incorporates security and privacy considerations." },
      { id: "SA-4", title: "Acquisition Process", description: "Include security and privacy functional requirements and design principles in the acquisition contract for the system." },
      { id: "SA-5", title: "System Documentation", description: "Obtain or develop administrator and user documentation for the system that describes secure configuration and operation." },
      { id: "SA-8", title: "Security and Privacy Engineering Principles", description: "Apply systems security and privacy engineering principles in the specification, design, development, implementation, and modification of the system." },
      { id: "SA-9", title: "External System Services", description: "Require that providers of external system services comply with organizational security and privacy requirements." },
      { id: "SA-10", title: "Developer Configuration Management", description: "Require the developer of the system to perform configuration management during system design, development, implementation, and operation." },
      { id: "SA-11", title: "Developer Testing and Evaluation", description: "Require the developer of the system to create and implement a security and privacy assessment plan." },
      { id: "SA-15", title: "Development Process, Standards, and Tools", description: "Require the developer of the system to follow a documented development process and use defined tools." },
      { id: "SA-16", title: "Developer-provided Training", description: "Require the developer of the system to provide training on the correct use and operation of the system." },
      { id: "SA-17", title: "Developer Security and Privacy Architecture and Design", description: "Require the developer to produce a design specification and architecture that is consistent with organization's security and privacy architecture." },
      { id: "SA-20", title: "Customized Development of Critical Components", description: "Re-implement or custom develop critical system components." },
      { id: "SA-21", title: "Developer Screening", description: "Require that the developer of the system screens personnel with access to the system." },
      { id: "SA-22", title: "Unsupported System Components", description: "Replace system components when support for the components is no longer available from the developer." },
    ],
  },
  {
    id: "SC",
    title: "System and Communications Protection",
    description:
      "Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of the systems.",
    controls: [
      { id: "SC-1", title: "Policy and Procedures", description: "Develop, document, and disseminate system and communications protection policy and procedures." },
      { id: "SC-2", title: "Separation of System and User Functionality", description: "Separate user functionality from system management functionality." },
      { id: "SC-3", title: "Security Function Isolation", description: "Isolate security functions from nonsecurity functions." },
      { id: "SC-4", title: "Information in Shared System Resources", description: "Prevent unauthorized and unintended information transfer via shared system resources." },
      { id: "SC-5", title: "Denial-of-service Protection", description: "Protect against or limit the effects of denial-of-service attacks." },
      { id: "SC-7", title: "Boundary Protection", description: "Monitor and control communications at the external managed interfaces to the system and key internal managed interfaces." },
      { id: "SC-8", title: "Transmission Confidentiality and Integrity", description: "Protect the confidentiality and integrity of transmitted information." },
      { id: "SC-10", title: "Network Disconnect", description: "Terminate the network connection associated with a communications session at the end of the session or after a defined period of inactivity." },
      { id: "SC-12", title: "Cryptographic Key Establishment and Management", description: "Establish and manage cryptographic keys when cryptography is employed within the system." },
      { id: "SC-13", title: "Cryptographic Protection", description: "Determine the cryptographic uses and implement the required types of cryptography." },
      { id: "SC-15", title: "Collaborative Computing Devices and Applications", description: "Prohibit remote activation of collaborative computing devices and applications with exceptions." },
      { id: "SC-17", title: "Public Key Infrastructure Certificates", description: "Issue public key certificates under an appropriate certificate policy or obtain public key certificates from an approved service provider." },
      { id: "SC-18", title: "Mobile Code", description: "Define acceptable and unacceptable mobile code and mobile code technologies." },
      { id: "SC-20", title: "Secure Name/Address Resolution Service (Authoritative Source)", description: "Provide additional data origin authentication and integrity verification artifacts along with the authoritative name resolution data." },
      { id: "SC-21", title: "Secure Name/Address Resolution Service (Recursive or Caching Resolver)", description: "Request and perform data origin authentication and data integrity verification on the name/address resolution responses." },
      { id: "SC-22", title: "Architecture and Provisioning for Name/Address Resolution Service", description: "Ensure the systems that collectively provide name/address resolution service are fault-tolerant." },
      { id: "SC-23", title: "Session Authenticity", description: "Protect the authenticity of communications sessions." },
      { id: "SC-24", title: "Fail in Known State", description: "Fail to a known secure state in the event of failures preserving system state information." },
      { id: "SC-25", title: "Thin Nodes", description: "Employ thin nodes for information processing, storage, and transmission." },
      { id: "SC-26", title: "Honeypots", description: "Employ honeypots to detect and deflect unauthorized use or activity." },
      { id: "SC-27", title: "Platform-independent Applications", description: "Include within organizational systems platform-independent applications." },
      { id: "SC-28", title: "Protection of Information at Rest", description: "Protect the confidentiality and integrity of information at rest." },
      { id: "SC-39", title: "Process Isolation", description: "Maintain a separate execution domain for each executing system process." },
      { id: "SC-40", title: "Wireless Link Protection", description: "Protect external and internal wireless links from signal parameter attacks." },
      { id: "SC-41", title: "Port and I/O Device Access", description: "Disable or remove unnecessary physical ports and input/output devices on systems." },
      { id: "SC-42", title: "Sensor Capability and Data", description: "Prohibit the use of devices possessing environmental sensing capabilities in defined facilities." },
      { id: "SC-43", title: "Usage Restrictions", description: "Enforce usage restrictions and implementation guidance on system connections." },
      { id: "SC-44", title: "Detonation Chambers", description: "Employ a detonation chamber capability within the system." },
      { id: "SC-45", title: "System Time Synchronization", description: "Synchronize system clocks within and between systems and system components." },
      { id: "SC-48", title: "Sensor Relocation", description: "Relocate sensors or monitoring capabilities to optimize detection of unauthorized activities." },
      { id: "SC-49", title: "Hardware-enforced Separation and Policy Enforcement", description: "Implement hardware-enforced separation and policy enforcement mechanisms." },
      { id: "SC-50", title: "Software-enforced Separation and Policy Enforcement", description: "Implement software-enforced separation and policy enforcement mechanisms." },
      { id: "SC-51", title: "Hardware-based Protection", description: "Implement hardware-based mechanisms to protect system memory." },
    ],
  },
  {
    id: "SI",
    title: "System and Information Integrity",
    description:
      "Identify, report, and correct information and information system flaws in a timely manner; provide protection from malicious code at appropriate locations within organizational systems.",
    controls: [
      { id: "SI-1", title: "Policy and Procedures", description: "Develop, document, and disseminate system and information integrity policy and procedures." },
      { id: "SI-2", title: "Flaw Remediation", description: "Identify, report, and correct system flaws." },
      { id: "SI-3", title: "Malicious Code Protection", description: "Implement malicious code protection mechanisms at system entry and exit points to detect and eradicate malicious code." },
      { id: "SI-4", title: "System Monitoring", description: "Monitor the system to detect attacks, indicators of potential attacks, and unauthorized connections." },
      { id: "SI-5", title: "Security Alerts, Advisories, and Directives", description: "Receive system security alerts, advisories, and directives from external organizations on an ongoing basis." },
      { id: "SI-6", title: "Security and Privacy Function Verification", description: "Verify the correct operation of security and privacy functions." },
      { id: "SI-7", title: "Software, Firmware, and Information Integrity", description: "Employ integrity verification tools to detect unauthorized changes to software, firmware, and information." },
      { id: "SI-8", title: "Spam Protection", description: "Employ spam protection mechanisms at system entry and exit points." },
      { id: "SI-10", title: "Information Input Validation", description: "Check the validity of information inputs." },
      { id: "SI-11", title: "Error Handling", description: "Generate error messages that provide information necessary for corrective actions without revealing information exploitable by adversaries." },
      { id: "SI-12", title: "Information Management and Retention", description: "Manage and retain information within the system and information output from the system in accordance with applicable laws." },
      { id: "SI-13", title: "Predictable Failure Prevention", description: "Determine mean time to failure for system components and take proactive steps to maintain system availability." },
      { id: "SI-14", title: "Non-persistence", description: "Implement non-persistent system components and services that are initiated in a known state and terminated at the end of the session." },
      { id: "SI-15", title: "Information Output Filtering", description: "Validate information output from software programs to ensure that the information is consistent with the expected content." },
      { id: "SI-16", title: "Memory Protection", description: "Implement security safeguards to protect the system memory from unauthorized code execution." },
      { id: "SI-17", title: "Fail-safe Procedures", description: "Implement fail-safe procedures when a failure occurs in the system." },
      { id: "SI-18", title: "Personally Identifiable Information Quality Operations", description: "Check for and correct inaccurate or outdated personally identifiable information." },
      { id: "SI-19", title: "De-identification", description: "Remove personally identifiable information elements from datasets to enable safe processing." },
      { id: "SI-20", title: "Tainting", description: "Embed data or capabilities in systems that allow for the detection of unauthorized or altered data." },
      { id: "SI-21", title: "Information Refresh", description: "Refresh information at defined frequencies to ensure that the information is current." },
      { id: "SI-22", title: "Information Diversity", description: "Employ diverse sources of information as input to decisions based on the information." },
      { id: "SI-23", title: "Information Fragmentation", description: "Fragment information based on characteristics of the information to achieve defined objectives." },
    ],
  },
  {
    id: "SR",
    title: "Supply Chain Risk Management",
    description:
      "Manage supply chain risks to organizational systems and system components by developing a plan, establishing policies, and implementing processes to identify, assess, and mitigate supply chain risks.",
    controls: [
      { id: "SR-1", title: "Policy and Procedures", description: "Develop, document, and disseminate supply chain risk management policy and procedures." },
      { id: "SR-2", title: "Supply Chain Risk Management Plan", description: "Develop a plan for managing supply chain risks associated with the research, design, manufacturing, acquisition, delivery, integration, operations, and disposal of systems." },
      { id: "SR-3", title: "Supply Chain Controls and Processes", description: "Establish a process to identify and address weaknesses or deficiencies in the supply chain elements and processes." },
      { id: "SR-4", title: "Provenance", description: "Document, monitor, and maintain valid provenance of systems, system components, and associated data." },
      { id: "SR-5", title: "Acquisition Strategies, Tools, and Methods", description: "Employ acquisition strategies, contract tools, and procurement methods to protect against, identify, and mitigate supply chain risks." },
      { id: "SR-6", title: "Supplier Assessments and Reviews", description: "Assess and review the supply chain-related risks associated with suppliers or contractors." },
      { id: "SR-7", title: "Supply Chain Operations Security", description: "Employ operations security controls and measures to protect supply chain elements and processes." },
      { id: "SR-8", title: "Notification Agreements", description: "Establish agreements and procedures with entities involved in the supply chain for notification of supply chain compromises." },
      { id: "SR-9", title: "Tamper Resistance and Detection", description: "Implement a tamper protection program for the system, system component, or system service." },
      { id: "SR-10", title: "Inspection of Systems or Components", description: "Inspect systems or system components to detect tampering." },
      { id: "SR-11", title: "Component Authenticity", description: "Develop and implement anti-counterfeit policy and procedures to detect and prevent counterfeit components." },
      { id: "SR-12", title: "Component Disposal", description: "Dispose of system components using defined disposal techniques and methods." },
    ],
  },
];

/**
 * Lookup a NIST 800-53 control by its ID (e.g. "AC-2", "SI-4").
 * Returns the title and description if found.
 */
export function lookupNIST80053Control(controlId: string): {
  title: string;
  description: string;
  parentTitle?: string;
} | null {
  // Try to find as a top-level family
  const topLevel = NIST_800_53_CONTROLS.find((f) => f.id === controlId);
  if (topLevel) {
    return { title: topLevel.title, description: topLevel.description };
  }

  // Try to find as a control within a family
  for (const family of NIST_800_53_CONTROLS) {
    const control = family.controls?.find((c) => c.id === controlId);
    if (control) {
      return {
        title: control.title,
        description: control.description,
        parentTitle: family.title,
      };
    }
  }

  // Try to match by prefix (e.g., "AC-2.1" -> family "AC")
  const familyId = getControlFamily(controlId);
  const family = NIST_800_53_CONTROLS.find((f) => f.id === familyId);
  if (family) {
    return {
      title: `Control ${controlId}`,
      description: `Control in family: ${family.title}`,
      parentTitle: family.title,
    };
  }

  return null;
}

/**
 * Get the control family from a control ID.
 * e.g. "AC-2" -> "AC", "SI-4" -> "SI", "AU-6.1" -> "AU"
 * The family ID is the alphabetic prefix before the dash.
 */
export function getControlFamily(controlId: string): string {
  const dashIdx = controlId.indexOf("-");
  if (dashIdx > 0) {
    return controlId.substring(0, dashIdx);
  }
  return controlId;
}
