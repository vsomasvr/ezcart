
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  id: string;
  label: string; // For accessibility, not visually displayed as a <label> here
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  id,
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) setSearchTerm(""); // Reset search term when closing
  };

  const handleOptionClick = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };
  
  const getButtonLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const selectedOption = options.find(opt => opt.value === selectedValues[0]);
      return selectedOption ? selectedOption.label : placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        id={`${id}-button`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-label={`${label}: ${getButtonLabel()}`}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-left"
      >
        <span className="truncate">{getButtonLabel()}</span>
        <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ml-2 text-slate-400 transition-transform`}></i>
      </button>

      {isOpen && (
        <div 
            id={`${id}-listbox`}
            role="listbox" 
            aria-multiselectable="true"
            aria-label={`${label} options`}
            className="absolute z-10 mt-1 w-full bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              aria-label={`Search ${label} options`}
              className="w-full px-3 py-2 mb-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-slate-400 text-sm">No options match your search.</div>
          ) : (
            <ul tabIndex={-1}> {/* Make UL focusable for keyboard nav if needed */}
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={selectedValues.includes(option.value)}
                  onClick={() => handleOptionClick(option.value)}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleOptionClick(option.value)}
                  className={`px-3 py-2 text-sm text-slate-200 hover:bg-slate-600 cursor-pointer flex items-center justify-between ${selectedValues.includes(option.value) ? 'bg-cyan-700 hover:bg-cyan-600' : ''}`}
                  tabIndex={0} // Make options focusable
                >
                  <span>{option.label}</span>
                  {selectedValues.includes(option.value) && (
                    <i className="fas fa-check text-emerald-400"></i>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
