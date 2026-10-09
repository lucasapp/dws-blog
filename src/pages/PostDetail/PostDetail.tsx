import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { Button } from '../../components/ui/Button/Button';
import { Icon } from '../../components/ui/Icon/Icon';
import { PostGrid } from '../../components/posts/PostGrid/PostGrid';
import { ErrorState } from '../../components/feedback/ErrorState/ErrorState';
import { useBlogData } from '../../context/blogData';
import { usePost } from '../../hooks/usePost';
import { sortPosts } from '../../hooks/useFilteredPosts';
import { formatDate, toParagraphs } from '../../utils/format';
import styles from './PostDetail.module.scss';

const LATEST_COUNT = 3;

export function PostDetail() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { posts, status } = useBlogData();
    const { post, loading, error } = usePost(id);

    const latest = useMemo(() => sortPosts(posts, 'newest').filter((p) => p.id !== id).slice(0, LATEST_COUNT), [posts, id]);
    const paragraphs = useMemo(() => (post ? toParagraphs(post.content) : []), [post]);

    const goBack = () => (navigate('/'));

    return (
        <div className={styles.page}>
            <div className={styles.backCol}>
                <Button variant="secondary" icon={<Icon name="arrow-left" />} onClick={goBack}>
                    Back
                </Button>
            </div>

            <div className={styles.contentCol}>
                {loading && <ArticleSkeleton />}

                {error && <ErrorState message={error === 'Not found' ? 'This post does not exist.' : error} />}

                {post && (
                    <article className={styles.article}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>{post.title}</h1>
                            <div className={styles.author}>
                                <Avatar name={post.author?.name ?? ''} src={post.author?.profilePicture} size={48} />
                                <div className={styles.authorInfo}>
                                    <p className={styles.writtenBy}>
                                        Written by: <strong>{post.author?.name}</strong>
                                    </p>
                                    <time className={styles.date} dateTime={post.createdAt}>
                                        {formatDate(post.createdAt)}
                                    </time>
                                </div>
                            </div>
                        </header>

                        <figure className={styles.cover}>
                            <img src={post.thumbnail_url} alt="" />
                        </figure>

                        <div className={styles.body}>
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </article>
                )}

                {(latest.length > 0 || status === 'loading') && (
                    <section className={styles.latest} aria-labelledby="latest-title">
                        <h2 id="latest-title" className={styles.latestTitle}>
                            Latest articles
                        </h2>
                        <PostGrid posts={latest} loading={status === 'loading'} skeletonCount={LATEST_COUNT} variant="latest" />
                    </section>
                )}
            </div>
        </div>
    );
}

function ArticleSkeleton() {
    return (
        <div className={styles.skeleton} aria-hidden="true">
            <span style={{ width: '85%', height: 40 }} />
            <span style={{ width: '60%', height: 40 }} />
            <span style={{ width: 200, height: 48, borderRadius: 24 }} />
            <span style={{ width: '100%', height: 320, borderRadius: 16 }} />
            <span style={{ width: '100%' }} />
            <span style={{ width: '95%' }} />
            <span style={{ width: '90%' }} />
        </div>
    );
}
