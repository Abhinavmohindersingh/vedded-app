"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  X,
  Clock,
  Target,
  Brain,
  Lightbulb,
  Search,
  ChevronDown,
  Menu,
  Loader2,
} from "lucide-react";

interface NameCardProps {
  name: string;
  domain: string;
  rationale: string;
  available: boolean | null;
}

function NameCard({ name, domain, rationale, available }: NameCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {/* Card Content */}
      <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-white tracking-tight">
            {name}
          </span>
          {available !== null && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                available
                  ? "bg-green-400/10 text-green-300"
                  : "bg-red-400/10 text-red-300"
              }`}
            >
              {available ? "Available" : "Taken"}
            </span>
          )}
        </div>
        <p className="mt-1 text-purple-300/60">{domain}</p>
      </div>

      {/* Tooltip Overlay */}
      <div
        className="
          absolute inset-0 p-4 bg-black/95 rounded-2xl
          backdrop-blur-none opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-300 ease-in-out z-20
          flex items-center justify-center text-center
        "
      >
        <div className="p-6">
          <p className="text-white/95 font-medium leading-relaxed text-sm max-w-[95%] mx-auto px-4">
            {rationale}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({
    businessDescription: "",
    industry: "",
    tone: "",
    email: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<
    Array<{
      name: string;
      domain: string;
      available: boolean | null;
      rationale?: string;
    }>
  >([]);

  // Mouse lighting effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to waitlist
      const waitlistResponse = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          industry: formData.industry,
          businessDescription: formData.businessDescription,
        }),
      });

      if (waitlistResponse.ok) {
        console.log("Email saved to waitlist!");
      }

      // Generate names
      const response = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: formData.industry,
          keywords: formData.businessDescription,
          tone: formData.tone,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedNames(data.names);
        setShowResults(true);
      } else {
        alert("Failed to generate names. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter your email.");
      return;
    }
    setEmailSubmitted(true);
  };

  const features = [
    {
      icon: Globe,
      title: "Multilingual Creativity",
      description:
        "We mine ideas from Sanskrit, Greek mythology, Japanese aesthetics, and 20+ cultural traditions. Your competitors are stuck in English - you won't be.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Lightbulb,
      title: "Intentional Meaning",
      description:
        "Every name comes with its story. No random syllables - just clever wordplay, metaphors, and meanings that connect with humans.",
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Deep Research Mode",
      description:
        "Toggle between instant creative results or wait for our AI to verify domain availability and trademark conflicts across US, EU, and Australia.",
      color: "from-cyan-500 to-blue-600",
    },
  ];

  const personas = [
    {
      icon: Zap,
      title: "Tech Founders",
      description: "Building the next Stripe, not the next 'TechSolutions AI'",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Sparkles,
      title: "Creative Entrepreneurs",
      description: "Your brand deserves better than a .io domain hack",
      gradient: "from-fuchsia-500 to-pink-600",
    },
    {
      icon: Globe,
      title: "Global Businesses",
      description: "Names that work across cultures, not just Silicon Valley",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell us about your business",
      description: "Industry, values, target customers, and vibe",
      icon: Target,
    },
    {
      number: "02",
      title: "AI generates unique names",
      description:
        "Multilingual, metaphorical, and meaningful options (3-5 curated picks)",
      icon: Brain,
    },
    {
      number: "03",
      title: "See availability instantly",
      description: "Domain and trademark status in your regions",
      icon: Search,
    },
    {
      number: "04",
      title: "Save your favorites",
      description: "Build your shortlist and share with your team",
      icon: Star,
    },
  ];

  const comingSoonFeatures = [
    {
      title: "Domain Purchase Integration",
      description: "Buy your perfect domain right from our platform",
      icon: Globe,
    },
    {
      title: "Trademark Registration Forms",
      description: "Streamlined legal protection for your new brand",
      icon: Shield,
    },
    {
      title: "Market Research Tools",
      description: "Validate your name with target audience insights",
      icon: TrendingUp,
    },
    {
      title: "Brand Identity Starter Kits",
      description: "Logos, color palettes, and style guides",
      icon: Sparkles,
    },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl shadow-2xl"
            : "bg-transparent"
        }`}
        style={{
          boxShadow: scrolled
            ? "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 -1px 0 rgba(139, 92, 246, 0.2)"
            : "none",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="Vedded Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              Vedded
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Waitlist"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-white font-medium transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            style={{
              boxShadow:
                "0 10px 30px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Join Waitlist</span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </motion.button>

          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="min-h-screen bg-black text-white overflow-hidden pt-20">
        {/* Lighting & Grid */}
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
          }}
        />
        <div className="fixed inset-0 opacity-[0.15]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600/30 to-pink-600/30 rounded-full blur-[150px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-[150px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="container mx-auto px-4 relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 mb-8 shadow-2xl relative overflow-hidden group"
                style={{
                  boxShadow:
                    "0 0 60px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sparkles className="w-5 h-5 text-violet-300 relative z-10" />
                <span className="font-semibold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent relative z-10">
                  AI-Powered Name Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 text-6xl md:text-8xl font-black leading-[0.95]"
                style={{
                  textShadow:
                    "0 0 80px rgba(139, 92, 246, 0.6), 0 0 40px rgba(217, 70, 239, 0.4)",
                }}
              >
                <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                  The Business Name
                  <br />
                  Generator That
                  <br />
                  Gets It Right
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto"
              >
                AI-powered names with cultural depth, clever meanings, and
                trademark availability. Built for founders who refuse to be
                forgettable.
              </motion.p>

              {/* Hero Form */}
              {!showResults ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 max-w-3xl mx-auto relative group"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), 0 0 100px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      placeholder="What does your business do?"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
                      style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)" }}
                      value={formData.businessDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessDescription: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <select
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none shadow-inner"
                          style={{
                            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                          }}
                          value={formData.industry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              industry: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="" className="bg-black">
                            Select Industry
                          </option>
                          <option value="tech" className="bg-black">
                            Tech
                          </option>
                          <option value="ecommerce" className="bg-black">
                            E-commerce
                          </option>
                          <option value="health" className="bg-black">
                            Health & Wellness
                          </option>
                          <option value="finance" className="bg-black">
                            Finance
                          </option>
                          <option value="creative" className="bg-black">
                            Creative Services
                          </option>
                          <option value="other" className="bg-black">
                            Other
                          </option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none shadow-inner"
                          style={{
                            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                          }}
                          value={formData.tone}
                          onChange={(e) =>
                            setFormData({ ...formData, tone: e.target.value })
                          }
                          required
                        >
                          <option value="" className="bg-black">
                            Desired Tone
                          </option>
                          <option value="bold" className="bg-black">
                            Bold & Edgy
                          </option>
                          <option value="professional" className="bg-black">
                            Professional & Trust-worthy
                          </option>
                          <option value="playful" className="bg-black">
                            Playful & Memorable
                          </option>
                          <option value="sophisticated" className="bg-black">
                            Sophisticated & Elegant
                          </option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
                      style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)" }}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg relative overflow-hidden group disabled:opacity-50"
                      style={{
                        boxShadow:
                          "0 10px 40px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                          <span className="relative z-10">Generating...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">
                            Generate My Names
                          </span>
                          <ArrowRight className="w-5 h-5 relative z-10" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                /* Results */
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8 max-w-4xl mx-auto"
                >
                  <div
                    className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 border border-white/10 relative"
                    style={{
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.5), 0 0 100px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Here are AI-generated names for your {formData.industry}{" "}
                      business:
                    </h3>
                    <p className="text-gray-400 mb-8">
                      Fresh, unique names powered by OpenAI
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {generatedNames.map((nameObj, index) => (
                        <NameCard
                          key={index}
                          name={nameObj.name}
                          domain={
                            nameObj.domain ||
                            `${nameObj.name.toLowerCase()}.com`
                          }
                          rationale={
                            nameObj.rationale ||
                            `A premium brand name crafted for ${formData.industry || "your business"} with elegant phonetics, timeless appeal, and strategic positioning.`
                          }
                          available={nameObj.available}
                        />
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <p className="text-lg text-gray-300 mb-6">
                        Want domain availability checks and trademark
                        verification? Join our waitlist!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          document
                            .getElementById("waitlist")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                        style={{
                          boxShadow:
                            "0 10px 40px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                        }}
                      >
                        Join Waitlist for Full Features
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                      <button
                        onClick={() => setShowResults(false)}
                        className="ml-4 text-gray-400 hover:text-white transition-colors"
                      >
                        Generate More Names
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm text-gray-400">Scroll to explore</span>
              <ChevronDown className="w-6 h-6 text-violet-400" />
            </motion.div>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section id="features" className="py-20 md:py-32 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-600/20 to-fuchsia-600/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 text-pink-300 px-6 py-2 rounded-full text-sm font-semibold border border-pink-500/30 mb-4 backdrop-blur-xl">
                <X className="w-4 h-4" />
                The Harsh Truth
              </span>
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 60px rgba(236, 72, 153, 0.5)",
                }}
              >
                <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                  Most Name Generators
                  <br />
                  Are Garbage
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Generic Nonsense",
                  description:
                    '"TechPro Solutions" and "BizHub360" aren\'t brand names - they\'re spam subject lines',
                  icon: X,
                },
                {
                  title: "Zero Cultural Depth",
                  description:
                    "Cookie-cutter English words with zero meaning, story, or global perspective",
                  icon: X,
                },
                {
                  title: "Availability Nightmare",
                  description:
                    "Fall in love with a name, then discover 47 trademarks and no .com domain",
                  icon: X,
                },
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-pink-500/30 hover:border-pink-400/50 transition-all relative group"
                  style={{
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/40"
                    style={{
                      boxShadow: "0 0 30px rgba(236, 72, 153, 0.3)",
                    }}
                  >
                    <problem.icon className="w-8 h-8 text-pink-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-pink-300">
                    {problem.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {problem.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Vedded Difference */}
        <section className="py-20 md:py-32 relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 px-6 py-2 rounded-full text-sm font-semibold border border-violet-500/30 mb-4 backdrop-blur-xl">
                <CheckCircle2 className="w-4 h-4" />
                The Vedded Way
              </span>
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 60px rgba(139, 92, 246, 0.5)",
                }}
              >
                <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Vetted Names. Vetted Approach.
                  <br />
                  Vetted Results.
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We don't generate thousands of random combinations. We craft
                names with intention, meaning, and global resonance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-violet-500/50 transition-all relative group"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg group-hover:scale-110 transition-transform`}
                    style={{
                      boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Toggle Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div
                className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-10 border border-white/10 relative"
                style={{
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto border border-white/20"
                      style={{
                        boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
                      }}
                    >
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Instant Mode</h4>
                    <p className="text-sm text-gray-400">
                      Creative names in seconds
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-8 bg-black/50 rounded-full p-1 border border-white/20 shadow-inner">
                      <motion.div
                        className="w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-lg"
                        animate={{ x: [0, 32, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 mx-auto border border-white/20"
                      style={{
                        boxShadow: "0 0 40px rgba(217, 70, 239, 0.4)",
                      }}
                    >
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Vetted Mode</h4>
                    <p className="text-sm text-gray-400">
                      Full trademark & domain check
                    </p>
                  </div>
                </div>
                <p className="text-center text-gray-300">
                  Choose your speed: Fast creativity or complete verification
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-6 py-2 rounded-full text-sm font-semibold border border-cyan-500/30 mb-4 backdrop-blur-xl">
                <Users className="w-4 h-4" />
                Who We Serve
              </span>
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 60px rgba(6, 182, 212, 0.5)",
                }}
              >
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                  Built for Founders Who
                  <br />
                  Refuse to Blend In
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {personas.map((persona, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div
                    className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-violet-500/50 transition-all h-full relative"
                    style={{
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${persona.gradient} rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform shadow-lg`}
                      style={{
                        boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
                      }}
                    >
                      <persona.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{persona.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {persona.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 px-6 py-2 rounded-full text-sm font-semibold border border-fuchsia-500/30 mb-4 backdrop-blur-xl">
                <Clock className="w-4 h-4" />
                Simple Process
              </span>
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 60px rgba(217, 70, 239, 0.5)",
                }}
              >
                <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                  From Idea to Vetted Name
                  <br />
                  in 60 Seconds
                </span>
              </h2>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Connection Line */}
                <div
                  className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-fuchsia-500/50 to-pink-500/50"
                  style={{
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                  }}
                />

                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`relative mb-16 md:mb-24 flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } flex-col gap-8`}
                  >
                    {/* Content */}
                    <div className="w-full md:w-5/12">
                      <div
                        className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all"
                        style={{
                          boxShadow:
                            "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center border border-white/20"
                            style={{
                              boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
                            }}
                          >
                            <step.icon className="w-6 h-6 text-white" />
                          </div>
                          <span
                            className="text-4xl font-bold text-violet-400"
                            style={{
                              textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                            }}
                          >
                            {step.number}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Center Circle */}
                    <div className="hidden md:flex w-2/12 justify-center">
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full border-4 border-black flex items-center justify-center relative"
                        style={{
                          boxShadow:
                            "0 0 40px rgba(139, 92, 246, 0.6), inset 0 2px 0 rgba(255,255,255,0.3)",
                        }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="w-full md:w-5/12" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 px-6 py-2 rounded-full text-sm font-semibold border border-violet-500/30 mb-4 backdrop-blur-xl">
                <Sparkles className="w-4 h-4" />
                Coming Soon
              </span>
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 60px rgba(139, 92, 246, 0.5)",
                }}
              >
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  More Than Just Names
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're building a complete brand-building ecosystem for ambitious
                founders
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {comingSoonFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-all group relative"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start gap-6">
                    <div
                      className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-white/20"
                      style={{
                        boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
                      }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA / Waitlist */}
        <section
          id="waitlist"
          className="py-20 md:py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)",
                backgroundSize: "100px 100px",
              }}
            />
          </div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-fuchsia-600/30 to-pink-600/30 rounded-full blur-[120px] animate-pulse" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2
                className="text-4xl md:text-6xl font-black mb-6"
                style={{
                  textShadow: "0 0 80px rgba(139, 92, 246, 0.6)",
                }}
              >
                <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
                  Stop Settling for Names
                  <br />
                  That Sound Like Spam
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Join 500+ ambitious founders who are waiting for Vedded to
                launch. Be first to access the name generator that actually
                understands brand building.
              </p>

              {!emailSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 max-w-2xl mx-auto relative"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), 0 0 100px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

                  <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                    <input
                      type="email"
                      placeholder="Enter your email for early access"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-5 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
                      style={{
                        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                      }}
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
                      style={{
                        boxShadow:
                          "0 10px 40px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10">Join the Waitlist</span>
                      <ArrowRight className="w-5 h-5 relative z-10" />
                    </motion.button>
                    <p className="text-sm text-gray-400">
                      Be first to access Vedded when we launch in December 2025.
                      Plus, get our free "Ultimate Guide to Naming Your Startup"
                      ebook.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-b from-emerald-500/10 to-green-500/10 backdrop-blur-2xl rounded-3xl p-10 border border-emerald-500/30 max-w-2xl mx-auto relative"
                  style={{
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                  <div
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500/30 to-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50"
                    style={{
                      boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-300" />
                  </div>
                  <h3
                    className="text-3xl font-bold mb-4 text-emerald-300"
                    style={{
                      textShadow: "0 0 40px rgba(16, 185, 129, 0.6)",
                    }}
                  >
                    You're on the list!
                  </h3>
                  <p className="text-xl text-gray-300 mb-6">
                    Check your email for your free "Ultimate Guide to Naming
                    Your Startup" ebook.
                  </p>
                  <p className="text-gray-400">
                    We'll notify you as soon as Vedded launches. Get ready to
                    find a name that doesn't suck.
                  </p>
                </motion.div>
              )}

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 flex flex-wrap justify-center items-center gap-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 border-2 border-black flex items-center justify-center text-sm font-bold"
                        style={{
                          boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                        }}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-300">500+ founders waiting</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-violet-400 text-violet-400"
                      style={{
                        filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))",
                      }}
                    />
                  ))}
                  <span className="text-gray-300 ml-2">
                    Trained on 500+ exceptional brands
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-black/50 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-black text-2xl font-black italic">
                      V
                    </span>
                  </div>
                  <span
                    className="text-2xl font-bold text-white"
                    style={{
                      textShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                    }}
                  >
                    Vedded
                  </span>
                </div>
                <p className="text-gray-400 max-w-md leading-relaxed">
                  The AI-powered business name generator that helps ambitious
                  founders find unique, trademark-vetted brand names with
                  cultural depth and meaning.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold mb-4 text-gray-200">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-bold mb-4 text-gray-200">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-violet-300 transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Vedded. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-violet-300 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-violet-300 transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Trusted by 500+ founders building the next generation of iconic
                brands
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
