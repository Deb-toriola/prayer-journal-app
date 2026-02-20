import { useState, useRef, useEffect } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import { BIBLE_BOOKS } from '../utils/bibleBooks';

/**
 * ScripturePicker — two-step scripture input:
 *  1. Search and select a Bible book (like a country picker)
 *  2. Type chapter:verse (e.g. "4:6")
 *
 * Props:
 *   value      — current scripture string e.g. "Philippians 4:6"
 *   onChange   — called with the new string
 *   placeholder — optional placeholder text
 */
export default function ScripturePicker({ value, onChange, placeholder = 'e.g. Philippians 4:6' }) {
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [verseRef, setVerseRef] = useState('');
  const searchRef = useRef(null);
  const verseRef2 = useRef(null);

  // Parse existing value into book + verse on mount / value change
  useEffect(() => {
    if (!value) {
      setSelectedBook(null);
      setVerseRef('');
      return;
    }
    const book = BIBLE_BOOKS.find(b => value.toLowerCase().startsWith(b.name.toLowerCase()));
    if (book) {
      setSelectedBook(book);
      setVerseRef(value.slice(book.name.length).trim());
    }
  }, [value]);

  const filteredBooks = BIBLE_BOOKS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSearch('');
    setShowPicker(false);
    // Compose full reference if we already have a verse
    const newRef = verseRef ? `${book.name} ${verseRef}` : '';
    onChange(newRef);
    // Focus verse field
    setTimeout(() => verseRef2.current?.focus(), 50);
  };

  const handleVerseChange = (e) => {
    const v = e.target.value;
    setVerseRef(v);
    if (selectedBook && v) {
      onChange(`${selectedBook.name} ${v}`);
    } else {
      onChange('');
    }
  };

  const handleClear = () => {
    setSelectedBook(null);
    setVerseRef('');
    setSearch('');
    onChange('');
  };

  const openPicker = () => {
    setShowPicker(true);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  return (
    <div className="scripture-picker">
      {/* Display row */}
      <div className="scripture-picker-row">
        {/* Book selector button */}
        <button
          type="button"
          className={`scripture-book-btn ${selectedBook ? 'scripture-book-selected' : ''}`}
          onClick={openPicker}
        >
          <BookOpen size={13} />
          <span>{selectedBook ? selectedBook.name : 'Select book'}</span>
        </button>

        {/* Chapter:verse input */}
        <input
          ref={verseRef2}
          type="text"
          className="scripture-verse-input"
          placeholder="1:1"
          value={verseRef}
          onChange={handleVerseChange}
          disabled={!selectedBook}
          maxLength={10}
        />

        {/* Clear */}
        {(selectedBook || verseRef) && (
          <button type="button" className="scripture-clear-btn" onClick={handleClear}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Current value preview */}
      {value && (
        <p className="scripture-preview">{value}</p>
      )}

      {/* Book picker dropdown */}
      {showPicker && (
        <div className="scripture-picker-dropdown">
          <div className="scripture-search-wrap">
            <Search size={13} />
            <input
              ref={searchRef}
              type="text"
              className="scripture-search-input"
              placeholder="Search books..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="scripture-search-clear">
                <X size={12} />
              </button>
            )}
          </div>
          <div className="scripture-book-list">
            {filteredBooks.length === 0 ? (
              <p className="scripture-no-results">No books found</p>
            ) : (
              filteredBooks.map(book => (
                <button
                  key={book.code}
                  type="button"
                  className={`scripture-book-option ${selectedBook?.code === book.code ? 'scripture-book-option-active' : ''}`}
                  onClick={() => handleBookSelect(book)}
                >
                  {book.name}
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            className="scripture-picker-close"
            onClick={() => setShowPicker(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
