interface CategoryNavProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryClick: (category: string) => void;
}

export const CategoryNav = ({ categories, activeCategory, onCategoryClick }: CategoryNavProps) => {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-32">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-3">
          Browse
        </h3>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className={`w-full text-left px-3 py-2 text-sm rounded-btn transition-all relative ${
                activeCategory === category
                  ? "text-brand-500 font-medium bg-accent before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-brand-500"
                  : "text-text hover:text-brand-500 hover:bg-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
