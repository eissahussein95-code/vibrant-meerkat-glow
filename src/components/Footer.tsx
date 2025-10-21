import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">VorixHub</h3>
            <p className="text-secondary text-sm">
              Premium curated marketplace connecting exceptional freelancers with quality employers.
            </p>
          </div>

          <div>
            <h4 className="text-primary font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-secondary hover:text-brand text-sm transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="text-secondary hover:text-brand text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-secondary hover:text-brand text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-semibold mb-4">Get Started</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-secondary hover:text-brand text-sm transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="text-secondary hover:text-brand text-sm transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-secondary hover:text-brand text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-secondary hover:text-brand text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-tertiary text-sm">
            {currentYear} VorixHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}