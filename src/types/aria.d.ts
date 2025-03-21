import { AriaAttributes } from 'react';

declare module 'react' {
  interface AriaAttributes {
    'aria-checked'?: 'true' | 'false';
    'aria-selected'?: 'true' | 'false';
    'aria-label'?: string;
    'aria-controls'?: string;
    'aria-hidden'?: 'true' | 'false';
    'aria-labelledby'?: string;
  }
} 