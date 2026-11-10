import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import logo from "@/assets/images/hair-pinns-logo-full.webp";
import { renderInlineLinks } from "@/lib/renderInlineLinks";
import { BUSINESS_NAP } from "@/config/businessConfig";
import "./EventEditorial.css";

type EventPost = { title: string; date: string; readTime: string; author: string; image: string; imageAlt: string; content: { introduction: string; sections: readonly { heading: string; content: string }[] } };
const Paragraphs = ({ text }: { text: string }) => <>{text.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph.split("\n").map((line, lineIndex) => <span key={lineIndex}>{lineIndex > 0 && <br />}{renderInlineLinks(line)}</span>)}</p>)}</>;
export default function EventEditorial({ post, seo }: { post: EventPost; seo: ReactNode }) {
 const contents = post.content.sections.map((section, index) => <a key={section.heading} href={`#event-section-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</a>);
 return <div className="event-editorial">{seo}
 <a className="event-skip" href="#main-content">Skip to article</a>
 <header><Link to="/" aria-label="Hair Pinns home"><img src={logo} alt="Hair Pinns, Happy Hair Specialist" width="250" height="160" /></Link><nav aria-label="Main navigation"><Link to="/">Our salon</Link><Link to="/services/">Services</Link><Link className="button" to="/services/">Explore services ↗</Link></nav></header>
 <main id="main-content" tabIndex={-1} data-blog-article="">
 <div className="hero"><div><div className="eyebrow"><Link to="/blog/">The Hair Pinns Journal</Link> / Salon advice</div><h1>{post.title}</h1><p>A little planning. A clearer appointment.<br />More time to enjoy the occasion.</p><div className="meta"><span>By {post.author}</span><span>{post.date}</span><span>{post.readTime}</span></div></div><figure><img src={post.image} alt={post.imageAlt} width="1080" height="1080" loading="eager" fetchPriority="high" /><figcaption>Jena Pinn · Hair Pinns, Bangor</figcaption></figure></div>
 <div className="plan"><div className="plan-inner"><div><div className="eyebrow">Before you book</div><h2>Start with three things.</h2></div>{[['01 / Your timing','When do you need to be ready?'],['02 / Your finish','What look do you have in mind?'],['03 / Your hair','What is your starting point?']].map(([title, text]) => <div key={title}><div className="eyebrow">{title}</div><p>{text}</p></div>)}</div></div>
 <div className="layout"><aside className="toc"><nav aria-label="Article contents"><div className="eyebrow">In this guide</div>{contents}</nav></aside><article id="article-content"><details className="mobile-toc"><summary>In this guide · 7 simple steps</summary><nav aria-label="Article contents">{contents}</nav></details><Paragraphs text={post.content.introduction} />{post.content.sections.map((section,index) => <section key={section.heading} id={`event-section-${index}`} className="article-section"><div className="eyebrow">{String(index+1).padStart(2,'0')} / The event edit</div><h2>{section.heading}</h2><Paragraphs text={section.content} /></section>)}</article></div>
 <section className="cta"><div><div className="eyebrow">Your next step</div><h2>Make a little room for you.</h2><p>Explore the services and check your current booking options.</p><p>{BUSINESS_NAP.address.street}, {BUSINESS_NAP.address.locality} NSW 2234</p></div><Link className="button" to="/services/">Explore Hair Pinns services ↗</Link></section>
 </main><footer><span>Hair Pinns · Happy Hair Specialist</span><Link to="/blog/">Back to the journal</Link></footer></div>;
}
