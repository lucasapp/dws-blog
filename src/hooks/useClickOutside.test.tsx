import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

function Box({ handler, enabled }: { handler: () => void; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handler, enabled);
  return (
    <>
      <div ref={ref}>
        inside <span>child</span>
      </div>
      <p>outside</p>
    </>
  );
}

describe('useClickOutside', () => {
  it('calls the handler on pointerdown outside the element', () => {
    const handler = vi.fn();
    render(<Box handler={handler} />);

    fireEvent.pointerDown(screen.getByText('outside'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('ignores pointerdown on the element or its children', () => {
    const handler = vi.fn();
    render(<Box handler={handler} />);

    fireEvent.pointerDown(screen.getByText(/inside/));
    fireEvent.pointerDown(screen.getByText('child'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('calls the handler on Escape only', () => {
    const handler = vi.fn();
    render(<Box handler={handler} />);

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(handler).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does nothing while disabled', () => {
    const handler = vi.fn();
    render(<Box handler={handler} enabled={false} />);

    fireEvent.pointerDown(screen.getByText('outside'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes its listeners when unmounted', () => {
    const handler = vi.fn();
    const { unmount } = render(<Box handler={handler} />);

    unmount();
    fireEvent.pointerDown(document.body);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });
});
