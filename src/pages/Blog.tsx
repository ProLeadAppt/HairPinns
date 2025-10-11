import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Hair Care Blog | Expert Tips from Hair Pinns Bangor</title>
        <meta name="description" content="Expert hair care advice, styling tips, and product recommendations from Hair Pinns salon in Bangor, Sutherland Shire. Learn from experienced stylists." />
        <link rel="canonical" href="https://hairpinns.com.au/blog" />
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-500/10 via-accent/20 to-background py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-heading mb-6 leading-tight">
                Expert Hair Care Insights
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Professional tips, trends, and advice from Bangor's trusted hair specialists
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 lg:py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to={`/blog/${featuredPost.slug}`}
              className="group block"
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3]">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-500 text-white font-semibold text-sm shadow-lg">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="lg:pl-8">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/50 text-brand-600 font-medium text-sm mb-6">
                    {featuredPost.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-heading mb-4 group-hover:text-brand-500 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-brand-500 font-semibold group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Regular Posts Grid */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {regularPosts.map((post) => (
                <Link 
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="h-full flex flex-col bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-heading/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex-grow flex flex-col p-6 lg:p-8">
                      <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-accent/50 text-brand-600 font-medium text-xs mb-4">
                        {post.category}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-heading text-heading mb-3 group-hover:text-brand-500 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-brand-500 to-brand-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
              Ready to Transform Your Hair?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Book your consultation with Jena at Hair Pinns Bangor
            </p>
            <a 
              href="https://www.fresha.com/a/hair-pinns-bangor-76-old-illawarra-road-9z7ejbry/booking?utm_source=site&utm_medium=cta&utm_campaign=booking"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full hover:bg-accent transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Book with Jena
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
