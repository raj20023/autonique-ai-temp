/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Anthropic-inspired neutral palette
        neutral: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#eaecf0',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c111d',
        },
        // Logo-inspired orange palette (primary brand color)
        orange: {
          25: '#fffcf5',
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f79009', // Main orange from logo
          600: '#dc6803',
          700: '#b54708',
          800: '#93370d',
          900: '#7a2e0e',
          950: '#4e1d09',
        },
        // Secondary brand colors
        brand: {
          // Main logo navy blue
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#2D3748', // Main logo color
        },
        accent: {
          // Logo light blue accent
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#7C9AE7', // Logo accent color
          600: '#6366f1',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Success, warning, error colors
        success: {
          25: '#f6fef9',
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
          800: '#05603a',
          900: '#054f31',
        },
        warning: {
          25: '#fffcf5',
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f79009',
          600: '#dc6803',
          700: '#b54708',
          800: '#93370d',
          900: '#7a2e0e',
        },
        error: {
          25: '#fffbfa',
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda29b',
          400: '#f97066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
        },
        instagram: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // AI-inspired color palettes
        neural: {
          25: '#fafcff',
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#b8d4ff',
          300: '#7db3ff',
          400: '#4facfe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        cyber: {
          25: '#fafcfe',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        quantum: {
          25: '#fefaff',
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d4fe',
          300: '#e9b3fd',
          400: '#d946ef',
          500: '#c026d3',
          600: '#a21caf',
          700: '#86198f',
          800: '#701a75',
          900: '#581c87',
          950: '#3b0764',
        },
        matrix: {
          25: '#f0fdf4',
          50: '#dcfce7',
          100: '#bbf7d0',
          200: '#86efac',
          300: '#4ade80',
          400: '#22c55e',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#14532d',
          950: '#052e16',
        },
      },
      // Enhanced background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ai-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-ai-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-ai-neural': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-ai-quantum': 'linear-gradient(135deg, #d946ef 0%, #c026d3 50%, #a21caf 100%)',
        'gradient-ai-cyber': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        'gradient-ai-matrix': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        'neural-flow': 'linear-gradient(45deg, #4facfe 0%, #00f2fe 25%, #667eea 50%, #764ba2 75%, #4facfe 100%)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        display: [
          'Space Grotesk',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ],
        accent: [
          'Space Grotesk',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(248 113 113 / 0.3)',
        'glow-orange': '0 0 20px rgb(247 144 9 / 0.3)',
        'glow-blue': '0 0 20px rgb(124 154 231 / 0.3)',
      },
      animation: {
        // Existing animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',

        // New Anthropic-inspired animations
        'slide-in-from-top': 'slideInFromTop 0.3s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'slide-in-from-left': 'slideInFromLeft 0.3s ease-out',
        'slide-in-from-right': 'slideInFromRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        // Existing keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // New keyframes
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(247 144 9 / 0.2), 0 0 10px rgb(247 144 9 / 0.2), 0 0 15px rgb(247 144 9 / 0.2)' },
          '100%': { boxShadow: '0 0 10px rgb(247 144 9 / 0.4), 0 0 20px rgb(247 144 9 / 0.4), 0 0 30px rgb(247 144 9 / 0.4)' },
        },
        // AI-inspired advanced animations
        neuralPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(79, 172, 254, 0.7)'
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(79, 172, 254, 0)'
          },
        },
        morphGlow: {
          '0%': {
            borderRadius: '1rem',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)'
          },
          '33%': {
            borderRadius: '2rem',
            boxShadow: '0 0 30px rgba(240, 147, 251, 0.4)'
          },
          '66%': {
            borderRadius: '1.5rem',
            boxShadow: '0 0 25px rgba(79, 172, 254, 0.35)'
          },
          '100%': {
            borderRadius: '1rem',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)'
          },
        },
        dataFlow: {
          '0%': {
            transform: 'translateX(-100%) scaleX(0)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateX(0%) scaleX(1)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%) scaleX(0)',
            opacity: '0'
          },
        },
        levitate: {
          '0%, 100%': {
            transform: 'translateY(0px) rotateX(0deg)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          },
          '50%': {
            transform: 'translateY(-20px) rotateX(2deg)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          },
        },
        breathe: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(1.02)',
            opacity: '1'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'neural': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ai-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'morphic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      // Enhanced backdrop blur options
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      // Advanced box shadow utilities
      boxShadow: {
        'neural': '0 10px 25px -3px rgba(79, 172, 254, 0.1), 0 4px 6px -2px rgba(79, 172, 254, 0.05)',
        'ai-glow': '0 0 20px rgba(102, 126, 234, 0.3), 0 0 40px rgba(102, 126, 234, 0.1)',
        'morphic': '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.18) inset',
        'levitate': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
