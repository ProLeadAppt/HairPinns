/** Use actual option labels rather than brush-specific instructions on every product. */
export function productOptionGuidance(optionNames: string[], variantCount: number, imageCount: number): string | null {
  if (variantCount <= 1) return null;
  const labels = optionNames.filter(name => name !== "Title").map(name => name.toLowerCase());
  const choice = labels.length ? labels.join(" / ") : "option";
  return `Choose your ${choice} above.${imageCount > 1 ? " Gallery-only photographs do not change your selection." : ""}`;
}
