import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?is_featured=true');
        let productsData = [];
        if (Array.isArray(response.data?.data?.data)) {
          productsData = response.data.data.data;
        } else if (Array.isArray(response.data?.data)) {
          productsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        }
        setFeaturedProducts(productsData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-gray-50 font-sans -mt-10">
      {/* Hero Section */}
      <section className="w-full bg-white text-gray-900 pt-20 pb-32 px-6 lg:px-12 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Bring Furniture to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-500">Life</span> Before You Buy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Experience our premium collection in your own space using cutting-edge AR technology directly from your phone. No guessing, just visualizing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link to="/products" className="px-8 py-4 bg-amber-700 text-white font-bold rounded-full shadow-lg hover:bg-amber-800 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-lg">
                Explore Collection
              </Link>
              <Link to="/about" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-full hover:border-gray-300 hover:bg-gray-50 transition duration-300 text-lg">
                How it works
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition duration-500">
              <img src="/images/living_room.png" alt="Modern living room" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Preview in AR</p>
                    <p className="text-lg font-bold text-gray-900">Modern Sofa Series</p>
                  </div>
                  <Link to="/products" className="bg-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-200 transition">Try Now</Link>
                </div>
              </div>
            </div>
            {/* Decorative background shapes */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Room</h2>
              <p className="text-gray-600 text-lg">Find the perfect pieces for every corner of your home.</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition text-lg">
              View All Categories <span className="text-xl">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Living Room", img: "/images/living_room.png", count: "120+ Items" },
              { name: "Bedroom", img: "/images/bedroom.png", count: "85+ Items" },
              { name: "Dining Room", img: "/images/dining_room.png", count: "60+ Items" },
              { name: "Home Office", img: "/images/office.png", count: "45+ Items" }
            ].map((category, i) => (
              <Link to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`} key={i} className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500">
                <img src={category.img} alt={category.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition duration-300"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform transition duration-300 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-sm font-medium tracking-wide uppercase">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
              <p className="text-gray-600 text-lg">Our most popular designs with AR viewing enabled.</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition text-lg">
              Shop All <span className="text-xl">&rarr;</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-700"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
               <p className="text-gray-500 text-xl font-medium">No featured products found.</p>
             </div>
          )}
        </div>
      </section>

      {/* Inspiration/Ideas Section */}
      <section className="w-full py-24 px-6 bg-gray-900 text-white rounded-t-[3rem] mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Design Inspiration</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Discover beautiful spaces designed with our pieces to inspire your next home makeover.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative rounded-3xl overflow-hidden cursor-pointer h-[500px]">
              <img src="/images/scandinavian.png" alt="Scandinavian style" className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500"></div>
              <div className="absolute bottom-10 left-10 right-10 transform transition duration-500 group-hover:-translate-y-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full mb-4 inline-block uppercase tracking-wider">Trending</span>
                <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-md">Scandinavian Minimal</h3>
                <p className="text-gray-200 text-lg line-clamp-2 drop-shadow">Light woods, clean lines, and neutral tones for a bright and airy space.</p>
              </div>
            </div>
            
            <div className="group relative rounded-3xl overflow-hidden cursor-pointer h-[500px]">
              <img src="/images/minimalist.png" alt="Minimalist style" className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500"></div>
              <div className="absolute bottom-10 left-10 right-10 transform transition duration-500 group-hover:-translate-y-2">
                <span className="bg-amber-700/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full mb-4 inline-block uppercase tracking-wider">Editor's Pick</span>
                <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-md">Modern Monochrome</h3>
                <p className="text-gray-200 text-lg line-clamp-2 drop-shadow">Embrace simplicity with bold contrasts and purposeful empty spaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 px-6 bg-amber-700 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-950"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to upgrade your space?</h2>
          <p className="text-orange-100 text-2xl mb-12 font-light">Join thousands of customers who found their perfect match using AR.</p>
          <Link to="/register" className="px-12 py-5 bg-white text-amber-950 font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] transform hover:-translate-y-2 transition duration-300 inline-block text-xl">
            Create an Account Today
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
