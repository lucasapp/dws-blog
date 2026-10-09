import { FilterDropdown } from '../../components/filters/FilterDropdown/FilterDropdown';
import { FilterSidebar } from '../../components/filters/FilterSidebar/FilterSidebar';
import { PostGrid } from '../../components/posts/PostGrid/PostGrid';
import { SortToggle } from '../../components/ui/SortToggle/SortToggle';
import { Button } from '../../components/ui/Button/Button';
import { EmptyState } from '../../components/feedback/EmptyState/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState/ErrorState';
import { useBlogData } from '../../context/blogData';
import { useFilters } from '../../context/filters';
import { useFilteredPosts } from '../../hooks/useFilteredPosts';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import styles from './Home.module.scss';

export function Home() {
    const { categories, authors, status, error, reload } = useBlogData();
    const { filters, search, activeCount, toggleCategory, toggleAuthor, clearCategories, clearAuthors, resetAll } =
        useFilters();
    const posts = useFilteredPosts();
    const isDesktop = useIsDesktop();

    const loading = status === 'loading';
    const hasCriteria = activeCount > 0 || search.trim().length > 0;

    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <h1 className={styles.title}>DWS blog</h1>

                {!isDesktop && (
                    <div className={styles.mobileToolbar}>
                        <FilterDropdown
                            label="Category"
                            options={categories}
                            selectedIds={filters.categoryIds}
                            onToggle={toggleCategory}
                            onClear={clearCategories}
                        />
                        <FilterDropdown
                            label="Author"
                            options={authors}
                            selectedIds={filters.authorIds}
                            onToggle={toggleAuthor}
                            onClear={clearAuthors}
                        />
                        <div className={styles.sortMobile}>
                            <SortToggle />
                        </div>
                    </div>
                )}

                {isDesktop && <SortToggle showLabel />}
            </div>

            <div className={styles.content}>
                {isDesktop && (
                    <div className={styles.sidebar}>
                        <FilterSidebar />
                    </div>
                )}

                <section className={styles.posts} aria-label="Posts" aria-live="polite">
                    {status === 'error' ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : !loading && posts.length === 0 ? (
                        <EmptyState
                            title="No posts found"
                            description={
                                hasCriteria
                                    ? 'Try adjusting your search or filters to find what you are looking for.'
                                    : 'There are no posts published yet.'
                            }
                            action={
                                hasCriteria && (
                                    <Button variant="secondary" onClick={resetAll}>
                                        Clear search and filters
                                    </Button>
                                )
                            }
                        />
                    ) : (
                        <PostGrid posts={posts} loading={loading} />
                    )}
                </section>
            </div>
        </div>
    );
}
