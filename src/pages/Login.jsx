import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'

function Login({ setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data.username)
      navigate('/discussions')
    } else {
      const err = await res.json()
      setError(err.Error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <p className="form-hint">
        Log in to post and read messages in Group Discussions.
      </p>
      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}
      <label>Username</label>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log In</button>
      <p className="form-alt">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </form>
  )
}

export default Login