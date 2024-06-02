'use client';

import { useState } from 'react';
import { SearchForm } from './search-form';
import { Doc } from '@/convex/_generated/dataModel';
import { ResultCard } from './result-card';
import { api } from '@/convex/_generated/api';

const SearchPage = () => {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>
      <SearchForm setResults={setResults} />
      <ul className="flex flex-col gap-4">
        {results?.map((result) => (
          <li key={result.record._id}>
            <ResultCard result={result} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
