import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Calendar, Clock, User } from "lucide-react";
import Badge from "@/components/design-system/Badge";
import ProductModule from "@/components/blog/ProductModule";
import LeadMagnetBox from "@/components/blog/LeadMagnetBox";
import { getPostBySlug } from "@/data/blogPosts";
import {
  generateOrganizationSchema,
  generateBlogPostSchema,
  generateBreadcrumbSchema,
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://hairpinns.com' },
    { name: 'Blog', url: 'https://hairpinns.com/blog' },
    { name: post.title, url: `https://hairpinns.com/blog/${post.slug}` },
  ]);

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
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">{post.title}</span>
          </nav>
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

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-brand-500 hover:text-brand-600 transition-colors font-medium"
            >
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              Back to All Articles
            </Link>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
