import React from 'react';

interface Props {
  value: number | null;
  onChange: (val: string) => void;
}

export default function InputCell({ value, onChange }: Props) {
  return (
    <input
      type="number"
      min="1"
      max="9"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="w-8 h-8 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
    />
  );
}
