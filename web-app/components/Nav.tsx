import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Nav.module.scss';

export default function Nav() {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <h1>PFP Blender</h1>
      </div>

      <Link href='/'>
        <a className={currentRoute === '/' ? styles.active : ''}>Create</a>
      </Link>
      <Link href='/history'>
        <a className={currentRoute === '/history' ? styles.active : ''}>
          History
        </a>
      </Link>
    </nav>
  );
}
