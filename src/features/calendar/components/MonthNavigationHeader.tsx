import React from 'react';
import { EventCategory } from '../../../services/calendar/types';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';

interface MonthNavigationHeaderProps {
  currentYear: number;
  currentMonth: number;
  selectedCategory: EventCategory | 'all';
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectCategory: (cat: EventCategory | 'all') => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MonthNavigationHeader: React.FC<MonthNavigationHeaderProps> = ({
  currentYear,
  currentMonth,
  selectedCategory,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectCategory,
}) => {
  const monthName = MONTH_NAMES[currentMonth - 1] || 'Month';

  return (
    <div className="month-nav-container">
      <div className="month-nav-top">
        <div className="month-title-group">
          <CalendarIcon size={24} className="month-icon" />
          <h2 className="month-title">
            {monthName} {currentYear}
          </h2>
        </div>

        <div className="month-nav-actions">
          <PixelButton variant="secondary" size="sm" onClick={onPrevMonth} icon={<ChevronLeft size={16} />}>
            Prev
          </PixelButton>

          <PixelButton variant="ghost" size="sm" onClick={onToday}>
            Today
          </PixelButton>

          <PixelButton variant="secondary" size="sm" onClick={onNextMonth} icon={<ChevronRight size={16} />}>
            Next
          </PixelButton>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="category-filters-row">
        <span className="filter-label">
          <Filter size={14} /> Category:
        </span>

        <button
          className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          All Events
        </button>
        <button
          className={`filter-chip ${selectedCategory === 'astronomy' ? 'active' : ''}`}
          onClick={() => onSelectCategory('astronomy')}
        >
          Astronomy
        </button>
        <button
          className={`filter-chip ${selectedCategory === 'sun_moon' ? 'active' : ''}`}
          onClick={() => onSelectCategory('sun_moon')}
        >
          Sun & Moon
        </button>
        <button
          className={`filter-chip ${selectedCategory === 'seasonal' ? 'active' : ''}`}
          onClick={() => onSelectCategory('seasonal')}
        >
          Seasonal
        </button>
        <button
          className={`filter-chip ${selectedCategory === 'wildlife' ? 'active' : ''}`}
          onClick={() => onSelectCategory('wildlife')}
        >
          Wildlife
        </button>
        <button
          className={`filter-chip ${selectedCategory === 'environmental' ? 'active' : ''}`}
          onClick={() => onSelectCategory('environmental')}
        >
          Environmental
        </button>
      </div>
    </div>
  );
};
