import type {
  GPOPolicy,
  GPOPolicyTree,
  GPOPolicyDetails,
  GPOPolicySetting,
} from "../types/gpo";

interface PolicySummary {
  id: number;
  name: string;
  display_name: string;
  explain_text?: string;
}

interface PolicyGroup {
  scope: string;
  policies?: PolicySummary[];
  policiesList?: PolicySummary[];
}

interface CategoryView {
  id: number;
  category_name?: string;
  categoryName?: string;
  display_name?: string;
  displayName?: string;
  childs?: CategoryView[];
  childsList?: CategoryView[];
}

interface PolicyDetails {
  policy: {
    id: number;
    name: string;
    hash: string;
    scope: string;
    parent_category_ref?: string;
    supported_on_ref?: string;
  };
  presentation?: {
    id: number;
    presentation_id: string;
    elements?: unknown[];
  };
  policy_elements?: Array<{
    id: number;
    element_id: string;
    type: string;
    value_name?: string;
    registry_key?: string;
    items?: Array<{
      id: number;
      name: string;
      display_name?: string;
    }>;
  }>;
}

export interface ListPoliciesGroupedByScopeResponse {
  groups: PolicyGroup[] | unknown[];
}

export interface GetCategoryTreeResponse {
  lang_code: string;
  categories: CategoryView[] | unknown[];
}

function policySummaryToGPOPolicy(summary: PolicySummary | Record<string, unknown>): GPOPolicy {
  const id = (summary as { id?: number }).id;
  const name = (summary as { name?: string }).name || "";
  const displayName =
    (summary as { display_name?: string; displayName?: string }).display_name ||
    (summary as { display_name?: string; displayName?: string }).displayName ||
    name;
  const explainText =
    (summary as { explain_text?: string; explainText?: string }).explain_text ||
    (summary as { explain_text?: string; explainText?: string }).explainText;

  return {
    id: String(id || ""),
    name: name,
    displayName: displayName,
    path: `CN={${id}},CN=Policies,CN=System`,
    enabled: true,
    description: explainText,
  };
}

export function adaptPoliciesFromGroups(
  response: ListPoliciesGroupedByScopeResponse,
): GPOPolicy[] {
  const policies: GPOPolicy[] = [];


  for (const group of response.groups || []) {
    if (group && typeof group === "object") {
      const policyGroup = group as PolicyGroup;
      const policiesArray = policyGroup.policiesList || policyGroup.policies || [];


      if (Array.isArray(policiesArray)) {
        for (const policy of policiesArray) {
          policies.push(policySummaryToGPOPolicy(policy));
        }
      }
    }
  }

  return policies;
}

export function adaptCategoryTreeToPolicyTree(
  response: GetCategoryTreeResponse,
): GPOPolicyTree {

  const convertCategory = (
    category: CategoryView | Record<string, unknown>,
    parentPath = "",
  ): GPOPolicyTree => {
    const categoryName =
      (category as CategoryView).categoryName ||
      (category as CategoryView).category_name ||
      "";
    const displayName =
      (category as CategoryView).displayName ||
      (category as CategoryView).display_name ||
      categoryName;
    const childsList =
      (category as CategoryView).childsList ||
      (category as CategoryView).childs ||
      [];

    const path = parentPath
      ? `${parentPath}/${categoryName}`
      : categoryName;

    const node: GPOPolicyTree = {
      id: `category-${(category as { id?: number }).id || ""}`,
      name: displayName,
      path: path,
      children: [],
    };

    if (Array.isArray(childsList) && childsList.length > 0) {
      node.children = childsList.map((child) =>
        convertCategory(child as CategoryView, path),
      );
    }

    return node;
  };

  const categories = (response.categories || []).filter(
    (cat): cat is CategoryView | Record<string, unknown> =>
      cat !== null &&
      typeof cat === "object" &&
      ("id" in cat || "categoryName" in cat || "category_name" in cat),
  );


  const root: GPOPolicyTree = {
    id: "root",
    name: "GPO Policies",
    path: "",
    children: categories.map((cat) => convertCategory(cat)),
  };

  return root;
}

export function adaptPolicyDetails(response: PolicyDetails): GPOPolicyDetails {
  const policy = response.policy;

  const settings: GPOPolicySetting[] = (response.policy_elements || []).map(
    (element) => ({
      id: `element-${element.id}`,
      name: element.element_id,
      path: element.registry_key || "",
      value: element.value_name || "",
      type: element.type,
      description: element.items?.[0]?.display_name,
    }),
  );

  return {
    id: String(policy.id),
    name: policy.name,
    displayName: policy.name,
    path: `CN={${policy.hash}},CN=Policies,CN=System`,
    enabled: true,
    description: policy.supported_on_ref,
    settings: settings,
  };
}

export function adaptPolicySummaryToDetails(
  summary: PolicySummary,
): GPOPolicyDetails {
  return {
    id: String(summary.id),
    name: summary.name,
    displayName: summary.display_name || summary.name,
    path: `CN={${summary.id}},CN=Policies,CN=System`,
    enabled: true,
    description: summary.explain_text,
    settings: [],
  };
}
