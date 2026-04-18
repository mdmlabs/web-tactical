import type { GDPRArticleMeta } from "@/types/gdpr";

/**
 * GDPR (General Data Protection Regulation) article descriptions.
 * Used to display human-readable labels in the Compliance UI.
 */
export const GDPR_ARTICLES: GDPRArticleMeta[] = [
  {
    id: "5",
    title: "Article 5: Principles relating to processing of personal data",
    description:
      "Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject. It must be collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes.",
    subArticles: [
      { id: "5.1.a", title: "Lawfulness, fairness and transparency", description: "Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject." },
      { id: "5.1.b", title: "Purpose limitation", description: "Personal data shall be collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes." },
      { id: "5.1.c", title: "Data minimisation", description: "Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed." },
      { id: "5.1.d", title: "Accuracy", description: "Personal data shall be accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate are erased or rectified without delay." },
      { id: "5.1.e", title: "Storage limitation", description: "Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed." },
      { id: "5.1.f", title: "Integrity and confidentiality", description: "Personal data shall be processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures." },
      { id: "5.2", title: "Accountability", description: "The controller shall be responsible for, and be able to demonstrate compliance with, the principles relating to processing of personal data." },
    ],
  },
  {
    id: "6",
    title: "Article 6: Lawfulness of processing",
    description:
      "Processing shall be lawful only if and to the extent that at least one of the specified legal bases applies, including consent, contract performance, legal obligation, vital interests, public interest, or legitimate interests.",
    subArticles: [
      { id: "6.1", title: "Legal bases for processing", description: "Processing shall be lawful only if and to the extent that at least one of the following applies: consent, contract, legal obligation, vital interests, public task, or legitimate interests." },
      { id: "6.2", title: "Member State law basis", description: "Member States may maintain or introduce more specific provisions to adapt the application of the rules of this Regulation with regard to processing for compliance with points (c) and (e) of paragraph 1." },
    ],
  },
  {
    id: "7",
    title: "Article 7: Conditions for consent",
    description:
      "Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented to processing of his or her personal data.",
    subArticles: [
      { id: "7.1", title: "Demonstrable consent", description: "Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented to processing of his or her personal data." },
      { id: "7.2", title: "Distinguishable consent request", description: "If the data subject's consent is given in the context of a written declaration which also concerns other matters, the request for consent shall be presented in a manner which is clearly distinguishable from the other matters." },
      { id: "7.3", title: "Right to withdraw consent", description: "The data subject shall have the right to withdraw his or her consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal." },
    ],
  },
  {
    id: "12",
    title: "Article 12: Transparent information, communication and modalities",
    description:
      "The controller shall take appropriate measures to provide any information and any communication relating to processing to the data subject in a concise, transparent, intelligible and easily accessible form, using clear and plain language.",
    subArticles: [
      { id: "12.1", title: "Transparent communication", description: "The controller shall take appropriate measures to provide information in a concise, transparent, intelligible and easily accessible form, using clear and plain language." },
      { id: "12.2", title: "Facilitating exercise of rights", description: "The controller shall facilitate the exercise of data subject rights under Articles 15 to 22." },
      { id: "12.3", title: "Timely response", description: "The controller shall provide information on action taken on a request under Articles 15 to 22 to the data subject without undue delay and in any event within one month of receipt of the request." },
    ],
  },
  {
    id: "13",
    title: "Article 13: Information to be provided where personal data are collected from the data subject",
    description:
      "Where personal data relating to a data subject are collected from the data subject, the controller shall, at the time when personal data are obtained, provide the data subject with specified information.",
    subArticles: [
      { id: "13.1", title: "Information at time of collection", description: "Where personal data relating to a data subject are collected from the data subject, the controller shall provide identity and contact details, purposes and legal basis, recipients, and transfer information." },
      { id: "13.2", title: "Additional information for fair processing", description: "In addition to the information referred to in paragraph 1, the controller shall provide the data subject with information about retention period, rights, automated decision-making, etc." },
    ],
  },
  {
    id: "14",
    title: "Article 14: Information to be provided where personal data have not been obtained from the data subject",
    description:
      "Where personal data have not been obtained from the data subject, the controller shall provide the data subject with specified information within a reasonable period.",
    subArticles: [
      { id: "14.1", title: "Information when data not collected from subject", description: "Where personal data have not been obtained from the data subject, the controller shall provide the data subject with identity, purposes, categories of data, and recipients." },
      { id: "14.2", title: "Additional information", description: "In addition to the information referred to in paragraph 1, the controller shall provide the data subject with information about retention period, legitimate interests, rights, source, and automated decision-making." },
    ],
  },
  {
    id: "15",
    title: "Article 15: Right of access by the data subject",
    description:
      "The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data concerning him or her are being processed, and, where that is the case, access to the personal data.",
    subArticles: [
      { id: "15.1", title: "Right of access", description: "The data subject shall have the right to obtain from the controller confirmation as to whether personal data concerning him or her are being processed, and access to the data and specified information." },
      { id: "15.2", title: "Right to copy", description: "The controller shall provide a copy of the personal data undergoing processing. For any further copies requested by the data subject, the controller may charge a reasonable fee." },
    ],
  },
  {
    id: "17",
    title: "Article 17: Right to erasure ('right to be forgotten')",
    description:
      "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data without undue delay where specified grounds apply.",
    subArticles: [
      { id: "17.1", title: "Right to erasure", description: "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay where the data is no longer necessary, consent is withdrawn, the subject objects, or data was unlawfully processed." },
      { id: "17.2", title: "Inform other controllers", description: "Where the controller has made the personal data public, the controller shall take reasonable steps to inform controllers which are processing the personal data that the data subject has requested erasure." },
    ],
  },
  {
    id: "25",
    title: "Article 25: Data protection by design and by default",
    description:
      "The controller shall implement appropriate technical and organisational measures designed to implement data-protection principles and integrate the necessary safeguards into the processing.",
    subArticles: [
      { id: "25.1", title: "Data protection by design", description: "The controller shall implement appropriate technical and organisational measures, such as pseudonymisation, designed to implement data-protection principles in an effective manner and to integrate the necessary safeguards into the processing." },
      { id: "25.2", title: "Data protection by default", description: "The controller shall implement appropriate technical and organisational measures for ensuring that, by default, only personal data which are necessary for each specific purpose of the processing are processed." },
    ],
  },
  {
    id: "30",
    title: "Article 30: Records of processing activities",
    description:
      "Each controller and, where applicable, the controller's representative, shall maintain a record of processing activities under its responsibility.",
    subArticles: [
      { id: "30.1", title: "Controller records", description: "Each controller shall maintain a record of processing activities under its responsibility, containing the name and contact details, purposes, categories of data subjects and personal data, recipients, transfers, retention time limits, and security measures." },
      { id: "30.2", title: "Processor records", description: "Each processor shall maintain a record of all categories of processing activities carried out on behalf of a controller." },
    ],
  },
  {
    id: "32",
    title: "Article 32: Security of processing",
    description:
      "Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing, the controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.",
    subArticles: [
      { id: "32.1", title: "Appropriate security measures", description: "The controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including pseudonymisation and encryption, ability to ensure confidentiality, integrity, availability and resilience, ability to restore availability and access, and process for regularly testing and evaluating effectiveness." },
      { id: "32.2", title: "Risk-appropriate security", description: "In assessing the appropriate level of security, account shall be taken in particular of the risks that are presented by processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data." },
      { id: "32.3", title: "Testing and evaluating effectiveness", description: "The controller and processor shall take steps to ensure that any natural person acting under the authority of the controller or the processor who has access to personal data does not process them except on instructions from the controller." },
    ],
  },
  {
    id: "33",
    title: "Article 33: Notification of a personal data breach to the supervisory authority",
    description:
      "In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the personal data breach to the supervisory authority.",
    subArticles: [
      { id: "33.1", title: "Notification to supervisory authority", description: "In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the personal data breach to the supervisory authority competent." },
      { id: "33.2", title: "Processor notification to controller", description: "The processor shall notify the controller without undue delay after becoming aware of a personal data breach." },
      { id: "33.3", title: "Information in notification", description: "The notification shall describe the nature of the personal data breach, the contact point, the likely consequences, and the measures taken or proposed to address the breach." },
      { id: "33.4", title: "Documentation of breaches", description: "The controller shall document any personal data breaches, comprising the facts relating to the personal data breach, its effects and the remedial action taken." },
    ],
  },
  {
    id: "34",
    title: "Article 34: Communication of a personal data breach to the data subject",
    description:
      "When the personal data breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the personal data breach to the data subject without undue delay.",
    subArticles: [
      { id: "34.1", title: "Communication to data subject", description: "When the personal data breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the personal data breach to the data subject without undue delay." },
      { id: "34.2", title: "Communication in clear language", description: "The communication to the data subject shall describe in clear and plain language the nature of the personal data breach and contain the recommendations for the data subject." },
    ],
  },
  {
    id: "35",
    title: "Article 35: Data protection impact assessment",
    description:
      "Where a type of processing in particular using new technologies, and taking into account the nature, scope, context and purposes of the processing, is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall carry out an assessment of the impact of the envisaged processing operations on the protection of personal data.",
    subArticles: [
      { id: "35.1", title: "Impact assessment required", description: "Where a type of processing is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall, prior to the processing, carry out an assessment of the impact of the envisaged processing operations on the protection of personal data." },
      { id: "35.2", title: "Seek DPO advice", description: "The controller shall seek the advice of the data protection officer, where designated, when carrying out a data protection impact assessment." },
      { id: "35.3", title: "Assessment required cases", description: "A data protection impact assessment shall in particular be required in the case of a systematic and extensive evaluation, processing on a large scale of special categories, or systematic monitoring of a publicly accessible area on a large scale." },
    ],
  },
];

/**
 * Lookup a GDPR article or sub-article by its ID (e.g. "32.1", "5.1.f").
 * Returns the title and description if found.
 */
export function lookupGDPRArticle(articleId: string): {
  title: string;
  description: string;
  parentTitle?: string;
} | null {
  // Try to find as a top-level article
  const topLevel = GDPR_ARTICLES.find((a) => a.id === articleId);
  if (topLevel) {
    return { title: topLevel.title, description: topLevel.description };
  }

  // Try to find as a sub-article
  for (const article of GDPR_ARTICLES) {
    const sub = article.subArticles?.find((s) => s.id === articleId);
    if (sub) {
      return {
        title: sub.title,
        description: sub.description,
        parentTitle: article.title,
      };
    }
  }

  // Try to match by prefix (e.g., "32.1" -> parent "32")
  const parentId = articleId.split(".")[0];
  const parent = GDPR_ARTICLES.find((a) => a.id === parentId);
  if (parent) {
    return {
      title: `Article ${articleId}`,
      description: `Sub-article of: ${parent.title}`,
      parentTitle: parent.title,
    };
  }

  return null;
}

/**
 * Get the parent article ID from a sub-article ID.
 * e.g. "32.1" -> "32", "5.1.f" -> "5"
 */
export function getParentArticleId(articleId: string): string {
  return articleId.split(".")[0];
}
