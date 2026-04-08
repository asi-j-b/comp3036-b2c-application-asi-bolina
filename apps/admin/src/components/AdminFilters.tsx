'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function AdminFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Updates the URL search parameters without a full page reload
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Push the new URL (e.g., /?query=react)
    router.push(`?${params.toString()}`);
  };

  return (
    <section style={{ marginBottom: '20px', display: 'flex', gap: '1rem' }}>
      {/* Playwright looks for this exact label text */}
      <label>
        Filter by Content: 
        <input
          type="text"
          defaultValue={searchParams.get('query') || ''}
          onChange={(e) => handleFilterChange('query', e.target.value)}
        />
      </label>

      <label>
        Filter by Tag: 
        <input
          type="text"
          defaultValue={searchParams.get('tag') || ''}
          onChange={(e) => handleFilterChange('tag', e.target.value)}
        />
      </label>

      <label>
        Sort: 
        <select 
          defaultValue={searchParams.get('sort') || 'date-desc'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </label>
    </section>
  );
}