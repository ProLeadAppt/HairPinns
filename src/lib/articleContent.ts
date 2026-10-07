type Section = { content?: string; subsections?: { heading: string; content: string }[]; bullets?: string[]; steps?: string[] };
export type ArticleContent = { introduction: string; sections: Section[]; stylistTip?: string; faqSection?: { question: string; answer: string }[] };
export function articleWordCount(content: ArticleContent): number {
  const text = [content.introduction, content.stylistTip, ...(content.sections || []).flatMap(section => [
    section.content, ...(section.subsections?.map(item => item.content) || []), ...(section.bullets || []), ...(section.steps || []),
  ]), ...(content.faqSection?.flatMap(item => [item.question, item.answer]) || [])].filter(Boolean).join(" ");
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").split(/\s+/).filter(Boolean).length;
}
