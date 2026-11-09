import { Link } from 'react-router-dom'

function Navigation({ user, setUser }) {
  return (
    <>
      <Link to="/">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/discussions">Group Discussions</Link>
      <Link to="/teacher">Teacher Mode</Link>
      {user && (
        <button onClick={() => setUser(null)}>Logout</button>
      )}
    </>
  )
}

export default Navigation