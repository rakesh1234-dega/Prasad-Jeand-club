'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-white">About Us</h1>
          <p className="text-gray-300 mt-4 text-lg">Style That Defines You</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Our Story */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-poppins font-bold text-primary mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Prasad Jeans Club was founded in 2020 with a simple mission: to provide premium quality men&apos;s fashion at affordable prices. What started as a small shop has grown into a trusted brand serving thousands of customers across India.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            We believe every man deserves to look his best without burning a hole in his pocket. That&apos;s why we carefully source our fabrics, work with skilled craftsmen, and cut out middlemen to deliver the best value directly to you.
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-poppins font-bold text-primary mb-2">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To provide high-quality, stylish menswear at prices that are fair and accessible. We want every man to feel confident and comfortable in what he wears.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="text-3xl mb-4">🌟</div>
            <h3 className="text-xl font-poppins font-bold text-primary mb-2">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become India&apos;s #1 men&apos;s fashion destination, known for quality, style, and customer satisfaction. We aim to dress 10 million men by 2030.
            </p>
          </div>
        </div>

        {/* Numbers */}
        <section className="bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { number: '1000+', label: 'Products' },
              { number: '50K+', label: 'Happy Customers' },
              { number: '100+', label: 'Cities Served' },
              { number: '4.5★', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-poppins font-bold">{stat.number}</p>
                <p className="text-sm text-white/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="bg-white rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-poppins font-bold text-primary mb-6">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✨', title: 'Quality First', desc: 'Every product goes through strict quality checks' },
              { icon: '💰', title: 'Fair Pricing', desc: 'No markup, no middlemen - direct value to you' },
              { icon: '🤝', title: 'Customer Love', desc: '7-day returns, fast shipping, 24/7 support' },
            ].map(value => (
              <div key={value.title} className="text-center">
                <span className="text-3xl">{value.icon}</span>
                <h4 className="font-semibold mt-2">{value.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
