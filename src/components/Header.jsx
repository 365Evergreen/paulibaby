import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header({ siteTitle, siteTagline }) {
  return (
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        <p className={styles.eyebrow}>365 Evergreen</p>
        <NavLink className={styles.brandLink} to="/">
          {siteTitle}
        </NavLink>
        <p className={styles.tagline}>{siteTagline}</p>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <NavLink className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')} to="/">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')} to="/blog">
          Blog
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
