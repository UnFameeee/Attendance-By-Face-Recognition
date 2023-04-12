const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];

module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    //Because we made a dynamic class with the label we need to add those clases
    // to the safe list so the purge does not remove that
    safelist: [
      ...labelsClasses.map((lbl) => `bg-${lbl}-500`),
      ...labelsClasses.map((lbl) => `bg-${lbl}-200`),
      ...labelsClasses.map((lbl) => `text-${lbl}-400`)
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans"]
      },
      gridTemplateColumns: {
        "1/5": "1fr 5fr"
      },
      colors:{
        'calCo1':'#845EC2',
        'calCo2':'#D65DB1',
        'calCo3':'#FF6F91',
        'calCo4':'#FF9671',
        'calCo5':'#FFC75F',
        'calCo6':'#F9F871',
        'calCo7':'#008F7A',
        'calCo8':'#008E9B',
        'calCo9':'#0081CF',
        'calCo10':'#C4FCEF',
        'calCo11':'#FBEAFF',
        'calCo12':'#F3C5FF',
        'calCo13':'#FEFEDF',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}