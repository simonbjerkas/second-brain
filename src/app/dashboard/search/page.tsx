'use client';

import { useEffect, useState } from 'react';
import { SearchForm } from './search-form';
import { ResultCard } from './result-card';
import { api } from '@/convex/_generated/api';

const SearchPage = () => {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('searchResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  return (
    <>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>
      <SearchForm
        setResults={(searchResults) => {
          setResults(searchResults);
          localStorage.setItem('searchResults', JSON.stringify(searchResults));
        }}
      />
      <ul className="flex flex-col gap-4 mt-6 overflow-y-auto max-h-[500px]">
        {results?.map((result) => (
          <li key={result.record._id}>
            <ResultCard result={result} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default SearchPage;
