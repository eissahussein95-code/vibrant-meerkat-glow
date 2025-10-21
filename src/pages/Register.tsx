import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'freelancer' | 'employer';
    phone: string;
    companyName: string;
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'freelancer',
    phone: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      // User will be redirected automatically by AuthContext
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          <Card padding="lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Join VorixHub</h1>
              <p className="text-secondary">Create your account on the premium marketplace</p>
            </div>

            {error && (
              <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Choose a strong password"
                required
              />

              <Input
                label="Phone (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />

              <div>
                <label className="block text-sm font-medium text-secondary mb-3">I am a...</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'freelancer' 
                        ? 'border-purple-500 bg-purple-500 bg-opacity-10' 
                        : 'border-neutral-700 hover:border-purple-700'
                    }`}
                  >
                    <div className="font-semibold text-primary">Freelancer</div>
                    <div className="text-xs text-tertiary">Offer your services</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'employer' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'employer' 
                        ? 'border-purple-500 bg-purple-500 bg-opacity-10' 
                        : 'border-neutral-700 hover:border-purple-700'
                    }`}
                  >
                    <div className="font-semibold text-primary">Employer</div>
                    <div className="text-xs text-tertiary">Hire talent</div>
                  </button>
                </div>
              </div>

              {formData.role === 'employer' && (
                <Input
                  label="Company Name"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Your company name"
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}