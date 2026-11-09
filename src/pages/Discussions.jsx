import { useEffect, useState } from 'react'

function Discussions({ username }) {
  const [posts, setPosts] = useState([])
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [error, setError] = useState('')

  const loadPosts = async () => {
    const res = await fetch('http://localhost:3000/discussions')
    setPosts(await res.json())
  }

  useEffect(() => { loadPosts() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setError('')
    const res = await fetch('http://localhost:3000/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message }),
    })
    if (res.ok) {
      setMessage('')
      loadPosts()
    } else {
      setError('Could not post your message. Try again.')
    }
  }

  // Undo toast: removes from UI immediately, deletes on server after 5s unless undone
  const handleDelete = (id) => {
    const target = posts.find(p => p._id === id)
    setPosts(posts.filter(p => p._id !== id))
    setPendingDelete({ post: target, timeout: setTimeout(async () => {
      await fetch(`http://localhost:3000/discussions/${id}`, { method: 'DELETE' })
      setPendingDelete(null)
    }, 5000) })
  }

  const handleUndo = () => {
    if (!pendingDelete) return
    clearTimeout(pendingDelete.timeout)
    setPendingDelete(null)
    loadPosts()
  }

  const visible = posts.filter(p =>
    p.username.toLowerCase().includes(filter.toLowerCase()) ||
    p.message.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="page">
      <h2>Group Discussions</h2>
      <p className="page-hint">
        Post questions and replies to discuss course material with classmates.
        Newest posts appear first.
      </p>
      <ol className="task-path">
        <li>Type a message below</li>
        <li>Click <strong>Post</strong></li>
        <li>Filter by keyword or username to find posts</li>
      </ol>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Message</label>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button type="submit">Post</button>
      </form>

      <label htmlFor="filter" className="filter-label">Filter posts</label>
      <input
        id="filter"
        className="filter-input"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter by user or keyword…"
      />

      <table>
        <thead>
          <tr><th>User</th><th>Message</th><th>When</th><th>Action</th></tr>
        </thead>
        <tbody>
          {visible.map(p => (
            <tr key={p._id}>
              <td>{p.username}</td>
              <td>{p.message}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                {p.username === username && (
                  <button type="button" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                )}
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

export default Discussions