import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 text-center mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">SeeItHome</h3>
          <p className="text-sm">Experience furniture in your own space before buying using our cutting-edge AR technology.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition">Shop All</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="#" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition">Returns & Refunds</a></li>
          </ul>
        </div>
      </div>
      <p className="text-sm border-t border-gray-800 pt-6">© {new Date().getFullYear()} SeeItHome. All rights reserved.</p>
    </footer>
  );
}
