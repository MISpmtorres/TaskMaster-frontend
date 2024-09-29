import React, { useState } from 'react';
import { TextField } from '@mui/material';

const SearchFilter = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <TextField
      label="Search Tasks"
      value={query}
      onChange={handleSearch}
    />
  );
};

export default SearchFilter;
