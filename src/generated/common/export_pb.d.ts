import * as jspb from 'google-protobuf'



export class ExportResponse extends jspb.Message {
  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): ExportResponse;

  getExportFormat(): ExportFormat;
  setExportFormat(value: ExportFormat): ExportResponse;

  getFileName(): string;
  setFileName(value: string): ExportResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExportResponse): ExportResponse.AsObject;
  static serializeBinaryToWriter(message: ExportResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportResponse;
  static deserializeBinaryFromReader(message: ExportResponse, reader: jspb.BinaryReader): ExportResponse;
}

export namespace ExportResponse {
  export type AsObject = {
    content: Uint8Array | string;
    exportFormat: ExportFormat;
    fileName: string;
  };
}

export enum ExportFormat {
  CSV = 0,
  XLSX = 1,
}
