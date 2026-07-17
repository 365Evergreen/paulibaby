import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header({ siteTitle, siteTagline }) {
  return (
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        <NavLink className={styles.brandLink} to="/">
          {siteTitle}
        </NavLink>
        <p className={styles.tagline}>{siteTagline}</p>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <NavLink className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')} to="/">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')} to="/music">
          Music
        </NavLink>
        <NavLink className={({ isActive }) => [styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')} to="/video">
          Video
        </NavLink
      </nav>
    </header>
  )
}

export default Header
