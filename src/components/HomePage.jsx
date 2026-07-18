import { Link } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import styles from './HomePage.module.css'

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
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function HomePage({ posts, featuredPost, siteTitle, siteIntro }) {
  const latestPosts = posts.slice(0, 3)

  return (
    <section className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <h1>{siteTitle}</h1>
          <p className={styles.lead}>{siteIntro}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryLink} to="/blog">
              Browse the archive
            </Link>
            <Link className={styles.secondaryLink} to={`/blog/${featuredPost?.slug ?? ''}`}>
              Read the latest post
            </Link>
          </div>
        </div>

        <article className={styles.featureCard}>
          <p className={styles.sectionLabel}>Featured update</p>
          <h2>{featuredPost?.title ?? 'A new story is brewing'}</h2>
          <p className={styles.featureText}>{featuredPost?.excerpt ?? 'The newest post will appear here once your content is connected.'}</p>
          <div className={styles.metaRow}>
            <span>{featuredPost?.author ?? 'Pauli Baby'}</span>
            <span>{formatDate(featuredPost?.publishedAt)}</span>
          </div>
          {featuredPost ? <Link className={styles.cardLink} to={`/blog/${featuredPost.slug}`}>Open full post</Link> : null}
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Latest notes</p>
            <h2>Fresh from the archive</h2>
          </div>
          <Link className={styles.textLink} to="/blog">
            See all posts
          </Link>
        </div>

        <div className={styles.postGrid}>
          {latestPosts.map((post) => (
            <article className={styles.postCard} key={post.slug}>
              <p className={styles.postDate}>{formatDate(post.publishedAt)}</p>
              <h3>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <Link className={styles.cardLink} to={`/blog/${post.slug}`}>
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>A reusable media layer</p>
            <h2>Video stories, ready to slot into any post</h2>
          </div>
        </div>

        <div className={styles.videoShell}>
          <div className={styles.videoCopy}>
            <h3>Shared experience, flexible layout</h3>
            <p>
              The video player is built once and can be reused across the landing page or individual posts without any inline styling.
            </p>
          </div>
          <VideoPlayer
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            title="A short motion sample for immersive storytelling"
          />
        </div>
      </section>
    </section>
  )
}

export default HomePage
