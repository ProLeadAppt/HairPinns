import { Sparkles, Wind, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureStrip = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Colour & Blonding",
      anchor: "colour"
    },
    {
      icon: Wind,
      title: "Smoothing & Treatments",
      anchor: "treatments"
    },
    {
      icon: Scissors,
      title: "Cuts & Styling",
      anchor: "cuts"
    }
  ];

  return (
    <section className="bg-accent py-12 md:py-16" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={index}
                to={`/services#${feature.anchor}`}
                className="group text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-base">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-heading group-hover:text-brand-500 transition-colors">
                    {feature.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
