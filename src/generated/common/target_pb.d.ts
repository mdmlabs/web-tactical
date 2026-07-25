import * as jspb from 'google-protobuf'



export class Target extends jspb.Message {
  getGlobal(): GlobalTarget | undefined;
  setGlobal(value?: GlobalTarget): Target;
  hasGlobal(): boolean;
  clearGlobal(): Target;

  getAgent(): AgentTarget | undefined;
  setAgent(value?: AgentTarget): Target;
  hasAgent(): boolean;
  clearAgent(): Target;

  getUser(): UserTarget | undefined;
  setUser(value?: UserTarget): Target;
  hasUser(): boolean;
  clearUser(): Target;

  getClient(): TacticalClientTarget | undefined;
  setClient(value?: TacticalClientTarget): Target;
  hasClient(): boolean;
  clearClient(): Target;

  getClients(): TacticalClientsTarget | undefined;
  setClients(value?: TacticalClientsTarget): Target;
  hasClients(): boolean;
  clearClients(): Target;

  getSite(): TacticalSiteTarget | undefined;
  setSite(value?: TacticalSiteTarget): Target;
  hasSite(): boolean;
  clearSite(): Target;

  getSites(): TacticalSitesTarget | undefined;
  setSites(value?: TacticalSitesTarget): Target;
  hasSites(): boolean;
  clearSites(): Target;

  getAgents(): AggentsTarget | undefined;
  setAgents(value?: AggentsTarget): Target;
  hasAgents(): boolean;
  clearAgents(): Target;

  getCombined(): CombinedTarget | undefined;
  setCombined(value?: CombinedTarget): Target;
  hasCombined(): boolean;
  clearCombined(): Target;

  getGroup(): GroupTarget | undefined;
  setGroup(value?: GroupTarget): Target;
  hasGroup(): boolean;
  clearGroup(): Target;

  getGroups(): GroupsTarget | undefined;
  setGroups(value?: GroupsTarget): Target;
  hasGroups(): boolean;
  clearGroups(): Target;

  getAgentcategory(): AgentCategoryTarget | undefined;
  setAgentcategory(value?: AgentCategoryTarget): Target;
  hasAgentcategory(): boolean;
  clearAgentcategory(): Target;

  getUserOnAgent(): UserOnAgentTArget | undefined;
  setUserOnAgent(value?: UserOnAgentTArget): Target;
  hasUserOnAgent(): boolean;
  clearUserOnAgent(): Target;

  getTargetCase(): Target.TargetCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Target.AsObject;
  static toObject(includeInstance: boolean, msg: Target): Target.AsObject;
  static serializeBinaryToWriter(message: Target, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Target;
  static deserializeBinaryFromReader(message: Target, reader: jspb.BinaryReader): Target;
}

export namespace Target {
  export type AsObject = {
    global?: GlobalTarget.AsObject;
    agent?: AgentTarget.AsObject;
    user?: UserTarget.AsObject;
    client?: TacticalClientTarget.AsObject;
    clients?: TacticalClientsTarget.AsObject;
    site?: TacticalSiteTarget.AsObject;
    sites?: TacticalSitesTarget.AsObject;
    agents?: AggentsTarget.AsObject;
    combined?: CombinedTarget.AsObject;
    group?: GroupTarget.AsObject;
    groups?: GroupsTarget.AsObject;
    agentcategory?: AgentCategoryTarget.AsObject;
    userOnAgent?: UserOnAgentTArget.AsObject;
  };

  export enum TargetCase {
    TARGET_NOT_SET = 0,
    GLOBAL = 1,
    AGENT = 2,
    USER = 3,
    CLIENT = 4,
    CLIENTS = 5,
    SITE = 6,
    SITES = 7,
    AGENTS = 8,
    COMBINED = 9,
    GROUP = 10,
    GROUPS = 11,
    AGENTCATEGORY = 12,
    USER_ON_AGENT = 13,
  }
}

export class GroupTarget extends jspb.Message {
  getGroupid(): string;
  setGroupid(value: string): GroupTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupTarget.AsObject;
  static toObject(includeInstance: boolean, msg: GroupTarget): GroupTarget.AsObject;
  static serializeBinaryToWriter(message: GroupTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupTarget;
  static deserializeBinaryFromReader(message: GroupTarget, reader: jspb.BinaryReader): GroupTarget;
}

export namespace GroupTarget {
  export type AsObject = {
    groupid: string;
  };
}

export class GroupsTarget extends jspb.Message {
  getGroupidsList(): Array<string>;
  setGroupidsList(value: Array<string>): GroupsTarget;
  clearGroupidsList(): GroupsTarget;
  addGroupids(value: string, index?: number): GroupsTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupsTarget.AsObject;
  static toObject(includeInstance: boolean, msg: GroupsTarget): GroupsTarget.AsObject;
  static serializeBinaryToWriter(message: GroupsTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupsTarget;
  static deserializeBinaryFromReader(message: GroupsTarget, reader: jspb.BinaryReader): GroupsTarget;
}

export namespace GroupsTarget {
  export type AsObject = {
    groupidsList: Array<string>;
  };
}

export class TacticalClientTarget extends jspb.Message {
  getClientId(): number;
  setClientId(value: number): TacticalClientTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TacticalClientTarget.AsObject;
  static toObject(includeInstance: boolean, msg: TacticalClientTarget): TacticalClientTarget.AsObject;
  static serializeBinaryToWriter(message: TacticalClientTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TacticalClientTarget;
  static deserializeBinaryFromReader(message: TacticalClientTarget, reader: jspb.BinaryReader): TacticalClientTarget;
}

export namespace TacticalClientTarget {
  export type AsObject = {
    clientId: number;
  };
}

export class TacticalClientsTarget extends jspb.Message {
  getClientsList(): Array<TacticalClientTarget>;
  setClientsList(value: Array<TacticalClientTarget>): TacticalClientsTarget;
  clearClientsList(): TacticalClientsTarget;
  addClients(value?: TacticalClientTarget, index?: number): TacticalClientTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TacticalClientsTarget.AsObject;
  static toObject(includeInstance: boolean, msg: TacticalClientsTarget): TacticalClientsTarget.AsObject;
  static serializeBinaryToWriter(message: TacticalClientsTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TacticalClientsTarget;
  static deserializeBinaryFromReader(message: TacticalClientsTarget, reader: jspb.BinaryReader): TacticalClientsTarget;
}

export namespace TacticalClientsTarget {
  export type AsObject = {
    clientsList: Array<TacticalClientTarget.AsObject>;
  };
}

export class TacticalSiteTarget extends jspb.Message {
  getSiteId(): number;
  setSiteId(value: number): TacticalSiteTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TacticalSiteTarget.AsObject;
  static toObject(includeInstance: boolean, msg: TacticalSiteTarget): TacticalSiteTarget.AsObject;
  static serializeBinaryToWriter(message: TacticalSiteTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TacticalSiteTarget;
  static deserializeBinaryFromReader(message: TacticalSiteTarget, reader: jspb.BinaryReader): TacticalSiteTarget;
}

export namespace TacticalSiteTarget {
  export type AsObject = {
    siteId: number;
  };
}

export class TacticalSitesTarget extends jspb.Message {
  getSitesList(): Array<TacticalSiteTarget>;
  setSitesList(value: Array<TacticalSiteTarget>): TacticalSitesTarget;
  clearSitesList(): TacticalSitesTarget;
  addSites(value?: TacticalSiteTarget, index?: number): TacticalSiteTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TacticalSitesTarget.AsObject;
  static toObject(includeInstance: boolean, msg: TacticalSitesTarget): TacticalSitesTarget.AsObject;
  static serializeBinaryToWriter(message: TacticalSitesTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TacticalSitesTarget;
  static deserializeBinaryFromReader(message: TacticalSitesTarget, reader: jspb.BinaryReader): TacticalSitesTarget;
}

export namespace TacticalSitesTarget {
  export type AsObject = {
    sitesList: Array<TacticalSiteTarget.AsObject>;
  };
}

export class AggentsTarget extends jspb.Message {
  getAgentsList(): Array<AgentTarget>;
  setAgentsList(value: Array<AgentTarget>): AggentsTarget;
  clearAgentsList(): AggentsTarget;
  addAgents(value?: AgentTarget, index?: number): AgentTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AggentsTarget.AsObject;
  static toObject(includeInstance: boolean, msg: AggentsTarget): AggentsTarget.AsObject;
  static serializeBinaryToWriter(message: AggentsTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AggentsTarget;
  static deserializeBinaryFromReader(message: AggentsTarget, reader: jspb.BinaryReader): AggentsTarget;
}

export namespace AggentsTarget {
  export type AsObject = {
    agentsList: Array<AgentTarget.AsObject>;
  };
}

export class CombinedTarget extends jspb.Message {
  getClients(): TacticalClientsTarget | undefined;
  setClients(value?: TacticalClientsTarget): CombinedTarget;
  hasClients(): boolean;
  clearClients(): CombinedTarget;

  getSites(): TacticalSitesTarget | undefined;
  setSites(value?: TacticalSitesTarget): CombinedTarget;
  hasSites(): boolean;
  clearSites(): CombinedTarget;

  getAgents(): AggentsTarget | undefined;
  setAgents(value?: AggentsTarget): CombinedTarget;
  hasAgents(): boolean;
  clearAgents(): CombinedTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CombinedTarget.AsObject;
  static toObject(includeInstance: boolean, msg: CombinedTarget): CombinedTarget.AsObject;
  static serializeBinaryToWriter(message: CombinedTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CombinedTarget;
  static deserializeBinaryFromReader(message: CombinedTarget, reader: jspb.BinaryReader): CombinedTarget;
}

export namespace CombinedTarget {
  export type AsObject = {
    clients?: TacticalClientsTarget.AsObject;
    sites?: TacticalSitesTarget.AsObject;
    agents?: AggentsTarget.AsObject;
  };

  export enum ClientsCase {
    _CLIENTS_NOT_SET = 0,
    CLIENTS = 1,
  }

  export enum SitesCase {
    _SITES_NOT_SET = 0,
    SITES = 2,
  }

  export enum AgentsCase {
    _AGENTS_NOT_SET = 0,
    AGENTS = 3,
  }
}

export class GlobalTarget extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GlobalTarget.AsObject;
  static toObject(includeInstance: boolean, msg: GlobalTarget): GlobalTarget.AsObject;
  static serializeBinaryToWriter(message: GlobalTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GlobalTarget;
  static deserializeBinaryFromReader(message: GlobalTarget, reader: jspb.BinaryReader): GlobalTarget;
}

export namespace GlobalTarget {
  export type AsObject = {
  };
}

export class AgentTarget extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): AgentTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentTarget.AsObject;
  static toObject(includeInstance: boolean, msg: AgentTarget): AgentTarget.AsObject;
  static serializeBinaryToWriter(message: AgentTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentTarget;
  static deserializeBinaryFromReader(message: AgentTarget, reader: jspb.BinaryReader): AgentTarget;
}

export namespace AgentTarget {
  export type AsObject = {
    agentId: string;
  };
}

export class UserTarget extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): UserTarget;

  getUserId(): string;
  setUserId(value: string): UserTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserTarget.AsObject;
  static toObject(includeInstance: boolean, msg: UserTarget): UserTarget.AsObject;
  static serializeBinaryToWriter(message: UserTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserTarget;
  static deserializeBinaryFromReader(message: UserTarget, reader: jspb.BinaryReader): UserTarget;
}

export namespace UserTarget {
  export type AsObject = {
    agentId: string;
    userId: string;
  };
}

export class UserOnAgentTArget extends jspb.Message {
  getAgentId(): string;
  setAgentId(value: string): UserOnAgentTArget;

  getUserSid(): string;
  setUserSid(value: string): UserOnAgentTArget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserOnAgentTArget.AsObject;
  static toObject(includeInstance: boolean, msg: UserOnAgentTArget): UserOnAgentTArget.AsObject;
  static serializeBinaryToWriter(message: UserOnAgentTArget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserOnAgentTArget;
  static deserializeBinaryFromReader(message: UserOnAgentTArget, reader: jspb.BinaryReader): UserOnAgentTArget;
}

export namespace UserOnAgentTArget {
  export type AsObject = {
    agentId: string;
    userSid: string;
  };
}

export class AgentCategoryTarget extends jspb.Message {
  getCategoryId(): number;
  setCategoryId(value: number): AgentCategoryTarget;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AgentCategoryTarget.AsObject;
  static toObject(includeInstance: boolean, msg: AgentCategoryTarget): AgentCategoryTarget.AsObject;
  static serializeBinaryToWriter(message: AgentCategoryTarget, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AgentCategoryTarget;
  static deserializeBinaryFromReader(message: AgentCategoryTarget, reader: jspb.BinaryReader): AgentCategoryTarget;
}

export namespace AgentCategoryTarget {
  export type AsObject = {
    categoryId: number;
  };
}

