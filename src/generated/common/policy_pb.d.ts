import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class PolicySelection extends jspb.Message {
  getValue(): string;
  setValue(value: string): PolicySelection;

  getElementsList(): Array<PolicyElementSelection>;
  setElementsList(value: Array<PolicyElementSelection>): PolicySelection;
  clearElementsList(): PolicySelection;
  addElements(value?: PolicyElementSelection, index?: number): PolicyElementSelection;

  getListKeysList(): Array<string>;
  setListKeysList(value: Array<string>): PolicySelection;
  clearListKeysList(): PolicySelection;
  addListKeys(value: string, index?: number): PolicySelection;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicySelection.AsObject;
  static toObject(includeInstance: boolean, msg: PolicySelection): PolicySelection.AsObject;
  static serializeBinaryToWriter(message: PolicySelection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicySelection;
  static deserializeBinaryFromReader(message: PolicySelection, reader: jspb.BinaryReader): PolicySelection;
}

export namespace PolicySelection {
  export type AsObject = {
    value: string;
    elementsList: Array<PolicyElementSelection.AsObject>;
    listKeysList: Array<string>;
  };
}

export class PolicyElementSelection extends jspb.Message {
  getIdName(): string;
  setIdName(value: string): PolicyElementSelection;

  getValue(): string;
  setValue(value: string): PolicyElementSelection;

  getChildsList(): Array<PolicyElementItemSelection>;
  setChildsList(value: Array<PolicyElementItemSelection>): PolicyElementSelection;
  clearChildsList(): PolicyElementSelection;
  addChilds(value?: PolicyElementItemSelection, index?: number): PolicyElementItemSelection;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyElementSelection.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyElementSelection): PolicyElementSelection.AsObject;
  static serializeBinaryToWriter(message: PolicyElementSelection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyElementSelection;
  static deserializeBinaryFromReader(message: PolicyElementSelection, reader: jspb.BinaryReader): PolicyElementSelection;
}

export namespace PolicyElementSelection {
  export type AsObject = {
    idName: string;
    value: string;
    childsList: Array<PolicyElementItemSelection.AsObject>;
  };
}

export class PolicyElementItemSelection extends jspb.Message {
  getIdName(): string;
  setIdName(value: string): PolicyElementItemSelection;

  getValue(): string;
  setValue(value: string): PolicyElementItemSelection;

  getChildsList(): Array<PolicyElementItemSelection>;
  setChildsList(value: Array<PolicyElementItemSelection>): PolicyElementItemSelection;
  clearChildsList(): PolicyElementItemSelection;
  addChilds(value?: PolicyElementItemSelection, index?: number): PolicyElementItemSelection;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PolicyElementItemSelection.AsObject;
  static toObject(includeInstance: boolean, msg: PolicyElementItemSelection): PolicyElementItemSelection.AsObject;
  static serializeBinaryToWriter(message: PolicyElementItemSelection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PolicyElementItemSelection;
  static deserializeBinaryFromReader(message: PolicyElementItemSelection, reader: jspb.BinaryReader): PolicyElementItemSelection;
}

export namespace PolicyElementItemSelection {
  export type AsObject = {
    idName: string;
    value: string;
    childsList: Array<PolicyElementItemSelection.AsObject>;
  };
}

