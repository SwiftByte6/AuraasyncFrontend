import { notFound } from 'next/navigation';
import ProductGrid from '@/components/female/ProductGrid';
import { Metadata } from 'next';

// Define the mapping of slugs to display names
const occasionNames: { [key: string]: string } = {
  'glow-up-vibes': 'GLOW UP VIBES',
  'campus-or-work-fit': 'Campus or work Fit',
  'date-and-chill': 'Date & Chill',
  'shaadi-scenes': 'Shaadi Scenes',
  'festive-feels': 'Festive Feels',
  'vacay-mood': 'Vacay Mood',
};

interface OccasionPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for dynamic routes
export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { slug } = params;
  const occasionName = occasionNames[slug];
  
  if (!occasionName) {
    return {
      title: 'Occasion Not Found',
    };
  }

  return {
    title: `${occasionName} - Female Fashion Recommendations`,
    description: `Discover the perfect ${occasionName.toLowerCase()} fashion recommendations for women. Browse our curated collection of stylish outfits.`,
  };
}

const OccasionPage = ({ params }: OccasionPageProps) => {
  const { slug } = params;
  const occasionName = occasionNames[slug];

  if (!occasionName) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1a1414] pb-20">
      {/* Page Title */}
      <section className="pt-8 pb-4 bg-[#1a1414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            {occasionName}
          </h1>
        </div>
      </section>

      {/* Occasion Title Header */}
      <section className="py-8 bg-[#1a1414] relative">
        <div className="w-full overflow-hidden mb-8">
          <div className="marquee whitespace-nowrap">
            <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider mx-8">
              {occasionName} | {occasionName} | {occasionName} | {occasionName}
            </span>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <ProductGrid />
    </div>
  );
};

export default OccasionPage;
