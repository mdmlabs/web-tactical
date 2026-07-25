// source: operator.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

import * as jspb from "google-protobuf";
import * as google_protobuf_wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb.js";
import * as common_user_pb from "./common/user_pb.js";
import * as common_node_pb from "./common/node_pb.js";
import * as common_policy_pb from "./common/policy_pb.js";

var goog = jspb;
var global = globalThis;

var proto = (typeof globalThis !== 'undefined' && globalThis.__grpc_web_proto__) || {};
if (typeof globalThis !== 'undefined') { globalThis.__grpc_web_proto__ = proto; }

proto.laborato = proto.laborato || {};
proto.laborato.mesh = proto.laborato.mesh || {};
proto.laborato.mesh.operator = proto.laborato.mesh.operator || {};
proto.laborato.mesh.operator.v1 = proto.laborato.mesh.operator.v1 || {};

proto.google = proto.google || {};
proto.google.protobuf = proto.google.protobuf || {};
goog.object.extend(proto, google_protobuf_wrappers_pb);

if (google_protobuf_wrappers_pb.StringValue) {
  proto.google.protobuf.StringValue = google_protobuf_wrappers_pb.StringValue;
}
if (google_protobuf_wrappers_pb.BoolValue) {
  proto.google.protobuf.BoolValue = google_protobuf_wrappers_pb.BoolValue;
}
if (google_protobuf_wrappers_pb.Int32Value) {
  proto.google.protobuf.Int32Value = google_protobuf_wrappers_pb.Int32Value;
}
if (google_protobuf_wrappers_pb.Int64Value) {
  proto.google.protobuf.Int64Value = google_protobuf_wrappers_pb.Int64Value;
}

proto.laborato.common = proto.laborato.common || {};
proto.laborato.common.user = common_user_pb;

proto.laborato.common = proto.laborato.common || {};
proto.laborato.common.node = common_node_pb;

goog.exportSymbol('proto.laborato.mesh.operator.v1.ACResponseStatus', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AdmxFile', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AdmxSnapshot', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AgentDetails', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AgentSummary', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AssignPolicyRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.AssignPolicyResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CategoryView', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CollectionDetailsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CollectionTranslation', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CollectionsSummary', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CreateCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.DeleteCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.DeleteCollectionResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.EffectivePolicy', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ExportAgentStatusRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ExportPolicyStateRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAgentRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllCollectionsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllCollectionsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAssignmentsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetAssignmentsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetCategoryTreeRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetCategoryTreeResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetCollectionByIdRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetPolicyRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ImportAdmxFileRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ImportAdmxResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ImportAdmxZipRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListAdmxFilesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListAdmxFilesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListAgentsRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListAgentsResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListPoliciesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListUsersForAgentRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ListUsersForAgentResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.ManufacturerModels', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyAssigmentsState', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyAssignment', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyCategory', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyConfigureModel', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDescriptor', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDesiredState', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDetails', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDetailsElement', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDetailsElementItem', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyDetailsPolicy', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyElement', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyGroup', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyNamespace', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyPresentation', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyPresentationElement', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyScope', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicySource', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyStatus', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicySummary', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyValueOverride', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyValueOverride.ValueCase', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.PolicyVersion', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RemovePolicyRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RemovePolicyResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.SearchPolicyShortRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.SearchPolicyShortResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdateAgentRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdateAgentResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdateCollectionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdatePoliciesResponse', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest', null, global);
goog.exportSymbol('proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.displayName = 'proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.displayName = 'proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ManufacturerModels = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ManufacturerModels.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ManufacturerModels, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ManufacturerModels.displayName = 'proto.laborato.mesh.operator.v1.ManufacturerModels';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ExportAgentStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.displayName = 'proto.laborato.mesh.operator.v1.ExportAgentStatusRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdateAgentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdateAgentResponse.displayName = 'proto.laborato.mesh.operator.v1.UpdateAgentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdateAgentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdateAgentRequest.displayName = 'proto.laborato.mesh.operator.v1.UpdateAgentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListAgentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListAgentsRequest.displayName = 'proto.laborato.mesh.operator.v1.ListAgentsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAgentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAgentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAgentRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAgentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListAgentsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListAgentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListAgentsResponse.displayName = 'proto.laborato.mesh.operator.v1.ListAgentsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AgentSummary = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AgentSummary, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AgentSummary.displayName = 'proto.laborato.mesh.operator.v1.AgentSummary';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AgentDetails = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AgentDetails, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AgentDetails.displayName = 'proto.laborato.mesh.operator.v1.AgentDetails';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.displayName = 'proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyConfigureModel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyConfigureModel.displayName = 'proto.laborato.mesh.operator.v1.PolicyConfigureModel';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllCollectionsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAllCollectionsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllCollectionsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.displayName = 'proto.laborato.mesh.operator.v1.GetAllCollectionsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetCollectionByIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.displayName = 'proto.laborato.mesh.operator.v1.GetCollectionByIdRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CollectionDetailsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CollectionDetailsResponse.displayName = 'proto.laborato.mesh.operator.v1.CollectionDetailsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CollectionsSummary = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.CollectionsSummary.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CollectionsSummary, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CollectionsSummary.displayName = 'proto.laborato.mesh.operator.v1.CollectionsSummary';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.CreateCollectionRequest.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CreateCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CreateCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.CreateCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.UpdateCollectionRequest.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdateCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdateCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.UpdateCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CollectionTranslation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CollectionTranslation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CollectionTranslation.displayName = 'proto.laborato.mesh.operator.v1.CollectionTranslation';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.DeleteCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.DeleteCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.DeleteCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.DeleteCollectionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.DeleteCollectionResponse.displayName = 'proto.laborato.mesh.operator.v1.DeleteCollectionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListUsersForAgentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.displayName = 'proto.laborato.mesh.operator.v1.ListUsersForAgentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListUsersForAgentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.displayName = 'proto.laborato.mesh.operator.v1.ListUsersForAgentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.displayName = 'proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.displayName = 'proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ImportAdmxZipRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.displayName = 'proto.laborato.mesh.operator.v1.ImportAdmxZipRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ImportAdmxFileRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.displayName = 'proto.laborato.mesh.operator.v1.ImportAdmxFileRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ImportAdmxResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ImportAdmxResponse.displayName = 'proto.laborato.mesh.operator.v1.ImportAdmxResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListAdmxFilesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.displayName = 'proto.laborato.mesh.operator.v1.ListAdmxFilesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListAdmxFilesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.displayName = 'proto.laborato.mesh.operator.v1.ListAdmxFilesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AdmxFile = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AdmxFile, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AdmxFile.displayName = 'proto.laborato.mesh.operator.v1.AdmxFile';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyCategory = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyCategory, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyCategory.displayName = 'proto.laborato.mesh.operator.v1.PolicyCategory';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyNamespace = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyNamespace, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyNamespace.displayName = 'proto.laborato.mesh.operator.v1.PolicyNamespace';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.AdmxSnapshot.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AdmxSnapshot, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AdmxSnapshot.displayName = 'proto.laborato.mesh.operator.v1.AdmxSnapshot';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.displayName = 'proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.displayName = 'proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.displayName = 'proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyVersion = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyVersion, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyVersion.displayName = 'proto.laborato.mesh.operator.v1.PolicyVersion';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.displayName = 'proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdatePoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.UpdatePoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.displayName = 'proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.SearchPolicyShortRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.displayName = 'proto.laborato.mesh.operator.v1.SearchPolicyShortRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.SearchPolicyShortResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.displayName = 'proto.laborato.mesh.operator.v1.SearchPolicyShortResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.displayName = 'proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetCategoryTreeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.displayName = 'proto.laborato.mesh.operator.v1.GetCategoryTreeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetCategoryTreeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.displayName = 'proto.laborato.mesh.operator.v1.GetCategoryTreeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.CategoryView = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.CategoryView.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.CategoryView, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.CategoryView.displayName = 'proto.laborato.mesh.operator.v1.CategoryView';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.ListPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListPoliciesResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListPoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListPoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.ListPoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPolicyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPolicyRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPolicyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.displayName = 'proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.displayName = 'proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyDetails = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyDetails.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyDetails, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyDetails.displayName = 'proto.laborato.mesh.operator.v1.PolicyDetails';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyDetailsPolicy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.displayName = 'proto.laborato.mesh.operator.v1.PolicyDetailsPolicy';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyPresentation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyPresentation.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyPresentation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyPresentation.displayName = 'proto.laborato.mesh.operator.v1.PolicyPresentation';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyPresentationElement, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyPresentationElement.displayName = 'proto.laborato.mesh.operator.v1.PolicyPresentationElement';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyDetailsElement.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyDetailsElement, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyDetailsElement.displayName = 'proto.laborato.mesh.operator.v1.PolicyDetailsElement';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyDetailsElementItem, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.displayName = 'proto.laborato.mesh.operator.v1.PolicyDetailsElementItem';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.displayName = 'proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyDescriptor.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyDescriptor, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyDescriptor.displayName = 'proto.laborato.mesh.operator.v1.PolicyDescriptor';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyElement = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyElement, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyElement.displayName = 'proto.laborato.mesh.operator.v1.PolicyElement';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyGroup = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyGroup.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyGroup, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyGroup.displayName = 'proto.laborato.mesh.operator.v1.PolicyGroup';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicySummary = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicySummary, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicySummary.displayName = 'proto.laborato.mesh.operator.v1.PolicySummary';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.displayName = 'proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.displayName = 'proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.displayName = 'proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AssignPolicyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AssignPolicyRequest.displayName = 'proto.laborato.mesh.operator.v1.AssignPolicyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.AssignPolicyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.AssignPolicyResponse.displayName = 'proto.laborato.mesh.operator.v1.AssignPolicyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RemovePolicyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RemovePolicyRequest.displayName = 'proto.laborato.mesh.operator.v1.RemovePolicyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.RemovePolicyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.RemovePolicyResponse.displayName = 'proto.laborato.mesh.operator.v1.RemovePolicyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyValueOverride, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyValueOverride.displayName = 'proto.laborato.mesh.operator.v1.PolicyValueOverride';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.ExportPolicyStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.displayName = 'proto.laborato.mesh.operator.v1.ExportPolicyStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.displayName = 'proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.displayName = 'proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.EffectivePolicy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.EffectivePolicy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.EffectivePolicy.displayName = 'proto.laborato.mesh.operator.v1.EffectivePolicy';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAssignmentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAssignmentsRequest.displayName = 'proto.laborato.mesh.operator.v1.GetAssignmentsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.GetAssignmentsResponse.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.GetAssignmentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.GetAssignmentsResponse.displayName = 'proto.laborato.mesh.operator.v1.GetAssignmentsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyAssignment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.laborato.mesh.operator.v1.PolicyAssignment.repeatedFields_, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyAssignment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyAssignment.displayName = 'proto.laborato.mesh.operator.v1.PolicyAssignment';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.laborato.mesh.operator.v1.PolicyAssigmentsState, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.laborato.mesh.operator.v1.PolicyAssigmentsState.displayName = 'proto.laborato.mesh.operator.v1.PolicyAssigmentsState';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest;
  return proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
manufacturersList: jspb.Message.toObjectList(msg.getManufacturersList(),
    proto.laborato.mesh.operator.v1.ManufacturerModels.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse;
  return proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.ManufacturerModels;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.ManufacturerModels.deserializeBinaryFromReader);
      msg.addManufacturers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getManufacturersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.ManufacturerModels.serializeBinaryToWriter
    );
  }
};


/**
 * repeated ManufacturerModels manufacturers = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.ManufacturerModels>}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.getManufacturersList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.ManufacturerModels>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.ManufacturerModels, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.ManufacturerModels>} value
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.setManufacturersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.ManufacturerModels=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels}
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.addManufacturers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.ManufacturerModels, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetUniqueManufacturersResponse.prototype.clearManufacturersList = function() {
  return this.setManufacturersList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ManufacturerModels.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ManufacturerModels} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
modelsList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ManufacturerModels;
  return proto.laborato.mesh.operator.v1.ManufacturerModels.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ManufacturerModels} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addModels(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ManufacturerModels.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ManufacturerModels} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getModelsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels} returns this
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string models = 2;
 * @return {!Array<string>}
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.getModelsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels} returns this
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.setModelsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels} returns this
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.addModels = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ManufacturerModels} returns this
 */
proto.laborato.mesh.operator.v1.ManufacturerModels.prototype.clearModelsList = function() {
  return this.setModelsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
requestedBy: jspb.Message.getFieldWithDefault(msg, 2, ""),
note: jspb.Message.getFieldWithDefault(msg, 3, ""),
fromUtc: (f = msg.getFromUtc()) && proto.google.protobuf.Timestamp.toObject(includeInstance, f),
toUtc: (f = msg.getToUtc()) && proto.google.protobuf.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ExportAgentStatusRequest;
  return proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequestedBy(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNote(value);
      break;
    case 4:
      var value = new proto.google.protobuf.Timestamp;
      reader.readMessage(value,proto.google.protobuf.Timestamp.deserializeBinaryFromReader);
      msg.setFromUtc(value);
      break;
    case 5:
      var value = new proto.google.protobuf.Timestamp;
      reader.readMessage(value,proto.google.protobuf.Timestamp.deserializeBinaryFromReader);
      msg.setToUtc(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getRequestedBy();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getNote();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getFromUtc();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.google.protobuf.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getToUtc();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.google.protobuf.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional laborato.common.target.Target target = 1;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 1));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
*/
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string requested_by = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.getRequestedBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.setRequestedBy = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string note = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.getNote = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.setNote = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp from_utc = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.getFromUtc = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
*/
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.setFromUtc = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.clearFromUtc = function() {
  return this.setFromUtc(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.hasFromUtc = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.Timestamp to_utc = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.getToUtc = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Timestamp, 5));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
*/
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.setToUtc = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ExportAgentStatusRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.clearToUtc = function() {
  return this.setToUtc(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ExportAgentStatusRequest.prototype.hasToUtc = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdateAgentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentResponse}
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdateAgentResponse;
  return proto.laborato.mesh.operator.v1.UpdateAgentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentResponse}
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdateAgentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateAgentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdateAgentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, ""),
description: jspb.Message.getFieldWithDefault(msg, 2, ""),
maxPolicies: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentRequest}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdateAgentRequest;
  return proto.laborato.mesh.operator.v1.UpdateAgentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentRequest}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdateAgentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMaxPolicies();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string description = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 max_policies = 3;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.getMaxPolicies = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateAgentRequest.prototype.setMaxPolicies = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListAgentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
manufacturer: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
model: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
minimalOsVersion: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListAgentsRequest;
  return proto.laborato.mesh.operator.v1.ListAgentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setManufacturer(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setModel(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setMinimalOsVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListAgentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string manufacturer = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.getManufacturer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.setManufacturer = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.clearManufacturer = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.hasManufacturer = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string model = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.getModel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.setModel = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.clearModel = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.hasModel = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string minimal_os_version = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.getMinimalOsVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.setMinimalOsVersion = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.clearMinimalOsVersion = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ListAgentsRequest.prototype.hasMinimalOsVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAgentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAgentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAgentRequest}
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAgentRequest;
  return proto.laborato.mesh.operator.v1.GetAgentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAgentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAgentRequest}
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAgentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAgentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAgentRequest.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListAgentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
agentsList: jspb.Message.toObjectList(msg.getAgentsList(),
    proto.laborato.mesh.operator.v1.AgentSummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsResponse}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListAgentsResponse;
  return proto.laborato.mesh.operator.v1.ListAgentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsResponse}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.AgentSummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.AgentSummary.deserializeBinaryFromReader);
      msg.addAgents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListAgentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListAgentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.AgentSummary.serializeBinaryToWriter
    );
  }
};


/**
 * repeated AgentSummary agents = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.AgentSummary>}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.getAgentsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.AgentSummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.AgentSummary, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.AgentSummary>} value
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.setAgentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.AgentSummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary}
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.addAgents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.AgentSummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListAgentsResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListAgentsResponse.prototype.clearAgentsList = function() {
  return this.setAgentsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AgentSummary.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AgentSummary} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AgentSummary.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, ""),
hostName: jspb.Message.getFieldWithDefault(msg, 2, ""),
ipAddress: jspb.Message.getFieldWithDefault(msg, 3, ""),
isOnline: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
lastHeartbeatUnix: jspb.Message.getFieldWithDefault(msg, 5, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary}
 */
proto.laborato.mesh.operator.v1.AgentSummary.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AgentSummary;
  return proto.laborato.mesh.operator.v1.AgentSummary.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AgentSummary} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary}
 */
proto.laborato.mesh.operator.v1.AgentSummary.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setHostName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIpAddress(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsOnline(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLastHeartbeatUnix(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AgentSummary.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AgentSummary} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AgentSummary.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getHostName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIpAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getIsOnline();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = message.getLastHeartbeatUnix();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary} returns this
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string host_name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.getHostName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary} returns this
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.setHostName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string ip_address = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.getIpAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary} returns this
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.setIpAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bool is_online = 4;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.getIsOnline = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary} returns this
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.setIsOnline = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * optional int64 last_heartbeat_unix = 5;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.getLastHeartbeatUnix = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.AgentSummary} returns this
 */
proto.laborato.mesh.operator.v1.AgentSummary.prototype.setLastHeartbeatUnix = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AgentDetails.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AgentDetails} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AgentDetails.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, ""),
hostName: jspb.Message.getFieldWithDefault(msg, 2, ""),
ipAddress: jspb.Message.getFieldWithDefault(msg, 3, ""),
isOnline: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
lastHeartbeatUnix: jspb.Message.getFieldWithDefault(msg, 5, 0),
nodeInfo: (f = msg.getNodeInfo()) && proto.laborato.common.node.NodeFullInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails}
 */
proto.laborato.mesh.operator.v1.AgentDetails.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AgentDetails;
  return proto.laborato.mesh.operator.v1.AgentDetails.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AgentDetails} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails}
 */
proto.laborato.mesh.operator.v1.AgentDetails.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setHostName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIpAddress(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsOnline(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLastHeartbeatUnix(value);
      break;
    case 6:
      var value = new proto.laborato.common.node.NodeFullInfo;
      reader.readMessage(value,proto.laborato.common.node.NodeFullInfo.deserializeBinaryFromReader);
      msg.setNodeInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AgentDetails.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AgentDetails} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AgentDetails.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getHostName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIpAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getIsOnline();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = message.getLastHeartbeatUnix();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = message.getNodeInfo();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.laborato.common.node.NodeFullInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string host_name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getHostName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setHostName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string ip_address = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getIpAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setIpAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bool is_online = 4;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getIsOnline = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setIsOnline = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * optional int64 last_heartbeat_unix = 5;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getLastHeartbeatUnix = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setLastHeartbeatUnix = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional laborato.common.node.NodeFullInfo node_info = 6;
 * @return {?proto.laborato.common.node.NodeFullInfo}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.getNodeInfo = function() {
  return /** @type{?proto.laborato.common.node.NodeFullInfo} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.node.NodeFullInfo, 6));
};


/**
 * @param {?proto.laborato.common.node.NodeFullInfo|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
*/
proto.laborato.mesh.operator.v1.AgentDetails.prototype.setNodeInfo = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AgentDetails} returns this
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.clearNodeInfo = function() {
  return this.setNodeInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AgentDetails.prototype.hasNodeInfo = function() {
  return jspb.Message.getField(this, 6) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
scope: jspb.Message.getFieldWithDefault(msg, 2, 0),
exportFormat: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest;
  return proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 3:
      var value = /** @type {!proto.laborato.common.export.ExportFormat} */ (reader.readEnum());
      msg.setExportFormat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getScope();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getExportFormat();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyScope scope = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.setScope = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional laborato.common.export.ExportFormat export_format = 3;
 * @return {!proto.laborato.common.export.ExportFormat}
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.getExportFormat = function() {
  return /** @type {!proto.laborato.common.export.ExportFormat} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.laborato.common.export.ExportFormat} value
 * @return {!proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportCollectionPoliciesRequest.prototype.setExportFormat = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
categoryId: jspb.Message.getFieldWithDefault(msg, 1, 0),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest;
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCategoryId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCategoryId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional int64 category_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.getCategoryId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.setCategoryId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentCategoryRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, ""),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest;
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByAgentRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
userId: jspb.Message.getFieldWithDefault(msg, 1, ""),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest;
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string user_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByUserRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
groupId: jspb.Message.getFieldWithDefault(msg, 1, ""),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest;
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setGroupId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getGroupId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string group_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.getGroupId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.setGroupId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsByGroupRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionsList: jspb.Message.toObjectList(msg.getCollectionsList(),
    proto.laborato.mesh.operator.v1.CollectionsSummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse;
  return proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.CollectionsSummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinaryFromReader);
      msg.addCollections(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.CollectionsSummary.serializeBinaryToWriter
    );
  }
};


/**
 * repeated CollectionsSummary collections = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.getCollectionsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CollectionsSummary, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.setCollectionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CollectionsSummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary}
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.addCollections = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.CollectionsSummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetAppliedCollectionsResponse.prototype.clearCollectionsList = function() {
  return this.setCollectionsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicyConfigureModel.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest;
  return proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicyConfigureModel;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyConfigureModel.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicyConfigureModel.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * repeated PolicyConfigureModel policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyConfigureModel>}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyConfigureModel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyConfigureModel, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyConfigureModel>} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} returns this
*/
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyConfigureModel=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicyConfigureModel, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesRequest.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyConfigureModel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.toObject = function(includeInstance, msg) {
  var f, obj = {
hash: jspb.Message.getFieldWithDefault(msg, 1, ""),
state: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
selection: (f = msg.getSelection()) && proto.laborato.common.policy.PolicySelection.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyConfigureModel;
  return proto.laborato.mesh.operator.v1.PolicyConfigureModel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setState(value);
      break;
    case 3:
      var value = new proto.laborato.common.policy.PolicySelection;
      reader.readMessage(value,proto.laborato.common.policy.PolicySelection.deserializeBinaryFromReader);
      msg.setSelection(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyConfigureModel.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getState();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getSelection();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.laborato.common.policy.PolicySelection.serializeBinaryToWriter
    );
  }
};


/**
 * optional string hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} returns this
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.setHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool state = 2;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.getState = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} returns this
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.setState = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional laborato.common.policy.PolicySelection selection = 3;
 * @return {?proto.laborato.common.policy.PolicySelection}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.getSelection = function() {
  return /** @type{?proto.laborato.common.policy.PolicySelection} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.policy.PolicySelection, 3));
};


/**
 * @param {?proto.laborato.common.policy.PolicySelection|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} returns this
*/
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.setSelection = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyConfigureModel} returns this
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.clearSelection = function() {
  return this.setSelection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyConfigureModel.prototype.hasSelection = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse;
  return proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionsPoliciesResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
scope: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllCollectionsRequest;
  return proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyScope scope = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.setScope = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.clearScope = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsRequest.prototype.hasScope = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionsList: jspb.Message.toObjectList(msg.getCollectionsList(),
    proto.laborato.mesh.operator.v1.CollectionsSummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllCollectionsResponse;
  return proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.CollectionsSummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinaryFromReader);
      msg.addCollections(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.CollectionsSummary.serializeBinaryToWriter
    );
  }
};


/**
 * repeated CollectionsSummary collections = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.getCollectionsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CollectionsSummary, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CollectionsSummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.setCollectionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CollectionsSummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary}
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.addCollections = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.CollectionsSummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetAllCollectionsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetAllCollectionsResponse.prototype.clearCollectionsList = function() {
  return this.setCollectionsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetCollectionByIdRequest;
  return proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetCollectionByIdRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetCollectionByIdRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CollectionDetailsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
collection: (f = msg.getCollection()) && proto.laborato.mesh.operator.v1.CollectionsSummary.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CollectionDetailsResponse;
  return proto.laborato.mesh.operator.v1.CollectionDetailsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.CollectionsSummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinaryFromReader);
      msg.setCollection(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CollectionDetailsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollection();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.CollectionsSummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional CollectionsSummary collection = 1;
 * @return {?proto.laborato.mesh.operator.v1.CollectionsSummary}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.getCollection = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.CollectionsSummary} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.CollectionsSummary, 1));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.CollectionsSummary|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse} returns this
*/
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.setCollection = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.CollectionDetailsResponse} returns this
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.clearCollection = function() {
  return this.setCollection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.CollectionDetailsResponse.prototype.hasCollection = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CollectionsSummary.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CollectionsSummary} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
scope: jspb.Message.getFieldWithDefault(msg, 2, 0),
name: jspb.Message.getFieldWithDefault(msg, 3, ""),
explainText: jspb.Message.getFieldWithDefault(msg, 4, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CollectionsSummary;
  return proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CollectionsSummary} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    case 5:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CollectionsSummary.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CollectionsSummary} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getScope();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional PolicyScope scope = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.setScope = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string name = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string explain_text = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * repeated PolicySummary policies = 5;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 5));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
*/
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.CollectionsSummary} returns this
 */
proto.laborato.mesh.operator.v1.CollectionsSummary.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CreateCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
scope: jspb.Message.getFieldWithDefault(msg, 2, 0),
explainText: jspb.Message.getFieldWithDefault(msg, 3, ""),
translationsList: jspb.Message.toObjectList(msg.getTranslationsList(),
    proto.laborato.mesh.operator.v1.CollectionTranslation.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CreateCollectionRequest;
  return proto.laborato.mesh.operator.v1.CreateCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.CollectionTranslation;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CollectionTranslation.deserializeBinaryFromReader);
      msg.addTranslations(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CreateCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getScope();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getTranslationsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.CollectionTranslation.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyScope scope = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.setScope = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string explain_text = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated CollectionTranslation translations = 4;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.getTranslationsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CollectionTranslation, 4));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>} value
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} returns this
*/
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.setTranslationsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CollectionTranslation=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation}
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.addTranslations = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.laborato.mesh.operator.v1.CollectionTranslation, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.CreateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.CreateCollectionRequest.prototype.clearTranslationsList = function() {
  return this.setTranslationsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdateCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
explainText: jspb.Message.getFieldWithDefault(msg, 3, ""),
translationsList: jspb.Message.toObjectList(msg.getTranslationsList(),
    proto.laborato.mesh.operator.v1.CollectionTranslation.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdateCollectionRequest;
  return proto.laborato.mesh.operator.v1.UpdateCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.CollectionTranslation;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CollectionTranslation.deserializeBinaryFromReader);
      msg.addTranslations(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdateCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getTranslationsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.CollectionTranslation.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string explain_text = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated CollectionTranslation translations = 4;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.getTranslationsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CollectionTranslation, 4));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CollectionTranslation>} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} returns this
*/
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.setTranslationsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CollectionTranslation=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation}
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.addTranslations = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.laborato.mesh.operator.v1.CollectionTranslation, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.UpdateCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateCollectionRequest.prototype.clearTranslationsList = function() {
  return this.setTranslationsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CollectionTranslation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CollectionTranslation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
explainText: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CollectionTranslation;
  return proto.laborato.mesh.operator.v1.CollectionTranslation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CollectionTranslation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CollectionTranslation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CollectionTranslation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation} returns this
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation} returns this
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string explain_text = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CollectionTranslation} returns this
 */
proto.laborato.mesh.operator.v1.CollectionTranslation.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.DeleteCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.DeleteCollectionRequest;
  return proto.laborato.mesh.operator.v1.DeleteCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.DeleteCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.DeleteCollectionRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.DeleteCollectionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.DeleteCollectionResponse;
  return proto.laborato.mesh.operator.v1.DeleteCollectionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.DeleteCollectionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse} returns this
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.DeleteCollectionResponse} returns this
 */
proto.laborato.mesh.operator.v1.DeleteCollectionResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest;
  return proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse;
  return proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PolicySummary policies = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesInCollectionResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionid: jspb.Message.getFieldWithDefault(msg, 1, 0),
policiesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest;
  return proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionid();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional int64 collectionId = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.getCollectionid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.setCollectionid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * repeated string policies = 2;
 * @return {!Array<string>}
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.getPoliciesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.setPoliciesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.addPolicies = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePoliciesFromCollectionRequest.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListUsersForAgentRequest;
  return proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentRequest.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
usersList: jspb.Message.toObjectList(msg.getUsersList(),
    proto.laborato.common.user.UserInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListUsersForAgentResponse;
  return proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.user.UserInfo;
      reader.readMessage(value,proto.laborato.common.user.UserInfo.deserializeBinaryFromReader);
      msg.addUsers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.common.user.UserInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated laborato.common.user.UserInfo users = 1;
 * @return {!Array<!proto.laborato.common.user.UserInfo>}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.getUsersList = function() {
  return /** @type{!Array<!proto.laborato.common.user.UserInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.common.user.UserInfo, 1));
};


/**
 * @param {!Array<!proto.laborato.common.user.UserInfo>} value
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.setUsersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.common.user.UserInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.common.user.UserInfo}
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.addUsers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.common.user.UserInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListUsersForAgentResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListUsersForAgentResponse.prototype.clearUsersList = function() {
  return this.setUsersList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
agentId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest;
  return proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAgentId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAgentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string agent_id = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.prototype.getAgentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentRequest.prototype.setAgentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
groupsList: jspb.Message.toObjectList(msg.getGroupsList(),
    proto.laborato.common.user.GroupInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse;
  return proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.user.GroupInfo;
      reader.readMessage(value,proto.laborato.common.user.GroupInfo.deserializeBinaryFromReader);
      msg.addGroups(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getGroupsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.common.user.GroupInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated laborato.common.user.GroupInfo groups = 1;
 * @return {!Array<!proto.laborato.common.user.GroupInfo>}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.getGroupsList = function() {
  return /** @type{!Array<!proto.laborato.common.user.GroupInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.common.user.GroupInfo, 1));
};


/**
 * @param {!Array<!proto.laborato.common.user.GroupInfo>} value
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.setGroupsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.common.user.GroupInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.common.user.GroupInfo}
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.addGroups = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.common.user.GroupInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListUserGroupsForAgentResponse.prototype.clearGroupsList = function() {
  return this.setGroupsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
zipContent: msg.getZipContent_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ImportAdmxZipRequest;
  return proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setZipContent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getZipContent_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes zip_content = 1;
 * @return {!(string|Uint8Array)}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.getZipContent = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes zip_content = 1;
 * This is a type-conversion wrapper around `getZipContent()`
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.getZipContent_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getZipContent()));
};


/**
 * optional bytes zip_content = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getZipContent()`
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.getZipContent_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getZipContent()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxZipRequest} returns this
 */
proto.laborato.mesh.operator.v1.ImportAdmxZipRequest.prototype.setZipContent = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
fileContent: msg.getFileContent_asB64(),
fileName: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ImportAdmxFileRequest;
  return proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setFileContent(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFileContent_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bytes file_content = 1;
 * @return {!(string|Uint8Array)}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.getFileContent = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes file_content = 1;
 * This is a type-conversion wrapper around `getFileContent()`
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.getFileContent_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getFileContent()));
};


/**
 * optional bytes file_content = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getFileContent()`
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.getFileContent_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getFileContent()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest} returns this
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.setFileContent = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional string file_name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.getFileName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxFileRequest} returns this
 */
proto.laborato.mesh.operator.v1.ImportAdmxFileRequest.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ImportAdmxResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxResponse}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ImportAdmxResponse;
  return proto.laborato.mesh.operator.v1.ImportAdmxResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxResponse}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ImportAdmxResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ImportAdmxResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxResponse} returns this
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ImportAdmxResponse} returns this
 */
proto.laborato.mesh.operator.v1.ImportAdmxResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesRequest}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListAdmxFilesRequest;
  return proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesRequest}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
filesList: jspb.Message.toObjectList(msg.getFilesList(),
    proto.laborato.mesh.operator.v1.AdmxFile.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListAdmxFilesResponse;
  return proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.AdmxFile;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.AdmxFile.deserializeBinaryFromReader);
      msg.addFiles(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFilesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.AdmxFile.serializeBinaryToWriter
    );
  }
};


/**
 * repeated AdmxFile files = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.AdmxFile>}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.getFilesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.AdmxFile>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.AdmxFile, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.AdmxFile>} value
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.setFilesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.AdmxFile=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile}
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.addFiles = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.AdmxFile, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListAdmxFilesResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListAdmxFilesResponse.prototype.clearFilesList = function() {
  return this.setFilesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
fileHash: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest}
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest;
  return proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest}
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFileHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string file_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.prototype.getFileHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAdmxSnapshotRequest.prototype.setFileHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AdmxFile.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AdmxFile} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AdmxFile.toObject = function(includeInstance, msg) {
  var f, obj = {
fileName: jspb.Message.getFieldWithDefault(msg, 1, ""),
fileHash: jspb.Message.getFieldWithDefault(msg, 2, ""),
loadedAtUnix: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile}
 */
proto.laborato.mesh.operator.v1.AdmxFile.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AdmxFile;
  return proto.laborato.mesh.operator.v1.AdmxFile.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AdmxFile} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile}
 */
proto.laborato.mesh.operator.v1.AdmxFile.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setFileHash(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLoadedAtUnix(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AdmxFile.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AdmxFile} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AdmxFile.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFileName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getFileHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLoadedAtUnix();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * optional string file_name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.getFileName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile} returns this
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.setFileName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string file_hash = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.getFileHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile} returns this
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.setFileHash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 loaded_at_unix = 3;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.getLoadedAtUnix = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxFile} returns this
 */
proto.laborato.mesh.operator.v1.AdmxFile.prototype.setLoadedAtUnix = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyCategory.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyCategory} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyCategory.toObject = function(includeInstance, msg) {
  var f, obj = {
name: jspb.Message.getFieldWithDefault(msg, 1, ""),
displayName: jspb.Message.getFieldWithDefault(msg, 2, ""),
explainText: jspb.Message.getFieldWithDefault(msg, 3, ""),
parentCategoryName: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyCategory;
  return proto.laborato.mesh.operator.v1.PolicyCategory.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyCategory} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisplayName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentCategoryName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyCategory.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyCategory} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyCategory.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDisplayName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getParentCategoryName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory} returns this
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string display_name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.getDisplayName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory} returns this
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.setDisplayName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string explain_text = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory} returns this
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string parent_category_name = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.getParentCategoryName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory} returns this
 */
proto.laborato.mesh.operator.v1.PolicyCategory.prototype.setParentCategoryName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyNamespace.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyNamespace} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.toObject = function(includeInstance, msg) {
  var f, obj = {
prefix: jspb.Message.getFieldWithDefault(msg, 1, ""),
namespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyNamespace}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyNamespace;
  return proto.laborato.mesh.operator.v1.PolicyNamespace.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyNamespace} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyNamespace}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPrefix(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyNamespace.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyNamespace} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPrefix();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string prefix = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.getPrefix = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyNamespace} returns this
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.setPrefix = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string namespace = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.getNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyNamespace} returns this
 */
proto.laborato.mesh.operator.v1.PolicyNamespace.prototype.setNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.repeatedFields_ = [2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AdmxSnapshot.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AdmxSnapshot} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.toObject = function(includeInstance, msg) {
  var f, obj = {
file: (f = msg.getFile()) && proto.laborato.mesh.operator.v1.AdmxFile.toObject(includeInstance, f),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicyDescriptor.toObject, includeInstance),
categoriesList: jspb.Message.toObjectList(msg.getCategoriesList(),
    proto.laborato.mesh.operator.v1.PolicyCategory.toObject, includeInstance),
namespacesList: jspb.Message.toObjectList(msg.getNamespacesList(),
    proto.laborato.mesh.operator.v1.PolicyNamespace.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AdmxSnapshot;
  return proto.laborato.mesh.operator.v1.AdmxSnapshot.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AdmxSnapshot} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.AdmxFile;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.AdmxFile.deserializeBinaryFromReader);
      msg.setFile(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicyDescriptor;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    case 3:
      var value = new proto.laborato.mesh.operator.v1.PolicyCategory;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyCategory.deserializeBinaryFromReader);
      msg.addCategories(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.PolicyNamespace;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyNamespace.deserializeBinaryFromReader);
      msg.addNamespaces(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AdmxSnapshot.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AdmxSnapshot} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFile();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.AdmxFile.serializeBinaryToWriter
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicyDescriptor.serializeBinaryToWriter
    );
  }
  f = message.getCategoriesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.laborato.mesh.operator.v1.PolicyCategory.serializeBinaryToWriter
    );
  }
  f = message.getNamespacesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.PolicyNamespace.serializeBinaryToWriter
    );
  }
};


/**
 * optional AdmxFile file = 1;
 * @return {?proto.laborato.mesh.operator.v1.AdmxFile}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.getFile = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.AdmxFile} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.AdmxFile, 1));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.AdmxFile|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
*/
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.setFile = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.clearFile = function() {
  return this.setFile(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.hasFile = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated PolicyDescriptor policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDescriptor, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
*/
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyDescriptor=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicyDescriptor, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};


/**
 * repeated PolicyCategory categories = 3;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyCategory>}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.getCategoriesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyCategory>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyCategory, 3));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyCategory>} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
*/
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.setCategoriesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyCategory=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyCategory}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.addCategories = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.laborato.mesh.operator.v1.PolicyCategory, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.clearCategoriesList = function() {
  return this.setCategoriesList([]);
};


/**
 * repeated PolicyNamespace namespaces = 4;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyNamespace>}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.getNamespacesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyNamespace>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyNamespace, 4));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyNamespace>} value
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
*/
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.setNamespacesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyNamespace=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyNamespace}
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.addNamespaces = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.laborato.mesh.operator.v1.PolicyNamespace, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.AdmxSnapshot} returns this
 */
proto.laborato.mesh.operator.v1.AdmxSnapshot.prototype.clearNamespacesList = function() {
  return this.setNamespacesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
version: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest;
  return proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVersion();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 version = 2;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashAndVersionRequest.prototype.setVersion = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast;
  return proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast} returns this
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashRequast.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
versionsList: jspb.Message.toObjectList(msg.getVersionsList(),
    proto.laborato.mesh.operator.v1.PolicyVersion.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse;
  return proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicyVersion;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyVersion.deserializeBinaryFromReader);
      msg.addVersions(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVersionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicyVersion.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PolicyVersion versions = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyVersion>}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.getVersionsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyVersion>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyVersion, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyVersion>} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.setVersionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyVersion=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion}
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.addVersions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.PolicyVersion, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetAllVersionByHashResponse.prototype.clearVersionsList = function() {
  return this.setVersionsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyVersion.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyVersion} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyVersion.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
policy: (f = msg.getPolicy()) && proto.laborato.mesh.operator.v1.PolicyDescriptor.toObject(includeInstance, f),
version: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyVersion;
  return proto.laborato.mesh.operator.v1.PolicyVersion.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyVersion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicyDescriptor;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinaryFromReader);
      msg.setPolicy(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyVersion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyVersion} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyVersion.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPolicy();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicyDescriptor.serializeBinaryToWriter
    );
  }
  f = message.getVersion();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion} returns this
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyDescriptor policy = 2;
 * @return {?proto.laborato.mesh.operator.v1.PolicyDescriptor}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.getPolicy = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicyDescriptor} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDescriptor, 2));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicyDescriptor|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion} returns this
*/
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.setPolicy = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion} returns this
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.clearPolicy = function() {
  return this.setPolicy(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.hasPolicy = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int32 version = 3;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyVersion} returns this
 */
proto.laborato.mesh.operator.v1.PolicyVersion.prototype.setVersion = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
hash: jspb.Message.getFieldWithDefault(msg, 1, ""),
name: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
displayname: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
explaintext: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
scope: (f = jspb.Message.getField(msg, 5)) == null ? undefined : f,
registrykey: (f = jspb.Message.getField(msg, 6)) == null ? undefined : f,
valuename: (f = jspb.Message.getField(msg, 7)) == null ? undefined : f,
enabledvalue: (f = jspb.Message.getField(msg, 8)) == null ? undefined : f,
disabledvalue: (f = jspb.Message.getField(msg, 9)) == null ? undefined : f,
supportedonref: (f = jspb.Message.getField(msg, 10)) == null ? undefined : f,
parentcategoryref: (f = jspb.Message.getField(msg, 11)) == null ? undefined : f,
presentationref: (f = jspb.Message.getField(msg, 12)) == null ? undefined : f,
clientextension: (f = jspb.Message.getField(msg, 13)) == null ? undefined : f,
policystatus: (f = jspb.Message.getField(msg, 14)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest;
  return proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisplayname(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplaintext(value);
      break;
    case 5:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setRegistrykey(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setValuename(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnabledvalue(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisabledvalue(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setSupportedonref(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentcategoryref(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setPresentationref(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setClientextension(value);
      break;
    case 14:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (reader.readEnum());
      msg.setPolicystatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeString(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeString(
      7,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 8));
  if (f != null) {
    writer.writeString(
      8,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 9));
  if (f != null) {
    writer.writeString(
      9,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 10));
  if (f != null) {
    writer.writeString(
      10,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 11));
  if (f != null) {
    writer.writeString(
      11,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 12));
  if (f != null) {
    writer.writeString(
      12,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 13));
  if (f != null) {
    writer.writeString(
      13,
      f
    );
  }
  f = /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (jspb.Message.getField(message, 14));
  if (f != null) {
    writer.writeEnum(
      14,
      f
    );
  }
};


/**
 * optional string hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setName = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearName = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasName = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string displayName = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getDisplayname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setDisplayname = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearDisplayname = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasDisplayname = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string explainText = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getExplaintext = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setExplaintext = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearExplaintext = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasExplaintext = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional PolicyScope scope = 5;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setScope = function(value) {
  return jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearScope = function() {
  return jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasScope = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional string registryKey = 6;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getRegistrykey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setRegistrykey = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearRegistrykey = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasRegistrykey = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string valueName = 7;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getValuename = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setValuename = function(value) {
  return jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearValuename = function() {
  return jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasValuename = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional string enabledValue = 8;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getEnabledvalue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setEnabledvalue = function(value) {
  return jspb.Message.setField(this, 8, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearEnabledvalue = function() {
  return jspb.Message.setField(this, 8, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasEnabledvalue = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional string disabledValue = 9;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getDisabledvalue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setDisabledvalue = function(value) {
  return jspb.Message.setField(this, 9, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearDisabledvalue = function() {
  return jspb.Message.setField(this, 9, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasDisabledvalue = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional string supportedOnRef = 10;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getSupportedonref = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setSupportedonref = function(value) {
  return jspb.Message.setField(this, 10, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearSupportedonref = function() {
  return jspb.Message.setField(this, 10, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasSupportedonref = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional string parentCategoryRef = 11;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getParentcategoryref = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setParentcategoryref = function(value) {
  return jspb.Message.setField(this, 11, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearParentcategoryref = function() {
  return jspb.Message.setField(this, 11, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasParentcategoryref = function() {
  return jspb.Message.getField(this, 11) != null;
};


/**
 * optional string presentationRef = 12;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getPresentationref = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setPresentationref = function(value) {
  return jspb.Message.setField(this, 12, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearPresentationref = function() {
  return jspb.Message.setField(this, 12, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasPresentationref = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * optional string clientExtension = 13;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getClientextension = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setClientextension = function(value) {
  return jspb.Message.setField(this, 13, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearClientextension = function() {
  return jspb.Message.setField(this, 13, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasClientextension = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional PolicyStatus policyStatus = 14;
 * @return {!proto.laborato.mesh.operator.v1.PolicyStatus}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.getPolicystatus = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (jspb.Message.getFieldWithDefault(this, 14, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyStatus} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.setPolicystatus = function(value) {
  return jspb.Message.setField(this, 14, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.clearPolicystatus = function() {
  return jspb.Message.setField(this, 14, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesByHashRequest.prototype.hasPolicystatus = function() {
  return jspb.Message.getField(this, 14) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdatePoliciesResponse;
  return proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.UpdatePoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.UpdatePoliciesResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
hash: jspb.Message.getFieldWithDefault(msg, 1, ""),
policyStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest;
  return proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (reader.readEnum());
      msg.setPolicyStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPolicyStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.setHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyStatus policy_status = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyStatus}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.getPolicyStatus = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyStatus} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesRequest.prototype.setPolicyStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse;
  return proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.UpdateStatusPoliciesResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
supportedOs: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest;
  return proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSupportedOs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSupportedOs();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string supported_os = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.getSupportedOs = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsRequest.prototype.setSupportedOs = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse;
  return proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated PolicySummary policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesBySupportedOsResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest;
  return proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
osBuildsList: jspb.Message.toObjectList(msg.getOsBuildsList(),
    proto.laborato.common.node.OsBuild.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse;
  return proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.node.OsBuild;
      reader.readMessage(value,proto.laborato.common.node.OsBuild.deserializeBinaryFromReader);
      msg.addOsBuilds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOsBuildsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.common.node.OsBuild.serializeBinaryToWriter
    );
  }
};


/**
 * repeated laborato.common.node.OsBuild os_builds = 1;
 * @return {!Array<!proto.laborato.common.node.OsBuild>}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.getOsBuildsList = function() {
  return /** @type{!Array<!proto.laborato.common.node.OsBuild>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.common.node.OsBuild, 1));
};


/**
 * @param {!Array<!proto.laborato.common.node.OsBuild>} value
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.setOsBuildsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.common.node.OsBuild=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.common.node.OsBuild}
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.addOsBuilds = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.common.node.OsBuild, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetAllSupportedOsResponse.prototype.clearOsBuildsList = function() {
  return this.setOsBuildsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
search: jspb.Message.getFieldWithDefault(msg, 1, ""),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.SearchPolicyShortRequest;
  return proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSearch(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSearch();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string search = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.getSearch = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest} returns this
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.setSearch = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortRequest} returns this
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.SearchPolicyShortResponse;
  return proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} returns this
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated PolicySummary policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} returns this
*/
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.SearchPolicyShortResponse} returns this
 */
proto.laborato.mesh.operator.v1.SearchPolicyShortResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
exportFormat: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest;
  return proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.laborato.common.export.ExportFormat} */ (reader.readEnum());
      msg.setExportFormat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExportFormat();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional laborato.common.export.ExportFormat export_format = 1;
 * @return {!proto.laborato.common.export.ExportFormat}
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.prototype.getExportFormat = function() {
  return /** @type {!proto.laborato.common.export.ExportFormat} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.laborato.common.export.ExportFormat} value
 * @return {!proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportAllPoliciesRequest.prototype.setExportFormat = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
admxFile: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest;
  return proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdmxFile(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAdmxFile();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string admx_file = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.getAdmxFile = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxRequest.prototype.setAdmxFile = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
admxFile: jspb.Message.getFieldWithDefault(msg, 2, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse;
  return proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdmxFile(value);
      break;
    case 3:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAdmxFile();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string admx_file = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.getAdmxFile = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.setAdmxFile = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated PolicySummary policies = 3;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 3));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByAdmxResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
category: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest;
  return proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCategory(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCategory();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string category = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.getCategory = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryRequest.prototype.setCategory = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse;
  return proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated PolicySummary policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetPoliciesByCategoryResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetCategoryTreeRequest;
  return proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, ""),
categoriesList: jspb.Message.toObjectList(msg.getCategoriesList(),
    proto.laborato.mesh.operator.v1.CategoryView.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetCategoryTreeResponse;
  return proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.CategoryView;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CategoryView.deserializeBinaryFromReader);
      msg.addCategories(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCategoriesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.CategoryView.serializeBinaryToWriter
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated CategoryView categories = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CategoryView>}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.getCategoriesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CategoryView>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CategoryView, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CategoryView>} value
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.setCategoriesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CategoryView=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CategoryView}
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.addCategories = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.CategoryView, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetCategoryTreeResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetCategoryTreeResponse.prototype.clearCategoriesList = function() {
  return this.setCategoriesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.CategoryView.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.CategoryView.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.CategoryView} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CategoryView.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
categoryName: jspb.Message.getFieldWithDefault(msg, 2, ""),
displayName: jspb.Message.getFieldWithDefault(msg, 3, ""),
childsList: jspb.Message.toObjectList(msg.getChildsList(),
    proto.laborato.mesh.operator.v1.CategoryView.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.CategoryView}
 */
proto.laborato.mesh.operator.v1.CategoryView.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.CategoryView;
  return proto.laborato.mesh.operator.v1.CategoryView.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.CategoryView} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.CategoryView}
 */
proto.laborato.mesh.operator.v1.CategoryView.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCategoryName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisplayName(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.CategoryView;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.CategoryView.deserializeBinaryFromReader);
      msg.addChilds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.CategoryView.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.CategoryView} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.CategoryView.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getCategoryName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDisplayName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getChildsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.CategoryView.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.CategoryView} returns this
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string category_name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.getCategoryName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CategoryView} returns this
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.setCategoryName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string display_name = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.getDisplayName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.CategoryView} returns this
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.setDisplayName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated CategoryView childs = 4;
 * @return {!Array<!proto.laborato.mesh.operator.v1.CategoryView>}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.getChildsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.CategoryView>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.CategoryView, 4));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.CategoryView>} value
 * @return {!proto.laborato.mesh.operator.v1.CategoryView} returns this
*/
proto.laborato.mesh.operator.v1.CategoryView.prototype.setChildsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.CategoryView=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.CategoryView}
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.addChilds = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.laborato.mesh.operator.v1.CategoryView, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.CategoryView} returns this
 */
proto.laborato.mesh.operator.v1.CategoryView.prototype.clearChildsList = function() {
  return this.setChildsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
admxFileHash: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListPoliciesRequest;
  return proto.laborato.mesh.operator.v1.ListPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdmxFileHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAdmxFileHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string admx_file_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.prototype.getAdmxFileHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListPoliciesRequest.prototype.setAdmxFileHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListPoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicyDescriptor.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListPoliciesResponse;
  return proto.laborato.mesh.operator.v1.ListPoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicyDescriptor;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListPoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicyDescriptor.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PolicyDescriptor policies = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDescriptor, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyDescriptor>} value
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyDescriptor=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor}
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.PolicyDescriptor, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListPoliciesResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPolicyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyRequest}
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPolicyRequest;
  return proto.laborato.mesh.operator.v1.GetPolicyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyRequest}
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPolicyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPolicyRequest.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
langCode: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest;
  return proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string lang_code = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest} returns this
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
policyId: jspb.Message.getFieldWithDefault(msg, 1, 0),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest;
  return proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPolicyId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional int64 policy_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.getPolicyId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.setPolicyId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetPolicyDetailsRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyDetails.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyDetails.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetails} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetails.toObject = function(includeInstance, msg) {
  var f, obj = {
policy: (f = msg.getPolicy()) && proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.toObject(includeInstance, f),
presentation: (f = msg.getPresentation()) && proto.laborato.mesh.operator.v1.PolicyPresentation.toObject(includeInstance, f),
policyElementsList: jspb.Message.toObjectList(msg.getPolicyElementsList(),
    proto.laborato.mesh.operator.v1.PolicyDetailsElement.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyDetails;
  return proto.laborato.mesh.operator.v1.PolicyDetails.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetails} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicyDetailsPolicy;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.deserializeBinaryFromReader);
      msg.setPolicy(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicyPresentation;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyPresentation.deserializeBinaryFromReader);
      msg.setPresentation(value);
      break;
    case 3:
      var value = new proto.laborato.mesh.operator.v1.PolicyDetailsElement;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDetailsElement.deserializeBinaryFromReader);
      msg.addPolicyElements(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyDetails.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetails} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetails.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicy();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.serializeBinaryToWriter
    );
  }
  f = message.getPresentation();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicyPresentation.serializeBinaryToWriter
    );
  }
  f = message.getPolicyElementsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.laborato.mesh.operator.v1.PolicyDetailsElement.serializeBinaryToWriter
    );
  }
};


/**
 * optional PolicyDetailsPolicy policy = 1;
 * @return {?proto.laborato.mesh.operator.v1.PolicyDetailsPolicy}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.getPolicy = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDetailsPolicy, 1));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicyDetailsPolicy|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.setPolicy = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.clearPolicy = function() {
  return this.setPolicy(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.hasPolicy = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional PolicyPresentation presentation = 2;
 * @return {?proto.laborato.mesh.operator.v1.PolicyPresentation}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.getPresentation = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicyPresentation} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicyPresentation, 2));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicyPresentation|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.setPresentation = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.clearPresentation = function() {
  return this.setPresentation(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.hasPresentation = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated PolicyDetailsElement policy_elements = 3;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElement>}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.getPolicyElementsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElement>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDetailsElement, 3));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElement>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.setPolicyElementsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElement=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement}
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.addPolicyElements = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.laborato.mesh.operator.v1.PolicyDetailsElement, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetails} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetails.prototype.clearPolicyElementsList = function() {
  return this.setPolicyElementsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
hash: jspb.Message.getFieldWithDefault(msg, 3, ""),
scope: jspb.Message.getFieldWithDefault(msg, 4, ""),
policyStatus: jspb.Message.getFieldWithDefault(msg, 5, ""),
version: jspb.Message.getFieldWithDefault(msg, 6, 0),
parentCategoryRef: (f = jspb.Message.getField(msg, 7)) == null ? undefined : f,
supportedOnRef: (f = jspb.Message.getField(msg, 8)) == null ? undefined : f,
clientExtension: (f = msg.getClientExtension()) && proto.google.protobuf.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyDetailsPolicy;
  return proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setHash(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setScope(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyStatus(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVersion(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentCategoryRef(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setSupportedOnRef(value);
      break;
    case 9:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setClientExtension(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getHash();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getScope();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPolicyStatus();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getVersion();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeString(
      7,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 8));
  if (f != null) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getClientExtension();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string hash = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setHash = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string scope = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getScope = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setScope = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string policy_status = 5;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getPolicyStatus = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setPolicyStatus = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional int32 version = 6;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setVersion = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional string parent_category_ref = 7;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getParentCategoryRef = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setParentCategoryRef = function(value) {
  return jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.clearParentCategoryRef = function() {
  return jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.hasParentCategoryRef = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional string supported_on_ref = 8;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getSupportedOnRef = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setSupportedOnRef = function(value) {
  return jspb.Message.setField(this, 8, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.clearSupportedOnRef = function() {
  return jspb.Message.setField(this, 8, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.hasSupportedOnRef = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.StringValue client_extension = 9;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.getClientExtension = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 9));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.setClientExtension = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsPolicy} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.clearClientExtension = function() {
  return this.setClientExtension(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsPolicy.prototype.hasClientExtension = function() {
  return jspb.Message.getField(this, 9) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyPresentation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
presentationId: jspb.Message.getFieldWithDefault(msg, 2, ""),
admlFile: jspb.Message.getFieldWithDefault(msg, 3, ""),
elementsList: jspb.Message.toObjectList(msg.getElementsList(),
    proto.laborato.mesh.operator.v1.PolicyPresentationElement.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyPresentation;
  return proto.laborato.mesh.operator.v1.PolicyPresentation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPresentationId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdmlFile(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.PolicyPresentationElement;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyPresentationElement.deserializeBinaryFromReader);
      msg.addElements(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyPresentation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getPresentationId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAdmlFile();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getElementsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.PolicyPresentationElement.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string presentation_id = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.getPresentationId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.setPresentationId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string adml_file = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.getAdmlFile = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.setAdmlFile = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated PolicyPresentationElement elements = 4;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyPresentationElement>}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.getElementsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyPresentationElement>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyPresentationElement, 4));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyPresentationElement>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation} returns this
*/
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.setElementsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentationElement=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement}
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.addElements = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.laborato.mesh.operator.v1.PolicyPresentationElement, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentation} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentation.prototype.clearElementsList = function() {
  return this.setElementsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyPresentationElement.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
type: jspb.Message.getFieldWithDefault(msg, 2, ""),
refId: jspb.Message.getFieldWithDefault(msg, 3, ""),
parentElementId: (f = msg.getParentElementId()) && proto.google.protobuf.Int32Value.toObject(includeInstance, f),
defaultValue: (f = msg.getDefaultValue()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
text: (f = msg.getText()) && proto.google.protobuf.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyPresentationElement;
  return proto.laborato.mesh.operator.v1.PolicyPresentationElement.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRefId(value);
      break;
    case 4:
      var value = new proto.google.protobuf.Int32Value;
      reader.readMessage(value,proto.google.protobuf.Int32Value.deserializeBinaryFromReader);
      msg.setParentElementId(value);
      break;
    case 5:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setDefaultValue(value);
      break;
    case 6:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setText(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyPresentationElement.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRefId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getParentElementId();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.google.protobuf.Int32Value.serializeBinaryToWriter
    );
  }
  f = message.getDefaultValue();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getText();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string type = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string ref_id = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getRefId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setRefId = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Int32Value parent_element_id = 4;
 * @return {?proto.google.protobuf.Int32Value}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getParentElementId = function() {
  return /** @type{?proto.google.protobuf.Int32Value} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Int32Value, 4));
};


/**
 * @param {?proto.google.protobuf.Int32Value|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setParentElementId = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.clearParentElementId = function() {
  return this.setParentElementId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.hasParentElementId = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.StringValue default_value = 5;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getDefaultValue = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 5));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setDefaultValue = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.clearDefaultValue = function() {
  return this.setDefaultValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.hasDefaultValue = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.StringValue text = 6;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.getText = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 6));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.setText = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyPresentationElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.clearText = function() {
  return this.setText(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyPresentationElement.prototype.hasText = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.repeatedFields_ = [15];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyDetailsElement.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
elementId: jspb.Message.getFieldWithDefault(msg, 2, ""),
type: jspb.Message.getFieldWithDefault(msg, 3, ""),
valueName: (f = msg.getValueName()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
registryKey: (f = msg.getRegistryKey()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
required: (f = msg.getRequired()) && proto.google.protobuf.BoolValue.toObject(includeInstance, f),
maxLength: (f = msg.getMaxLength()) && proto.google.protobuf.Int32Value.toObject(includeInstance, f),
maxStrings: (f = msg.getMaxStrings()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
expandable: (f = msg.getExpandable()) && proto.google.protobuf.BoolValue.toObject(includeInstance, f),
minValue: (f = msg.getMinValue()) && proto.google.protobuf.Int64Value.toObject(includeInstance, f),
maxValue: (f = msg.getMaxValue()) && proto.google.protobuf.Int64Value.toObject(includeInstance, f),
valuePrefix: (f = msg.getValuePrefix()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
explicitValue: (f = msg.getExplicitValue()) && proto.google.protobuf.BoolValue.toObject(includeInstance, f),
additive: (f = msg.getAdditive()) && proto.google.protobuf.BoolValue.toObject(includeInstance, f),
itemsList: jspb.Message.toObjectList(msg.getItemsList(),
    proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyDetailsElement;
  return proto.laborato.mesh.operator.v1.PolicyDetailsElement.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setElementId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 4:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setValueName(value);
      break;
    case 5:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setRegistryKey(value);
      break;
    case 6:
      var value = new proto.google.protobuf.BoolValue;
      reader.readMessage(value,proto.google.protobuf.BoolValue.deserializeBinaryFromReader);
      msg.setRequired(value);
      break;
    case 7:
      var value = new proto.google.protobuf.Int32Value;
      reader.readMessage(value,proto.google.protobuf.Int32Value.deserializeBinaryFromReader);
      msg.setMaxLength(value);
      break;
    case 8:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setMaxStrings(value);
      break;
    case 9:
      var value = new proto.google.protobuf.BoolValue;
      reader.readMessage(value,proto.google.protobuf.BoolValue.deserializeBinaryFromReader);
      msg.setExpandable(value);
      break;
    case 10:
      var value = new proto.google.protobuf.Int64Value;
      reader.readMessage(value,proto.google.protobuf.Int64Value.deserializeBinaryFromReader);
      msg.setMinValue(value);
      break;
    case 11:
      var value = new proto.google.protobuf.Int64Value;
      reader.readMessage(value,proto.google.protobuf.Int64Value.deserializeBinaryFromReader);
      msg.setMaxValue(value);
      break;
    case 12:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setValuePrefix(value);
      break;
    case 13:
      var value = new proto.google.protobuf.BoolValue;
      reader.readMessage(value,proto.google.protobuf.BoolValue.deserializeBinaryFromReader);
      msg.setExplicitValue(value);
      break;
    case 14:
      var value = new proto.google.protobuf.BoolValue;
      reader.readMessage(value,proto.google.protobuf.BoolValue.deserializeBinaryFromReader);
      msg.setAdditive(value);
      break;
    case 15:
      var value = new proto.laborato.mesh.operator.v1.PolicyDetailsElementItem;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.deserializeBinaryFromReader);
      msg.addItems(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyDetailsElement.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getElementId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getValueName();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getRegistryKey();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getRequired();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.google.protobuf.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getMaxLength();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.google.protobuf.Int32Value.serializeBinaryToWriter
    );
  }
  f = message.getMaxStrings();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getExpandable();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.google.protobuf.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getMinValue();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.google.protobuf.Int64Value.serializeBinaryToWriter
    );
  }
  f = message.getMaxValue();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.google.protobuf.Int64Value.serializeBinaryToWriter
    );
  }
  f = message.getValuePrefix();
  if (f != null) {
    writer.writeMessage(
      12,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getExplicitValue();
  if (f != null) {
    writer.writeMessage(
      13,
      f,
      proto.google.protobuf.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getAdditive();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      proto.google.protobuf.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getItemsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      15,
      f,
      proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string element_id = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getElementId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setElementId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string type = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.StringValue value_name = 4;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getValueName = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 4));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setValueName = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearValueName = function() {
  return this.setValueName(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasValueName = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.StringValue registry_key = 5;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getRegistryKey = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 5));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setRegistryKey = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearRegistryKey = function() {
  return this.setRegistryKey(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasRegistryKey = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.BoolValue required = 6;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getRequired = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.BoolValue, 6));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setRequired = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearRequired = function() {
  return this.setRequired(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasRequired = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional google.protobuf.Int32Value max_length = 7;
 * @return {?proto.google.protobuf.Int32Value}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getMaxLength = function() {
  return /** @type{?proto.google.protobuf.Int32Value} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Int32Value, 7));
};


/**
 * @param {?proto.google.protobuf.Int32Value|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setMaxLength = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearMaxLength = function() {
  return this.setMaxLength(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasMaxLength = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.StringValue max_strings = 8;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getMaxStrings = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 8));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setMaxStrings = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearMaxStrings = function() {
  return this.setMaxStrings(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasMaxStrings = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.BoolValue expandable = 9;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getExpandable = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.BoolValue, 9));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setExpandable = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearExpandable = function() {
  return this.setExpandable(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasExpandable = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional google.protobuf.Int64Value min_value = 10;
 * @return {?proto.google.protobuf.Int64Value}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getMinValue = function() {
  return /** @type{?proto.google.protobuf.Int64Value} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Int64Value, 10));
};


/**
 * @param {?proto.google.protobuf.Int64Value|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setMinValue = function(value) {
  return jspb.Message.setWrapperField(this, 10, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearMinValue = function() {
  return this.setMinValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasMinValue = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional google.protobuf.Int64Value max_value = 11;
 * @return {?proto.google.protobuf.Int64Value}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getMaxValue = function() {
  return /** @type{?proto.google.protobuf.Int64Value} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Int64Value, 11));
};


/**
 * @param {?proto.google.protobuf.Int64Value|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setMaxValue = function(value) {
  return jspb.Message.setWrapperField(this, 11, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearMaxValue = function() {
  return this.setMaxValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasMaxValue = function() {
  return jspb.Message.getField(this, 11) != null;
};


/**
 * optional google.protobuf.StringValue value_prefix = 12;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getValuePrefix = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 12));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setValuePrefix = function(value) {
  return jspb.Message.setWrapperField(this, 12, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearValuePrefix = function() {
  return this.setValuePrefix(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasValuePrefix = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * optional google.protobuf.BoolValue explicit_value = 13;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getExplicitValue = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.BoolValue, 13));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setExplicitValue = function(value) {
  return jspb.Message.setWrapperField(this, 13, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearExplicitValue = function() {
  return this.setExplicitValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasExplicitValue = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional google.protobuf.BoolValue additive = 14;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getAdditive = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.BoolValue, 14));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setAdditive = function(value) {
  return jspb.Message.setWrapperField(this, 14, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearAdditive = function() {
  return this.setAdditive(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.hasAdditive = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * repeated PolicyDetailsElementItem items = 15;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem>}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.getItemsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyDetailsElementItem, 15));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.setItemsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 15, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.addItems = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 15, opt_value, proto.laborato.mesh.operator.v1.PolicyDetailsElementItem, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElement.prototype.clearItemsList = function() {
  return this.setItemsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
parentType: jspb.Message.getFieldWithDefault(msg, 3, ""),
type: jspb.Message.getFieldWithDefault(msg, 4, ""),
valueType: jspb.Message.getFieldWithDefault(msg, 5, ""),
valueName: (f = msg.getValueName()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
required: (f = msg.getRequired()) && proto.google.protobuf.BoolValue.toObject(includeInstance, f),
parentId: (f = msg.getParentId()) && proto.google.protobuf.Int32Value.toObject(includeInstance, f),
displayName: (f = msg.getDisplayName()) && proto.google.protobuf.StringValue.toObject(includeInstance, f),
value: jspb.Message.getFieldWithDefault(msg, 10, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyDetailsElementItem;
  return proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentType(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setValueType(value);
      break;
    case 6:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setValueName(value);
      break;
    case 7:
      var value = new proto.google.protobuf.BoolValue;
      reader.readMessage(value,proto.google.protobuf.BoolValue.deserializeBinaryFromReader);
      msg.setRequired(value);
      break;
    case 8:
      var value = new proto.google.protobuf.Int32Value;
      reader.readMessage(value,proto.google.protobuf.Int32Value.deserializeBinaryFromReader);
      msg.setParentId(value);
      break;
    case 9:
      var value = new proto.google.protobuf.StringValue;
      reader.readMessage(value,proto.google.protobuf.StringValue.deserializeBinaryFromReader);
      msg.setDisplayName(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getParentType();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getValueType();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getValueName();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getRequired();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.google.protobuf.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getParentId();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.google.protobuf.Int32Value.serializeBinaryToWriter
    );
  }
  f = message.getDisplayName();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.google.protobuf.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string parent_type = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getParentType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setParentType = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string type = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string value_type = 5;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getValueType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setValueType = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional google.protobuf.StringValue value_name = 6;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getValueName = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 6));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setValueName = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.clearValueName = function() {
  return this.setValueName(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.hasValueName = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional google.protobuf.BoolValue required = 7;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getRequired = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.BoolValue, 7));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setRequired = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.clearRequired = function() {
  return this.setRequired(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.hasRequired = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.Int32Value parent_id = 8;
 * @return {?proto.google.protobuf.Int32Value}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getParentId = function() {
  return /** @type{?proto.google.protobuf.Int32Value} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Int32Value, 8));
};


/**
 * @param {?proto.google.protobuf.Int32Value|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setParentId = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.clearParentId = function() {
  return this.setParentId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.hasParentId = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.StringValue display_name = 9;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getDisplayName = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.StringValue, 9));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setDisplayName = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.clearDisplayName = function() {
  return this.setDisplayName(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.hasDisplayName = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional string value = 10;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDetailsElementItem} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDetailsElementItem.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
groupsList: jspb.Message.toObjectList(msg.getGroupsList(),
    proto.laborato.mesh.operator.v1.PolicyGroup.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse;
  return proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicyGroup;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyGroup.deserializeBinaryFromReader);
      msg.addGroups(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getGroupsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicyGroup.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PolicyGroup groups = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyGroup>}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.getGroupsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyGroup>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyGroup, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyGroup>} value
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse} returns this
*/
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.setGroupsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyGroup=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup}
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.addGroups = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.PolicyGroup, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse} returns this
 */
proto.laborato.mesh.operator.v1.ListPoliciesGroupedByScopeResponse.prototype.clearGroupsList = function() {
  return this.setGroupsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.repeatedFields_ = [13,14,15,16];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyDescriptor.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyDescriptor} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
scope: jspb.Message.getFieldWithDefault(msg, 3, 0),
registryKey: jspb.Message.getFieldWithDefault(msg, 4, ""),
valueName: jspb.Message.getFieldWithDefault(msg, 5, ""),
enabledValue: jspb.Message.getFieldWithDefault(msg, 6, ""),
disabledValue: jspb.Message.getFieldWithDefault(msg, 7, ""),
supportedOnRef: jspb.Message.getFieldWithDefault(msg, 8, ""),
parentCategory: jspb.Message.getFieldWithDefault(msg, 9, ""),
presentationRef: jspb.Message.getFieldWithDefault(msg, 10, ""),
policyStatus: jspb.Message.getFieldWithDefault(msg, 11, 0),
version: jspb.Message.getFieldWithDefault(msg, 12, 0),
elementsList: jspb.Message.toObjectList(msg.getElementsList(),
    proto.laborato.mesh.operator.v1.PolicyElement.toObject, includeInstance),
requiredCapabilitiesList: (f = jspb.Message.getRepeatedField(msg, 14)) == null ? undefined : f,
requiredHardwareList: (f = jspb.Message.getRepeatedField(msg, 15)) == null ? undefined : f,
admxFileHashesList: (f = jspb.Message.getRepeatedField(msg, 16)) == null ? undefined : f,
explainText: jspb.Message.getFieldWithDefault(msg, 17, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyDescriptor;
  return proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDescriptor} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setRegistryKey(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setValueName(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnabledValue(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisabledValue(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setSupportedOnRef(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentCategory(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setPresentationRef(value);
      break;
    case 11:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (reader.readEnum());
      msg.setPolicyStatus(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVersion(value);
      break;
    case 13:
      var value = new proto.laborato.mesh.operator.v1.PolicyElement;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyElement.deserializeBinaryFromReader);
      msg.addElements(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.addRequiredCapabilities(value);
      break;
    case 15:
      var value = /** @type {string} */ (reader.readString());
      msg.addRequiredHardware(value);
      break;
    case 16:
      var value = /** @type {string} */ (reader.readString());
      msg.addAdmxFileHashes(value);
      break;
    case 17:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyDescriptor.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyDescriptor} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getScope();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getRegistryKey();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getValueName();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getEnabledValue();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getDisabledValue();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getSupportedOnRef();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getParentCategory();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getPresentationRef();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getPolicyStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      11,
      f
    );
  }
  f = message.getVersion();
  if (f !== 0) {
    writer.writeInt32(
      12,
      f
    );
  }
  f = message.getElementsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      13,
      f,
      proto.laborato.mesh.operator.v1.PolicyElement.serializeBinaryToWriter
    );
  }
  f = message.getRequiredCapabilitiesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      14,
      f
    );
  }
  f = message.getRequiredHardwareList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      15,
      f
    );
  }
  f = message.getAdmxFileHashesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      16,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      17,
      f
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional PolicyScope scope = 3;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setScope = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional string registry_key = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getRegistryKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setRegistryKey = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string value_name = 5;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getValueName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setValueName = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string enabled_value = 6;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getEnabledValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setEnabledValue = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string disabled_value = 7;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getDisabledValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setDisabledValue = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string supported_on_ref = 8;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getSupportedOnRef = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setSupportedOnRef = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string parent_category = 9;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getParentCategory = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setParentCategory = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string presentation_ref = 10;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getPresentationRef = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setPresentationRef = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional PolicyStatus policy_status = 11;
 * @return {!proto.laborato.mesh.operator.v1.PolicyStatus}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getPolicyStatus = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyStatus} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setPolicyStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 11, value);
};


/**
 * optional int32 version = 12;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setVersion = function(value) {
  return jspb.Message.setProto3IntField(this, 12, value);
};


/**
 * repeated PolicyElement elements = 13;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyElement>}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getElementsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyElement>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyElement, 13));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyElement>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
*/
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setElementsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 13, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyElement=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.addElements = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 13, opt_value, proto.laborato.mesh.operator.v1.PolicyElement, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.clearElementsList = function() {
  return this.setElementsList([]);
};


/**
 * repeated string required_capabilities = 14;
 * @return {!Array<string>}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getRequiredCapabilitiesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 14));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setRequiredCapabilitiesList = function(value) {
  return jspb.Message.setField(this, 14, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.addRequiredCapabilities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 14, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.clearRequiredCapabilitiesList = function() {
  return this.setRequiredCapabilitiesList([]);
};


/**
 * repeated string required_hardware = 15;
 * @return {!Array<string>}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getRequiredHardwareList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 15));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setRequiredHardwareList = function(value) {
  return jspb.Message.setField(this, 15, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.addRequiredHardware = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 15, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.clearRequiredHardwareList = function() {
  return this.setRequiredHardwareList([]);
};


/**
 * repeated string admx_file_hashes = 16;
 * @return {!Array<string>}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getAdmxFileHashesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 16));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setAdmxFileHashesList = function(value) {
  return jspb.Message.setField(this, 16, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.addAdmxFileHashes = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 16, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.clearAdmxFileHashesList = function() {
  return this.setAdmxFileHashesList([]);
};


/**
 * optional string explain_text = 17;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 17, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyDescriptor} returns this
 */
proto.laborato.mesh.operator.v1.PolicyDescriptor.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 17, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyElement.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyElement} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyElement.toObject = function(includeInstance, msg) {
  var f, obj = {
idName: jspb.Message.getFieldWithDefault(msg, 1, ""),
type: jspb.Message.getFieldWithDefault(msg, 2, ""),
valueName: jspb.Message.getFieldWithDefault(msg, 3, ""),
maxLength: jspb.Message.getFieldWithDefault(msg, 4, 0),
required: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
clientExtension: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement}
 */
proto.laborato.mesh.operator.v1.PolicyElement.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyElement;
  return proto.laborato.mesh.operator.v1.PolicyElement.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyElement} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement}
 */
proto.laborato.mesh.operator.v1.PolicyElement.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setValueName(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxLength(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRequired(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setClientExtension(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyElement.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyElement} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyElement.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIdName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValueName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMaxLength();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getRequired();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getClientExtension();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional string id_name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getIdName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setIdName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string type = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string value_name = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getValueName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setValueName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 max_length = 4;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getMaxLength = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setMaxLength = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional bool required = 5;
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getRequired = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setRequired = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * optional string client_extension = 6;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.getClientExtension = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyElement} returns this
 */
proto.laborato.mesh.operator.v1.PolicyElement.prototype.setClientExtension = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyGroup.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyGroup.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyGroup} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyGroup.toObject = function(includeInstance, msg) {
  var f, obj = {
scope: jspb.Message.getFieldWithDefault(msg, 1, ""),
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.PolicySummary.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyGroup;
  return proto.laborato.mesh.operator.v1.PolicyGroup.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyGroup} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setScope(value);
      break;
    case 2:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyGroup.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyGroup} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyGroup.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScope();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
};


/**
 * optional string scope = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.getScope = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup} returns this
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.setScope = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated PolicySummary policies = 2;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 2));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicySummary>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup} returns this
*/
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.laborato.mesh.operator.v1.PolicySummary, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyGroup} returns this
 */
proto.laborato.mesh.operator.v1.PolicyGroup.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicySummary.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicySummary.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
name: jspb.Message.getFieldWithDefault(msg, 2, ""),
displayName: jspb.Message.getFieldWithDefault(msg, 3, ""),
explainText: jspb.Message.getFieldWithDefault(msg, 4, ""),
scope: jspb.Message.getFieldWithDefault(msg, 5, 0),
policyStatus: jspb.Message.getFieldWithDefault(msg, 6, 0),
version: jspb.Message.getFieldWithDefault(msg, 7, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicySummary;
  return proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisplayName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setExplainText(value);
      break;
    case 5:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (reader.readEnum());
      msg.setScope(value);
      break;
    case 6:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (reader.readEnum());
      msg.setPolicyStatus(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicySummary} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDisplayName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getExplainText();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getScope();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getPolicyStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      6,
      f
    );
  }
  f = message.getVersion();
  if (f !== 0) {
    writer.writeInt32(
      7,
      f
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string display_name = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getDisplayName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setDisplayName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string explain_text = 4;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getExplainText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setExplainText = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional PolicyScope scope = 5;
 * @return {!proto.laborato.mesh.operator.v1.PolicyScope}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getScope = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyScope} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyScope} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setScope = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional PolicyStatus policy_status = 6;
 * @return {!proto.laborato.mesh.operator.v1.PolicyStatus}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getPolicyStatus = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyStatus} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyStatus} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setPolicyStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 6, value);
};


/**
 * optional int32 version = 7;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicySummary} returns this
 */
proto.laborato.mesh.operator.v1.PolicySummary.prototype.setVersion = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest;
  return proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
};


/**
 * optional laborato.common.target.Target target = 1;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 1));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest} returns this
*/
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
status: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse;
  return proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.laborato.mesh.operator.v1.ACResponseStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional ACResponseStatus status = 1;
 * @return {!proto.laborato.mesh.operator.v1.ACResponseStatus}
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.prototype.getStatus = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.ACResponseStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.ACResponseStatus} value
 * @return {!proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.RestoreAllPoliciesResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0),
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
selection: (f = msg.getSelection()) && proto.laborato.common.policy.PolicySelection.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest;
  return proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    case 2:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 3:
      var value = new proto.laborato.common.policy.PolicySelection;
      reader.readMessage(value,proto.laborato.common.policy.PolicySelection.deserializeBinaryFromReader);
      msg.setSelection(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getSelection();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.laborato.common.policy.PolicySelection.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional laborato.common.target.Target target = 2;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 2));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} returns this
*/
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional laborato.common.policy.PolicySelection selection = 3;
 * @return {?proto.laborato.common.policy.PolicySelection}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.getSelection = function() {
  return /** @type{?proto.laborato.common.policy.PolicySelection} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.policy.PolicySelection, 3));
};


/**
 * @param {?proto.laborato.common.policy.PolicySelection|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} returns this
*/
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.setSelection = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.clearSelection = function() {
  return this.setSelection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionRequest.prototype.hasSelection = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse;
  return proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyCollectionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
collectionId: jspb.Message.getFieldWithDefault(msg, 1, 0),
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest;
  return proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCollectionId(value);
      break;
    case 2:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollectionId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 collection_id = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.getCollectionId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional laborato.common.target.Target target = 2;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 2));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} returns this
*/
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse;
  return proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyCollectionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AssignPolicyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
selection: (f = msg.getSelection()) && proto.laborato.common.policy.PolicySelection.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AssignPolicyRequest;
  return proto.laborato.mesh.operator.v1.AssignPolicyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 3:
      var value = new proto.laborato.common.policy.PolicySelection;
      reader.readMessage(value,proto.laborato.common.policy.PolicySelection.deserializeBinaryFromReader);
      msg.setSelection(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AssignPolicyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getSelection();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.laborato.common.policy.PolicySelection.serializeBinaryToWriter
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional laborato.common.target.Target target = 2;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 2));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} returns this
*/
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional laborato.common.policy.PolicySelection selection = 3;
 * @return {?proto.laborato.common.policy.PolicySelection}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.getSelection = function() {
  return /** @type{?proto.laborato.common.policy.PolicySelection} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.policy.PolicySelection, 3));
};


/**
 * @param {?proto.laborato.common.policy.PolicySelection|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} returns this
*/
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.setSelection = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.clearSelection = function() {
  return this.setSelection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.AssignPolicyRequest.prototype.hasSelection = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.AssignPolicyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyResponse}
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.AssignPolicyResponse;
  return proto.laborato.mesh.operator.v1.AssignPolicyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.AssignPolicyResponse}
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.AssignPolicyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.AssignPolicyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.AssignPolicyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RemovePolicyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyRequest}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RemovePolicyRequest;
  return proto.laborato.mesh.operator.v1.RemovePolicyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyRequest}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RemovePolicyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional laborato.common.target.Target target = 2;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 2));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} returns this
*/
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyRequest} returns this
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.RemovePolicyRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.RemovePolicyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyResponse}
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.RemovePolicyResponse;
  return proto.laborato.mesh.operator.v1.RemovePolicyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.RemovePolicyResponse}
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.RemovePolicyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.RemovePolicyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.RemovePolicyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.ValueCase = {
  VALUE_NOT_SET: 0,
  DWORD: 1,
  STRING_VALUE: 2
};

/**
 * @return {proto.laborato.mesh.operator.v1.PolicyValueOverride.ValueCase}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.getValueCase = function() {
  return /** @type {proto.laborato.mesh.operator.v1.PolicyValueOverride.ValueCase} */(jspb.Message.computeOneofCase(this, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyValueOverride.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyValueOverride} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.toObject = function(includeInstance, msg) {
  var f, obj = {
dword: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
stringValue: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyValueOverride;
  return proto.laborato.mesh.operator.v1.PolicyValueOverride.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyValueOverride} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setDword(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setStringValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyValueOverride.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyValueOverride} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional int32 dword = 1;
 * @return {number}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.getDword = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride} returns this
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.setDword = function(value) {
  return jspb.Message.setOneofField(this, 1, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride} returns this
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.clearDword = function() {
  return jspb.Message.setOneofField(this, 1, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.hasDword = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string string_value = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.getStringValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride} returns this
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.setStringValue = function(value) {
  return jspb.Message.setOneofField(this, 2, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyValueOverride} returns this
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.clearStringValue = function() {
  return jspb.Message.setOneofField(this, 2, proto.laborato.mesh.operator.v1.PolicyValueOverride.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyValueOverride.prototype.hasStringValue = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
exportFormat: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.ExportPolicyStateRequest;
  return proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.common.export.ExportFormat} */ (reader.readEnum());
      msg.setExportFormat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getExportFormat();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional laborato.common.target.Target target = 1;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 1));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} returns this
*/
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional laborato.common.export.ExportFormat export_format = 2;
 * @return {!proto.laborato.common.export.ExportFormat}
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.getExportFormat = function() {
  return /** @type {!proto.laborato.common.export.ExportFormat} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.common.export.ExportFormat} value
 * @return {!proto.laborato.mesh.operator.v1.ExportPolicyStateRequest} returns this
 */
proto.laborato.mesh.operator.v1.ExportPolicyStateRequest.prototype.setExportFormat = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest;
  return proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional laborato.common.target.Target target = 1;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 1));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} returns this
*/
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
policiesList: jspb.Message.toObjectList(msg.getPoliciesList(),
    proto.laborato.mesh.operator.v1.EffectivePolicy.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse;
  return proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.EffectivePolicy;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.EffectivePolicy.deserializeBinaryFromReader);
      msg.addPolicies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPoliciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.EffectivePolicy.serializeBinaryToWriter
    );
  }
};


/**
 * repeated EffectivePolicy policies = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.EffectivePolicy>}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.getPoliciesList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.EffectivePolicy>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.EffectivePolicy, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.EffectivePolicy>} value
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.setPoliciesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.EffectivePolicy=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy}
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.addPolicies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.EffectivePolicy, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetEffectivePoliciesResponse.prototype.clearPoliciesList = function() {
  return this.setPoliciesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.EffectivePolicy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.EffectivePolicy} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
source: jspb.Message.getFieldWithDefault(msg, 2, 0),
usersid: jspb.Message.getFieldWithDefault(msg, 3, ""),
summary: (f = msg.getSummary()) && proto.laborato.mesh.operator.v1.PolicySummary.toObject(includeInstance, f),
selection: (f = msg.getSelection()) && proto.laborato.common.policy.PolicySelection.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.EffectivePolicy;
  return proto.laborato.mesh.operator.v1.EffectivePolicy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.EffectivePolicy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicySource} */ (reader.readEnum());
      msg.setSource(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsersid(value);
      break;
    case 4:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.setSummary(value);
      break;
    case 5:
      var value = new proto.laborato.common.policy.PolicySelection;
      reader.readMessage(value,proto.laborato.common.policy.PolicySelection.deserializeBinaryFromReader);
      msg.setSelection(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.EffectivePolicy.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.EffectivePolicy} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSource();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getUsersid();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSummary();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
  f = message.getSelection();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.laborato.common.policy.PolicySelection.serializeBinaryToWriter
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicySource source = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicySource}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.getSource = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicySource} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicySource} value
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.setSource = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string userSid = 3;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.getUsersid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.setUsersid = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional PolicySummary summary = 4;
 * @return {?proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.getSummary = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicySummary} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 4));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicySummary|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
*/
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.setSummary = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.clearSummary = function() {
  return this.setSummary(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.hasSummary = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional laborato.common.policy.PolicySelection selection = 5;
 * @return {?proto.laborato.common.policy.PolicySelection}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.getSelection = function() {
  return /** @type{?proto.laborato.common.policy.PolicySelection} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.policy.PolicySelection, 5));
};


/**
 * @param {?proto.laborato.common.policy.PolicySelection|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
*/
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.setSelection = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.EffectivePolicy} returns this
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.clearSelection = function() {
  return this.setSelection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.EffectivePolicy.prototype.hasSelection = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAssignmentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
langCode: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAssignmentsRequest;
  return proto.laborato.mesh.operator.v1.GetAssignmentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLangCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAssignmentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getLangCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional laborato.common.target.Target target = 1;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 1));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} returns this
*/
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string lang_code = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.getLangCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsRequest} returns this
 */
proto.laborato.mesh.operator.v1.GetAssignmentsRequest.prototype.setLangCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.GetAssignmentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
assignmentsList: jspb.Message.toObjectList(msg.getAssignmentsList(),
    proto.laborato.mesh.operator.v1.PolicyAssignment.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.GetAssignmentsResponse;
  return proto.laborato.mesh.operator.v1.GetAssignmentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.laborato.mesh.operator.v1.PolicyAssignment;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyAssignment.deserializeBinaryFromReader);
      msg.addAssignments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.GetAssignmentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAssignmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.laborato.mesh.operator.v1.PolicyAssignment.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PolicyAssignment assignments = 1;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyAssignment>}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.getAssignmentsList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyAssignment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyAssignment, 1));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyAssignment>} value
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse} returns this
*/
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.setAssignmentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssignment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment}
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.addAssignments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.laborato.mesh.operator.v1.PolicyAssignment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.GetAssignmentsResponse} returns this
 */
proto.laborato.mesh.operator.v1.GetAssignmentsResponse.prototype.clearAssignmentsList = function() {
  return this.setAssignmentsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.repeatedFields_ = [7];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyAssignment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssignment} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.toObject = function(includeInstance, msg) {
  var f, obj = {
policyHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
desiredState: jspb.Message.getFieldWithDefault(msg, 2, 0),
override: (f = msg.getOverride()) && proto.laborato.mesh.operator.v1.PolicyValueOverride.toObject(includeInstance, f),
target: (f = msg.getTarget()) && proto.laborato.common.target.Target.toObject(includeInstance, f),
sid: jspb.Message.getFieldWithDefault(msg, 5, ""),
summary: (f = msg.getSummary()) && proto.laborato.mesh.operator.v1.PolicySummary.toObject(includeInstance, f),
stateList: jspb.Message.toObjectList(msg.getStateList(),
    proto.laborato.mesh.operator.v1.PolicyAssigmentsState.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyAssignment;
  return proto.laborato.mesh.operator.v1.PolicyAssignment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssignment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPolicyHash(value);
      break;
    case 2:
      var value = /** @type {!proto.laborato.mesh.operator.v1.PolicyDesiredState} */ (reader.readEnum());
      msg.setDesiredState(value);
      break;
    case 3:
      var value = new proto.laborato.mesh.operator.v1.PolicyValueOverride;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyValueOverride.deserializeBinaryFromReader);
      msg.setOverride(value);
      break;
    case 4:
      var value = new proto.laborato.common.target.Target;
      reader.readMessage(value,proto.laborato.common.target.Target.deserializeBinaryFromReader);
      msg.setTarget(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setSid(value);
      break;
    case 6:
      var value = new proto.laborato.mesh.operator.v1.PolicySummary;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicySummary.deserializeBinaryFromReader);
      msg.setSummary(value);
      break;
    case 7:
      var value = new proto.laborato.mesh.operator.v1.PolicyAssigmentsState;
      reader.readMessage(value,proto.laborato.mesh.operator.v1.PolicyAssigmentsState.deserializeBinaryFromReader);
      msg.addState(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyAssignment.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssignment} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPolicyHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDesiredState();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getOverride();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.laborato.mesh.operator.v1.PolicyValueOverride.serializeBinaryToWriter
    );
  }
  f = message.getTarget();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.laborato.common.target.Target.serializeBinaryToWriter
    );
  }
  f = message.getSid();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getSummary();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.laborato.mesh.operator.v1.PolicySummary.serializeBinaryToWriter
    );
  }
  f = message.getStateList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      7,
      f,
      proto.laborato.mesh.operator.v1.PolicyAssigmentsState.serializeBinaryToWriter
    );
  }
};


/**
 * optional string policy_hash = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getPolicyHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setPolicyHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional PolicyDesiredState desired_state = 2;
 * @return {!proto.laborato.mesh.operator.v1.PolicyDesiredState}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getDesiredState = function() {
  return /** @type {!proto.laborato.mesh.operator.v1.PolicyDesiredState} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyDesiredState} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setDesiredState = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional PolicyValueOverride override = 3;
 * @return {?proto.laborato.mesh.operator.v1.PolicyValueOverride}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getOverride = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicyValueOverride} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicyValueOverride, 3));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicyValueOverride|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
*/
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setOverride = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.clearOverride = function() {
  return this.setOverride(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.hasOverride = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional laborato.common.target.Target target = 4;
 * @return {?proto.laborato.common.target.Target}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getTarget = function() {
  return /** @type{?proto.laborato.common.target.Target} */ (
    jspb.Message.getWrapperField(this, proto.laborato.common.target.Target, 4));
};


/**
 * @param {?proto.laborato.common.target.Target|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
*/
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setTarget = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.clearTarget = function() {
  return this.setTarget(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.hasTarget = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string sid = 5;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getSid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setSid = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional PolicySummary summary = 6;
 * @return {?proto.laborato.mesh.operator.v1.PolicySummary}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getSummary = function() {
  return /** @type{?proto.laborato.mesh.operator.v1.PolicySummary} */ (
    jspb.Message.getWrapperField(this, proto.laborato.mesh.operator.v1.PolicySummary, 6));
};


/**
 * @param {?proto.laborato.mesh.operator.v1.PolicySummary|undefined} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
*/
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setSummary = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.clearSummary = function() {
  return this.setSummary(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.hasSummary = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * repeated PolicyAssigmentsState state = 7;
 * @return {!Array<!proto.laborato.mesh.operator.v1.PolicyAssigmentsState>}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.getStateList = function() {
  return /** @type{!Array<!proto.laborato.mesh.operator.v1.PolicyAssigmentsState>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.laborato.mesh.operator.v1.PolicyAssigmentsState, 7));
};


/**
 * @param {!Array<!proto.laborato.mesh.operator.v1.PolicyAssigmentsState>} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
*/
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.setStateList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 7, value);
};


/**
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState=} opt_value
 * @param {number=} opt_index
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState}
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.addState = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 7, opt_value, proto.laborato.mesh.operator.v1.PolicyAssigmentsState, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssignment} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssignment.prototype.clearStateList = function() {
  return this.setStateList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.toObject = function(opt_includeInstance) {
  return proto.laborato.mesh.operator.v1.PolicyAssigmentsState.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.toObject = function(includeInstance, msg) {
  var f, obj = {
idName: jspb.Message.getFieldWithDefault(msg, 1, ""),
value: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.laborato.mesh.operator.v1.PolicyAssigmentsState;
  return proto.laborato.mesh.operator.v1.PolicyAssigmentsState.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.laborato.mesh.operator.v1.PolicyAssigmentsState.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIdName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string id_name = 1;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.getIdName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.setIdName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.laborato.mesh.operator.v1.PolicyAssigmentsState} returns this
 */
proto.laborato.mesh.operator.v1.PolicyAssigmentsState.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.PolicyScope = {
  POLICY_SCOPE_NONE: 0,
  POLICY_SCOPE_USER: 1,
  POLICY_SCOPE_MACHINE: 2,
  POLICY_SCOPE_BOTH: 3
};

/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.PolicyDesiredState = {
  POLICY_DESIRED_STATE_UNSPECIFIED: 0,
  POLICY_DESIRED_STATE_ENABLED: 1,
  POLICY_DESIRED_STATE_DISABLED: 2
};

/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.PolicySource = {
  POLICY_SOURCE_UNSPECIFIED: 0,
  POLICY_SOURCE_GLOBAL: 1,
  POLICY_SOURCE_AGENT: 2,
  POLICY_SOURCE_USER: 3
};

/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.PolicyStatus = {
  DRAFT: 0,
  APPROVE: 1,
  REJECTED: 2,
  OBSOLETE: 3
};

/**
 * @enum {number}
 */
proto.laborato.mesh.operator.v1.ACResponseStatus = {
  RESPONSE_STATUS_OK: 0,
  RESPONSE_STATUS_ERROR: 1
};

const namespace = proto.laborato.mesh.operator.v1;

const isDevMode =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";

if (isDevMode && Object.keys(namespace).length === 0) {
  console.warn("[laborato.mesh.operator.v1] Namespace is empty!");
}

const v1_pb_exports = namespace;

export default v1_pb_exports;

export const ACResponseStatus = v1_pb_exports.ACResponseStatus;
export const AdmxFile = v1_pb_exports.AdmxFile;
export const AdmxSnapshot = v1_pb_exports.AdmxSnapshot;
export const AgentDetails = v1_pb_exports.AgentDetails;
export const AgentSummary = v1_pb_exports.AgentSummary;
export const AssignPolicyCollectionRequest = v1_pb_exports.AssignPolicyCollectionRequest;
export const AssignPolicyCollectionResponse = v1_pb_exports.AssignPolicyCollectionResponse;
export const AssignPolicyRequest = v1_pb_exports.AssignPolicyRequest;
export const AssignPolicyResponse = v1_pb_exports.AssignPolicyResponse;
export const CategoryView = v1_pb_exports.CategoryView;
export const CollectionDetailsResponse = v1_pb_exports.CollectionDetailsResponse;
export const CollectionTranslation = v1_pb_exports.CollectionTranslation;
export const CollectionsSummary = v1_pb_exports.CollectionsSummary;
export const CreateCollectionRequest = v1_pb_exports.CreateCollectionRequest;
export const CreateCollectionsPoliciesRequest = v1_pb_exports.CreateCollectionsPoliciesRequest;
export const CreateCollectionsPoliciesResponse = v1_pb_exports.CreateCollectionsPoliciesResponse;
export const DeleteCollectionRequest = v1_pb_exports.DeleteCollectionRequest;
export const DeleteCollectionResponse = v1_pb_exports.DeleteCollectionResponse;
export const EffectivePolicy = v1_pb_exports.EffectivePolicy;
export const ExportAgentStatusRequest = v1_pb_exports.ExportAgentStatusRequest;
export const ExportAllPoliciesRequest = v1_pb_exports.ExportAllPoliciesRequest;
export const ExportCollectionPoliciesRequest = v1_pb_exports.ExportCollectionPoliciesRequest;
export const ExportPolicyStateRequest = v1_pb_exports.ExportPolicyStateRequest;
export const GetAdmxSnapshotRequest = v1_pb_exports.GetAdmxSnapshotRequest;
export const GetAgentRequest = v1_pb_exports.GetAgentRequest;
export const GetAllCollectionsRequest = v1_pb_exports.GetAllCollectionsRequest;
export const GetAllCollectionsResponse = v1_pb_exports.GetAllCollectionsResponse;
export const GetAllSupportedOsRequest = v1_pb_exports.GetAllSupportedOsRequest;
export const GetAllSupportedOsResponse = v1_pb_exports.GetAllSupportedOsResponse;
export const GetAllVersionByHashRequast = v1_pb_exports.GetAllVersionByHashRequast;
export const GetAllVersionByHashResponse = v1_pb_exports.GetAllVersionByHashResponse;
export const GetAppliedCollectionsByAgentCategoryRequest = v1_pb_exports.GetAppliedCollectionsByAgentCategoryRequest;
export const GetAppliedCollectionsByAgentRequest = v1_pb_exports.GetAppliedCollectionsByAgentRequest;
export const GetAppliedCollectionsByGroupRequest = v1_pb_exports.GetAppliedCollectionsByGroupRequest;
export const GetAppliedCollectionsByUserRequest = v1_pb_exports.GetAppliedCollectionsByUserRequest;
export const GetAppliedCollectionsResponse = v1_pb_exports.GetAppliedCollectionsResponse;
export const GetAssignmentsRequest = v1_pb_exports.GetAssignmentsRequest;
export const GetAssignmentsResponse = v1_pb_exports.GetAssignmentsResponse;
export const GetCategoryTreeRequest = v1_pb_exports.GetCategoryTreeRequest;
export const GetCategoryTreeResponse = v1_pb_exports.GetCategoryTreeResponse;
export const GetCollectionByIdRequest = v1_pb_exports.GetCollectionByIdRequest;
export const GetEffectivePoliciesRequest = v1_pb_exports.GetEffectivePoliciesRequest;
export const GetEffectivePoliciesResponse = v1_pb_exports.GetEffectivePoliciesResponse;
export const GetPoliciesByAdmxRequest = v1_pb_exports.GetPoliciesByAdmxRequest;
export const GetPoliciesByAdmxResponse = v1_pb_exports.GetPoliciesByAdmxResponse;
export const GetPoliciesByCategoryRequest = v1_pb_exports.GetPoliciesByCategoryRequest;
export const GetPoliciesByCategoryResponse = v1_pb_exports.GetPoliciesByCategoryResponse;
export const GetPoliciesBySupportedOsRequest = v1_pb_exports.GetPoliciesBySupportedOsRequest;
export const GetPoliciesBySupportedOsResponse = v1_pb_exports.GetPoliciesBySupportedOsResponse;
export const GetPoliciesInCollectionRequest = v1_pb_exports.GetPoliciesInCollectionRequest;
export const GetPoliciesInCollectionResponse = v1_pb_exports.GetPoliciesInCollectionResponse;
export const GetPolicyDetailsRequest = v1_pb_exports.GetPolicyDetailsRequest;
export const GetPolicyRequest = v1_pb_exports.GetPolicyRequest;
export const GetUniqueManufacturersRequest = v1_pb_exports.GetUniqueManufacturersRequest;
export const GetUniqueManufacturersResponse = v1_pb_exports.GetUniqueManufacturersResponse;
export const ImportAdmxFileRequest = v1_pb_exports.ImportAdmxFileRequest;
export const ImportAdmxResponse = v1_pb_exports.ImportAdmxResponse;
export const ImportAdmxZipRequest = v1_pb_exports.ImportAdmxZipRequest;
export const ListAdmxFilesRequest = v1_pb_exports.ListAdmxFilesRequest;
export const ListAdmxFilesResponse = v1_pb_exports.ListAdmxFilesResponse;
export const ListAgentsRequest = v1_pb_exports.ListAgentsRequest;
export const ListAgentsResponse = v1_pb_exports.ListAgentsResponse;
export const ListPoliciesGroupedByScopeRequest = v1_pb_exports.ListPoliciesGroupedByScopeRequest;
export const ListPoliciesGroupedByScopeResponse = v1_pb_exports.ListPoliciesGroupedByScopeResponse;
export const ListPoliciesRequest = v1_pb_exports.ListPoliciesRequest;
export const ListPoliciesResponse = v1_pb_exports.ListPoliciesResponse;
export const ListUserGroupsForAgentRequest = v1_pb_exports.ListUserGroupsForAgentRequest;
export const ListUserGroupsForAgentResponse = v1_pb_exports.ListUserGroupsForAgentResponse;
export const ListUsersForAgentRequest = v1_pb_exports.ListUsersForAgentRequest;
export const ListUsersForAgentResponse = v1_pb_exports.ListUsersForAgentResponse;
export const ManufacturerModels = v1_pb_exports.ManufacturerModels;
export const PolicyAssigmentsState = v1_pb_exports.PolicyAssigmentsState;
export const PolicyAssignment = v1_pb_exports.PolicyAssignment;
export const PolicyCategory = v1_pb_exports.PolicyCategory;
export const PolicyConfigureModel = v1_pb_exports.PolicyConfigureModel;
export const PolicyDescriptor = v1_pb_exports.PolicyDescriptor;
export const PolicyDesiredState = v1_pb_exports.PolicyDesiredState;
export const PolicyDetails = v1_pb_exports.PolicyDetails;
export const PolicyDetailsElement = v1_pb_exports.PolicyDetailsElement;
export const PolicyDetailsElementItem = v1_pb_exports.PolicyDetailsElementItem;
export const PolicyDetailsPolicy = v1_pb_exports.PolicyDetailsPolicy;
export const PolicyElement = v1_pb_exports.PolicyElement;
export const PolicyGroup = v1_pb_exports.PolicyGroup;
export const PolicyNamespace = v1_pb_exports.PolicyNamespace;
export const PolicyPresentation = v1_pb_exports.PolicyPresentation;
export const PolicyPresentationElement = v1_pb_exports.PolicyPresentationElement;
export const PolicyScope = v1_pb_exports.PolicyScope;
export const PolicySource = v1_pb_exports.PolicySource;
export const PolicyStatus = v1_pb_exports.PolicyStatus;
export const PolicySummary = v1_pb_exports.PolicySummary;
export const PolicyValueOverride = v1_pb_exports.PolicyValueOverride;
export const PolicyVersion = v1_pb_exports.PolicyVersion;
export const RemovePoliciesFromCollectionRequest = v1_pb_exports.RemovePoliciesFromCollectionRequest;
export const RemovePolicyCollectionRequest = v1_pb_exports.RemovePolicyCollectionRequest;
export const RemovePolicyCollectionResponse = v1_pb_exports.RemovePolicyCollectionResponse;
export const RemovePolicyRequest = v1_pb_exports.RemovePolicyRequest;
export const RemovePolicyResponse = v1_pb_exports.RemovePolicyResponse;
export const RestoreAllPoliciesRequest = v1_pb_exports.RestoreAllPoliciesRequest;
export const RestoreAllPoliciesResponse = v1_pb_exports.RestoreAllPoliciesResponse;
export const SearchPolicyShortRequest = v1_pb_exports.SearchPolicyShortRequest;
export const SearchPolicyShortResponse = v1_pb_exports.SearchPolicyShortResponse;
export const UpdateAgentRequest = v1_pb_exports.UpdateAgentRequest;
export const UpdateAgentResponse = v1_pb_exports.UpdateAgentResponse;
export const UpdateCollectionRequest = v1_pb_exports.UpdateCollectionRequest;
export const UpdatePoliciesByHashAndVersionRequest = v1_pb_exports.UpdatePoliciesByHashAndVersionRequest;
export const UpdatePoliciesByHashRequest = v1_pb_exports.UpdatePoliciesByHashRequest;
export const UpdatePoliciesResponse = v1_pb_exports.UpdatePoliciesResponse;
export const UpdateStatusPoliciesRequest = v1_pb_exports.UpdateStatusPoliciesRequest;
export const UpdateStatusPoliciesResponse = v1_pb_exports.UpdateStatusPoliciesResponse;
export const ValueCase = v1_pb_exports.ValueCase;
