import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ChatPage from './pages/ChatPage'
import UploadPage from './pages/UploadPage'
import QuizPage from './pages/QuizPage'
import CodePage from './pages/CodePage'
import VideoPage from './pages/VideoPage'
import LandingPage from './pages/LandingPage'
import SupabasePage from './pages/page'

function TutorWorkspace() {
  return (
    <div className='flex h-screen bg-black text-white dashboard-container'>
      <Sidebar />
      <main className='relative z-10 flex-1 overflow-auto bg-transparent'>

        <Routes>
          <Route path='chat' element={<ChatPage />} />
          <Route path='upload' element={<UploadPage />} />
          <Route path='video' element={<VideoPage />} />
          <Route path='quiz' element={<QuizPage />} />
          <Route path='code' element={<CodePage />} />
          <Route path='supabase' element={<SupabasePage />} />
          <Route path='*' element={<Navigate to='chat' replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/app/*' element={<TutorWorkspace />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
