import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  MapPin,
  Utensils,
  IndianRupee,
  Wallet,
  CreditCard,
  CheckSquare,
  Calendar,
  ArrowRight,
  LogOut,
  GitBranch,
  Car,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";
import "./Home.css";


function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll to dynamically style navigation bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentTripId");
    setMobileMenuOpen(false);
    navigate("/");
  };

  // 3. Features Data
  const features = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Smart Trip Planning",
      desc: "Define your start point, destination, timeline, and traveler counts to automatically generate a trip outline tailored for you."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Places Discovery",
      desc: "Explore top tourist spots and hidden gems around your destination. Filter, view details, and select attractions easily."
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Restaurant Recommendations",
      desc: "Get food suggestions based on popular culinary hubs. Save top dining options and map them to your active daily plan."
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Transport Cost Estimation",
      desc: "Estimate transit budgets for flights, trains, cabs, or private cars. Align transport costs with your overall parameters."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Budget Tracking",
      desc: "Set a macro trip budget limit and monitor remaining funds in real-time with visual indicators as plans change."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Expense Tracking",
      desc: "Log daily costs, meals, shopping, and tours. Categorize entries to understand exactly where your travel funds are going."
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Travel Checklist",
      desc: "Never forget a passport or charger. Maintain organized, interactive packing lists and checklists that you can mark on the go."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Day-wise Itinerary Management",
      desc: "Synthesize saved spots, restaurants, and transport choices into a single timeline. Adjust timings and organize days fluidly."
    }
  ];

  // 4. How It Works Steps
  const steps = [
    {
      number: "01",
      icon: <Calendar className="w-5 h-5" />,
      title: "Create a Trip",
      desc: "Input your dates, starting location, destination, and budget parameters."
    },
    {
      number: "02",
      icon: <MapPin className="w-5 h-5" />,
      title: "Explore Places",
      desc: "Browse local sightseeing spots and pin must-visit destinations."
    },
    {
      number: "03",
      icon: <Utensils className="w-5 h-5" />,
      title: "Add Restaurants",
      desc: "Find and select highly-rated dining hubs matching your budget."
    },
    {
      number: "04",
      icon: <Car className="w-5 h-5" />,
      title: "Plan Transport",
      desc: "Add transit tickets and coordinate day-to-day transportation."
    },
    {
      number: "05",
      icon: <FileText className="w-5 h-5" />,
      title: "Generate Itinerary",
      desc: "Synchronize activities into a daily sequence with timing details."
    },
    {
      number: "06",
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Track Budget & Expenses",
      desc: "Log spend items in real-time to avoid going over your travel limits."
    }
  ];


  // 7. Travel Showcase (Destinations)
  const destinations = [
    {
      name: "Goa",
      tag: "Beaches & Nightlife",
      desc: "Sun-kissed beaches, historic churches, and vibrant local markets.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Manali",
      tag: "Mountain Retreat",
      desc: "Snow-covered peaks, adventure sports, and scenic Solang Valley.",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Jaipur",
      tag: "Royal Heritage",
      desc: "The Pink City, grand palaces, forts, and rich Rajasthani art.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Hyderabad",
      tag: "Pearls & Cuisine",
      desc: "The Charminar, tech parks, and legendary Biryani spots.",
      image: "https://images.unsplash.com/photo-1608958416715-e215ff5ab602?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Mumbai",
      tag: "Bustling Metropolis",
      desc: "Gateway of India, Marine Drive, and the city that never sleeps.",
      image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Kerala",
      tag: "Serene Backwaters",
      desc: "Tranquil houseboats, lush tea estates, and tropical scenery.",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="home-page">
      {/* 1. Sticky Navigation Bar */}
      <nav className={`landing-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="navbar-logo-icon">
              <Compass />
            </div>
            JourneySync<span>Planner</span>
          </a>

          {/* Desktop Navbar Actions */}
          <div className="navbar-actions" style={{ display: 'flex' }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#destinations" className="nav-link">Destinations</a>
            
            {token ? (
              <>
                <button className="nav-btn-outline" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
                <button className="nav-btn-solid" onClick={handleLogout}>
                  Logout <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button className="nav-btn-outline" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="nav-btn-solid" onClick={() => navigate("/register")}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero-wrapper">
        <div className="hero-background-grid" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-tag"
        >
          <Award className="w-4 h-4" /> Discover the Smart Way to Travel
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hero-main-title"
        >
          Plan Your Perfect Journey, <br />
          <span>Sync Every Detail</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-desc"
        >
          Everything you need to organize your dream trip in one place. Discover tourist attractions, save restaurants, coordinate transit costs, and track your daily travel budgets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hero-ctas"
        >
          {token ? (
            <button className="hero-btn-primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard <ArrowRight />
            </button>
          ) : (
            <>
              <button className="hero-btn-primary" onClick={() => navigate("/register")}>
                Start Planning Free <ArrowRight />
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate("/login")}>
                Sign In to Account
              </button>
            </>
          )}
        </motion.div>



      </header>

      {/* 3. Features Section */}
      <section id="features" className="home-section">
        <div className="section-header">
          <span className="section-badge">Platform Capabilities</span>
          <h2 className="section-title">Designed for Seamless Organization</h2>
          <p className="section-subtitle">
            Say goodbye to messy spreadsheets. JourneySync gives you dedicated tools to plan itineraries, stay within budget, and explore with ease.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="feature-card-wrapper"
            >
              <div className="feature-icon-container">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="home-section">
        <div className="section-header">
          <span className="section-badge">The Workflow</span>
          <h2 className="section-title">How JourneySync Works</h2>
          <p className="section-subtitle">
            Build your ideal travel itinerary step-by-step. Keep your expenses aligned and checklist packed without breaking a sweat.
          </p>
        </div>

        <div className="how-it-works-timeline">
          <div className="timeline-line" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="timeline-step"
            >
              <div className="step-number-node">
                {step.number}
              </div>
              <div className="step-card">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* 7. Travel Showcase Section */}
      <section id="destinations" className="home-section">
        <div className="section-header">
          <span className="section-badge">Travel Showcase</span>
          <h2 className="section-title">Popular Destinations in India</h2>
          <p className="section-subtitle">
            Need inspiration? Explore these highly curated destinations and start planning your perfect itinerary instantly.
          </p>
        </div>

        <div className="travel-grid-layout">
          {destinations.map((dest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="travel-card-wrapper"
              onClick={() => {
                if (token) {
                  navigate("/dashboard");
                } else {
                  navigate("/login");
                }
              }}
            >
              <img src={dest.image} alt={dest.name} className="travel-image-element" />
              <div className="travel-card-overlay">
                <div className="travel-card-details">
                  <span className="travel-card-tag">{dest.tag}</span>
                  <h3 className="travel-card-name">{dest.name}</h3>
                  <p className="travel-card-desc">{dest.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Call To Action Section */}
      <section className="home-section" style={{ paddingBottom: 60 }}>
        <div className="glow-orb-cta" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="cta-banner-wrapper"
        >
          <h2 className="cta-title">Ready to Plan Your Next Adventure?</h2>
          <p className="cta-desc">
            Join thousands of travelers who plan smarter, track their budgets, and stay organized on the road. Create your account today.
          </p>
          <button className="cta-btn" onClick={() => navigate(token ? "/dashboard" : "/register")}>
            Start Planning Now <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* 9. Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand-column">
            <a href="#" className="footer-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              JourneySync<span>Planner</span>
            </a>
            <p className="footer-desc">
              Simplifying the art of travel planning. Budget, track, customize, and execute your dream itineraries from one modern platform.
            </p>
          </div>
          <div className="footer-column">
            <h4 className="footer-column-title">About</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Company</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Press</a>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-column-title">Features</h4>
            <div className="footer-links">
              <a href="#features" className="footer-link">Itinerary Creator</a>
              <a href="#features" className="footer-link">Places Discovery</a>
              <a href="#features" className="footer-link">Budget Tracking</a>
              <a href="#features" className="footer-link">Expense Logger</a>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-column-title">Contact</h4>
            <div className="footer-links">
              <a href="mailto:support@journeysync.io" className="footer-link">Support</a>
              <a href="#" className="footer-link">Sales</a>
              <a href="#" className="footer-link">Partnerships</a>
              <a href="#" className="footer-link">Help Center</a>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-column-title">Developers</h4>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <GitBranch className="w-4 h-4" /> GitHub
              </a>
              <a href="#" className="footer-link">API Docs</a>
              <a href="#" className="footer-link">Status Page</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} JourneySync Inc. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;