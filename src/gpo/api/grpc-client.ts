import * as grpcWeb from "grpc-web";
import {
  AgentServiceClient,
  CollectionsControlServiceClient,
  UserServiceClient,
  AdmxServiceClient,
  PolicyCatalogServiceClient,
  PolicyAssignmentServiceClient,
  PolicyStateServiceClient,
} from "@/generated/OperatorServiceClientPb";
import { OperatorUserControlServiceClient } from "@/generated/User_serviceServiceClientPb";

import operator_pb from "@/generated/operator_pb";
import {
  UpdateUserRequest,
  UserIdentifier,
  CreateUserRequest,
  EnableUserRequest,
  SetUserPasswordRequest,
  SetUserAccountExpirationRequest,
  SetGroupChildGroupsRequest,
  CreateUserGroupRequest,
  GroupIdRequest,
  GroupRequest,
  UserGroupRequest,
  UserGroupTarget,
  UserIdRequest,
} from "@/generated/user_service_pb";

import type * as operator_pb_types from "@/generated/operator_pb";
import type * as user_service_pb_types from "@/generated/user_service_pb";
import * as wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb";
import * as empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { useAuthStore } from "@/stores/auth";
import {
  GroupInfo,
  UserInfo,
  UserRequest as CommonUserRequest,
} from "@/generated/common/user_pb";





// interface WindowWithEnv extends Window {
//   _env_?: {
//     GRPC_URL?: string;
//   };
// }

interface WindowWithEnv {
  _env_?: {
    GRPC_URL?: string;
  };
}

function getGrpcUrl(): string {
  if (import.meta.env.DEV) {
    return "/api/grpc";
  }

  const viteEnv = import.meta.env.VITE_GRPC_URL;
  const windowEnv = (globalThis.window as WindowWithEnv)?._env_?.GRPC_URL;
  const fallback = "https://mesh-stage.rmadm.org:5000";

  const grpcUrl = viteEnv || windowEnv || fallback;

  return grpcUrl.replace(/\/$/, "");
}

export function createGrpcMetadata(): grpcWeb.Metadata {
  const authStore = useAuthStore();
  const metadata: grpcWeb.Metadata = {};

  if (authStore.token) {
    metadata["authorization"] = `Bearer ${authStore.token}`;
  }

  return metadata;
}

function createClient<
  T extends new (
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: unknown },
  ) => InstanceType<T>,
>(ClientClass: T, options?: { [index: string]: unknown }): InstanceType<T> {
  const url = getGrpcUrl();
  const clientOptions = {
    ...options,
  };

  return new ClientClass(url, null, clientOptions);
}

const agentServiceClient = createClient(AgentServiceClient);
const collectionsControlServiceClient = createClient(
  CollectionsControlServiceClient,
);
const userServiceClient = createClient(UserServiceClient);
const operatorUserControlServiceClient = createClient(
  OperatorUserControlServiceClient,
);
const admxServiceClient = createClient(AdmxServiceClient);
const policyCatalogServiceClient = createClient(PolicyCatalogServiceClient);
const policyAssignmentServiceClient = createClient(
  PolicyAssignmentServiceClient,
);
const policyStateServiceClient = createClient(PolicyStateServiceClient);

export const policyCatalogClient = {
  async listPoliciesGroupedByScope(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.ListPoliciesGroupedByScopeResponse.AsObject> {
    if (!operator_pb.ListPoliciesGroupedByScopeRequest) {
      throw new Error(
        "ListPoliciesGroupedByScopeRequest class is not available in operator_pb",
      );
    }
    const request = new operator_pb.ListPoliciesGroupedByScopeRequest();
    request.setLangCode(langCode);

    const response =
      await policyCatalogServiceClient.listPoliciesGroupedByScope(
        request,
        createGrpcMetadata(),
      );

    return response.toObject();
  },

  async getCategoryTree(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetCategoryTreeResponse.AsObject> {
    const request = new operator_pb.GetCategoryTreeRequest();
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getCategoryTree(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async listPolicies(
    admxFileHash: string,
  ): Promise<operator_pb_types.ListPoliciesResponse.AsObject> {
    const request = new operator_pb.ListPoliciesRequest();
    request.setAdmxFileHash(admxFileHash);

    const response = await policyCatalogServiceClient.listPolicies(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPolicy(
    policyHash: string,
  ): Promise<operator_pb_types.PolicyDescriptor.AsObject> {
    const request = new operator_pb.GetPolicyRequest();
    request.setPolicyHash(policyHash);

    const response = await policyCatalogServiceClient.getPolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPolicyDetails(
    policyId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.PolicyDetails.AsObject> {
    const request = new operator_pb.GetPolicyDetailsRequest();
    request.setPolicyId(policyId);
    request.setLangCode(langCode);

    try {
      const response = await policyCatalogServiceClient.getPolicyDetails(
        request,
        createGrpcMetadata(),
      );

      return response.toObject();
    } catch (error) {
      throw error;
    }
  },

  async getPoliciesByCategory(
    category: string,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesByCategoryResponse.AsObject> {
    const request = new operator_pb.GetPoliciesByCategoryRequest();
    request.setCategory(category);
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getPoliciesByCategory(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPoliciesByAdmx(
    admxFile: string,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesByAdmxResponse.AsObject> {
    const request = new operator_pb.GetPoliciesByAdmxRequest();
    request.setAdmxFile(admxFile);
    request.setLangCode(langCode);

    const response = await policyCatalogServiceClient.getPoliciesByAdmx(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export const agentServiceClientWrapper = {
  async listAgents(
    allowedAgentIds?: string[],
  ): Promise<operator_pb_types.ListAgentsResponse.AsObject> {
    if (!operator_pb.ListAgentsRequest) {
      throw new Error(
        "ListAgentsRequest class is not available in operator_pb",
      );
    }
    const request = new operator_pb.ListAgentsRequest();

    const response = await agentServiceClient.listAgents(
      request,
      createGrpcMetadata(),
    );

    const result = response.toObject();

    if (allowedAgentIds && allowedAgentIds.length > 0) {
      const allowedSet = new Set(allowedAgentIds);
      const agentsList = result.agentsList || [];
      result.agentsList = agentsList.filter((agent) => {
        const agentId = agent.agentId || "";
        return allowedSet.has(agentId);
      });
    }

    return result;
  },

  async getAgent(
    agentId: string,
  ): Promise<operator_pb_types.AgentDetails.AsObject> {
    const request = new operator_pb.GetAgentRequest();
    request.setAgentId(agentId);

    try {
      const response = await agentServiceClient.getAgent(
        request,
        createGrpcMetadata(),
      );
      return response.toObject();
    } catch (err) {
      console.error("getAgent error:", err);
      throw err;
    }
  },
};

export const userClient = {
  async listUsersForAgent(agentId: string): Promise<UserInfo.AsObject[]> {
    const request = new operator_pb.ListUsersForAgentRequest();
    request.setAgentId(agentId);
    const response = await userServiceClient.listUsersForAgent(
      request,
      createGrpcMetadata(),
    );

    try {
      const responseObj = response.toObject();
      return responseObj.usersList || [];
    } catch (error) {
      console.warn(
        "Error deserializing users response, using manual extraction:",
        error,
      );
      const usersList = response.getUsersList?.() || [];
      return usersList.map((user) => {
        try {
          return user.toObject();
        } catch {
          return user as unknown as UserInfo.AsObject;
        }
      });
    }
  },

  async listUserGroupsForAgent(agentId: string): Promise<GroupInfo.AsObject[]> {
    const request = new operator_pb.ListUserGroupsForAgentRequest();
    request.setAgentId(agentId);
    const response = await userServiceClient.listUserGroupsForAgent(
      request,
      createGrpcMetadata(),
    );

    const responseObj = response.toObject();
    return responseObj.groupsList || [];
  },
};

export type CreateUserParams = {
  samAccountName: string;
  password?: string;
  displayName?: string;
  description?: string;
  enabled?: boolean;
  passwordNotRequired?: boolean;
  userCannotChangePassword?: boolean;
  smartcardLogonRequired?: boolean;
  accountExpirationDate?: string;
  name?: string;
  middleName?: string;
  surname?: string;
  email?: string;
  homeDirectory?: string;
  scriptPath?: string;
  telephoneNumber?: string;
  employeeId?: string;
};

function setStringWrapper(
  userReq: InstanceType<typeof CommonUserRequest>,
  setter: (v: InstanceType<typeof wrappers_pb.StringValue>) => unknown,
  value: string | undefined,
): void {
  if (value != null && value !== "") {
    const w = new wrappers_pb.StringValue();
    w.setValue(value);
    setter.call(userReq, w);
  }
}

function setBoolWrapper(
  userReq: InstanceType<typeof CommonUserRequest>,
  setter: (v: InstanceType<typeof wrappers_pb.BoolValue>) => unknown,
  value: boolean | undefined,
): void {
  if (value != null) {
    const w = new wrappers_pb.BoolValue();
    w.setValue(value);
    setter.call(userReq, w);
  }
}

function fillUserRequest(
  userReq: InstanceType<typeof CommonUserRequest>,
  data: Partial<CreateUserParams> & { samAccountName: string },
): void {
  userReq.setSamAccountName(data.samAccountName);
  if (data.password != null) userReq.setPassword(data.password);
  setStringWrapper(userReq, userReq.setDisplayName, data.displayName);
  setStringWrapper(userReq, userReq.setDescription, data.description);
  setBoolWrapper(userReq, userReq.setEnabled, data.enabled);
  setBoolWrapper(
    userReq,
    userReq.setPasswordNotRequired,
    data.passwordNotRequired,
  );
  setBoolWrapper(
    userReq,
    userReq.setUserCannotChangePassword,
    data.userCannotChangePassword,
  );
  setBoolWrapper(
    userReq,
    userReq.setSmartcardLogonRequired,
    data.smartcardLogonRequired,
  );
  setStringWrapper(
    userReq,
    userReq.setAccountExpirationDate,
    data.accountExpirationDate,
  );
  setStringWrapper(userReq, userReq.setName, data.name);
  setStringWrapper(userReq, userReq.setMiddleName, data.middleName);
  setStringWrapper(userReq, userReq.setSurname, data.surname);
  setStringWrapper(userReq, userReq.setEmail, data.email);
  setStringWrapper(userReq, userReq.setHomeDirectory, data.homeDirectory);
  setStringWrapper(userReq, userReq.setScriptPath, data.scriptPath);
  setStringWrapper(userReq, userReq.setTelephoneNumber, data.telephoneNumber);
  setStringWrapper(userReq, userReq.setEmployeeId, data.employeeId);
}


function setUserIdentifier(
  uid: UserIdentifier,
  target: UserGroupTarget,
  samId: string,
): void {
  uid.setTarget(target);
  uid.setUserId(samId);
  uid.setSamId(samId);
}

export const userControlClient = {
  async createUser(
    target: UserGroupTarget,
    userData: CreateUserParams,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new CreateUserRequest();
    req.setTarget(target);
    const userReq = new CommonUserRequest();
    fillUserRequest(userReq, userData);
    req.setUser(userReq);
    const response = await operatorUserControlServiceClient.createUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async updateUser(
    target: UserGroupTarget,
    samId: string,
    data: Partial<CreateUserParams>,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UpdateUserRequest();
    const uid = new UserIdentifier();
    setUserIdentifier(uid, target, samId);
    req.setUser(uid);
    const dataReq = new CommonUserRequest();
    fillUserRequest(dataReq, { samAccountName: samId, ...data });
    req.setData(dataReq);
    const response = await operatorUserControlServiceClient.updateUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async deleteUser(
    target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UserIdentifier();
    setUserIdentifier(req, target, samId);
    const response = await operatorUserControlServiceClient.deleteUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async enableUser(
    target: UserGroupTarget,
    samId: string,
    enable: boolean,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new EnableUserRequest();
    const uid = new UserIdentifier();
    setUserIdentifier(uid, target, samId);
    req.setUser(uid);
    req.setEnable(enable);
    const response = await operatorUserControlServiceClient.enableUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async setUserPassword(
    target: UserGroupTarget,
    samId: string,
    newPassword: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new SetUserPasswordRequest();
    const uid = new UserIdentifier();
    setUserIdentifier(uid, target, samId);
    req.setUser(uid);
    req.setNewPassword(newPassword);
    const response = await operatorUserControlServiceClient.setUserPassword(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async unlockUser(
    target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UserIdentifier();
    setUserIdentifier(req, target, samId);
    const response = await operatorUserControlServiceClient.unlockUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async expireUserPassword(
    target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UserIdentifier();
    setUserIdentifier(req, target, samId);
    const response = await operatorUserControlServiceClient.expireUserPassword(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async setUserAccountExpiration(
    target: UserGroupTarget,
    samId: string,
    accountExpirationDate: string | undefined,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new SetUserAccountExpirationRequest();
    const uid = new UserIdentifier();
    setUserIdentifier(uid, target, samId);
    req.setUser(uid);
    if (accountExpirationDate != null) {
      const w = new wrappers_pb.StringValue();
      w.setValue(accountExpirationDate);
      req.setAccountExpirationDate(w);
    }
    const response =
      await operatorUserControlServiceClient.setUserAccountExpiration(
        req,
        createGrpcMetadata(),
      );
    return response.toObject();
  },

  async createGroup(
    target: UserGroupTarget,
    samGroupName: string,
    description?: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new CreateUserGroupRequest();
    req.setTarget(target);
    req.setSamGroupName(samGroupName);
    if (description != null) {
      const w = new wrappers_pb.StringValue();
      w.setValue(description);
      req.setDescription(w);
    }
    const response = await operatorUserControlServiceClient.createGroup(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async deleteGroup(
    target: UserGroupTarget,
    samGroupName: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new GroupRequest();
    req.setTarget(target);
    req.setSamGroupName(samGroupName);
    const response = await operatorUserControlServiceClient.deleteGroup(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async addUserToGroup(
    target: UserGroupTarget,
    samGroupName: string,
    samAccountName: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UserGroupRequest();
    req.setTarget(target);
    req.setSamGroupName(samGroupName);
    req.setSamAccountName(samAccountName);
    const response = await operatorUserControlServiceClient.addUserToGroup(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async removeUserFromGroup(
    target: UserGroupTarget,
    samGroupName: string,
    samAccountName: string,
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new UserGroupRequest();
    req.setTarget(target);
    req.setSamGroupName(samGroupName);
    req.setSamAccountName(samAccountName);
    const response = await operatorUserControlServiceClient.removeUserFromGroup(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getUserEffectiveAgents(
    _target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserAgentsResponse.AsObject> {
    const req = new UserIdRequest();
    req.setUserid(samId);
    const response =
      await operatorUserControlServiceClient.getUserEffectiveAgents(
        req,
        createGrpcMetadata(),
      );
    return response.toObject();
  },

  async setGroupChildGroups(
    groupId: string,
    childGroupIds: string[],
  ): Promise<user_service_pb_types.UserControlResponse.AsObject> {
    const req = new SetGroupChildGroupsRequest();
    const gr = new GroupIdRequest();
    gr.setGroupid(groupId);
    req.setGroup(gr);
    req.setChildGroupIdsList(childGroupIds);
    const response =
      await operatorUserControlServiceClient.setGroupChildGroups(
        req,
        createGrpcMetadata(),
      );
    return response.toObject();
  },

  async getUser(
    _target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserResponse.AsObject> {
    const req = new UserIdRequest();
    req.setUserid(samId);
    const response = await operatorUserControlServiceClient.getUser(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getAllUsers(): Promise<user_service_pb_types.UsersResponse.AsObject> {
    const request = new empty_pb.Empty();
    const response = await operatorUserControlServiceClient.getAllUsers(
      request,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getUserGroups(
    _target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.GroupListResponse.AsObject> {
    const req = new UserIdRequest();
    req.setUserid(samId);
    const response = await operatorUserControlServiceClient.getUserGroups(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getUserAgents(
    _target: UserGroupTarget,
    samId: string,
  ): Promise<user_service_pb_types.UserAgentsResponse.AsObject> {
    const req = new UserIdRequest();
    req.setUserid(samId);
    const response = await operatorUserControlServiceClient.getUserAgents(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getGroup(
    groupId: string,
  ): Promise<user_service_pb_types.GroupResponse.AsObject> {
    const req = new GroupIdRequest();
    req.setGroupid(groupId);
    const response = await operatorUserControlServiceClient.getGroup(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getAllGroups(): Promise<user_service_pb_types.GroupsResponse.AsObject> {
    const request = new empty_pb.Empty();
    const response = await operatorUserControlServiceClient.getAllGroups(
      request,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getGroupTree(): Promise<user_service_pb_types.GroupTreeResponse.AsObject> {
    const request = new empty_pb.Empty();
    const response = await operatorUserControlServiceClient.getGroupTree(
      request,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getGroupUsers(
    groupId: string,
  ): Promise<user_service_pb_types.UserListResponse.AsObject> {
    const req = new GroupIdRequest();
    req.setGroupid(groupId);
    const response = await operatorUserControlServiceClient.getGroupUsers(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getGroupAgents(
    groupId: string,
  ): Promise<user_service_pb_types.AgentListResponse.AsObject> {
    const req = new GroupIdRequest();
    req.setGroupid(groupId);
    const response = await operatorUserControlServiceClient.getGroupAgents(
      req,
      createGrpcMetadata(),
    );
    return response.toObject();
  },

  async getGroupChildGroups(
    groupId: string,
  ): Promise<user_service_pb_types.GroupListResponse.AsObject> {
    const req = new GroupIdRequest();
    req.setGroupid(groupId);
    const response =
      await operatorUserControlServiceClient.getGroupChildGroups(
        req,
        createGrpcMetadata(),
      );
    return response.toObject();
  },

  async getGroupParentGroups(
    groupId: string,
  ): Promise<user_service_pb_types.GroupListResponse.AsObject> {
    const req = new GroupIdRequest();
    req.setGroupid(groupId);
    const response =
      await operatorUserControlServiceClient.getGroupParentGroups(
        req,
        createGrpcMetadata(),
      );
    return response.toObject();
  },
};

export function createGlobalTarget(): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const globalTarget = new operator_pb.GlobalTarget();
  target.setGlobal(globalTarget);
  return target;
}

export function createAgentTarget(agentId: string): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const agentTarget = new operator_pb.AgentTarget();
  agentTarget.setAgentId(agentId);
  target.setAgent(agentTarget);
  return target;
}


export function createUserGroupTargetForAgent(agentId: string): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const agentTarget = new operator_pb.AgentTarget();
  agentTarget.setAgentId(agentId);
  ugTarget.setAgent(agentTarget);
  return ugTarget;
}

export function createUserGroupTargetForUser(
  agentId: string,
  userSid: string,
): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const userTarget = new operator_pb.UserTarget();
  userTarget.setAgentId(agentId);
  userTarget.setUserSid(userSid);
  ugTarget.setUser(userTarget);
  return ugTarget;
}

export function createUserGroupTargetGlobal(): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  ugTarget.setGlobal(new operator_pb.GlobalTarget());
  return ugTarget;
}

export function createUserGroupTargetForClient(clientId: string): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const clientTarget = new operator_pb.TacticalClientTarget();
  clientTarget.setClientId(clientId);
  ugTarget.setClient(clientTarget);
  return ugTarget;
}

export function createUserGroupTargetForClients(
  clientIds: string[],
): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const clientsTarget = new operator_pb.TacticalClientsTarget();
  clientsTarget.setClientsList(
    clientIds.map((id) => {
      const c = new operator_pb.TacticalClientTarget();
      c.setClientId(id);
      return c;
    }),
  );
  ugTarget.setClients(clientsTarget);
  return ugTarget;
}

export function createUserGroupTargetForSite(siteId: string): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const siteTarget = new operator_pb.TacticalSiteTarget();
  siteTarget.setSiteId(siteId);
  ugTarget.setSite(siteTarget);
  return ugTarget;
}

export function createUserGroupTargetForSites(
  siteIds: string[],
): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const sitesTarget = new operator_pb.TacticalSitesTarget();
  sitesTarget.setSitesList(
    siteIds.map((id) => {
      const s = new operator_pb.TacticalSiteTarget();
      s.setSiteId(id);
      return s;
    }),
  );
  ugTarget.setSites(sitesTarget);
  return ugTarget;
}

export function createUserGroupTargetForAgents(
  agentIds: string[],
): UserGroupTarget {
  const ugTarget = new UserGroupTarget();
  const agentsTarget = new operator_pb.AggentsTarget();
  agentsTarget.setAgentsList(
    agentIds.map((id) => {
      const a = new operator_pb.AgentTarget();
      a.setAgentId(id);
      return a;
    }),
  );
  ugTarget.setAgents(agentsTarget);
  return ugTarget;
}

export function createUserGroupTargetCombined(params: {
  clientIds?: string[];
  siteIds?: string[];
  agentIds?: string[];
}): UserGroupTarget {
  const { clientIds = [], siteIds = [], agentIds = [] } = params;
  const combined = new operator_pb.CombinedTarget();
  if (clientIds.length > 0) {
    const clientsTarget = new operator_pb.TacticalClientsTarget();
    clientsTarget.setClientsList(
      clientIds.map((id) => {
        const c = new operator_pb.TacticalClientTarget();
        c.setClientId(id);
        return c;
      }),
    );
    combined.setClients(clientsTarget);
  }
  if (siteIds.length > 0) {
    const sitesTarget = new operator_pb.TacticalSitesTarget();
    sitesTarget.setSitesList(
      siteIds.map((id) => {
        const s = new operator_pb.TacticalSiteTarget();
        s.setSiteId(id);
        return s;
      }),
    );
    combined.setSites(sitesTarget);
  }
  if (agentIds.length > 0) {
    const agentsTarget = new operator_pb.AggentsTarget();
    agentsTarget.setAgentsList(
      agentIds.map((id) => {
        const a = new operator_pb.AgentTarget();
        a.setAgentId(id);
        return a;
      }),
    );
    combined.setAgents(agentsTarget);
  }
  const ugTarget = new UserGroupTarget();
  ugTarget.setCombined(combined);
  return ugTarget;
}

export type UserGroupTargetType =
  | "global"
  | "agent"
  | "user"
  | "client"
  | "site"
  | "clients"
  | "sites"
  | "agents"
  | "combined";

export type UserGroupTargetParams = {
  agentId?: string;
  userSid?: string;
  clientId?: string;
  siteId?: string;
  clientIds?: string[];
  siteIds?: string[];
  agentIds?: string[];
};

export function createUserGroupTargetFromParams(
  targetType: UserGroupTargetType,
  targetParams: UserGroupTargetParams = {},
): UserGroupTarget {
  switch (targetType) {
    case "global":
      return createUserGroupTargetGlobal();
    case "agent":
      if (!targetParams.agentId) {
        throw new Error("agentId обязателен для типа 'agent'");
      }
      return createUserGroupTargetForAgent(targetParams.agentId);
    case "user":
      if (!targetParams.agentId || !targetParams.userSid) {
        throw new Error("agentId и userSid обязательны для типа 'user'");
      }
      return createUserGroupTargetForUser(
        targetParams.agentId,
        targetParams.userSid,
      );
    case "client":
      if (!targetParams.clientId) {
        throw new Error("clientId обязателен для типа 'client'");
      }
      return createUserGroupTargetForClient(targetParams.clientId);
    case "site":
      if (!targetParams.siteId) {
        throw new Error("siteId обязателен для типа 'site'");
      }
      return createUserGroupTargetForSite(targetParams.siteId);
    case "clients":
      return createUserGroupTargetForClients(targetParams.clientIds ?? []);
    case "sites":
      return createUserGroupTargetForSites(targetParams.siteIds ?? []);
    case "agents":
      return createUserGroupTargetForAgents(targetParams.agentIds ?? []);
    case "combined":
      return createUserGroupTargetCombined({
        clientIds: targetParams.clientIds,
        siteIds: targetParams.siteIds,
        agentIds: targetParams.agentIds,
      });
    default:
      throw new Error(`Неизвестный тип цели: ${targetType}`);
  }
}

export function createUserTarget(
  agentId: string,
  userSid: string,
): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const userTarget = new operator_pb.UserTarget();
  userTarget.setAgentId(agentId);
  userTarget.setUserSid(userSid);
  target.setUser(userTarget);
  return target;
}

export function createTacticalClientTarget(
  clientId: string,
): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const clientTarget = new operator_pb.TacticalClientTarget();
  clientTarget.setClientId(clientId);
  target.setClient(clientTarget);
  return target;
}

export function createTacticalSiteTarget(
  siteId: string,
): operator_pb.PolicyTarget {
  const target = new operator_pb.PolicyTarget();
  const siteTarget = new operator_pb.TacticalSiteTarget();
  siteTarget.setSiteId(siteId);
  target.setSite(siteTarget);
  return target;
}

export function createCombinedTarget(params: {
  clientIds?: string[];
  siteIds?: string[];
  agentIds?: string[];
}): operator_pb.PolicyTarget {
  const { clientIds = [], siteIds = [], agentIds = [] } = params;
  const combined = new operator_pb.CombinedTarget();
  if (clientIds.length > 0) {
    const clientsTarget = new operator_pb.TacticalClientsTarget();
    clientsTarget.setClientsList(
      clientIds.map((id) => {
        const c = new operator_pb.TacticalClientTarget();
        c.setClientId(id);
        return c;
      }),
    );
    combined.setClients(clientsTarget);
  }
  if (siteIds.length > 0) {
    const sitesTarget = new operator_pb.TacticalSitesTarget();
    sitesTarget.setSitesList(
      siteIds.map((id) => {
        const s = new operator_pb.TacticalSiteTarget();
        s.setSiteId(id);
        return s;
      }),
    );
    combined.setSites(sitesTarget);
  }
  if (agentIds.length > 0) {
    const agentsTarget = new operator_pb.AggentsTarget();
    agentsTarget.setAgentsList(
      agentIds.map((id) => {
        const a = new operator_pb.AgentTarget();
        a.setAgentId(id);
        return a;
      }),
    );
    combined.setAgents(agentsTarget);
  }
  const target = new operator_pb.PolicyTarget();
  target.setCombined(combined);
  return target;
}

export type PolicyTargetType =
  | "global"
  | "agent"
  | "user"
  | "client"
  | "site"
  | "combined";

export type PolicyTargetParams = {
  agentId?: string;
  userSid?: string;
  clientId?: string;
  siteId?: string;
  clientIds?: string[];
  siteIds?: string[];
  agentIds?: string[];
};

export function createPolicyTargetFromParams(
  targetType: PolicyTargetType,
  targetParams: PolicyTargetParams = {},
): operator_pb.PolicyTarget {
  switch (targetType) {
    case "global":
      return createGlobalTarget();
    case "agent":
      if (!targetParams.agentId) {
        throw new Error("agentId обязателен для типа 'agent'");
      }
      return createAgentTarget(targetParams.agentId);
    case "user":
      if (!targetParams.agentId || !targetParams.userSid) {
        throw new Error("agentId и userSid обязательны для типа 'user'");
      }
      return createUserTarget(targetParams.agentId, targetParams.userSid);
    case "client":
      if (!targetParams.clientId) {
        throw new Error("clientId обязателен для типа 'client'");
      }
      return createTacticalClientTarget(targetParams.clientId);
    case "site":
      if (!targetParams.siteId) {
        throw new Error("siteId обязателен для типа 'site'");
      }
      return createTacticalSiteTarget(targetParams.siteId);
    case "combined":
      return createCombinedTarget({
        clientIds: targetParams.clientIds,
        siteIds: targetParams.siteIds,
        agentIds: targetParams.agentIds,
      });
    default:
      throw new Error(`Неизвестный тип цели: ${targetType}`);
  }
}

function createPolicyElementItemSelection(
  itemId: string,
  itemValue: unknown,
): operator_pb.PolicyElementItemSelection | null {
  if (itemValue === null || itemValue === undefined) {
    return null;
  }

  const itemSelection = new operator_pb.PolicyElementItemSelection();
  itemSelection.setIdName(itemId);

  if (typeof itemValue === "object" && !Array.isArray(itemValue)) {
    const childs: operator_pb.PolicyElementItemSelection[] = [];

    for (const [childId, childValue] of Object.entries(
      itemValue as Record<string, unknown>,
    )) {
      const childSelection = createPolicyElementItemSelection(
        childId,
        childValue,
      );
      if (childSelection) {
        childs.push(childSelection);
      }
    }

    if (childs.length > 0) {
      itemSelection.setChildsList(childs);
    }

    itemSelection.setValue("");
  } else {
    let stringValue: string;
    if (typeof itemValue === "boolean") {
      stringValue = itemValue ? "1" : "0";
    } else if (typeof itemValue === "number") {
      stringValue = String(itemValue);
    } else if (Array.isArray(itemValue)) {
      stringValue = itemValue
        .map((item) => String(item))
        .filter((item) => item !== "")
        .join(",");
    } else {
      stringValue = String(itemValue);
    }
    itemSelection.setValue(stringValue);
  }

  return itemSelection;
}

export function createPolicySelection(
  settings: Record<string, unknown>,
): operator_pb.PolicySelection {
  const selection = new operator_pb.PolicySelection();
  const elements: operator_pb.PolicyElementSelection[] = [];
  const listKeys: string[] = [];
  const settingsKeys = Object.keys(settings);
  if (settingsKeys.length === 0) {
    selection.setValue("1");
    return selection;
  }

  for (const [elementId, value] of Object.entries(settings)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      const arrayKeys = value
        .map((item) => {
          if (item === null || item === undefined) return null;
          return String(item);
        })
        .filter((key): key is string => key !== null);
      listKeys.push(...arrayKeys);
      continue;
    }

    const elementSelection = new operator_pb.PolicyElementSelection();
    elementSelection.setIdName(elementId);

    if (typeof value === "object" && !Array.isArray(value)) {
      const childs: operator_pb.PolicyElementItemSelection[] = [];

      for (const [itemId, itemValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        const itemSelection = createPolicyElementItemSelection(
          itemId,
          itemValue,
        );
        if (itemSelection) {
          childs.push(itemSelection);
        }
      }

      if (childs.length > 0) {
        elementSelection.setChildsList(childs);
      }

      elementSelection.setValue("");
    } else {
      let stringValue: string;
      if (typeof value === "boolean") {
        stringValue = value ? "1" : "0";
      } else if (typeof value === "number") {
        stringValue = String(value);
      } else {
        stringValue = String(value);
      }
      elementSelection.setValue(stringValue);
    }

    elements.push(elementSelection);
  }

  if (elements.length > 0) {
    selection.setElementsList(elements);
  }
  if (listKeys.length > 0) {
    selection.setListKeysList(listKeys);
  }

  if (
    elements.length === 0 &&
    listKeys.length === 0 &&
    settingsKeys.length > 0
  ) {
    selection.setValue("1");
  }

  return selection;
}

export const policyAssignmentClient = {
  async assignPolicy(
    policyHash: string,
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams = {},
    selection?: Record<string, unknown> | operator_pb_types.PolicySelection,
  ): Promise<operator_pb_types.AssignPolicyResponse.AsObject> {
    const request = new operator_pb.AssignPolicyRequest();
    request.setPolicyHash(policyHash);

    const target = createPolicyTargetFromParams(targetType, targetParams);
    request.setTarget(target);

    if (selection) {
      let policySelection: operator_pb.PolicySelection;
      if (selection instanceof operator_pb.PolicySelection) {
        policySelection = selection;
      } else {
        policySelection = createPolicySelection(selection);
      }
      request.setSelection(policySelection);

      //для дэбага
      console.log("асайн полиси дебаг:", {
        policyHash,
        targetType,
        targetParams,
        selectionInput: selection,
        selectionProto: policySelection.toObject?.() || "no toObject",
      });
    } else {
      console.log("асайн полиси дебаг: selection is undefined/null", {
        policyHash,
        targetType,
        targetParams,
      });
    }

    const response = await policyAssignmentServiceClient.assignPolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async removePolicy(
    policyHash: string,
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams = {},
  ): Promise<operator_pb_types.RemovePolicyResponse.AsObject> {
    const request = new operator_pb.RemovePolicyRequest();
    request.setPolicyHash(policyHash);

    const target = createPolicyTargetFromParams(targetType, targetParams);
    request.setTarget(target);

    const response = await policyAssignmentServiceClient.removePolicy(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async assignPolicyCollection(
    collectionId: number,
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams = {},
    selection?: Record<string, unknown> | operator_pb_types.PolicySelection,
  ): Promise<operator_pb_types.AssignPolicyCollectionResponse.AsObject> {
    const request = new operator_pb.AssignPolicyCollectionRequest();

    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }
    request.setCollectionId(collectionIdNum);

    const target = createPolicyTargetFromParams(targetType, targetParams);
    request.setTarget(target);

    if (selection) {
      let policySelection: operator_pb.PolicySelection;
      if (selection instanceof operator_pb.PolicySelection) {
        policySelection = selection;
      } else {
        policySelection = createPolicySelection(selection);
      }
      request.setSelection(policySelection);
    }

    const response = await policyAssignmentServiceClient.assignPolicyCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async removePolicyCollection(
    collectionId: number,
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams = {},
  ): Promise<operator_pb_types.RemovePolicyCollectionResponse.AsObject> {
    const request = new operator_pb.RemovePolicyCollectionRequest();

    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }
    request.setCollectionId(collectionIdNum);

    const target = createPolicyTargetFromParams(targetType, targetParams);
    request.setTarget(target);

    const response = await policyAssignmentServiceClient.removePolicyCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },
};

export const policyStateClient = {
  async getEffectivePolicies(
    target: operator_pb_types.PolicyTarget,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetEffectivePoliciesResponse.AsObject> {
    const request = new operator_pb.GetEffectivePoliciesRequest();
    request.setTarget(target);
    request.setLangCode(langCode);

    const response = await policyStateServiceClient.getEffectivePolicies(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getAssignments(
    target: operator_pb_types.PolicyTarget,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetAssignmentsResponse.AsObject> {
    const request = new operator_pb.GetAssignmentsRequest();
    request.setTarget(target);
    request.setLangCode(langCode);
    const response = await policyStateServiceClient.getAssignments(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getEffectivePoliciesFor(
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams & { langCode?: string } = {},
  ): Promise<operator_pb_types.GetEffectivePoliciesResponse.AsObject> {
    const { langCode, ...params } = targetParams;
    const target = createPolicyTargetFromParams(targetType, params);
    return await this.getEffectivePolicies(target, langCode);
  },

  async getAssignmentsFor(
    targetType: PolicyTargetType,
    targetParams: PolicyTargetParams & { langCode?: string } = {},
  ): Promise<operator_pb_types.GetAssignmentsResponse.AsObject> {
    const { langCode, ...params } = targetParams;
    const target = createPolicyTargetFromParams(targetType, params);
    return await this.getAssignments(target, langCode);
  },
};

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
  maxFileSize?: number;
}

export class AdmxUploadError extends Error {
  constructor(
    message: string,
    public code:
      | "FILE_TOO_LARGE"
      | "INVALID_FORMAT"
      | "UPLOAD_FAILED"
      | "CANCELLED",
  ) {
    super(message);
    this.name = "AdmxUploadError";
  }
}

export const admxServiceClientWrapper = {
  async importAdmxZip(
    zipFile: File | Uint8Array | ArrayBuffer,
    options: UploadOptions = {},
  ): Promise<operator_pb_types.ImportAdmxResponse.AsObject> {
    const { onProgress, signal, maxFileSize = 50 * 1024 * 1024 } = options;

    if (zipFile instanceof File) {
      if (zipFile.size > maxFileSize) {
        throw new AdmxUploadError(
          `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`,
          "FILE_TOO_LARGE",
        );
      }

      if (
        zipFile.type &&
        zipFile.type !== "application/zip" &&
        zipFile.type !== "application/x-zip-compressed"
      ) {
        throw new AdmxUploadError(
          "Invalid file type. Expected ZIP archive",
          "INVALID_FORMAT",
        );
      }
    }
    if (signal?.aborted) {
      throw new AdmxUploadError("Upload cancelled", "CANCELLED");
    }

    let zipContent: Uint8Array;
    if (zipFile instanceof File) {
      const arrayBuffer = await zipFile.arrayBuffer();
      zipContent = new Uint8Array(arrayBuffer);
    } else if (zipFile instanceof ArrayBuffer) {
      zipContent = new Uint8Array(zipFile);
    } else {
      zipContent = zipFile;
    }

    const totalSize = zipContent.length;
    const request = new operator_pb.ImportAdmxZipRequest();
    request.setZipContent(zipContent);

    onProgress?.({ loaded: totalSize * 0.5, total: totalSize, percentage: 50 });
    const abortListener = () => {
      throw new AdmxUploadError("Upload cancelled by user", "CANCELLED");
    };
    signal?.addEventListener("abort", abortListener);

    try {
      const response = await admxServiceClient.importAdmxZip(
        request,
        createGrpcMetadata(),
      );

      onProgress?.({
        loaded: totalSize,
        total: totalSize,
        percentage: 100,
      });
      return response.toObject();
    } catch (error) {
      if (signal?.aborted) {
        throw new AdmxUploadError("Upload cancelled", "CANCELLED");
      }
      throw new AdmxUploadError(
        error instanceof Error ? error.message : "Upload failed",
        "UPLOAD_FAILED",
      );
    } finally {
      signal?.removeEventListener("abort", abortListener);
    }
  },

  async listAdmxFiles(): Promise<operator_pb_types.ListAdmxFilesResponse.AsObject> {
    const request = new operator_pb.ListAdmxFilesRequest();

    const response = await admxServiceClient.listAdmxFiles(
      request,
      createGrpcMetadata(),
    );
    return response.toObject();
  },
};

export const collectionsClient = {
  async getAllCollections(
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetAllCollectionsResponse.AsObject> {
    const request = new operator_pb.GetAllCollectionsRequest();
    request.setLangCode(langCode);

    const response = await collectionsControlServiceClient.getAllCollections(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getCollectionById(
    collectionId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.CollectionDetailsResponse.AsObject> {
    const request = new operator_pb.GetCollectionByIdRequest();
    request.setCollectionId(collectionId);
    request.setLangCode(langCode);

    const response = await collectionsControlServiceClient.getCollectionById(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async createCollection(
    name: string,
    explainText: string = "",
    translations: Array<{
      langCode: string;
      name: string;
      explainText: string;
    }> = [],
    scope: operator_pb.PolicyScope = operator_pb.PolicyScope.POLICY_SCOPE_BOTH,
  ): Promise<operator_pb_types.CollectionDetailsResponse.AsObject> {
    const request = new operator_pb.CreateCollectionRequest();
    request.setName(name);
    request.setScope(scope);
    request.setExplainText(explainText);

    const translationsList = translations.map((trans) => {
      const translation = new operator_pb.CollectionTranslation();
      translation.setLangCode(trans.langCode);
      translation.setName(trans.name);
      translation.setExplainText(trans.explainText);
      return translation;
    });

    request.setTranslationsList(translationsList);

    const response = await collectionsControlServiceClient.createCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async updateCollection(
    id: number,
    name: string,
    explainText: string = "",
    translations: Array<{
      langCode: string;
      name: string;
      explainText: string;
    }> = [],
  ): Promise<operator_pb_types.CollectionDetailsResponse.AsObject> {
    const request = new operator_pb.UpdateCollectionRequest();
    request.setId(id);
    request.setName(name);
    request.setExplainText(explainText);

    const translationsList = translations.map((trans) => {
      const translation = new operator_pb.CollectionTranslation();
      translation.setLangCode(trans.langCode);
      translation.setName(trans.name);
      translation.setExplainText(trans.explainText);
      return translation;
    });

    request.setTranslationsList(translationsList);

    const response = await collectionsControlServiceClient.updateCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async createCollectionsPolicies(
    collectionId: number,
    policies: Array<{ hash: string; state: boolean }>,
  ): Promise<operator_pb_types.CreateCollectionsPoliciesResponse.AsObject> {
    if (!collectionId || collectionId <= 0) {
      throw new Error(
        "Invalid collection ID: collection ID must be a positive number",
      );
    }

    if (!Array.isArray(policies) || policies.length === 0) {
      throw new Error(
        "Invalid policies: policies must be a non-empty array of { hash, state }",
      );
    }

    const validPolicies = policies
      .map((p) => ({
        hash: typeof p.hash === "string" ? p.hash.trim() : String(p.hash),
        state: Boolean(p.state),
      }))
      .filter((p) => p.hash.length > 0);

    if (validPolicies.length === 0) {
      throw new Error("No valid policies after filtering (hash required)");
    }

    const collectionIdNum = Math.floor(Number(collectionId));
    if (
      !Number.isFinite(collectionIdNum) ||
      collectionIdNum <= 0 ||
      collectionIdNum !== Number(collectionId)
    ) {
      throw new Error(
        `Invalid collection ID: ${collectionId} (must be a positive integer)`,
      );
    }

    const request = new operator_pb.CreateCollectionsPoliciesRequest();
    request.setCollectionId(collectionIdNum);
    request.clearPoliciesList();

    for (const p of validPolicies) {
      const model = new operator_pb.PolicyConfigureModel();
      model.setHash(p.hash);
      model.setState(p.state);
      request.addPolicies(model);
    }

    try {
      const response =
        await collectionsControlServiceClient.createCollectionsPolicies(
          request,
          createGrpcMetadata(),
        );

      return response.toObject();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Exception was thrown by handler")) {
          throw new Error(
            "Server error: Could not add policies to collection. " +
              `Collection ID: ${collectionIdNum}. ` +
              "The collection or policies may not exist, or policy hashes may be incorrect.",
          );
        }
      }
      throw error;
    }
  },

  async deleteCollection(
    collectionId: number,
  ): Promise<operator_pb_types.DeleteCollectionResponse.AsObject> {
    const request = new operator_pb.DeleteCollectionRequest();
    request.setCollectionId(collectionId);

    const response = await collectionsControlServiceClient.deleteCollection(
      request,
      createGrpcMetadata(),
    );

    return response.toObject();
  },

  async getPoliciesInCollection(
    collectionId: number,
    langCode: string = "en-US",
  ): Promise<operator_pb_types.GetPoliciesInCollectionResponse.AsObject> {
    const request = new operator_pb.GetPoliciesInCollectionRequest();
    request.setCollectionId(collectionId);
    request.setLangCode(langCode);

    const response =
      await collectionsControlServiceClient.getPoliciesInCollection(
        request,
        createGrpcMetadata(),
      );

    return response.toObject();
  },
};

export {
  agentServiceClient,
  collectionsControlServiceClient,
  userServiceClient,
  operatorUserControlServiceClient,
  admxServiceClient,
  policyCatalogServiceClient,
  policyAssignmentServiceClient,
  policyStateServiceClient,
};

export { default as operator_pb } from "@/generated/operator_pb";
export { default as mesh_pb } from "@/generated/mesh_pb";
export { default as mesh_user_service_pb } from "@/generated/mesh/user_service_pb";
