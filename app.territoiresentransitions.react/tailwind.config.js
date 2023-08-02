/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: ['ml-0', 'ml-20', 'ml-40', 'ml-60'],
  theme: {
    maxHeight: {
      '80vh': '80vh',
    },
    extend: {
      colors: {
        // Misc
        beige: '#f9f8f6',
        // Design system
        bf500: '#000091',
        bf525: '#6A6AF4',
        // En rapport avec la dernière version Figma du DSFR
        // nomenclature Figma: light/text/default-info
        // nomenclature tailwind proposée: t = text -> tDefaultInfo
        bf925: '#E3E3FD',
        bf925hover: '#C1C1FB',
        bf975: '#f5f5fe',
        grey425: '#666',
        grey625: '#929292',
        grey925: '#E5E5E5',
        grey975: '#F6F6F6',
        // Couleurs système (info, succès, erreur)
        tDefaultInfo: '#0063CB',
        success: '#18753C',
        error425: '#CE0500',
      },
    },
  },
  // eslint-disable-next-line node/no-unpublished-require
  plugins: [require('@tailwindcss/line-clamp')],
};
