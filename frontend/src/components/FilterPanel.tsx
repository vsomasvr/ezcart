
import React, { useState, useEffect } from 'react';
import { ActiveFilters } from '../../App'; 
import MultiSelectDropdown from './MultiSelectDropdown';

interface FilterPanelProps {
  activeFilters: ActiveFilters;
  onFilterChange: (filterName: keyof ActiveFilters, value: string | string[]) => void;
  onClearFilters: () => void;
  availableCategories: string[];
  availableManufacturers: string[]; // New
}

const RAM_OPTIONS_MAP = [
    { value: "8", label: "8GB" },
    { value: "16", label: "16GB" },
    { value: "18", label: "18GB" }, 
    { value: "32", label: "32GB" },
    { value: "64", label: "64GB" }
];

const STORAGE_OPTIONS_MAP = [
    { value: "256GB", label: "256GB" },
    { value: "512GB", label: "512GB" },
    { value: "1TB", label: "1TB" },
    { value: "2TB", label: "2TB" },
    { value: "4TB", label: "4TB" }
];

const PROCESSOR_OPTIONS_MAP = [
    { value: "Intel Core i3", label: "Intel Core i3" },
    { value: "Intel Core i5", label: "Intel Core i5" },
    { value: "Intel Core i7", label: "Intel Core i7" },
    { value: "Intel Core i9", label: "Intel Core i9" },
    { value: "Intel Core Ultra", label: "Intel Core Ultra" },
    { value: "AMD Ryzen 5", label: "AMD Ryzen 5" },
    { value: "AMD Ryzen 7", label: "AMD Ryzen 7" },
    { value: "AMD Ryzen 9", label: "AMD Ryzen 9" },
    { value: "StreamLine S3 Pro", label: "StreamLine S3 Pro chip" }
];


const FilterPanel: React.FC<FilterPanelProps> = ({ 
    activeFilters, 
    onFilterChange, 
    onClearFilters,
    availableCategories,
    availableManufacturers 
}) => {
  const [showFilters, setShowFilters] = useState(true); 

  useEffect(() => {
    if (window.innerWidth < 768) { // md breakpoint, more space for filters
      setShowFilters(false);
    } else {
      setShowFilters(true);
    }
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'priceMin' | 'priceMax') => {
    onFilterChange(type, e.target.value);
  };

  const categoryOptions = availableCategories.map(cat => ({ value: cat, label: cat }));
  const manufacturerOptions = availableManufacturers.map(man => ({ value: man, label: man }));
  
  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl mb-8 border border-slate-700">
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="w-full text-left text-xl font-semibold text-sky-300 mb-4 flex justify-between items-center py-2"
        aria-expanded={showFilters}
        aria-controls="filter-details"
      >
        <span><i className="fas fa-filter mr-2 text-cyan-400"></i>Filters</span>
        <i className={`fas ${showFilters ? 'fa-chevron-up' : 'fa-chevron-down'} ml-2 transition-transform text-slate-400`}></i>
      </button>

      <div id="filter-details" className={`${showFilters ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
        {/* Row 1: Category, Manufacturer, Min Price, Max Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6 items-end">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <MultiSelectDropdown
                id="category-filter"
                label="Category"
                options={categoryOptions}
                selectedValues={activeFilters.category}
                onChange={(selected) => onFilterChange('category', selected)}
                placeholder="Select Categories"
            />
          </div>
          <div>
            <label htmlFor="manufacturer-filter" className="block text-sm font-medium text-slate-300 mb-1">Manufacturer</label>
            <MultiSelectDropdown
                id="manufacturer-filter"
                label="Manufacturer"
                options={manufacturerOptions}
                selectedValues={activeFilters.manufacturer}
                onChange={(selected) => onFilterChange('manufacturer', selected)}
                placeholder="Select Manufacturers"
            />
          </div>
          <div>
            <label htmlFor="price-min-filter" className="block text-sm font-medium text-slate-300 mb-1">Min Price ($)</label>
            <input
              type="number"
              id="price-min-filter"
              value={activeFilters.priceMin}
              onChange={(e) => handlePriceChange(e, 'priceMin')}
              placeholder="e.g., 100"
              className="w-full px-3 py-2.5 rounded-md border border-slate-600 bg-slate-700 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="price-max-filter" className="block text-sm font-medium text-slate-300 mb-1">Max Price ($)</label>
            <input
              type="number"
              id="price-max-filter"
              value={activeFilters.priceMax}
              onChange={(e) => handlePriceChange(e, 'priceMax')}
              placeholder="e.g., 2000"
              className="w-full px-3 py-2.5 rounded-md border border-slate-600 bg-slate-700 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              min="0"
            />
          </div>
        </div>
        
        {/* Row 2: RAM, Storage, Processor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mb-6 items-end">
            <div>
                <label htmlFor="ram-filter" className="block text-sm font-medium text-slate-300 mb-1">RAM</label>
                <MultiSelectDropdown
                    id="ram-filter"
                    label="RAM"
                    options={RAM_OPTIONS_MAP}
                    selectedValues={activeFilters.ram}
                    onChange={(selected) => onFilterChange('ram', selected)}
                    placeholder="Select RAM options"
                />
            </div>
            <div>
                <label htmlFor="storage-filter" className="block text-sm font-medium text-slate-300 mb-1">Storage</label>
                <MultiSelectDropdown
                    id="storage-filter"
                    label="Storage"
                    options={STORAGE_OPTIONS_MAP}
                    selectedValues={activeFilters.storage}
                    onChange={(selected) => onFilterChange('storage', selected)}
                    placeholder="Select storage options"
                />
            </div>
            <div>
                <label htmlFor="processor-filter" className="block text-sm font-medium text-slate-300 mb-1">Processor</label>
                <MultiSelectDropdown
                    id="processor-filter"
                    label="Processor"
                    options={PROCESSOR_OPTIONS_MAP}
                    selectedValues={activeFilters.processor}
                    onChange={(selected) => onFilterChange('processor', selected)}
                    placeholder="Select processors"
                />
            </div>
        </div>
        
        <div className="mt-8 flex justify-end">
             <button
              onClick={onClearFilters}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-colors duration-200 text-sm"
              aria-label="Clear all filters"
            >
              <i className="fas fa-times mr-2"></i>Clear Filters
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
