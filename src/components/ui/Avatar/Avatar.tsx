import { useState } from 'react';
import styles from './Avatar.module.scss';

interface Props {
  name: string;
  src?: string;
  size?: number;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function Avatar({ name, src, size = 40 }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className={styles.initials} style={{ fontSize: size * 0.38 }}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
