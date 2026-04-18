function reverseByteHexPairs(segment: string): string {
  const pairs: string[] = [];
  for (let i = 0; i < segment.length; i += 2) {
    pairs.push(segment.slice(i, i + 2));
  }
  return [...pairs].reverse().join("");
}

function hexStringToUint8Array(hex32: string): Uint8Array {
  if (hex32.length !== 32) {
    throw new Error(`Expected 32 hex chars, got ${hex32.length}`);
  }
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    out[i] = Number.parseInt(hex32.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}


const GUID_SEGMENTS =
  /^([0-9a-fA-F]{8})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{12})$/;

export function guidToDotNetBytes(guid: string): Uint8Array {
  const m = GUID_SEGMENTS.exec(guid);
  if (!m) {
    throw new Error(`Invalid GUID format: ${guid}`);
  }
  const [, p1, p2, p3, p4, p5] = m;
  const hex =
    reverseByteHexPairs(p1) +
    reverseByteHexPairs(p2) +
    reverseByteHexPairs(p3) +
    p4 +
    p5;
  return hexStringToUint8Array(hex);
}

export function dotNetBytesToGuidString(bytes: Uint8Array): string {
  if (bytes.length !== 16) {
    throw new Error(`Expected 16 bytes for UUID, got ${bytes.length}`);
  }
  const hex = [...bytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const p1 = reverseByteHexPairs(hex.slice(0, 8));
  const p2 = reverseByteHexPairs(hex.slice(8, 12));
  const p3 = reverseByteHexPairs(hex.slice(12, 16));
  const p4 = hex.slice(16, 20);
  const p5 = hex.slice(20, 32);
  return `${p1}-${p2}-${p3}-${p4}-${p5}`;
}

function tryBase64ToBytes(value: string): Uint8Array | null {
  try {
    const binary = atob(value);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      const code = binary.codePointAt(i);
      if (code === undefined) break;
      out[i] = code & 0xff;
    }
    return out;
  } catch {
    return null;
  }
}

export function connectivityBytesToGuidString(value: unknown): string {
  if (value == null || value === "") return "";

  if (value instanceof Uint8Array) {
    if (value.length === 16) {
      return dotNetBytesToGuidString(value);
    }
    try {
      return new TextDecoder("utf-8", { fatal: false }).decode(value);
    } catch {
      return "";
    }
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        trimmed,
      )
    ) {
      return trimmed;
    }
    const fromB64 = tryBase64ToBytes(trimmed);
    if (fromB64?.length === 16) {
      return dotNetBytesToGuidString(fromB64);
    }
  }

  return "";
}
