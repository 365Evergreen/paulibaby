import { Link } from 'react-router-dom'
import styles from './BlogArchivePage.module.css'

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

function BlogArchivePage({ posts }) {
  return (
    <section className={styles.page}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Archive</p>
        <h1>Browse every post</h1>
        <p className={styles.lead}>A calm archive page for long-form writing, quick notes, and embedded media.</p>
      </div>

      <div className={styles.postList}>
        {posts.map((post) => (
          <article className={styles.postCard} key={post.slug}>
            <div className={styles.postMeta}>
              <p className={styles.postDate}>{formatDate(post.publishedAt)}</p>
              <p className={styles.postAuthor}>{post.author}</p>
            </div>
            <h2>{post.title}</h2>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
            <div className={styles.tagRow}>
              {post.tags.map((tag) => (
                <span className={styles.tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link className={styles.readLink} to={`/blog/${post.slug}`}>
              Open post
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogArchivePage
