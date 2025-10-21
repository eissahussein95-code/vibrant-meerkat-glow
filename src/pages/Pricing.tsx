import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Pricing() {
  const plans = [
    {
      name: 'Freelancer',
      price: 'Free',
      description: 'For independent professionals',
      features: [
        'Portfolio builder',
        'Receive curated job invitations',
        'Internal workspace access',
        'Real-time chat',
        'Calendar integration',
        'File sharing',
        '10% platform fee on earnings'
      ]
    },
    {
      name: 'Employer',
      price: 'Free',
      description: 'For businesses hiring talent',
      features: [
        'Post unlimited jobs',
        'Admin-curated talent matches',
        'Company portfolio',
        'Internal workspace access',
        'Real-time chat',
        'Project management tools',
        '5% platform fee on project value'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'All Employer features',
        'Dedicated account manager',
        'Custom matching criteria',
        'Priority support',
        'Advanced analytics',
        'Team management',
        'Negotiable platform fees'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              No subscription fees. We only succeed when you do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card
                key={index}
                padding="lg"
                gradient={plan.highlighted}
                className={plan.highlighted ? 'border-purple-500' : ''}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                </div>
                <p className="text-secondary mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-semibold text-primary mb-4">Minimum Project Value</h2>
            <p className="text-3xl font-bold gradient-text mb-2">$500</p>
            <p className="text-secondary max-w-2xl mx-auto">
              All projects on VorixHub have a minimum value of $500. This ensures quality projects and serious professional engagement from both freelancers and employers.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}