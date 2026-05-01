import { ArrowRight, Bot, Brain, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Focused Learning',
    description: 'Turn any document or video into structured lessons with context-aware explanations.',
    icon: Brain,
  },
  {
    title: 'AI Chat Tutor',
    description: 'Ask deep follow-up questions and get clear responses grounded in your uploaded content.',
    icon: Bot,
  },
  {
    title: 'Quiz + Code Coach',
    description: 'Generate quiz questions and coding assistance from the same study material.',
    icon: Sparkles,
  },
]

const workflow = [
  {
    step: '01',
    title: 'Ingest',
    detail: 'Upload PDFs, notes, transcripts, or video files. Solo Tutor extracts and indexes your material for retrieval.',
  },
  {
    step: '02',
    title: 'Understand',
    detail: 'Use chat to ask precise follow-up questions and get answers grounded in your actual source content.',
  },
  {
    step: '03',
    title: 'Practice',
    detail: 'Generate quizzes on weak areas and use code mode to apply concepts with guided examples.',
  },
  {
    step: '04',
    title: 'Retain',
    detail: 'Keep history tied to each document so every study session compounds instead of restarting.',
  },
]

const ideaPoints = [
  'Most learners collect content but do not convert it into active understanding.',
  'Reading-only flows cause low retention and weak confidence before exams/interviews.',
  'Solo Tutor closes the loop: ingest -> explain -> test -> apply in one place.',
]

const outcomes = [
  { label: 'Context-grounded chat', value: 'Source-aware answers' },
  { label: 'Adaptive quizzes', value: 'Practice from your material' },
  { label: 'Code support', value: 'Concept-to-implementation' },
  { label: 'Single workspace', value: 'No tool switching' },
]

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-transparent text-slate-100'>
      <header className='relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-sm'>
        <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4'>
          <p className='display-type text-base text-white'>solotutor</p>
          <nav className='flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-slate-300'>
            <a href='#features' className='transition hover:text-white'>
              Work
            </a>
            <a href='#about' className='transition hover:text-white'>
              About
            </a>
            <a href='#contact' className='transition hover:text-white'>
              Contact
            </a>
            <Link
              to='/app/chat'
              className='rounded-full border border-white/20 bg-white px-4 py-2 font-medium text-black transition hover:bg-slate-200'
            >
              Open App
            </Link>
          </nav>
        </div>
      </header>

      <section className='relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-20'>
        <p className='mb-5 w-fit text-[10px] uppercase tracking-[0.22em] text-slate-400'>AI tutor workspace</p>
        <h1 className='display-type max-w-5xl text-6xl leading-[0.88] text-white md:text-8xl'>
          Study hard.
          <br />
          Build smart ↗
        </h1>
        <p className='mt-10 max-w-2xl text-lg leading-relaxed text-slate-300'>
          Solo Tutor turns your PDFs, notes, and videos into a focused AI workspace with chat, quizzes, and coding
          help. One clean interface. One learning flow.
        </p>
        <div className='mt-8 flex flex-wrap items-center gap-4'>
          <Link
            to='/app/upload'
            className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-6 py-3 font-semibold text-black transition hover:bg-slate-200'
          >
            Start Learning
            <ArrowRight size={16} />
          </Link>
          <a
            href='#about'
            className='rounded-full border border-white/20 px-6 py-3 font-medium text-slate-200 transition hover:border-white/40 hover:text-white'
          >
            Learn About Solo Tutor
          </a>
        </div>
      </section>

      <section id='features' className='relative z-10 mx-auto w-full max-w-6xl px-6 pb-16'>
        <h2 className='display-type mb-6 text-5xl leading-none text-white md:text-6xl'>Work</h2>
        <div className='grid gap-5 md:grid-cols-3'>
          {highlights.map(({ title, description, icon: Icon }) => (
            <article key={title} className='rounded-2xl border border-white/10 bg-black/40 p-5'>
              <div className='mb-4 w-fit rounded-xl border border-white/20 bg-white/5 p-2 text-white'>
                <Icon size={20} />
              </div>
              <h3 className='text-lg font-semibold text-white'>{title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-slate-300'>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='relative z-10 mx-auto w-full max-w-6xl px-6 pb-16'>
        <div className='grid gap-5 lg:grid-cols-[1.3fr_1fr]'>
          <article className='rounded-2xl border border-white/10 bg-black/40 p-6'>
            <p className='mb-2 text-[10px] uppercase tracking-[0.22em] text-slate-400'>Product idea</p>
            <h3 className='display-type text-4xl leading-[0.95] text-white md:text-5xl'>
              Build deep understanding, not shallow summaries.
            </h3>
            <div className='mt-6 space-y-4'>
              {ideaPoints.map((point) => (
                <div key={point} className='flex items-start gap-3'>
                  <CheckCircle2 size={16} className='mt-1 text-white' />
                  <p className='text-sm leading-relaxed text-slate-300'>{point}</p>
                </div>
              ))}
            </div>
          </article>

          <article className='rounded-2xl border border-white/10 bg-black/40 p-6'>
            <p className='mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400'>Visual outcomes</p>
            <div className='grid gap-3'>
              {outcomes.map((item) => (
                <div key={item.label} className='rounded-xl border border-white/10 bg-black/40 px-4 py-3'>
                  <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>{item.label}</p>
                  <p className='mt-1 text-sm font-medium text-white'>{item.value}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id='about' className='relative z-10 border-t border-white/10 bg-black/40'>
        <div className='mx-auto w-full max-w-6xl px-6 py-16'>
          <h2 className='text-3xl font-bold text-white md:text-4xl'>About Solo Tutor</h2>
          <p className='mt-5 max-w-3xl text-base leading-relaxed text-slate-300'>
            Solo Tutor is designed for independent learners who want fast understanding, not passive reading. The
            platform turns static content into an interactive learning flow: ingest, discuss, test, and apply. This
            landing page includes your About section directly so users can understand the product before entering the
            app workspace.
          </p>
          <div className='mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-slate-300'>
            This platform is designed for students, self-learners, and builders who want a system-level learning
            loop. Instead of juggling multiple tools, Solo Tutor keeps ingestion, explanation, recall practice, and
            coding application in one focused workspace.
          </div>
        </div>
      </section>

      <section className='relative z-10 mx-auto w-full max-w-6xl px-6 pb-16'>
        <h2 className='display-type mb-6 text-4xl text-white md:text-5xl'>How it works</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          {workflow.map((item) => (
            <article key={item.step} className='rounded-2xl border border-white/10 bg-black/40 p-5'>
              <p className='text-[10px] uppercase tracking-[0.22em] text-slate-400'>Step {item.step}</p>
              <h3 className='mt-2 text-xl font-semibold text-white'>{item.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-slate-300'>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id='contact' className='relative z-10 border-t border-white/10'>
        <div className='mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-6 py-14'>
          <h2 className='display-type text-5xl leading-[0.9] text-white md:text-7xl'>
            Say hi!
            <br />
            Let&apos;s talk ↗
          </h2>
          <p className='text-sm text-slate-400'>hello@solotutor.ai</p>
        </div>
      </section>
    </div>
  )
}
