import { useEffect, useState } from 'react'

function TeacherMode({ username }) {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const loadPosts = async () => {
    const res = await fetch('http://localhost:3000/discussions')
    setPosts(await res.json())
  }

  const loadUsers = async () => {
    const res = await fetch('http://localhost:3000/users')
    setUsers(await res.json())
  }

  useEffect(() => {
    loadPosts()
    loadUsers()
  }, [])

  const handleDelete = (id) => {
    if (!confirm('Delete this post permanently? You will have 5 seconds to undo.')) return
    const target = posts.find(p => p._id === id)
    setPosts(posts.filter(p => p._id !== id))
    setPendingDelete({ post: target, timeout: setTimeout(async () => {
      const res = await fetch(`http://localhost:3000/discussions/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) setError('Could not delete post')
      setPendingDelete(null)
    }, 5000) })
  }

  const handleUndo = () => {
    if (!pendingDelete) return
    clearTimeout(pendingDelete.timeout)
    setPendingDelete(null)
    loadPosts()
  }

  return (
    <div className="page">
      <h2>Teacher Mode</h2>
      <p className="page-hint">
        Review all accounts and moderate discussion posts. Deleting a post is
        permanent after the undo window closes.
      </p>
      <p className="page-hint">Signed in as: <strong>{username}</strong></p>
      {error && <p className="error">{error}</p>}

      <h3>Users ({users.length})</h3>
      <table>
        <thead>
          <tr><th>Username</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}><td>{u.username}</td></tr>
          ))}
        </tbody>
      </table>

      <h3>All Discussions ({posts.length})</h3>
      <table>
        <thead>
          <tr><th>User</th><th>Message</th><th>When</th><th>Action</th></tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id}>
              <td>{p.username}</td>
              <td>{p.message}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                <button type="button" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pendingDelete && (
        <div className="toast">
          Post deleted. <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </div>
  )
}

export default TeacherMode