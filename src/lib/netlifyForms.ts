export async function submitNetlifyForm(
  formName: "hair-pinns-contact" | "hair-pinns-review-feedback",
  fields: Record<string, string | number | boolean | null>,
): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName });

  for (const [key, value] of Object.entries(fields)) {
    if (value !== null && value !== "") body.set(key, String(value));
  }

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Form submission failed with HTTP ${response.status}`);
  }
}
