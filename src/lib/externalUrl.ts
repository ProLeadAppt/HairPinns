export function normalizeExternalWebhookUrl(value: string | undefined): string {
  const candidate = value?.trim() || "";
  if (!candidate) return "";

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}
