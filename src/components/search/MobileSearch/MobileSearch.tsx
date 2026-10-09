import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '../../ui/SearchInput/SearchInput';
import { useBlogData } from '../../../context/blogData';
import { useFilters } from '../../../context/filters';
import { matchesSearch } from '../../../hooks/useFilteredPosts';
import styles from './MobileSearch.module.scss';

interface Props {
  onClose: () => void;
}

const MAX_RESULTS = 12;

export function MobileSearch({ onClose }: Props) {
  const { posts } = useBlogData();
  const { search, setSearch } = useFilters();
  const [term, setTerm] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const results = useMemo(
    () => (term.trim() ? posts.filter((p) => matchesSearch(p, term)).slice(0, MAX_RESULTS) : []),
    [posts, term],
  );

  const submit = () => {
    setSearch(term);
    navigate('/');
    onClose();
  };

  const openPost = (id: string) => {
    navigate(`/posts/${id}`);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search">
      <div className={styles.bar}>
        <SearchInput
          ref={inputRef}
          id="mobile-search"
          variant="back"
          value={term}
          onChange={setTerm}
          onSubmit={submit}
          onBack={onClose}
          enterKeyHint="search"
        />
      </div>

      <ul className={styles.results} aria-live="polite">
        {results.map((post) => (
          <li key={post.id}>
            <button type="button" className={styles.result} onClick={() => openPost(post.id)}>
              {post.title}
            </button>
          </li>
        ))}
        {term.trim() && results.length === 0 && <li className={styles.empty}>No results for “{term}”</li>}
      </ul>
    </div>
  );
}
