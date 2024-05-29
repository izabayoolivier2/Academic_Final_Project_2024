const defaultTheme = require("tailwindcss/defaultTheme");

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "0px",
        xl: "40px",
        "2xl": "128px",
      },
    },

    extend: {
      colors: {
        darkGray4: '#939393',
        red: '#CE181E',
        typoPrimaryColor: '#FFFFFF',
        typoSecondaryColor: '#878787',
        buttonColor: '#2C2C2C',
        secondaryBackground: '#111',
        success: "#7ED321",
        primaryBtnColor: "#A613BE",
        onPrimaryBtnColor: "#FADDFF",
        primary: {
          50: customColors("--c-primary-50"),
          100: customColors("--c-primary-100"),
          200: customColors("--c-primary-200"),
          300: customColors("--c-primary-300"),
          400: customColors("--c-primary-400"),
          500: customColors("--c-primary-500"),
          6000: customColors("--c-primary-600"),
          700: customColors("--c-primary-700"),
          800: customColors("--c-primary-800"),
          900: customColors("--c-primary-900"),
          buttonPrimary: customColors("--c-primary-button-color"),
          buttonHoverPrimary: customColors("--c-primary-button-hover-color"),
          cardPrimary: customColors("--c-primary-card-color"),
          cardSecondary: customColors("--c-card-color"),
        },
        secondary: {
          50: customColors("--c-secondary-50"),
          100: customColors("--c-secondary-100"),
          200: customColors("--c-secondary-200"),
          300: customColors("--c-secondary-300"),
          400: customColors("--c-secondary-400"),
          500: customColors("--c-secondary-500"),
          6000: customColors("--c-secondary-600"),
          700: customColors("--c-secondary-700"),
          800: customColors("--c-secondary-800"),
          900: customColors("--c-secondary-900"),
        },
        neutral: {
          50: customColors("--c-neutral-50"),
          100: customColors("--c-neutral-100"),
          200: customColors("--c-neutral-200"),
          300: customColors("--c-neutral-300"),
          400: '#939393',
          500: customColors("--c-neutral-500"),
          6000: customColors("--c-neutral-600"),
          700: customColors("--c-neutral-700"),
          800: '#242529',
          900: customColors("--c-neutral-900"),
        },
        gray: {
          100: customColors("--bs-gray-100"),
          200: customColors("--bs-gray-200"),
          300: customColors("--bs-gray-300"),
          400: customColors("--bs-gray-400"),
          500: customColors("--bs-gray-500"),
          600: customColors("--bs-gray-600"),
          700: customColors("--bs-gray-700"),
          800: customColors("--bs-gray-800"),
          900: customColors("--bs-gray-900"),
          white: customColors("--bs-white"),
          light: customColors("--bs-light"),
          primary: customColors("--bs-primary"),
          success: customColors("--bs-success"),
          warning: customColors("--bs-warning"),
          danger: customColors("--bs-danger"),
          dark: customColors("--bs-dark"),
          secondary: customColors("--bs-secondary"),
          primaryActive: customColors("--bs-primary-active"),
          secondaryActive: customColors("--bs-secondary-active"),
          lightActive: customColors("--bs-light-active"),
          successActive: customColors("--bs-success-active"),
          infoActive: customColors("--bs-info-active"),
          warnigActive: customColors("--bs-warning-active"),
          dangerActive: customColors("--bs-danger-active"),
          darkActive: customColors("--bs-dark-active"),
          primaryLight: customColors("--bs-primary-light"),
          successLight: customColors("--bs-success-light"),
          infoLight: customColors("--bs-info-light"),
          warningLight: customColors("--bs-warning-light"),
          dangerLight: customColors("--bs-danger-light"),
          darkLight: customColors("--bs-dark-light"),
          secondaryLight: customColors("--bs-secondary-light"),
        },
        black: {
          100: customColors("--bs-black-100-rgb"),
        },
        bodyBg: '#0C0C0C',
        grey: '#242529',
        ringColor: '#313134'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
