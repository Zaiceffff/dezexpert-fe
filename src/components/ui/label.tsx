// src/components/ui/label.tsx — label
import * as React from 'react';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-sm font-medium" {...props} />;
}


