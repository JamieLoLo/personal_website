/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      opacity: {
        25: '.25',
        75: '.75',
        85: '.85',
      },
      scale: {
        85: '.85',
        95: '.95',
      },

      colors: {
        mainGrey: {
          100: '#6B6B6B',
        },
        mainGrey2: {
          100: '#E2E2E2',
        },
        textBlack: {
          100: '#242424',
        },
        infoBg: {
          100: '#E7E7E1',
        },
        ticker: {
          100: '#DA691D',
        },
        bgBlack: {
          100: '#2C2C2C',
        },
      },
    },
    screens: {
      landscapePhone: {
        raw: `only screen and (orientation: landscape) and (max-width: 1024px) and (max-height: 550px)`,
      },
      laptop: {
        raw: `only screen and (max-height: 859px) and (min-width: 1400px) `,
      },
      smallLaptop: {
        raw: `only screen and (max-height:650px) and (min-width:921px) and (orientation: landscape)`,
      },
      mdForQuestion: { raw: `only screen and (max-width: 1400px)` },
      landscapePad: {
        raw: `only screen and (min-width: 1024px) and (max-width: 1370px) and (orientation: landscape)`,
      },

      portraitPad: {
        raw: `only screen and (max-width: 1024px) and (orientation: portrait)`,
      },
      portraitPh: {
        raw: `only screen and (max-width: 550px)`,
      },
      shortPhone: {
        raw: `only screen and (max-height: 700px) and (max-width: 430px)`,
      },
      xsPhone: {
        raw: `only screen and  (max-width: 350px)`,
      },
    },
  },
  plugins: [],
}
