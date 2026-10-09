import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchButton, SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { MobileSearch } from '../../../components/search/MobileSearch/MobileSearch';
import { useFilters } from '../../../context/filters';
import styles from './Header.module.scss';

export function Header() {
  const { search, setSearch } = useFilters();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goHome = () => pathname !== '/' && navigate('/');
  const closeMobileSearch = useCallback(() => setMobileSearchOpen(false), []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Dentsu World Services blog — home">
          <span className={styles.brand}>dentsu</span>
          <span className={styles.tagline}>world services</span>
        </Link>

        <div className={styles.desktopSearch}>
          <SearchInput
            id="desktop-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              goHome();
            }}
            onSubmit={goHome}
          />
        </div>

        <div className={styles.mobileSearch}>
          <SearchButton onClick={() => setMobileSearchOpen(true)} />
        </div>
      </div>

      {mobileSearchOpen && <MobileSearch onClose={closeMobileSearch} />}
    </header>
  );
}
