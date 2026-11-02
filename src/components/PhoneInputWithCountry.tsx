import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { name: "Côte d'Ivoire", code: "CI", dialCode: "+225", flag: "🇨🇮" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Sénégal", code: "SN", dialCode: "+221", flag: "🇸🇳" },
  { name: "Mali", code: "ML", dialCode: "+223", flag: "🇲🇱" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226", flag: "🇧🇫" },
  { name: "Guinée", code: "GN", dialCode: "+224", flag: "🇬🇳" },
  { name: "Togo", code: "TG", dialCode: "+228", flag: "🇹🇬" },
  { name: "Bénin", code: "BJ", dialCode: "+229", flag: "🇧🇯" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "Cameroun", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Gabon", code: "GA", dialCode: "+241", flag: "🇬🇦" },
  { name: "Congo", code: "CG", dialCode: "+242", flag: "🇨🇬" },
  { name: "RDC", code: "CD", dialCode: "+243", flag: "🇨🇩" },
  { name: "Maroc", code: "MA", dialCode: "+212", flag: "🇲🇦" },
  { name: "Algérie", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
  { name: "Tunisie", code: "TN", dialCode: "+216", flag: "🇹🇳" },
  { name: "Belgique", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Suisse", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "États-Unis", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Royaume-Uni", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Allemagne", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Émirats Arabes Unis", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Liban", code: "LB", dialCode: "+961", flag: "🇱🇧" },
  { name: "Chine", code: "CN", dialCode: "+86", flag: "🇨🇳" }
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullPhoneNumber: string) => void;
  required?: boolean;
  placeholder?: string;
  variant?: 'rounded' | 'square';
  className?: string;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  required = false,
  placeholder = "07 01 20 20 21",
  variant = 'rounded',
  className = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse incoming value if dial code matches an existing country
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    const matching = COUNTRIES.find(c => value.startsWith(c.dialCode));
    if (matching) {
      setSelectedCountry(matching);
      setLocalNumber(value.replace(matching.dialCode, '').trim());
    } else {
      setLocalNumber(value.trim());
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    const full = `${country.dialCode} ${localNumber}`.trim();
    onChange(full);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalNumber(raw);
    const full = `${selectedCountry.dialCode} ${raw}`.trim();
    onChange(full);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const roundedClasses = variant === 'square' ? 'rounded-none' : 'rounded-xl';

  return (
    <div className={`relative flex items-center ${className}`} ref={dropdownRef}>
      {/* Sélecteur de pays avec drapeau & indicatif */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-10 px-2.5 sm:px-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 border border-r-0 border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer ${
            variant === 'square' ? 'rounded-l-none' : 'rounded-l-xl'
          }`}
          aria-expanded={isOpen}
          title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
          <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-bold">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
        </button>

        {/* Menu déroulant des pays */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-64 max-h-72 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un pays ou indicatif..."
                  autoFocus
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600]"
                />
              </div>
            </div>

            {/* Liste scrollable */}
            <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#e10600]/10 text-[#e10600] font-semibold'
                          : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base select-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 shrink-0">
                        <span>{c.dialCode}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#e10600]" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-zinc-400">
                  Aucun pays trouvé
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Champ numéro de téléphone */}
      <input
        type="tel"
        required={required}
        value={localNumber}
        onChange={handleNumberChange}
        placeholder={placeholder}
        className={`w-full h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#e10600] transition-colors ${
          variant === 'square' ? 'rounded-r-none' : 'rounded-r-xl'
        }`}
      />
    </div>
  );
};
