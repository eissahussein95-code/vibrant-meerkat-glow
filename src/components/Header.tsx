import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

export default function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!profile) return '/login';
    return `/${profile.role}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">VorixHub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link to="/" className="text-secondary hover:text-primary transition-colors">Home</Link>
                <Link to="/about" className="text-secondary hover:text-primary transition-colors">About</Link>
                <Link to="/pricing" className="text-secondary hover:text-primary transition-colors">Pricing</Link>
                <Link to="/contact" className="text-secondary hover:text-primary transition-colors">Contact</Link>
                <Link to="/login" className="text-secondary hover:text-primary transition-colors">Login</Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-secondary hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/jobs" className="text-secondary hover:text-primary transition-colors">Jobs</Link>
                <Link to="/profile" className="text-secondary hover:text-primary transition-colors">Profile</Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </nav>

          <button
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-neutral-800">
          <div className="px-4 py-4 space-y-3">
            {!user ? (
              <>
                <Link to="/" className="block text-secondary hover:text-primary transition-colors py-2">Home</Link>
                <Link to="/about" className="block text-secondary hover:text-primary transition-colors py-2">About</Link>
                <Link to="/pricing" className="block text-secondary hover:text-primary transition-colors py-2">Pricing</Link>
                <Link to="/contact" className="block text-secondary hover:text-primary transition-colors py-2">Contact</Link>
                <Link to="/login" className="block text-secondary hover:text-primary transition-colors py-2">Login</Link>
                <Link to="/register" className="block">
                  <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="block text-secondary hover:text-primary transition-colors py-2">Dashboard</Link>
                <Link to="/jobs" className="block text-secondary hover:text-primary transition-colors py-2">Jobs</Link>
                <Link to="/profile" className="block text-secondary hover:text-primary transition-colors py-2">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left text-secondary hover:text-primary transition-colors py-2">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}