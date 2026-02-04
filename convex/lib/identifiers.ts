export function normalizeHandle(input: string): string {
  const trimmed = input.trim().toLowerCase();
  const allowed = trimmed.replace(/[^a-z0-9_]/g, "");
  return allowed;
}

export function validateHandle(input: string): { valid: boolean; error?: string } {
  const normalized = normalizeHandle(input);

  if (normalized.length < 3 || normalized.length > 20) {
    return { valid: false, error: "Handle must be 3-20 characters long" };
  }

  if (!/^[a-z0-9_]+$/.test(normalized)) {
    return { valid: false, error: "Handle can only contain lowercase letters, numbers, and underscores" };
  }

  return { valid: true };
}

export async function generateCertificateCode(): Promise<string> {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `oc_${hex}`;
}
