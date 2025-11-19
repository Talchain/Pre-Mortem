/**
 * Tailwind Configuration - Olumi Design System v1.2
 * Extended with Olumi tokens for seamless integration
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ========================================
         COLORS - Olumi Cognitive Spectrum
         ======================================== */
      colors: {
        // Foundation Neutrals
        ink: {
          900: '#262626',
          700: '#404040',
          500: '#737373',
        },
        canvas: {
          25: '#F4F0EA',
        },
        paper: {
          50: '#FEF9F3',
        },
        sand: {
          100: '#EDE8DD',
          200: '#E1D8C7',
        },

        // Cognitive Spectrum
        sun: {
          400: '#F7D05F',
          500: '#F5C433',  // Primary actions
          600: '#E8B61F',
        },
        mint: {
          300: '#8DD4B4',
          400: '#62B28F',
          500: '#67C89E',  // Success
        },
        sky: {
          200: '#BFE3F4',
          500: '#63ADCF',  // Information
          600: '#5C9BB8',
        },
        carrot: {
          400: '#ED9163',
          500: '#EA7B4B',  // Warning/Danger
          600: '#D96A3C',
        },
        lilac: {
          300: '#B5B2F5',
          400: '#9E9AF1',  // Secondary accents
        },

        // Supporting
        periwinkle: {
          200: '#C9D9FF',
        },
        banana: {
          200: '#FFE497',
        },

        // Semantic shortcuts (for Tailwind utilities)
        primary: {
          DEFAULT: '#F5C433',
          hover: '#E8B61F',
          active: '#F7D05F',
        },
        success: {
          DEFAULT: '#67C89E',
        },
        info: {
          DEFAULT: '#63ADCF',
        },
        warning: {
          DEFAULT: '#EA7B4B',
        },
        danger: {
          DEFAULT: '#EA7B4B',
        },
      },

      /* ========================================
         TYPOGRAPHY - League Spartan
         ======================================== */
      fontFamily: {
        sans: ['League Spartan', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        primary: ['League Spartan', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },

      fontSize: {
        'hero': ['3rem', '1.10'],           // 48px
        'heading-lg': ['2.5rem', '1.15'],   // 40px
        'heading-md': ['1.75rem', '1.20'],  // 28px
        'heading-sm': ['1.375rem', '1.40'], // 22px
        'body': ['1rem', '1.55'],           // 16px
        'label': ['0.875rem', '1.30'],      // 14px
      },

      fontWeight: {
        semibold: 600,
        regular: 400,
      },

      /* ========================================
         SPACING - 8px Grid
         ======================================== */
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
      },

      /* ========================================
         BORDER RADIUS
         ======================================== */
      borderRadius: {
        'sm': '0.5rem',   // 8px
        'md': '0.75rem',  // 12px
        'lg': '1.25rem',  // 20px
        'pill': '999px',
      },

      /* ========================================
         BOX SHADOWS - Olumi Elevation
         ======================================== */
      boxShadow: {
        '0': 'none',
        '1': '0 1px 2px rgba(38, 38, 38, 0.06)',
        '2': '0 4px 12px rgba(38, 38, 38, 0.10)',
        '3': '0 8px 24px rgba(38, 38, 38, 0.14)',
        // Legacy names for compatibility
        'card': '0 4px 12px rgba(38, 38, 38, 0.10)',
        'elevated': '0 4px 12px rgba(38, 38, 38, 0.10)',
        'modal': '0 8px 24px rgba(38, 38, 38, 0.14)',
      },

      /* ========================================
         ANIMATIONS - Olumi Motion
         ======================================== */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'spin': 'spin 1s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      /* ========================================
         TRANSITIONS - Olumi Timing
         ======================================== */
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'base': '300ms',
        'slow': '400ms',
      },

      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      },

      /* ========================================
         Z-INDEX Scale
         ======================================== */
      zIndex: {
        'base': 0,
        'dropdown': 100,
        'sticky': 200,
        'modal': 300,
        'popover': 400,
        'tooltip': 500,
      },
    },
  },
  plugins: [],
  safelist: [
    // Ensure design token classes are always available
    'bg-canvas-25',
    'bg-paper-50',
    'text-ink-900',
    'border-sand-200',
  ],
}
