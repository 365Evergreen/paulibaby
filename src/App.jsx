import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import BlogArchivePage from './components/BlogArchivePage'
import SinglePostPage from './components/SinglePostPage'
import { fetchPosts, getBlogContainerUrl } from './lib/azureBlog'

const siteTitle = import.meta.env.VITE_SITE_TITLE || 'Pauli Baby'
const siteTagline =
  import.meta.env.VITE_SITE_TAGLINE || 'Personal writing powered by React, Vite, and Azure Blob Storage.'
const siteIntro =
  import.meta.env.VITE_SITE_INTRO ||
  'Publish each post as a JSON blob, and this site will automatically load the newest entries from your Azure container.'

const fallbackPosts = [
  {
    slug: 'welcome-to-the-new-site',
    title: 'Welcome to the new site experience',
    excerpt: 'A polished layout for landing, archive, and story pages with a reusable video component.',
    publishedAt: '2026-07-01',
    author: 'Pauli Baby',
    tags: ['design', 'launch'],
    paragraphs: [
      'This fresh layout gives the site a dedicated landing page, an archive view, and an article-style reading experience.',
      'The header and footer are intentionally simple so that future content can take center stage.',
    ],
  },
  {
    slug: 'building-with-azure-blob-storage',
    title: 'Building with Azure Blob Storage',
    excerpt: 'Use JSON blobs as content entries and let a lightweight frontend render each piece with strong defaults.',
    publishedAt: '2026-06-24',
    author: 'Pauli Baby',
    tags: ['azure', 'cms'],
    paragraphs: [
      'Azure Blob Storage is a practical publishing backend for a small personal site because it stays simple and fairly low-friction.',
      'JSON blobs remain portable and the frontend can transform them into polished stories without much ceremony.',
    ],
  },
  {
    slug: 'designing-for-quiet-reading',
    title: 'Designing for quiet reading',
    excerpt: 'A calm visual language helps the content breathe and keeps the browsing experience clear.',
    publishedAt: '2026-06-10',
    author: 'Pauli Baby',
    tags: ['ux', 'writing'],
    paragraphs: [
      'Readable type, generous spacing, and a clear visual hierarchy make the experience feel calm rather than crowded.',
      'That same approach applies equally well to the landing page, archive, and single-post view.',
    ],
  },
]

function AppContent() {
  const [posts, setPosts] = useState([])
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

  const displayPosts = useMemo(() => (posts.length ? posts : fallbackPosts), [posts])
  const hasContainer = Boolean(getBlogContainerUrl())
  const featuredPost = displayPosts[0]

  return (
    <main className={styles.appShell}>
      <Header siteTitle={siteTitle} siteTagline={siteTagline} />

      {hasContainer && loading ? <div className={styles.banner}>Loading posts from Azure Blob Storage…</div> : null}
      {hasContainer && error ? <div className={styles.bannerError}>{error}</div> : null}
      {!hasContainer ? <div className={styles.banner}>Set VITE_AZURE_BLOG_CONTAINER_URL to connect your Azure Blob CMS.</div> : null}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              posts={displayPosts}
              featuredPost={featuredPost}
              siteTitle={siteTitle}
              siteIntro={siteIntro}
            />
          }
        />
        <Route path="/blog" element={<BlogArchivePage posts={displayPosts} />} />
        <Route path="/blog/:slug" element={<SinglePostPage posts={displayPosts} />} />
      </Routes>
    </main>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
