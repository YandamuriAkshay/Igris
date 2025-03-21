import { useMemo } from 'react';

export const useAriaAttributes = (props: {
  isEnabled?: boolean;
  isSelected?: boolean;
  label: string;
  controls?: string;
  id?: string;
}) => {
  return useMemo(() => {
    const attributes: Record<string, string> = {
      'aria-label': props.label.toLowerCase(),
    };

    if (props.isEnabled !== undefined) {
      attributes['aria-checked'] = props.isEnabled ? 'true' : 'false';
    }

    if (props.isSelected !== undefined) {
      attributes['aria-selected'] = props.isSelected ? 'true' : 'false';
    }

    if (props.controls) {
      attributes['aria-controls'] = props.controls;
    }

    if (props.id) {
      attributes['id'] = props.id;
    }

    return attributes;
  }, [props.isEnabled, props.isSelected, props.label, props.controls, props.id]);
}; 