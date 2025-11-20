import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider } from 'next-themes';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    backgrounds: {
      disable: true, // We use our own theme system
    },
    layout: 'padded',
  },

  globalTypes: {
    theme: {
      description: 'Art Nouveau Theme Palette',
      defaultValue: 'mucha-classic',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'mucha-classic', title: 'Mucha Classic' },
          { value: 'mucha-spring', title: 'Spring Garden' },
          { value: 'mucha-autumn', title: 'Autumn Harvest' },
          { value: 'mucha-evening', title: 'Evening Jewel' },
          { value: 'mucha-ocean', title: 'Ocean Depths' },
        ],
        dynamicTitle: true,
      },
    },
    darkMode: {
      description: 'Dark Mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Dark Mode',
        icon: 'moon',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Language/Locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'Deutsch' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'mucha-classic';
      const darkMode = context.globals.darkMode || 'light';
      const locale = context.globals.locale || 'en';

      // Apply theme to document
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.className = darkMode === 'dark' ? 'dark' : '';
      }

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={darkMode}
          enableSystem={false}
          disableTransitionOnChange
        >
          <div data-theme={theme} className={darkMode === 'dark' ? 'dark' : ''}>
            <div className="font-body antialiased min-h-screen bg-background text-foreground">
              <Story />
            </div>
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;