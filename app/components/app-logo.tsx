import { Icon } from '@iconify/react';
import { cn } from '~/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Icon
      // icon='openmoji:pouting-cat'
      // icon='fluent-emoji-high-contrast:cat-with-wry-smile'
      icon="cil:cat"
      className={cn('text-primary', className)}
    />
  );
}
