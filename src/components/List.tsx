import React from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
}

export default function List<T>({ items, renderItem }: ListProps<T>) {
  if (!items.length) return <div className="text-gray-400">데이터가 없습니다.</div>;
  return (
    <ul className="divide-y">
      {items.map((item, idx) => (
        <li key={idx} className="py-2">{renderItem(item, idx)}</li>
      ))}
    </ul>
  );
}
