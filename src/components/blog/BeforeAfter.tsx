interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}

const BeforeAfter = ({ 
  beforeImage, 
  afterImage, 
  beforeAlt, 
  afterAlt,
  caption 
}: BeforeAfterProps) => {
  return (
    <div className="my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Image */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-card overflow-hidden shadow-card">
            <img 
              src={beforeImage} 
              alt={beforeAlt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
          </div>
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-heading font-semibold text-sm shadow-lg">
            Before
          </span>
        </div>
        
        {/* After Image */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-card overflow-hidden shadow-card">
            <img 
              src={afterImage} 
              alt={afterAlt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
            />
          </div>
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full bg-brand-500 text-white font-semibold text-sm shadow-lg">
            After
          </span>
        </div>
      </div>
      
      {caption && (
        <p className="text-sm text-center text-muted-foreground mt-4 italic">
          {caption}
        </p>
      )}
    </div>
  );
};

export default BeforeAfter;
