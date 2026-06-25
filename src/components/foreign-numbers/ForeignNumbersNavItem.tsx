import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCountries } from '@/hooks/useForeignNumbers';

export function ForeignNumbersNavItem() {
  const [isOpen, setIsOpen] = useState(false);
  const { countries, loading } = useCountries();
  const location = useLocation();

  const isForeignNumbersRoute = location.pathname.startsWith('/foreign-numbers');

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between py-2 transition-colors font-medium text-lg border-b border-border ${
          isForeignNumbersRoute
            ? 'text-brand-orange'
            : 'text-brand-navy hover:text-brand-orange'
        }`}
      >
        <span className="flex items-center gap-2">
          <span>🌍</span>
          <span>Shop Foreign Numbers</span>
        </span>
        {isOpen
          ? <ChevronDown className="w-4 h-4 opacity-60" />
          : <ChevronRight className="w-4 h-4 opacity-60" />
        }
      </button>

      {isOpen && (
        <div className="mt-1 ml-3 pl-3 border-l border-border space-y-0.5 max-h-64 overflow-y-auto">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-muted animate-pulse my-1" />
              ))
            : countries.map(country => {
                const countrySlug = country.name.toLowerCase().replace(/\s+/g, '-');
                const isActive = location.pathname === `/foreign-numbers/${countrySlug}`;
                return (
                  <Link
                    key={country.code}
                    to={`/foreign-numbers/${countrySlug}`}
                    className={`flex items-center gap-2 py-2 text-sm border-b border-border/40 transition-colors ${
                      isActive
                        ? 'text-brand-orange font-semibold'
                        : 'text-brand-navy hover:text-brand-orange'
                    }`}
                  >
                    <span>{country.flag_emoji}</span>
                    <span>{country.name}</span>
                  </Link>
                );
              })
          }
        </div>
      )}
    </div>
  );
}
