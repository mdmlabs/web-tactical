declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*?worker" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module "google-protobuf/google/protobuf/wrappers_pb" {
  export class StringValue {
    setValue(value: string): StringValue;
    getValue(): string;
  }
  export namespace StringValue {
    export type AsObject = { value: string };
  }
  export class BoolValue {
    setValue(value: boolean): BoolValue;
    getValue(): boolean;
  }
  export namespace BoolValue {
    export type AsObject = { value: boolean };
  }
  export class Int32Value {
    setValue(value: number): Int32Value;
    getValue(): number;
  }
  export namespace Int32Value {
    export type AsObject = { value: number };
  }
  export class Int64Value {
    setValue(value: number | string): Int64Value;
    getValue(): string;
  }
  export namespace Int64Value {
    export type AsObject = { value: string };
  }
}
