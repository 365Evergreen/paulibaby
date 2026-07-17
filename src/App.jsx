import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { fetchPosts, getBlogContainerUrl } from './lib/azureBlog'

const siteTitle = import.meta.env.VITE_SITE_TITLE || 'Pauli Baby'
const siteTagline =
  import.meta.env.VITE_SITE_TAGLINE || 'Personal writing powered by React, Vite, and Azure Blob Storage.'
const siteIntro =
  import.meta.env.VITE_SITE_INTRO ||
  'Publish each post as a JSON blob, and this site will automatically load the newest entries from your Azure container.'

function formatDate(value) {
  if (!value) {
    return 'Draft'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function App() {
  const [posts, setPosts] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [loading, setLoading] = useState(Boolean(getBlogContainerUrl()))
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPosts() {
      if (!getBlogContainerUrl()) {
        setLoading(false)
        return
      }

      try {
        const nextPosts = await fetchPosts()

        if (!isMounted) {
          return
        }

        setPosts(nextPosts)
        setSelectedSlug((currentSlug) => currentSlug || nextPosts[0]?.slug || '')
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load posts right now.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug) ?? posts[0],
    [posts, selectedSlug],
  )

  const hasContainer = Boolean(getBlogContainerUrl())

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Personal blog</p>
        <h1>{siteTitle}</h1>
        <p className="tagline">{siteTagline}</p>
        <p className="intro">{siteIntro}</p>
        <div className="status-card">
          {!hasContainer && (
            <>
              <h2>Connect your Azure Blob CMS</h2>
              <p>
                Set <code>VITE_AZURE_BLOG_CONTAINER_URL</code> to a public or SAS-enabled blob container URL to load
                your posts.
              </p>
            </>
          )}
          {hasContainer && loading && <p>Loading posts from Azure Blob Storage…</p>}
          {hasContainer && !loading && error && (
            <>
              <h2>We couldn&apos;t load the blog content.</h2>
              <p>{error}</p>
            </>
          )}
          {hasContainer && !loading && !error && !posts.length && (
            <>
              <h2>No posts found yet</h2>
              <p>Add one or more <code>.json</code> blobs to your container to populate the blog.</p>
            </>
          )}
          {hasContainer && !loading && !error && Boolean(posts.length) && (
            <>
              <h2>{posts.length} post{posts.length === 1 ? '' : 's'} published</h2>
              <p>The newest post opens automatically, and visitors can browse older entries from the list below.</p>
            </>
          )}
        </div>
      </section>

      <section className="content-grid" aria-label="Blog content">
        <aside className="sidebar-panel">
          <div className="panel-heading">
            <h2>Posts</h2>
            <p>Stored as JSON blobs in Azure.</p>
          </div>
          <div className="post-list" role="list">
            {posts.map((post) => {
              const isActive = post.slug === selectedPost?.slug

              return (
                <button
                  key={post.slug}
                  type="button"
                  className={`post-link${isActive ? ' is-active' : ''}`}
                  onClick={() => setSelectedSlug(post.slug)}
                >
                  <span className="post-date">{formatDate(post.publishedAt)}</span>
                  <span className="post-title">{post.title}</span>
                  <span className="post-excerpt">{post.excerpt}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <article className="article-panel">
          {selectedPost ? (
            <>
              <div className="article-meta">
                <p className="eyebrow">{formatDate(selectedPost.publishedAt)}</p>
                <h2>{selectedPost.title}</h2>
                <p>
                  By {selectedPost.author}
                  {selectedPost.tags.length ? ` • ${selectedPost.tags.join(' • ')}` : ''}
                </p>
              </div>
              <div className="article-body">
                {selectedPost.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Ready for your first post</h2>
              <p>Once your Azure container is connected, published entries will appear here.</p>
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
