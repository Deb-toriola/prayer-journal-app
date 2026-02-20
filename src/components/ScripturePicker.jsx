import { useState, useRef, useEffect } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import { BIBLE_BOOKS } from '../utils/bibleBooks';

/**
 * ScripturePicker — two-step scripture input:
 *  1. Search and select a Bible book (like a country picker)
 *  2. Type chapter:verse (e.g. "4:6")
 *
 * The book dropdown renders as a position:fixed overlay so it is
 * never clipped by the scrollable modal container.
 */
export default function ScripturePicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [verseRef, setVerseRef] = useState('');
  const searchRef = useRef(null);
  const verseInputRef = useRef(null);
  const btnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 300 });

  // Parse existing value into book + verse when value changes from outside
  useEffect(() => {
    if (!value) {
      setSelectedBook(null);
      setVerseRef('');
      return;
    }
    const book = BIBLE_BOOKS.find(b =>
      value.toLowerCase().startsWith(b.name.toLowerCase())
    );
    if (book) {
      setSelectedBook(book);
      setVerseRef(value.slice(book.name.length).trim());
    }
  }, [value]);

  const filteredBooks = BIBLE_BOOKS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const openPicker = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: Math.max(8, rect.left),
        width: Math.max(280, rect.width + 80),
      });
    }
    setShowPicker(true);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSearch('');
    setShowPicker(false);
    // Show book name immediately; verse appended once typed
    const currentVerse = verseRef.trim();
    onChange(currentVerse ? `${book.name} ${currentVerse}` : book.name);
    setTimeout(() => verseInputRef.current?.focus(), 50);
  };

  const handleVerseChange = (e) => {
    const v = e.target.value;
    setVerseRef(v);
    if (selectedBook) {
      onChange(v.trim() ? `${selectedBook.name} ${v.trim()}` : selectedBook.name);
    }
  };

  const handleClear = () => {
    setSelectedBook(null);
    setVerseRef('');
    setSearch('');
    onChange('');
  };

  // Close when clicking outside the dropdown
  useEffect(() => {
    if (!showPicker) return;
    const handleOutside = (e) => {
      if (
        !e.target.closest('.scripture-picker-dropdown-fixed') &&
        !e.target.closest('.scripture-book-btn')
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showPicker]);

  return (
    <div className="scripture-picker">
      <div className="scripture-picker-row">
        {/* Book selector */}
        <button
          ref={btnRef}
          type="button"
          className={`scripture-book-btn ${selectedBook ? 'scripture-book-selected' : ''}`}
          onClick={openPicker}
        >
          <BookOpen size={13} />
          <span>{selectedBook ? selectedBook.name : 'Select book'}</span>
        </button>

        {/* Chapter:verse */}
        <input
          ref={verseInputRef}
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

      {/* Preview */}
      {value && <p className="scripture-preview">{value}</p>}

      {/* Fixed-position dropdown — never clipped by modal overflow */}
      {showPicker && (
        <div
          className="scripture-picker-dropdown-fixed"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
        >
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
              <button type="button" className="scripture-search-clear" onClick={() => setSearch('')}>
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
