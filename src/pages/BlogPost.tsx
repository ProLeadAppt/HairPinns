import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, User } from "lucide-react";
import Badge from "@/components/design-system/Badge";
import ProductModule from "@/components/blog/ProductModule";
import LeadMagnetBox from "@/components/blog/LeadMagnetBox";
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";
import { getPostBySlug } from "@/data/blogPosts";
import {
  generateOrganizationSchema,
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateFAQPageSchema,
} from "@/lib/schema";

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  // Calculate word count from content
  const wordCount = 
    post.content.introduction.split(/\s+/).filter((word) => word.length > 0).length +
    post.content.sections.reduce((total, section) => 
      total + section.content.split(/\s+/).filter((word) => word.length > 0).length, 0
    );

  const organizationSchema = generateOrganizationSchema();
  const blogPostSchema = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    datePublished: new Date(post.date).toISOString(),
    image: post.image,
    url: `https://hairpinns.com/blog/${post.slug}`,
    wordCount: wordCount,
  });

  const blogFaqs = [
    {
      question: "What's the best treatment for frizz in humid Sydney weather?",
      answer: "A keratin-free smoothing treatment paired with a humidity-resistant leave-in works best for Sydney's changeable climate. Start with a gentle, sulphate-free wash, add a protein-balanced mask weekly, then seal with a heat-activated protectant before blow-drying. On high-humidity days, finish with a light, flexible-hold spray rather than heavy oils (they can collapse volume). If your hair is colour-treated, choose formulas labelled 'colour-safe' to prevent fade. For persistent halo frizz around the hairline, sleep on a silk pillowcase and avoid rough towel drying."
    },
    {
      question: "How often should I tone blonde hair at home?",
      answer: "Every 1–2 weeks for maintenance, using a pH-balanced violet or blue-violet treatment, depending on your undertone. Keep dwell time short (3–5 mins) to avoid over-ash. Follow with a hydrating mask because toners can be slightly drying. If your water is mineral-rich (common around the Shire), use a chelating shampoo once every 2–4 weeks to remove buildup that accelerates brassiness. In-salon glosses every 6–8 weeks will keep the tone fresher for longer."
    },
    {
      question: "Keratin vs. smoothing — which lasts longer?",
      answer: "Keratin treatments (formaldehyde-free) generally outlast quick smoothing services, giving 2–4 months of frizz reduction with proper care. Smoothing services are gentler and great for first-timers or colour-treated hair, lasting 4–8 weeks. Longevity depends on aftercare: sulphate-free cleanser, low heat, UV protection, and avoiding salt/chlorine. If you're blonde or fine-textured, start with smoothing; if you're coarse or highly porous, a keratin option may give better durability."
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hairpinns.com' },
    { name: 'Blog', url: 'https://hairpinns.com/blog' },
    { name: post.title, url: `https://hairpinns.com/blog/${post.slug}` },
  ]);

  const faqSchema = generateFAQPageSchema(blogFaqs);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.title} | Hair Pinns Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://hairpinns.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(blogPostSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title }
            ]}
          />
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-xl">
          <Badge variant="accent" className="mb-4">{post.category}</Badge>
          
          <h1 className="text-h1-lg font-heading text-heading mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <div className="aspect-video bg-muted rounded-card overflow-hidden mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-foreground leading-relaxed font-medium">
              {post.content.introduction}
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            {post.content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-h2 font-heading text-heading mb-4">
                  {section.heading}
                </h2>
                <p className="text-foreground leading-relaxed">
                  {section.content}
                </p>

                {/* Insert Product Module after 3rd section */}
                {index === 2 && post.content.productModule && (
                  <ProductModule 
                    title={post.content.productModule.title}
                    products={post.content.productModule.products}
                  />
                )}

                {/* Insert Lead Magnet after 5th section */}
                {index === 4 && <LeadMagnetBox />}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-h2 font-heading text-heading mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {blogFaqs.map((faq, index) => (
                <div key={index} className="bg-muted rounded-card p-6">
                  <h3 className="font-semibold text-heading mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-foreground leading-relaxed mb-4">
                    {faq.answer}
                  </p>
                  <FaqFeedbackWidget question={faq.question} />
                </div>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-brand-500 hover:text-brand-600 transition-colors font-medium"
            >
              ← Back to All Articles
            </Link>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
