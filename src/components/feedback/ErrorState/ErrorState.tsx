import { Button } from '../../../components/ui/Button/Button';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';

interface Props {
  message?: string | null;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <EmptyState
      title="Something went wrong"
      description={message ?? 'We could not load the content. Please try again.'}
      action={onRetry && <Button onClick={onRetry}>Try again</Button>}
    />
  );
}
