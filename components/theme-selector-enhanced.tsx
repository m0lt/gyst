"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MuchaPalette = "classic" | "emerald" | "ruby";

interface PaletteInfo {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const PALETTES: Record<MuchaPalette, PaletteInfo> = {
  classic: {
    name: "Classic",
    description: "Mauve & Gold - Inspired by Art Nouveau posters",
    colors: {
      primary: "hsl(310 75% 45%)", // Mauve
      secondary: "hsl(280 60% 60%)", // Lavender
      accent: "hsl(45 85% 60%)", // Gold
    },
  },
  emerald: {
    name: "Emerald",
    description: "Nature & Spring - Inspired by botanical paintings",
    colors: {
      primary: "hsl(150 70% 40%)", // Emerald green
      secondary: "hsl(180 60% 60%)", // Soft teal
      accent: "hsl(45 85% 55%)", // Warm gold
    },
  },
  ruby: {
    name: "Ruby",
    description: "Autumn & Passion - Inspired by warm season paintings",
    colors: {
      primary: "hsl(350 75% 50%)", // Ruby red
      secondary: "hsl(25 70% 60%)", // Terracotta
      accent: "hsl(35 90% 60%)", // Rich amber
    },
  },
};

const ThemeSelectorEnhanced = () => {
  const [mounted, setMounted] = useState(false);
  const [palette, setPalette] = useState<MuchaPalette>("classic");
  const { theme, setTheme } = useTheme();

  // Load palette from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedPalette = localStorage.getItem("mucha-palette") as MuchaPalette;
    if (savedPalette && PALETTES[savedPalette]) {
      setPalette(savedPalette);
      applyPalette(savedPalette);
    }
  }, []);

  const applyPalette = (newPalette: MuchaPalette) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newPalette);
    }
  };

  const handlePaletteChange = (newPalette: MuchaPalette) => {
    setPalette(newPalette);
    localStorage.setItem("mucha-palette", newPalette);
    applyPalette(newPalette);
  };

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette size={ICON_SIZE} className="text-muted-foreground" />
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className="text-muted-foreground"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        {/* Dark/Light Mode Section */}
        <DropdownMenuLabel className="text-xs font-ornamental uppercase tracking-wider text-muted-foreground">
          Mode
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Mucha Palette Section */}
        <DropdownMenuLabel className="text-xs font-ornamental uppercase tracking-wider text-muted-foreground">
          Mucha Palette
        </DropdownMenuLabel>
        <div className="p-2 space-y-2">
          <AnimatePresence mode="wait">
            {(Object.keys(PALETTES) as MuchaPalette[]).map((paletteKey) => {
              const paletteInfo = PALETTES[paletteKey];
              const isSelected = palette === paletteKey;

              return (
                <motion.button
                  key={paletteKey}
                  type="button"
                  onClick={() => handlePaletteChange(paletteKey)}
                  className={`
                    w-full p-3 rounded-lg border-2 transition-all text-left
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border/50 hover:border-primary/50 hover:bg-accent/5"
                    }
                  `}
                  whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-display font-semibold">
                      {paletteInfo.name}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {paletteInfo.description}
                  </p>
                  <div className="flex gap-2">
                    <motion.div
                      className="flex-1 h-6 rounded"
                      style={{ backgroundColor: paletteInfo.colors.primary }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="flex-1 h-6 rounded"
                      style={{ backgroundColor: paletteInfo.colors.secondary }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="flex-1 h-6 rounded"
                      style={{ backgroundColor: paletteInfo.colors.accent }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSelectorEnhanced };
