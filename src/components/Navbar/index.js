import Link from "next/link";
import styles from '@styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <menu className={styles.menu}>
        <Link className={styles.link} href="/">Home</Link>
        <Link className={styles.link} href="/learn">Learn</Link>
        <Link className={styles.link} href="/test">Test</Link>
      </menu>
    </nav>
  );
}

export default Navbar;