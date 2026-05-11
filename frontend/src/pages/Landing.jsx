import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store.js'

export default function Landing() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-surface-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                  <span className="text-surface-950 font-bold text-xs">✦</span>
                </div>
                <span className="font-sans font-bold text-lg text-surface-100">PostAgent</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">Features</a>
                <a href="#how" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">How it Works</a>
                <a href="#tools" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">API Tools</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-surface-400 hover:text-surface-100 transition-colors px-3 py-1.5">Log in</Link>
              <Link to="/register" className="text-sm bg-surface-800 hover:bg-surface-700 text-surface-100 border border-surface-700 px-4 py-1.5 rounded-full transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Promo Banner */}
      <div className="bg-surface-950 border-b border-surface-800/30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-xs text-surface-400">Start free and generate unlimited LinkedIn posts with AI</span>
          <Link to="/register" className="text-xs text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors">→</Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-surface-50 leading-[1.1] mb-6 tracking-tight">
                Unlock <span className="text-brand-500">Peak</span> Productivity<br />
                <span className="text-surface-200">Collaborate With AI</span>
              </h1>
              <p className="text-surface-400 text-lg leading-relaxed mb-8 max-w-lg">
                Automate workflows, enhance decision-making, & focus with AI by your side. Turn your daily code into posts that get you hired.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-surface-950 font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Get Started — For Free
                </Link>
                <a href="#how" className="inline-flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-surface-100 font-medium px-6 py-3 rounded-full border border-surface-700 transition-all duration-200">
                  See how it works
                </a>
              </div>
            </div>
            {/* Right — Hero Composition */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900 p-1">
                <img src="/hero-mockup.png" alt="PostAgent Dashboard" className="rounded-xl w-full" />
              </div>
              {/* Floating stat: 2x */}
              <div className="absolute -left-4 top-8 sm:-left-8 bg-surface-900 border border-surface-800 rounded-xl px-4 py-3 shadow-2xl shadow-black/40 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-lg">2x</span>
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Boost in</p>
                    <p className="text-sm font-semibold text-surface-100">engagement</p>
                  </div>
                </div>
              </div>
              {/* Floating stat: 86% */}
              <div className="absolute -right-2 bottom-12 sm:-right-6 bg-surface-900 border border-surface-800 rounded-xl px-4 py-3 shadow-2xl shadow-black/40 animate-slide-up" style={{animationDelay:'0.2s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-500/10">
                    <svg className="w-5 h-5 text-brand-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-surface-50">86%</p>
                    <p className="text-[10px] text-surface-500">Positive reception</p>
                  </div>
                </div>
              </div>
              {/* Floating card: profile */}
              <div className="hidden sm:flex absolute -bottom-4 left-4 bg-surface-900 border border-surface-800 rounded-xl px-3 py-2 items-center gap-2 shadow-2xl shadow-black/40 animate-slide-up" style={{animationDelay:'0.4s'}}>
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-xs text-surface-950 font-bold">PA</div>
                <div>
                  <p className="text-xs font-medium text-surface-200">PostAgent Assistant</p>
                  <p className="text-[10px] text-surface-500">Smart draft • AI writing</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium ml-1">HIRE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Logos */}
      <section className="border-t border-surface-800/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-surface-500 uppercase tracking-widest mb-8">Trusted by <span className="text-brand-400">developers</span> across the globe</p>
          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-40">
            {['GitHub','LeetCode','LinkedIn','DevTo','Hashnode'].map((name) => (
              <div key={name} className="flex items-center gap-2 text-surface-300">
                <span className="w-2 h-2 bg-surface-500 rounded-full" />
                <span className="text-sm font-medium tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — API Tools */}
      <section id="tools" className="py-20 border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-surface-500 uppercase tracking-widest text-center mb-3">Our API Tools</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-50 text-center mb-16 tracking-tight leading-tight">
            Scalable APIs for<br />Autonomous Intelligence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — GitHub */}
            <div className="group bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all duration-300">
              <div className="h-44 bg-surface-850 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900" />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-surface-800 border border-surface-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-surface-200" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-surface-400">Synced</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-surface-100 mb-2">Personalization</h3>
              <p className="text-sm text-surface-500 leading-relaxed">Fetches your real GitHub commits, PRs, and branches to weave authentic technical details into every post.</p>
            </div>
            {/* Card 2 — LeetCode */}
            <div className="group bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all duration-300">
              <div className="h-44 bg-surface-850 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900" />
                <div className="relative flex items-center gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="bg-brand-500/20 text-brand-400 text-[10px] font-bold px-2 py-1 rounded-md">Build</span>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded-md">Hard</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md">Easy</span>
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md">Deploy</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-surface-100 mb-2">Proactivity</h3>
              <p className="text-sm text-surface-500 leading-relaxed">Pulls your LeetCode stats — problems solved, difficulty breakdown, and streak — to showcase your DSA grind.</p>
            </div>
            {/* Card 3 — Claude AI */}
            <div className="group bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all duration-300">
              <div className="h-44 bg-surface-850 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900" />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 shadow-lg">
                    <span className="w-2 h-2 bg-brand-500 rounded-full" />
                    <span className="text-[11px] text-surface-300">Generating post...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center"><p className="text-[10px] text-surface-500">Less</p><p className="text-[10px] text-surface-400">Computation</p></div>
                    <div className="text-center"><p className="text-[10px] text-surface-500">Run</p><p className="text-[10px] text-surface-400">Faster</p></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-surface-100 mb-2">Small Models</h3>
              <p className="text-sm text-surface-500 leading-relaxed">Claude AI writes authentic posts — not corporate fluff. Sounds like you, because it uses your real story and data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-brand-400 uppercase tracking-widest text-center mb-3">Join Our Team</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-50 text-center mb-16 tracking-tight">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { tag: 'Step 1', title: 'Write Your Story', desc: 'Tell us what you built, what broke, and what clicked today.', loc: 'Your IDE' },
              { tag: 'Step 2', title: 'Agent Fetches Data', desc: 'PostAgent pulls commits from GitHub and problems from LeetCode.', loc: 'Automated' },
              { tag: 'Step 3', title: 'AI Writes Post', desc: 'Claude generates an authentic, scroll-stopping LinkedIn post.', loc: 'Claude AI' },
              { tag: 'Step 4', title: 'Copy & Publish', desc: 'One click to copy. Paste into LinkedIn and watch the engagement.', loc: 'LinkedIn' }
            ].map((step, i) => (
              <div key={i} className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] text-surface-500 uppercase tracking-wider">{step.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-surface-100 mb-2">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-6">{step.desc}</p>
                <div className="flex items-center justify-between border-t border-surface-800 pt-4 mt-auto">
                  <span className="text-xs text-surface-500">{step.loc}</span>
                  <div className="w-6 h-6 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <span className="text-brand-400 text-[10px]">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register" className="text-sm text-surface-400 hover:text-surface-100 border border-surface-700 hover:border-surface-600 px-5 py-2.5 rounded-full transition-all">
              View All Features →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-surface-500 uppercase tracking-widest text-center mb-3">Our Blog</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-50 text-center mb-4 tracking-tight">
            Explore Tools, Insights,<br />and Knowledge
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { cat: 'Insights', title: 'The Future of Work: Developers + AI', date: '12 May 2026' },
              { cat: 'Documentation', title: 'Developer Tools & APIs', date: '12 May 2026' },
              { cat: 'Handbook', title: 'Principles and patterns for human-AI interaction.', date: '12 May 2026' },
              { cat: 'Case Studies', title: 'Real results from devs using AI content.', date: '12 May 2026' }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="h-36 bg-surface-900 border border-surface-800 rounded-2xl mb-4 overflow-hidden flex items-center justify-center group-hover:border-surface-700 transition-all">
                  <div className="grid grid-cols-2 gap-1 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
                    <div className="w-12 h-12 bg-surface-700 rounded-lg" />
                    <div className="w-12 h-12 bg-surface-700 rounded-lg" />
                    <div className="w-12 h-12 bg-surface-700 rounded-lg" />
                    <div className="w-12 h-12 bg-surface-700 rounded-lg" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-brand-400 font-medium">● {item.cat}</span>
                  <span className="text-[10px] text-surface-600">{item.date}</span>
                </div>
                <h3 className="text-sm font-medium text-surface-200 group-hover:text-surface-50 transition-colors">{item.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register" className="text-sm text-surface-400 hover:text-surface-100 border border-surface-700 hover:border-surface-600 px-5 py-2.5 rounded-full transition-all">
              View All Resources →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — Cinematic */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/80 to-surface-900/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-[50%] bg-gradient-to-t from-brand-500/10 via-brand-500/5 to-transparent blur-[60px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-50 mb-5 tracking-tight">What are you<br />waiting for?</h2>
          <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">Automate workflows, enhance, & focus with AI by your side.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-surface-950 font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.02]">
              Get Started — For Free
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 text-surface-300 hover:text-surface-100 font-medium px-6 py-3 rounded-full border border-surface-700 hover:border-surface-600 transition-all duration-200">
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                <span className="text-surface-950 font-bold text-[10px]">✦</span>
              </div>
              <span className="font-sans text-sm font-semibold text-surface-500">PostAgent</span>
            </div>
            <p className="text-xs text-surface-600">© {new Date().getFullYear()} PostAgent. Built for developers who ship.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
