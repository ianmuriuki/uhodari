import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { Upload } from './pages/Upload'
import { StoryDetail } from './pages/StoryDetail'
import { Chatbot } from './pages/Chatbot'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { About } from './pages/About'
import { ProtectedRoute } from './components/Common/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="story/:id" element={<StoryDetail />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="upload" element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App