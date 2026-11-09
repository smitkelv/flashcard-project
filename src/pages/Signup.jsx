import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      navigate('/', { state: { message: 'Account created — please log in.' } })
    } else {
      const err = await res.json()
      setError(err.Error || 'Signup failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <p className="form-hint">
        Create an account to join the class discussion board.
      </p>
      {error && <p className="error">{error}</p>}
      <label>Username</label>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <p className="field-note">Usernames cannot be changed later.</p>
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <p className="field-note">Passwords are stored as-is for this class project.</p>
      <button type="submit">Create Account</button>
      <p className="form-alt">
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </form>
  )
}

export default Signup