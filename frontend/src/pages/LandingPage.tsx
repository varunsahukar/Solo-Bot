import { ArrowRight, Bot, Brain, Sparkles, Youtube, Shield, Zap, MessageSquare, BookOpen, GraduationCap, Globe, Layers, Cpu, Terminal, Database, Lock, FastForward } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Video Intelligence',
    description: 'Our neural engine extracts core concepts and creates searchable outlines from any YouTube video in seconds.',
    icon: Youtube,
    color: 'text-red-500/70',
    border: 'border-red-500/10'
  },
  {
    title: 'Semantic Retrieval',
    description: 'Chat with your local knowledge base using state-of-the-art RAG technology for 100% factual accuracy.',
    icon: MessageSquare,
    color: 'text-blue-500/70',
    border: 'border-blue-500/10'
  },
  {
    title: 'Adaptive Learning',
    description: 'Dynamic quiz generation and code challenges that evolve with your progress and identify knowledge gaps.',
    icon: Zap,
    color: 'text-emerald-500/70',
    border: 'border-emerald-500/10'
  },
]

const stack = [
  { name: 'Groq LPU™', detail: 'Inference Engine', icon: Cpu, color: 'text-blue-400' },
  { name: 'Llama 3.1', detail: 'Core Intelligence', icon: Bot, color: 'text-purple-400' },
  { name: 'Supabase', detail: 'Neural Database', icon: Database, color: 'text-emerald-400' },
  { name: 'FastAPI', detail: 'Real-time Backend', icon: Terminal, color: 'text-indigo-400' },
]

const steps = [
  {
    number: '01',
    title: 'Ingest',
    detail: 'Feed the system with PDFs, research papers, or YouTube URLs. We handle the heavy lifting of parsing and indexing.',
    icon: BookOpen,
    accent: 'bg-blue-500/20'
  },
  {
    number: '02',
    title: 'Synthesize',
    detail: 'The AI builds a contextual map of your data, identifying key entities, relationships, and recurring themes.',
    icon: Layers,
    accent: 'bg-purple-500/20'
  },
  {
    number: '03',
    title: 'Validate',
    detail: 'Test your retention with auto-generated quizzes or verify facts through our source-grounded knowledge chat.',
    icon: GraduationCap,
    accent: 'bg-emerald-500/20'
  }
]

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-black text-white selection:bg-blue-500/30 selection:text-white'>
      {/* Background Decorative Elements - Subtle Glows */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.03] blur-[120px]' />
        <div className='absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/[0.03] blur-[120px]' />
        
        {/* Grid Overlay */}
        <div className='absolute inset-0 opacity-[0.1]' 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      {/* Navigation */}
      <header className='relative z-50 border-b border-white/5 bg-transparent sticky top-0 backdrop-blur-sm'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 bg-blue-500' />
            <p className='display-type text-xs font-bold uppercase tracking-[0.4em] text-white'>SOLOTUTOR</p>
          </div>
          <nav className='hidden md:flex items-center gap-10'>
            <a href='#how-it-works' className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors'>Workflow</a>
            <a href='#tech' className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors'>Stack</a>
            <a href='#philosophy' className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors'>About</a>
          </nav>
          <Link to='/app/chat' className='rounded-none border border-white/10 bg-white/5 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all'>
            Launch Workspace
          </Link>
        </div>
      </header>

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='mx-auto max-w-7xl px-8 pt-32 pb-48 text-center'>
          <div className='inline-flex items-center gap-2 rounded-none border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 mb-12'>
            <Sparkles size={12} className='text-blue-400' />
            <span className='text-[9px] font-bold uppercase tracking-[0.4em] text-blue-400/80'>Intelligence via Groq & Llama 3.1</span>
          </div>
          
          <h1 className='display-type mx-auto max-w-5xl text-6xl leading-[1.1] font-bold md:text-8xl tracking-tighter mb-12'>
            OWN YOUR<br />
            KNOWLEDGE<span className='text-blue-500 animate-pulse'>.</span>
          </h1>
          
          <p className='mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-400 font-normal mb-16'>
            The minimalist research ecosystem for self-directed learners. 
            Synthesize complex sources into structured mastery at the speed of thought.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
            <Link to='/app/upload' className='rounded-none bg-blue-600 px-12 py-5 text-xs font-bold uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10'>
              Get Started
            </Link>
            <Link to='/app/video' className='rounded-none border border-white/10 bg-white/5 px-12 py-5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all'>
              YouTube Intelligence
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section id='features' className='border-t border-white/5 bg-black py-32'>
          <div className='mx-auto max-w-7xl px-8'>
            <div className='grid gap-px bg-white/5 md:grid-cols-3'>
              {highlights.map((h) => (
                <div key={h.title} className={`bg-black p-12 transition-all duration-500 hover:bg-white/[0.02] border-b md:border-b-0 ${h.border}`}>
                  <div className={`mb-8 ${h.color}`}>
                    <h.icon size={20} />
                  </div>
                  <h3 className='text-sm font-bold mb-4 uppercase tracking-[0.2em] text-white'>{h.title}</h3>
                  <p className='text-zinc-500 leading-relaxed font-normal text-xs'>{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id='how-it-works' className='border-y border-white/5 bg-zinc-950/50 py-40'>
          <div className='mx-auto max-w-7xl px-8'>
            <div className='grid lg:grid-cols-2 gap-32 items-center'>
              <div>
                <h2 className='display-type text-4xl md:text-5xl font-bold mb-16 tracking-tighter'>
                  THE MASTER <br />
                  <span className='text-blue-500'>WORKFLOW.</span>
                </h2>
                <div className='space-y-16'>
                   {steps.map((s) => (
                     <div key={s.number} className='flex gap-10 group'>
                        <div className='text-2xl font-bold text-zinc-800 pt-1 shrink-0 group-hover:text-blue-500 transition-colors duration-500'>{s.number}</div>
                        <div className='space-y-3'>
                           <h4 className='text-xs font-bold flex items-center gap-3 uppercase tracking-[0.3em] text-white'>
                              <div className={`h-1.5 w-1.5 ${s.accent.replace('/20', '')} rounded-full opacity-50`} />
                              {s.title}
                           </h4>
                           <p className='text-zinc-500 text-sm leading-relaxed font-light'>{s.detail}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className='relative'>
                 <div className='aspect-square border border-white/5 p-16 flex flex-col items-center justify-center text-center relative overflow-hidden bg-black'>
                    <div className='absolute inset-0 bg-blue-500/[0.02]' style={{ backgroundImage: 'radial-gradient(#333 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
                    <Bot size={48} className='mb-10 text-blue-500 opacity-30 animate-pulse' />
                    <h3 className='text-sm font-bold mb-6 tracking-[0.3em] uppercase text-white'>Neural Engine</h3>
                    <p className='text-zinc-500 text-sm leading-relaxed max-w-xs font-light'>
                      SoloTutor weaves disparate sources into a coherent network of ideas, enabling non-linear learning.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section id='tech' className='py-40 bg-black'>
           <div className='mx-auto max-w-7xl px-8'>
              <div className='text-center mb-24'>
                 <h2 className='display-type text-3xl font-bold uppercase tracking-[0.4em] mb-4 text-white'>System Architecture</h2>
                 <div className='h-px w-24 bg-blue-500/20 mx-auto' />
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5'>
                 {stack.map((item) => (
                    <div key={item.name} className='bg-black p-10 text-center flex flex-col items-center group'>
                       <item.icon size={20} className={`${item.color} mb-6 opacity-40 group-hover:opacity-100 transition-opacity`} />
                       <h4 className='text-[10px] font-bold uppercase tracking-widest text-white mb-2'>{item.name}</h4>
                       <p className='text-[9px] uppercase tracking-widest text-zinc-600 font-bold'>{item.detail}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Philosophy Section */}
        <section id='philosophy' className='mx-auto max-w-7xl px-8 py-48 border-t border-white/5'>
          <div className='grid lg:grid-cols-2 gap-24'>
            <div className='max-w-xl'>
              <h2 className='display-type text-2xl font-bold mb-10 tracking-[0.4em] uppercase text-white'>
                Philosophy
              </h2>
              <p className='text-zinc-400 text-lg md:text-xl mb-12 font-light leading-relaxed'>
                In an age of information overload, the bottleneck isn't access to data—it's the ability to filter, understand, and apply it. SoloTutor is designed to amplify your intellectual output by removing the friction from research.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-16'>
                <div>
                  <div className='flex items-center gap-3 mb-4'>
                    <Lock size={14} className='text-blue-400/60' />
                    <h4 className='text-[10px] font-bold uppercase tracking-widest text-white'>Data Privacy</h4>
                  </div>
                  <p className='text-zinc-600 text-xs leading-relaxed font-light'>Local-first processing ensures your intellectual property stays under your control.</p>
                </div>
                <div>
                  <div className='flex items-center gap-3 mb-4'>
                    <FastForward size={14} className='text-emerald-400/60' />
                    <h4 className='text-[10px] font-bold uppercase tracking-widest text-white'>Inference Speed</h4>
                  </div>
                  <p className='text-zinc-600 text-xs leading-relaxed font-light'>Powered by Groq's LPU hardware for near-zero latency intelligence.</p>
                </div>
              </div>
            </div>
            <div className='border border-white/5 p-16 flex flex-col justify-center bg-zinc-950/20'>
               <p className='text-zinc-400 text-lg leading-relaxed font-light italic mb-10'>
                 "SoloTutor is not just a tool; it's a second brain that remembers the details so you can focus on the insights. 
                 We aim to bridge the gap between curiosity and expertise."
               </p>
               <div className='flex items-center gap-4'>
                  <div className='h-px w-8 bg-blue-500/30' />
                  <span className='text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]'>Varun Sahukar / Lead Developer</span>
               </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='border-t border-white/5 bg-black py-48 text-center'>
           <h2 className='display-type text-4xl md:text-7xl font-bold mb-16 tracking-tighter'>DEEPEN YOUR<br />UNDERSTANDING.</h2>
           <Link to='/app/upload' className='rounded-none bg-white px-16 py-6 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-blue-600 hover:text-white transition-all shadow-2xl shadow-blue-500/10'>
             Enter Workspace
           </Link>
        </section>
      </main>

      <footer className='border-t border-white/5 py-16 bg-black'>
        <div className='mx-auto max-w-7xl px-8'>
           <div className='grid grid-cols-1 md:grid-cols-3 gap-20 mb-20'>
              <div className='col-span-1'>
                 <div className='flex items-center gap-2 mb-8'>
                    <div className='h-3 w-3 bg-blue-600' />
                    <p className='text-xs font-bold tracking-[0.4em] uppercase text-white'>SOLOTUTOR</p>
                 </div>
                 <p className='text-zinc-600 text-xs leading-relaxed max-w-xs uppercase tracking-widest font-bold'>
                    AI-Accelerated Learning Ecosystem. Built for the curious.
                 </p>
              </div>
              <div className='flex flex-col gap-4 text-left'>
                 <h5 className='text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2'>Product</h5>
                 <Link to='/app/chat' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>Neural Chat</Link>
                 <Link to='/app/video' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>Video Intel</Link>
                 <Link to='/app/quiz' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>Quiz Lab</Link>
              </div>
              <div className='flex flex-col gap-4 text-left'>
                 <h5 className='text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2'>Connect</h5>
                 <a href='#' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>𝕏 / Twitter</a>
                 <a href='#' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>GitHub</a>
                 <a href='#' className='text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors'>Discord</a>
              </div>
           </div>
           <div className='flex justify-between items-center pt-10 border-t border-white/5'>
              <p className='text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-bold'>© 2024 SoloTutor AI Labs.</p>
              <div className='flex gap-8 text-[9px] font-bold text-zinc-700 uppercase tracking-widest'>
                 <span className='cursor-pointer hover:text-white'>Privacy</span>
                 <span className='cursor-pointer hover:text-white'>Terms</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}
