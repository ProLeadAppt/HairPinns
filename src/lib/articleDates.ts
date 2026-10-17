/** Editorial dates keep day precision instead of inventing an event time. */
export function articleDates(post: { date: string; publishedDate?: string; updatedDate?: string }) {
  return {
    datePublished: post.publishedDate ?? new Date(post.date).toISOString(),
    dateModified: post.updatedDate,
    updatedLabel: post.updatedDate
      ? new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${post.updatedDate}T00:00:00Z`))
      : undefined,
  };
}
