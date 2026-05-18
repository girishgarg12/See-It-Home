import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">About SeeItHome</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We believe that shopping for furniture should be an immersive, confident experience. 
          That's why we've combined premium craftsmanship with cutting-edge AR technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Modern living room" 
            className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded in 2026, SeeItHome was born out of a simple frustration: it's incredibly hard 
            to know if a piece of furniture will look good in your home until it's already there.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            By leveraging Augmented Reality (AR) and 3D modeling, we allow you to "see it home" 
            before you buy. Our curated collection of modern, minimalist furniture isn't just 
            beautiful—it's designed to fit seamlessly into your life.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 rounded-3xl p-12 md:p-20 text-center mb-24 border border-amber-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-600">Every piece is crafted from sustainable, high-quality materials built to last.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AR Visualization</h3>
            <p className="text-gray-600">View our products in your own space using your smartphone camera.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hassle-Free Returns</h3>
            <p className="text-gray-600">Not quite right? Return it within 30 days for a full refund.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to transform your space?</h2>
        <Link to="/products" className="inline-block px-8 py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition text-lg">
          Explore Our Collection
        </Link>
      </div>
    </div>
  );
}
