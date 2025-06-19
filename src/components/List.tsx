import React from 'react';

interface ListProps<T> {
  items?: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
}

export default function List<T>({ items = [], renderItem }: ListProps<T>) {
  if (!items.length) return <div className="text-gray-400" role="status" aria-live="polite">데이터가 없습니다.</div>;
  return (
    <ul className="divide-y" role="list" aria-label="목록">
      {items.map((item, idx) => (
        <li key={idx} className="py-2 focus:bg-gray-100 outline-none" tabIndex={0} aria-label={`목록 아이템 ${idx+1}`}>{renderItem(item, idx)}</li>
      ))}
    </ul>
  );
}
