import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

type PropertyRow = {
  id: number;
  title: string;
  location: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  area?: string | number;
  price: number | string;
  image_url?: string;
  imageUrl?: string;
};

function bedroomLabel(n: number) {
  return n === 1 ? "1 bedroom" : `${n} bedrooms`;
}

function bathroomLabel(n: number) {
  return n === 1 ? "1 bathroom" : `${n} bathrooms`;
}

export default function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);

  const { data: properties = [], isLoading, error } = useQuery<PropertyRow[]>({
    queryKey: ["home-featured-properties"],
    queryFn: () => propertiesApi.list().then((r) => r.data),
  });

  const featured = useMemo(() => properties.slice(0, 6), [properties]);

  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSentOpen(true);
    e.currentTarget.reset();
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50">
      <nav className="fixed top-0 w-full z-50 border-b border-white/30 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#home" className="text-2xl font-bold text-primary flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              HomeRent
            </a>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</a>
              <a href="#properties" className="text-gray-600 hover:text-primary font-medium transition-colors">Properties</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact</a>
              <Link to="/login" className="px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity shadow-lg">
                Sign In
              </Link>
            </div>
            <button
              type="button"
              className="md:hidden text-gray-600 hover:text-primary rounded-md p-1"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {!mobileOpen ? null : (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#home" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary" onClick={() => setMobileOpen(false)}>Home</a>
              <a href="#properties" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary" onClick={() => setMobileOpen(false)}>Properties</a>
              <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary" onClick={() => setMobileOpen(false)}>How It Works</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary" onClick={() => setMobileOpen(false)}>Contact</a>
              <Link to="/login" className="block w-full text-center px-5 py-3 mt-4 rounded-md bg-primary text-white font-medium hover:opacity-90">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Find a Home that <br />
            <span className="text-teal-100">Suits Your Lifestyle</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Explore a wide range of properties in premium locations with our easy-to-use search and seamless booking experience.
          </p>
          <div className="bg-white p-2 rounded-full flex flex-col md:flex-row shadow-2xl max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
              <input type="text" placeholder="Location, City, or ZIP" className="w-full focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent" />
            </div>
            <div className="flex-1 flex items-center px-6 py-3">
              <select className="w-full focus:outline-none text-gray-700 bg-transparent appearance-none" defaultValue="">
                <option value="" disabled>Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            <a href="#properties" className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-opacity m-1 md:m-0 text-center">
              Search
            </a>
          </div>
        </div>
      </section>

      <section id="properties" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
              <p className="text-gray-600 max-w-2xl">Handpicked selection of the most beautiful and comfortable homes available for rent right now.</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center text-primary font-medium hover:opacity-80 transition-opacity">
              View All
            </Link>
          </div>

          {isLoading && <p className="text-gray-500 mb-4">Loading properties...</p>}
          {error && <p className="text-red-600 mb-4">{(error as Error).message}</p>}
          {!isLoading && !error && featured.length === 0 && (
            <p className="text-gray-500 col-span-full">No properties listed yet. Check back soon.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p) => {
              const image = p.image_url || p.imageUrl;
              return (
                <div key={p.id} className="block bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative rounded-t-2xl h-64 overflow-hidden">
                    {image ? (
                      <img src={image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-900">For Rent</div>
                  </div>
                  <div className="p-6">
                    <div className="text-primary font-bold text-xl mb-2">
                      {formatMoney(p.price)} <span className="text-sm text-gray-500 font-normal">/ month</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                    <p className="text-gray-500 mb-4 text-sm">{p.location}</p>
                    {p.description ? <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p> : null}
                    <div className="flex flex-wrap items-center border-t border-gray-100 pt-4 text-xs text-gray-500">
                      <span>{bedroomLabel(Number(p.bedrooms || 0))}</span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span>{bathroomLabel(Number(p.bathrooms || 0))}</span>
                      {p.area ? (
                        <>
                          <span className="mx-1.5 text-gray-300">·</span>
                          <span>{String(p.area)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How HomeRent Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Finding your dream home is easier than ever. Follow these simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="p-8 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Search & Find</h3>
              <p className="text-gray-600">Browse through our property listings across locations and pick what fits your needs.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Book a Visit</h3>
              <p className="text-gray-600">Schedule an in-person visit or virtual tour in just a few clicks.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Rent & Move In</h3>
              <p className="text-gray-600">Complete paperwork online and move into your next home securely and quickly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex-1 p-10 lg:p-14 bg-white">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">Have questions about a property or need help with booking? Our team is here to assist you 24/7.</p>
              <form className="space-y-6" onSubmit={onContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" required placeholder="First Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="text" required placeholder="Last Name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <input type="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                <textarea rows={4} required placeholder="Message" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="submit" className="w-full bg-primary text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Send Message</button>
              </form>
            </div>
            <div className="md:w-1/3 bg-gray-50 p-10 lg:p-14 flex flex-col justify-center border-l border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Contact Information</h3>
              <div className="space-y-4 text-gray-600">
                <p>Norrsken House, Kigali</p>
                <p><a href="mailto:eloibuyange@gmail.com" className="hover:text-primary">eloibuyange@gmail.com</a></p>
                <p><a href="tel:0790703759" className="hover:text-primary">0790703759</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-2xl font-bold text-white mb-4">HomeRent</p>
            <p className="text-sm">Making finding your perfect home easy, stress-free, and enjoyable.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-teal-300">Home</a></li>
              <li><a href="#properties" className="hover:text-teal-300">Properties</a></li>
              <li><a href="#how-it-works" className="hover:text-teal-300">How It Works</a></li>
              <li><a href="#contact" className="hover:text-teal-300">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; 2026 HomeRent. All rights reserved.
        </div>
      </footer>

      {!sentOpen ? null : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setSentOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <p className="text-lg font-semibold text-gray-900">Sent</p>
            <p className="text-gray-600 text-sm mt-2">Thank you - we have received your message.</p>
            <button type="button" className="mt-6 w-full bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity" onClick={() => setSentOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
