import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import Badge from "@/components/design-system/Badge";
import { Calendar, Clock } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      slug: "winter-hair-care-tips",
      title: "Winter Hair Care: Essential Tips for Healthy Hair",
      excerpt: "Keep your hair healthy and vibrant through the cold months with our expert tips and product recommendations.",
      category: "Hair Care",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      image: "/placeholder.svg"
    },
    {
      slug: "latest-color-trends",
      title: "2024 Hair Color Trends You Need to Try",
      excerpt: "From warm caramels to icy blondes, discover the hottest hair color trends this season.",
      category: "Trends",
      date: "Dec 10, 2024",
      readTime: "4 min read",
      image: "/placeholder.svg"
    },
    {
      slug: "bridal-hair-guide",
      title: "The Ultimate Bridal Hair Guide",
      excerpt: "Everything you need to know about choosing and preparing your perfect wedding day hairstyle.",
      category: "Weddings",
      date: "Dec 5, 2024",
      readTime: "7 min read",
      image: "/placeholder.svg"
    },
    {
      slug: "product-recommendations",
      title: "Our Top Product Picks for Damaged Hair",
      excerpt: "Professional recommendations for repairing and restoring damaged, over-processed hair.",
      category: "Products",
      date: "Nov 28, 2024",
      readTime: "6 min read",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Hair Care Blog" 
            subtitle="Expert tips, trends, and advice from our stylists"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
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
