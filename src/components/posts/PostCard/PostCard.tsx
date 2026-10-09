import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Chip } from '../../../components/ui/Chip/Chip';
import type { Post } from '../../../types';
import { formatDate, stripHtml } from '../../../utils/format';
import styles from './PostCard.module.scss';

interface Props {
  post: Post;
  compact?: boolean;
}

export const PostCard = memo(function PostCard({ post, compact }: Props) {
  return (
    <article className={styles.card}>
      <Link to={`/posts/${post.id}`} className={styles.link}>
        <figure className={styles.media}>
          <img src={post.thumbnail_url} alt="" loading="lazy" decoding="async" />
        </figure>

        <div className={styles.body}>
          <p className={styles.meta}>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            <span className={styles.dot} aria-hidden="true" />
            <span>{post.author?.name}</span>
          </p>

          <h3 className={styles.title}>{post.title}</h3>

          <p className={styles.excerpt} data-compact={compact || undefined}>
            {stripHtml(post.content)}
          </p>

          {post.categories.length > 0 && (
            <ul className={styles.tags} aria-label="Categories">
              {post.categories.map((category) => (
                <li key={category.id}>
                  <Chip>{category.name}</Chip>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
});

export function PostCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`} aria-hidden="true">
      <div className={styles.media} />
      <div className={styles.body}>
        <span className={styles.line} style={{ width: '55%' }} />
        <span className={styles.line} style={{ width: '90%', height: 20 }} />
        <span className={styles.line} style={{ width: '70%', height: 20 }} />
        <span className={styles.line} style={{ width: '100%' }} />
        <span className={styles.line} style={{ width: '40%', height: 28, borderRadius: 42 }} />
      </div>
    </div>
  );
}
