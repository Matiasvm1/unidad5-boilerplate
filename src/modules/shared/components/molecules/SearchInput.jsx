import { useEffect, useState } from 'react';
import Input from '../atoms/Input';
import useDebounce from '../../hooks/useDebounce';

// Search box with debounce. Calls onSearch with the trimmed text only when it
// has at least `minLength` characters, or with '' when it is shorter
// (spec 7.4: the API rejects names under 3 characters).
function SearchInput({
  id,
  label,
  placeholder,
  onSearch,
  minLength = 3,
  delay = 400,
  className = '',
}) {
  const [text, setText] = useState('');
  const debounced = useDebounce(text.trim(), delay);
  const term = debounced.length >= minLength ? debounced : '';

  useEffect(() => {
    onSearch(term);
  }, [term, onSearch]);

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Input
        id={id}
        type="search"
        icon="search"
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  );
}

export default SearchInput;
