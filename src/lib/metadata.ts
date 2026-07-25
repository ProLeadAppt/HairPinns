export interface MetaDescriptionOptions {
  maxLength?: number;
  minLength?: number;
  suffix?: string;
}

export interface MetaTitleOptions {
  maxLength?: number;
}

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

const clipAtWord = (value: string, maxLength: number, suffix = "…") => {
  if (value.length <= maxLength) return value;

  const available = Math.max(1, maxLength - suffix.length);
  const candidate = value.slice(0, available + 1);
  const boundary = candidate.lastIndexOf(" ");
  const clipped = normalize(candidate.slice(0, boundary > 0 ? boundary : available));
  return `${clipped}${suffix}`;
};

export const buildMetaDescription = (
  source: string,
  { maxLength = 160, minLength = 90, suffix }: MetaDescriptionOptions = {},
) => {
  let description = normalize(source);
  const normalizedSuffix = suffix ? normalize(suffix) : "";

  if (
    normalizedSuffix &&
    description.length < minLength &&
    !description.toLocaleLowerCase("en-AU").includes(normalizedSuffix.toLocaleLowerCase("en-AU"))
  ) {
    description = normalize(`${description} ${normalizedSuffix}`);
  }

  return clipAtWord(description, maxLength);
};

export const buildMetaTitle = (
  parts: Array<string | null | undefined>,
  { maxLength = 60 }: MetaTitleOptions = {},
) => {
  const title = parts.map((part) => normalize(part ?? "")).filter(Boolean).join(" | ");
  return clipAtWord(title, maxLength);
};
