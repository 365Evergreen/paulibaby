import styles from './VideoPlayer.module.css'

function VideoPlayer({ src, title }) {
  return (
    <figure className={styles.player}>
      <video className={styles.video} controls preload="metadata">
        <source src={src} type="video/mp4" />
        Your browser does not support embedded video playback.
      </video>
      {title ? <figcaption className={styles.caption}>{title}</figcaption> : null}
    </figure>
  )
}

export default VideoPlayer
