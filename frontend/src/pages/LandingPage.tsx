import { ArrowRight, Bot, Brain, Sparkles, Youtube, Shield, Zap, MessageSquare, BookOpen, Code, GraduationCap, Globe, Layers, Search, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Video Intelligence',
    description: 'Transform passive YouTube watching into active study sessions. Our AI extracts core concepts, creates structured outlines, and lets you query the video directly.',
    icon: Youtube,
    color: 'text-red-400',
    bg: 'bg-red-400/10'
  },
  {
    title: 'Semantic Knowledge Chat',
    description: 'Stop CTRL+F. Chat with your PDFs, notes, and transcripts using advanced Neural Retrieval (RAG). Every answer is cross-referenced with your sources.',
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    title: 'Adaptive Learning Lab',
    description: 'Generate custom quizzes, flashcards, and coding challenges based on the materials you upload. We identify your knowledge gaps and help you bridge them.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10'
  },
]

const steps = [
  {
    number: '01',
    title: 'Ingest Your Sources',
    detail: 'Upload PDFs, research papers, or paste YouTube URLs. Our system processes and indexes them for instant recall.',
    icon: BookOpen
  },
  {
    number: '02',
    title: 'Build Context',
    detail: 'Our AI summarizes, extracts entities, and creates a visual map of the information so you see the big picture immediately.',
    icon: Layers
  },
  {
    number: '03',
    title: 'Master the Material',
    detail: 'Generate quizzes, practice code, or chat with your "Second Brain" to deepen your understanding and retain knowledge longer.',
    icon: GraduationCap
  }
]

const features = [
  { title: 'Privacy First', detail: 'We prioritize your data sovereignty. Local-first processing ensures your learning history stays yours.', icon: Shield },
  { title: 'Neural Retrieval', detail: 'We use state-of-the-art vector embeddings and full-text search to ensure 100% factual accuracy.', icon: Brain },
  { title: 'Edge Performance', detail: 'Powered by Groq LPU™ technology, our AI responses are near-instant, matching the speed of your thought.', icon: Cpu },
  { title: 'Global Context', detail: 'Our RAG engine can handle massive documents, maintaining context across thousands of pages.', icon: Globe },
]

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#050507] text-slate-100 overflow-x-hidden selection:bg-blue-500/30'>
      {/* Background Decorative Elements */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-blue-600/5 blur-[120px] animate-pulse' />
        <div className='absolute bottom-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-purple-600/5 blur-[120px] animate-pulse' style={{ animationDelay: '1s' }} />
        <div className='absolute top-[40%] left-[30%] h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]' />
      </div>

      {/* Navigation */}
      <header className='relative z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl sticky top-0'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-5'>
          <div className='flex items-center gap-3 group cursor-pointer'>
            <div className='h-6 w-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-300' />
            <p className='display-type text-xl font-bold text-white tracking-tight'>solotutor<span className='text-blue-500'>.</span></p>
          </div>
          <nav className='hidden md:flex items-center gap-10'>
            <a href='#features' className='text-sm font-medium text-slate-400 hover:text-white transition-colors'>Features</a>
            <a href='#how-it-works' className='text-sm font-medium text-slate-400 hover:text-white transition-colors'>How it Works</a>
            <a href='#mission' className='text-sm font-medium text-slate-400 hover:text-white transition-colors'>Our Mission</a>
          </nav>
          <div className='flex items-center gap-4'>
            <Link
              to='/app/chat'
              className='rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black shadow-xl shadow-white/5 transition-all hover:bg-blue-50 hover:scale-[1.05] active:scale-[0.95]'
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </header>

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='mx-auto max-w-7xl px-8 pt-32 pb-40 text-center relative'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000'>
            <Sparkles size={14} className='text-blue-400' />
            <span className='text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400'>Intelligence Redefined for Learners</span>
          </div>
          
          <h1 className='display-type mx-auto max-w-5xl text-7xl leading-[1.05] font-bold text-white md:text-9xl tracking-tighter mb-12'>
            Deep learning, <br />
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic font-light'>AI accelerated.</span>
          </h1>
          
          <p className='mx-auto max-w-3xl text-xl md:text-2xl leading-relaxed text-slate-400 font-light mb-16'>
            SoloTutor is an intelligent research ecosystem designed for the modern autodidact. 
            We bridge the gap between information and mastery through visual intelligence and neural context.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <Link
              to='/app/upload'
              className='group relative inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-12 py-6 text-xl font-bold text-white shadow-[0_0_60px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'
            >
              Start Your Journey
              <ArrowRight size={22} className='transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              to='/app/video'
              className='rounded-2xl border border-white/10 bg-white/5 px-12 py-6 text-xl font-semibold text-slate-200 transition-all hover:bg-white/10 hover:border-white/20'
            >
              Watch Video Demo
            </Link>
          </div>

          <div className='mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700'>
             <div className='flex items-center justify-center gap-2'>
                <Cpu size={20} />
                <span className='text-sm font-bold uppercase tracking-widest'>Groq LPU™</span>
             </div>
             <div className='flex items-center justify-center gap-2'>
                <Bot size={20} />
                <span className='text-sm font-bold uppercase tracking-widest'>Llama 3.1</span>
             </div>
             <div className='flex items-center justify-center gap-2'>
                <Search size={20} />
                <span className='text-sm font-bold uppercase tracking-widest'>Neural Search</span>
             </div>
             <div className='flex items-center justify-center gap-2'>
                <Code size={20} />
                <span className='text-sm font-bold uppercase tracking-widest'>OSS Architecture</span>
             </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id='features' className='mx-auto max-w-7xl px-8 py-32'>
          <div className='text-center mb-24'>
            <h2 className='display-type text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight'>What can you do with SoloTutor?</h2>
            <p className='text-slate-400 text-xl font-light max-w-2xl mx-auto'>Three core pillars designed to move you from confusion to clarity.</p>
          </div>
          <div className='grid gap-8 md:grid-cols-3'>
            {highlights.map((h) => (
              <div key={h.title} className='glass-panel group p-10 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] relative overflow-hidden'>
                <div className='absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors' />
                <div className={`mb-8 w-fit rounded-2xl p-5 ${h.bg} ${h.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <h.icon size={28} />
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>{h.title}</h3>
                <p className='text-slate-400 leading-relaxed text-lg font-light'>{h.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id='how-it-works' className='relative py-32 overflow-hidden'>
           <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent' />
           <div className='mx-auto max-w-7xl px-8'>
              <div className='grid lg:grid-cols-2 gap-24 items-center'>
                 <div>
                    <h2 className='display-type text-5xl md:text-7xl font-bold text-white mb-10 tracking-tighter leading-[1.1]'>
                      The Master <br />
                      <span className='text-blue-500'>Workflow.</span>
                    </h2>
                    <div className='space-y-12'>
                       {steps.map((s) => (
                         <div key={s.number} className='flex gap-8 group'>
                            <div className='text-4xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors duration-500 display-type pt-1 shrink-0'>{s.number}</div>
                            <div className='space-y-3'>
                               <h4 className='text-2xl font-bold text-white flex items-center gap-3'>
                                  <s.icon size={22} className='text-blue-500' />
                                  {s.title}
                               </h4>
                               <p className='text-slate-400 text-lg leading-relaxed font-light'>{s.detail}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className='relative'>
                    <div className='absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full' />
                    <div className='glass-panel p-1 border-white/5 relative aspect-square rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl'>
                       <div className='h-full w-full rounded-[1.15rem] bg-[#0c0c0e] flex flex-col items-center justify-center p-12 text-center'>
                          <div className='h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-8 animate-bounce duration-[2000ms]'>
                             <Sparkles size={32} />
                          </div>
                          <h3 className='text-3xl font-bold text-white mb-6'>AI-Orchestrated Learning</h3>
                          <p className='text-slate-500 text-lg leading-relaxed mb-8 font-light'>
                             "SoloTutor doesn't just store files; it weaves them into a coherent network of ideas."
                          </p>
                          <div className='flex gap-2'>
                             {[1,2,3,4,5].map(i => <div key={i} className='h-1.5 w-8 rounded-full bg-blue-500/20' />)}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Philosophy / About Section */}
        <section id='mission' className='mx-auto max-w-7xl px-8 py-40 border-t border-white/5'>
          <div className='grid gap-20 lg:grid-cols-2'>
            <div>
              <h2 className='display-type text-4xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight'>
                Built for the <br />
                <span className='italic font-light opacity-60'>Modern Intellectual</span>
              </h2>
              <p className='text-slate-400 text-xl mb-12 font-light leading-relaxed'>
                We believe that learning shouldn't be a chore. In an age of information overload, the bottleneck isn't 
                access to data—it's the ability to filter, understand, and apply it. SoloTutor is our answer to that challenge.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                {features.map((f) => (
                  <div key={f.title} className='group'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'>
                        <f.icon size={18} />
                      </div>
                      <h4 className='text-white font-bold'>{f.title}</h4>
                    </div>
                    <p className='text-slate-500 text-sm leading-relaxed'>{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='glass-panel p-12 flex flex-col justify-center relative overflow-hidden group'>
               <div className='absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mb-32 -mr-32 group-hover:bg-blue-500/20 transition-all duration-700' />
               <div className='space-y-8 relative z-10'>
                  <div className='inline-block rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400'>The Philosophy</div>
                  <h3 className='text-4xl font-bold text-white leading-tight'>Active understanding over passive consumption.</h3>
                  <p className='text-slate-400 text-lg leading-relaxed font-light italic'>
                    "Our goal is to build a tool that feels like a natural extension of your mind. A system that remembers 
                    the details so you can focus on the insights. Whether you are a student, researcher, or curious mind, 
                    SoloTutor is designed to amplify your intellectual output."
                  </p>
                  <div className='flex items-center gap-4 pt-4'>
                     <div className='h-px flex-1 bg-white/10' />
                     <span className='text-sm font-bold text-slate-500 uppercase tracking-widest'>Team solotutor</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className='mx-auto max-w-7xl px-8 py-40 text-center relative overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none'>
             <div className='h-[500px] w-[500px] rounded-full border border-white/10' />
             <div className='absolute h-[300px] w-[300px] rounded-full border border-white/10' />
          </div>
          <div className='relative z-10'>
             <h2 className='display-type text-5xl md:text-7xl font-bold text-white mb-10 tracking-tighter'>Own your knowledge.</h2>
             <p className='text-slate-400 text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto leading-relaxed'>
               Join thousands of self-directed learners building their "Second Brain" with SoloTutor.
             </p>
             <Link
               to='/app/upload'
               className='group inline-flex items-center gap-4 rounded-2xl bg-white px-12 py-6 text-2xl font-black text-black shadow-[0_0_80px_rgba(255,255,255,0.1)] transition-all hover:bg-blue-50 hover:scale-[1.05] active:scale-[0.95]'
             >
               Enter Workspace
               <ArrowRight size={26} className='transition-transform group-hover:translate-x-1' />
             </Link>
             <p className='mt-10 text-slate-600 text-sm tracking-[0.25em] uppercase font-bold'>No account required to explore. Fast & Private.</p>
          </div>
        </section>
      </main>

      <footer className='border-t border-white/5 py-20 bg-black/40'>
        <div className='mx-auto max-w-7xl px-8'>
           <div className='grid grid-cols-1 md:grid-cols-4 gap-16 mb-20'>
              <div className='col-span-2'>
                 <div className='flex items-center gap-3 mb-8'>
                    <div className='h-5 w-5 rounded-md bg-blue-600' />
                    <p className='display-type text-xl font-bold text-white'>solotutor<span className='text-blue-500'>.</span></p>
                 </div>
                 <p className='text-slate-500 text-lg font-light leading-relaxed max-w-sm'>
                   An open-source intelligence platform for self-directed learners, researchers, and builders. 
                   Accelerate your understanding with AI.
                 </p>
              </div>
              <div>
                 <h5 className='text-white font-bold mb-6 uppercase text-xs tracking-widest'>Product</h5>
                 <ul className='space-y-4 text-sm text-slate-500'>
                    <li><Link to='/app/chat' className='hover:text-blue-400 transition-colors'>Neural Chat</Link></li>
                    <li><Link to='/app/video' className='hover:text-blue-400 transition-colors'>Video Intel</Link></li>
                    <li><Link to='/app/quiz' className='hover:text-blue-400 transition-colors'>Quiz Lab</Link></li>
                    <li><Link to='/app/code' className='hover:text-blue-400 transition-colors'>Code Mentor</Link></li>
                 </ul>
              </div>
              <div>
                 <h5 className='text-white font-bold mb-6 uppercase text-xs tracking-widest'>Connect</h5>
                 <ul className='space-y-4 text-sm text-slate-500'>
                    <li><a href='#' className='hover:text-blue-400 transition-colors'>𝕏 / Twitter</a></li>
                    <li><a href='#' className='hover:text-blue-400 transition-colors'>GitHub</a></li>
                    <li><a href='#' className='hover:text-blue-400 transition-colors'>Discord</a></li>
                    <li><a href='#' className='hover:text-blue-400 transition-colors'>Email Us</a></li>
                 </ul>
              </div>
           </div>
           <div className='flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5'>
             <p className='text-slate-600 text-xs tracking-wider uppercase font-bold'>© 2024 SoloTutor AI Labs. Made for the curious.</p>
             <div className='flex gap-10 text-xs text-slate-600 font-bold uppercase tracking-widest'>
               <a href='#' className='hover:text-white transition-colors'>Privacy</a>
               <a href='#' className='hover:text-white transition-colors'>Terms</a>
               <a href='#' className='hover:text-white transition-colors'>Cookies</a>
             </div>
           </div>
        </div>
      </footer>
    </div>
  )
}
