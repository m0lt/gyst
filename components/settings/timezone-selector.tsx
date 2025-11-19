"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Label } from "@/components/ui/label";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Common timezones grouped by region
const TIMEZONES = [
  // Europe
  { value: "Europe/London", label: "London (GMT)", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin (CET)", region: "Europe" },
  { value: "Europe/Paris", label: "Paris (CET)", region: "Europe" },
  { value: "Europe/Rome", label: "Rome (CET)", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid (CET)", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna (CET)", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich (CET)", region: "Europe" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels (CET)", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm (CET)", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw (CET)", region: "Europe" },
  { value: "Europe/Prague", label: "Prague (CET)", region: "Europe" },
  { value: "Europe/Athens", label: "Athens (EET)", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul (TRT)", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow (MSK)", region: "Europe" },

  // Americas
  { value: "America/New_York", label: "New York (EST)", region: "Americas" },
  { value: "America/Chicago", label: "Chicago (CST)", region: "Americas" },
  { value: "America/Denver", label: "Denver (MST)", region: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)", region: "Americas" },
  { value: "America/Toronto", label: "Toronto (EST)", region: "Americas" },
  { value: "America/Vancouver", label: "Vancouver (PST)", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City (CST)", region: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)", region: "Americas" },
  { value: "America/Buenos_Aires", label: "Buenos Aires (ART)", region: "Americas" },
  { value: "America/Santiago", label: "Santiago (CLT)", region: "Americas" },

  // Asia
  { value: "Asia/Dubai", label: "Dubai (GST)", region: "Asia" },
  { value: "Asia/Kolkata", label: "Mumbai/Delhi (IST)", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul (KST)", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", region: "Asia" },

  // Australia/Oceania
  { value: "Australia/Sydney", label: "Sydney (AEDT)", region: "Australia/Oceania" },
  { value: "Australia/Melbourne", label: "Melbourne (AEDT)", region: "Australia/Oceania" },
  { value: "Australia/Perth", label: "Perth (AWST)", region: "Australia/Oceania" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT)", region: "Australia/Oceania" },

  // Pacific
  { value: "Pacific/Fiji", label: "Fiji (FJT)", region: "Pacific" },
  { value: "Pacific/Honolulu", label: "Honolulu (HST)", region: "Pacific" },

  // Africa
  { value: "Africa/Cairo", label: "Cairo (EET)", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", region: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT)", region: "Africa" },
];

interface Props {
  value: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}

export function TimezoneSelector({ value, onChange, disabled }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedTimezone = TIMEZONES.find((tz) => tz.value === value);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const filteredTimezones = useMemo(() => {
    if (!search) return TIMEZONES;
    const searchLower = search.toLowerCase();
    return TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(searchLower) ||
        tz.value.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const groupedTimezones = useMemo(() => {
    const groups: Record<string, typeof TIMEZONES> = {};
    filteredTimezones.forEach((tz) => {
      if (!groups[tz.region]) {
        groups[tz.region] = [];
      }
      groups[tz.region].push(tz);
    });
    return groups;
  }, [filteredTimezones]);

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <Label htmlFor="timezone" className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4" />
        {t("settings.profile.timezone")}
      </Label>

      {/* Selected Value Display */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-md border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-sm"
        )}
      >
        <span>{selectedTimezone?.label || value}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div
            className="fixed z-50 bg-background border border-border rounded-md shadow-lg max-h-[400px] overflow-hidden flex flex-col"
            style={{
              top: `${dropdownPosition.top + 4}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {/* Search */}
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder={t("timezone.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>

            {/* Timezone List */}
            <div className="overflow-y-auto">
              {Object.entries(groupedTimezones).map(([region, timezones]) => (
                <div key={region}>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    {region}
                  </div>
                  {timezones.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => handleSelect(tz.value)}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between",
                        tz.value === value && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      <span>{tz.label}</span>
                      {tz.value === value && (
                        <Check className="w-4 h-4 text-mucha-mauve" />
                      )}
                    </button>
                  ))}
                </div>
              ))}

              {filteredTimezones.length === 0 && (
                <div className="px-3 py-8 text-sm text-center text-muted-foreground">
                  {t("timezone.noResults")}
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      <p className="text-xs text-muted-foreground mt-1">
        {t("settings.profile.timezoneDescription")}
      </p>
    </div>
  );
}
