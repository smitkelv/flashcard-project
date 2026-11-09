import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TeacherMode from './pages/TeacherMode'
import Discussions from './pages/Discussions'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <header>
        <h1>Login App</h1>
        <p>{user ? `Signed in as ${user}` : 'Please log in or sign up.'}</p>
      </header>
      <nav>
        <Navigation user={user} setUser={setUser} />
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/discussions"
            element={user ? <Discussions username={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/teacher"
            element={user ? <TeacherMode username={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
      <footer>
        <p>Copyright &copy; {new Date().getFullYear()} Kelvin Smith</p>
      </footer>
    </BrowserRouter>
  )
}

export default App