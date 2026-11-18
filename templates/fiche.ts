// The entry to add to the `models` array in src/models.tsx.
const entry = {
  slug: "my-component",             // page address: #/m/my-component
  span: 6,                          // card width, in columns out of 12: 4, 5, 6, 7, 8 or 12
  stageHeight: 320,                 // frame height in px: the whole demo fits, without big empty space
  author: { name: "First Last", url: "https://my-site.com" },
  title: "My component",
  line: "One sentence on what you see, under 12 words.",
  category: "Titres",               // Titres, Mouvements, Polices, Navigation, Sections, Formulaires or Galeries
  fonts: "Fraunces",
  motion: "700 ms, a single entrance",
  file: "my-component",             // src/library/my-component.tsx and src/demos/my-component.tsx
  usage: `<MyComponent text="Your text" />`,
  // Optional:
  // requires: "Tailwind CSS and framer-motion",  // everything needed besides React
  // stageColor: "#0b0b0f",                       // if the demo has its own background: the whole frame takes it
  // replayEvery: 3600,                           // replays the demo (animation length + about 2.5 s)
  // preview: "image",                            // static component: an image instead of a video
  // preview: "hover",                            // hover effect: the video is filmed while moving the mouse
};
export default entry;
