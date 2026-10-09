import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '../../../components/layout/Header/Header';
import styles from './Layout.module.scss';

export function Layout() {
  return (
    <div className={styles.layout}>
      <div className={styles.background} aria-hidden="true">
        <span className={styles.blobPink} />
        <span className={styles.blobCyan} />
        <span className={styles.blobBlue} />
      </div>

      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
