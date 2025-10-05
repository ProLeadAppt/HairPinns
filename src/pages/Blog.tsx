import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";
import { Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Hair Care Blog | Expert Tips from Hair Pinns Bangor</title>
        <meta name="description" content="Expert hair care advice, styling tips, and product recommendations from Hair Pinns salon in Bangor, Sutherland Shire. Learn from experienced stylists." />
        <link rel="canonical" href="https://hairpinns.com.au/blog" />
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Hair Care Blog" 
            subtitle="Expert tips, trends, and advice from our Bangor stylists"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-shadow duration-base">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="accent" size="sm" className="mb-3">
                      {post.category}
                    </Badge>
                    <h2 className="text-h2 font-heading text-heading mb-3 group-hover:text-brand-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
