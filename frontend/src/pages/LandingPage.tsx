import { ArrowRight, Bot, Brain, Sparkles, Youtube, Shield, Zap, MessageSquare } from 'lucide-react'

import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Visual Intelligence',
    description: 'Instantly summarize YouTube videos into structured study notes.',
    icon: Youtube,
    color: 'text-red-400'
  },
  {
    title: 'Contextual Chat',
    description: 'Ask deep questions grounded in your actual source documents.',
    icon: MessageSquare,
    color: 'text-blue-400'
  },
  {
    title: 'Adaptive Learning',
    description: 'Generate quizzes and code challenges tailored to your progress.',
    icon: Zap,
    color: 'text-yellow-400'
  },
]

const features = [
  { title: 'Privacy First', detail: 'Local-first processing keeps your learning data private.', icon: Shield },
  { title: 'Neural Retrieval', detail: 'Advanced RAG ensures every answer is source-verified.', icon: Brain },
  { title: 'Fast Inference', detail: 'Blazing fast summaries powered by Llama 3 via Groq.', icon: Bot },
]

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#050507] text-slate-100 overflow-hidden'>
      {/* Background Glows */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]' />
        <div className='absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px]' />
      </div>

      <header className='relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-5'>
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 rounded-md bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' />
            <p className='display-type text-lg font-semibold text-white tracking-tight'>solotutor</p>
          </div>
          <nav className='flex items-center gap-8'>
            <Link
              to='/app/chat'
              className='rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-blue-50 hover:scale-[1.05]'
            >
              Enter Workspace
            </Link>
          </nav>
        </div>
      </header>

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='mx-auto max-w-7xl px-8 pt-32 pb-24 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000'>
            <Sparkles size={14} className='text-blue-400' />
            <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>Powered by Llama 3.1 & Groq</span>
          </div>
          
          <h1 className='display-type mx-auto max-w-5xl text-6xl leading-[1.1] font-bold text-white md:text-8xl tracking-tight mb-10'>
            Build deep understanding, <br />
            <span className='opacity-40 italic'>not just summaries.</span>
          </h1>
          
          <p className='mx-auto max-w-2xl text-xl leading-relaxed text-slate-400 font-light mb-12'>
            Solo Tutor is your personal AI research workspace. 
            Upload documents, analyze videos, and convert information into long-term knowledge.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <Link
              to='/app/upload'
              className='group inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-bold text-white shadow-[0_0_40px_rgba(37,99,235,0.2)] transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'
            >
              Get Started for Free
              <ArrowRight size={20} className='transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              to='/app/video'
              className='rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-slate-200 transition-all hover:bg-white/10'
            >
              Try YouTube Intelligence
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className='mx-auto max-w-7xl px-8 py-24'>
          <div className='grid gap-8 md:grid-cols-3'>
            {highlights.map((h) => (
              <div key={h.title} className='glass-panel p-8 transition-all duration-300 hover:border-white/15 hover:translate-y-[-4px]'>
                <div className={`mb-6 w-fit rounded-2xl bg-white/5 p-4 ${h.color}`}>
                  <h.icon size={24} />
                </div>
                <h3 className='text-xl font-bold text-white mb-3'>{h.title}</h3>
                <p className='text-slate-400 leading-relaxed'>{h.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className='border-y border-white/5 bg-black/20 backdrop-blur-3xl'>
          <div className='mx-auto max-w-7xl px-8 py-24'>
            <div className='grid gap-12 lg:grid-cols-2 items-center'>
              <div>
                <h2 className='display-type text-4xl md:text-5xl font-bold text-white mb-6 leading-tight'>
                  Designed for the <br />
                  <span className='text-blue-500'>Self-Directed Learner</span>
                </h2>
                <p className='text-slate-400 text-lg mb-10 font-light'>
                  We don't just give you answers. We give you a system to understand. 
                  Turn passive reading into active building.
                </p>
                <div className='space-y-6'>
                  {features.map((f) => (
                    <div key={f.title} className='flex gap-5'>
                      <div className='shrink-0 h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400'>
                        <f.icon size={20} />
                      </div>
                      <div>
                        <h4 className='text-white font-bold mb-1'>{f.title}</h4>
                        <p className='text-sm text-slate-500 leading-relaxed'>{f.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='relative'>
                <div className='absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full' />
                <div className='glass-panel relative aspect-square flex items-center justify-center overflow-hidden border-white/10'>
                  <div className='flex flex-col items-center text-center px-12'>
                    <div className='h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 blur-[2px] mb-8 animate-pulse' />
                    <h3 className='display-type text-2xl font-bold text-white mb-4'>The Learning Loop</h3>
                    <p className='text-slate-400 text-sm leading-relaxed'>
                      Ingest → Understand → Practice → Retain. <br />
                      Solo Tutor manages the flow so you can focus on the growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className='mx-auto max-w-7xl px-8 py-32 text-center'>
          <h2 className='display-type text-5xl font-bold text-white mb-8'>Ready to level up?</h2>
          <Link
            to='/app/upload'
            className='inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-xl font-bold text-black transition-all hover:bg-blue-50 hover:scale-[1.05]'
          >
            Enter the Workspace
            <ArrowRight size={22} />
          </Link>
          <p className='mt-8 text-slate-500 text-sm tracking-widest uppercase font-bold'>No credit card required. Pure knowledge.</p>
        </section>
      </main>

      <footer className='border-t border-white/5 py-12'>
        <div className='mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='text-slate-500 text-sm'>© 2024 Solo Tutor. AI-Accelerated Learning.</p>
          <div className='flex gap-8 text-sm text-slate-500'>
            <a href='#' className='hover:text-white transition-colors'>Twitter</a>
            <a href='#' className='hover:text-white transition-colors'>GitHub</a>
            <a href='#' className='hover:text-white transition-colors'>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
