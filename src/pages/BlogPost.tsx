import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import Badge from "@/components/design-system/Badge";

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">Post</span>
          </nav>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-xl">
          <Badge variant="accent" className="mb-4">Hair Care</Badge>
          
          <h1 className="text-h1-lg font-heading text-heading mb-4">
            Blog Post Title
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Dec 15, 2024
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              5 min read
            </span>
          </div>

          <div className="aspect-video bg-muted rounded-card overflow-hidden mb-8">
            <img 
              src="/placeholder.svg" 
              alt="Blog post featured image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed mb-6">
              This is a sample blog post. In a real implementation, you would fetch 
              the actual post content based on the slug parameter and render it here.
            </p>
            
            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">
              Section Heading
            </h2>
            
            <p className="text-foreground leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris.
            </p>
            
            <ul className="space-y-2 mb-6 text-foreground">
              <li>• First important point about hair care</li>
              <li>• Second key tip for maintaining healthy hair</li>
              <li>• Third essential recommendation</li>
            </ul>
            
            <p className="text-foreground leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
