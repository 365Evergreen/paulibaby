import { Link, useParams } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import styles from './SinglePostPage.module.css'

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

function SinglePostPage({ posts }) {
  const { slug } = useParams()
  const post = posts.find((entry) => entry.slug === slug)

  if (!post) {
    return (
      <section className={styles.notFound}>
        <p className={styles.eyebrow}>Post not found</p>
        <h1>That article is not available.</h1>
        <p>Return to the archive to browse the latest stories.</p>
        <Link className={styles.backLink} to="/blog">
          Back to the archive
        </Link>
      </section>
    )
  }

  const relatedPosts = posts.filter((entry) => entry.slug !== post.slug).slice(0, 2)

  return (
    <section className={styles.page}>
      <article className={styles.postCard}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{formatDate(post.publishedAt)}</p>
          <h1>{post.title}</h1>
          <p className={styles.lead}>By {post.author}</p>
          <div className={styles.tagRow}>
            {post.tags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          {post.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <div className={styles.mediaBlock}>
        <VideoPlayer
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          title="Embedded video for the post experience"
        />
      </div>

      {relatedPosts.length ? (
        <aside className={styles.related}>
          <h2>More reading</h2>
          <div className={styles.relatedList}>
            {relatedPosts.map((entry) => (
              <Link className={styles.relatedLink} key={entry.slug} to={`/blog/${entry.slug}`}>
                {entry.title}
              </Link>
            ))}
          </div>
        </aside>
      ) : null}
    </section>
  )
}

export default SinglePostPage
