'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GenderNavbar from '../../../../components/GenderNavbar';
import BottomNavigation from '@/components/female/BottomNavigation';

interface Product {
    keyword: string;
    type: string;
    title: string;
    price: string;
    image: string;
    link: string;
    asin: string;
}

interface CategoryData {
    [key: string]: {
        title: string;
        description: string;
        slug: string;
        dataFile: string;
    };
}

const CATEGORIES: CategoryData = {
    'womens-dresses': {
        title: "Women's Dresses",
        description: "Discover our latest Women's Dresses collection",
        slug: 'womens-dresses',
        dataFile: 'floral mini dress women.json'
    },
    'womens-shirts': {
        title: "Women's Shirts",
        description: "Discover our latest Women's Shirts collection",
        slug: 'womens-shirts',
        dataFile: 'women_s shirts.json'
    },
    'womens-bottomwear': {
        title: "Women's Bottomwear",
        description: "Discover our latest Women's Bottomwear collection",
        slug: 'womens-bottomwear',
        dataFile: 'women_s bottomwear.json'
    },
    'womens-tshirts': {
        title: "Women's T-shirts",
        description: "Discover our latest Women's T-shirt collection",
        slug: 'womens-tshirts',
        dataFile: 'women_s t-shirts.json'
    },
    'womens-coats': {
        title: "Women's Coats",
        description: "Discover our latest Women's Coats collection",
        slug: 'womens-coats',
        dataFile: 'women_s coats.json'
    },
    'womens-ethnic-wear': {
        title: "Women's Ethnic Wear",
        description: "Discover our latest Women's Ethnic Wear collection",
        slug: 'womens-ethnic-wear',
        dataFile: 'kurta palazzo set women.json'
    }
};

export default function OutfitRecommendationsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);

    const productsPerPage = 12;
    const category = CATEGORIES[slug];

    useEffect(() => {
        if (!category) {
            setError('Category not found');
            setLoading(false);
            return;
        }

        loadCategoryData();
    }, [slug]);

    const loadCategoryData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Import the JSON data dynamically
            const dataModule = await import(`../data/${category.dataFile}`);
            const allProducts: Product[] = dataModule.default || dataModule;

            if (!allProducts || allProducts.length === 0) {
                throw new Error('No products found in this category');
            }

            // Shuffle the products for random display
            const shuffled = shuffleArray([...allProducts]);
            setShuffledProducts(shuffled);

            // Calculate total pages
            const total = Math.ceil(shuffled.length / productsPerPage);
            setTotalPages(total);

            // Set initial page
            setCurrentPage(1);
            updateDisplayedProducts(shuffled, 1);

        } catch (err) {
            console.error('Error loading category data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array: Product[]): Product[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const updateDisplayedProducts = (allProducts: Product[], page: number) => {
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const pageProducts = allProducts.slice(startIndex, endIndex);
        setProducts(pageProducts);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateDisplayedProducts(shuffledProducts, page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        loadCategoryData();
    };

    if (!category) {
        return (
            <div className="min-h-screen bg-[#1a1414] text-white">
                <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Category Not Found</h1>
                    <p className="text-gray-300 mb-6">The requested category does not exist.</p>
                    <button
                        onClick={() => router.push('/female')}
                        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1414] text-white">
            <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.title}</h1>
                            <p className="text-gray-300 text-lg">{category.description}</p>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-400 mb-4">
                        <span
                            className="cursor-pointer hover:text-white transition-colors"
                            onClick={() => router.push('/female')}
                        >
                            Home
                        </span>
                        <span className="mx-2">/</span>
                        <span className="text-white">{category.title}</span>
                    </nav>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-8">
                        <div className="text-center mb-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                            <p className="text-xl">Loading {category.title}...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="py-8">
                        <div className="text-center mb-8">
                            <div className="text-red-400 text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                            <p className="text-gray-300 mb-6">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {products.map((product, index) => (
                                <div key={`${product.asin}-${index}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative aspect-square">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                                        <p className="text-green-400 font-bold text-lg mb-3">{product.price}</p>
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View on Amazon
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                                >
                                    Previous
                                </button>
                                
                                <span className="px-4 py-2 text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* No Products State */}
                {!loading && !error && products.length === 0 && (
                    <div className="py-8">
                        <div className="text-center mb-8">
                            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                            <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
                            <p className="text-gray-300 mb-6">We couldn't find any products in this category.</p>
                            <button
                                onClick={handleRefresh}
                                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <BottomNavigation />
        </div>
    );
}
