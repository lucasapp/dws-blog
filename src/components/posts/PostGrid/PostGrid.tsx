import type { Post } from '../../../types';
import { PostCard, PostCardSkeleton } from '../../../components/posts/PostCard/PostCard';
import { cx } from '../../../utils/cx';
import styles from './PostGrid.module.scss';

interface Props {
  posts: Post[];
  loading?: boolean;
  skeletonCount?: number;
  variant?: 'main' | 'latest';
}

export function PostGrid({ posts, loading, skeletonCount = 6, variant = 'main' }: Props) {
  return (
    <ul className={cx(styles.grid, styles[variant])} aria-busy={loading}>
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <li key={i}>
              <PostCardSkeleton />
            </li>
          ))
        : posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} compact={variant === 'latest'} />
            </li>
          ))}
    </ul>
  );
}
