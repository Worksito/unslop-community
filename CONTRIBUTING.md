# Submit a component

Unslop takes components from independent developers. Each component keeps its author's name on its card and on its page.

## What to send

Three files. Templates to copy are in [`templates/`](templates/).

| File | Where it goes | What it does |
|---|---|---|
| The component | `src/library/<name>.tsx` | The code people copy, as is, through the prompt |
| The demo | `src/demos/<name>.tsx` | The component with sample content, shown on the site |
| The entry | an item in `models` in `src/models.tsx` | Title, author, card size, dependencies… |

`<name>` is the same for all three, lowercase with dashes (`my-component`).

## House rules

The site exists to show interfaces that don't look generated. A component is accepted if it follows these rules:

1. **No purple gradient**, and no framework default colors (Tailwind indigo, etc.). Pick a hue for the component.
2. **A typeface with character**, never a default font without a reason.
3. **Measured motion**: durations and easing curves written in the code. Only `transform` and `opacity` for what moves.
4. **Nothing hidden at rest**: content stays readable without JavaScript and without animation.
5. **A `prefers-reduced-motion` block** that shows the final state without animation.
6. **No fake content** in the demo: no made-up numbers, fake reviews or fake logos.
7. **Every dependency declared** in `requires` (Tailwind, framer-motion, lucide-react…). Without `requires`, the component may only import React.
8. **One file** for the component, with colors, font and durations as variables at the top, so people can adapt it without touching the rest.

## Security

Your code runs in visitors' browsers. It is rejected if it:

- sends or receives data over the network (`fetch`, `XMLHttpRequest`, `WebSocket`…);
- runs code from a string (`eval`, `new Function`) or loads code on the fly (`import()`);
- reads or writes cookies, `localStorage` or other browser data;
- redirects the visitor, opens a page or injects a script;
- asks for sensitive access (clipboard, location, camera, notifications);
- calls any external address other than Google Fonts, Fontshare, Wikimedia or Unsplash (fonts and sample images).

## Pick the card size

The card should be the size of what it shows: no big empty space around a small element, no squashed demo.

| What the demo shows | `span` (columns out of 12) | `stageHeight` |
|---|---|---|
| A small element: font, link, counter, button | 4 | 260 to 320 |
| A headline, a bar, a card | 5 to 7 | 320 to 400 |
| A form, a gallery | 5 to 8 | 560 to 640 |
| A background or a full section (hero) | 12 | 520 to 640 |

Cards in the same row share a height: combine widths that add up to 12 (4 + 4 + 4, 5 + 7, 12).

If the demo has its own background (black, blue…), set it in `stageColor`: the whole frame takes that color and the demo runs to the edges.

## Check before sending

With the site running (`npm run dev`):

```bash
npm run check-model -- my-component
npm run previews -- my-component
```

The first checks the format: files present, complete entry, declared imports, reduced motion. The second films the demo and creates its preview video in `public/previews/`.

## Send it: a pull request

1. Fork the repository and create a branch named after your component.
2. Add your three files and the generated previews (`public/previews/<slug>.mp4` and `.jpg`).
3. Open a pull request and tick the template's checklist.

**What happens next, automatically:** the site is built, your component is checked (format and security) and filmed. The video is attached to the run, and a preview version of the site is published. If something is wrong, the list of errors shows up in the pull request.

**Then a human review**, before publishing: the code ends up in visitors' browsers, so nothing goes live without being read.

## License

By submitting a component, you confirm it is your original work (or that you have the right to redistribute it, with source and license given), and you agree that it is published on Unslop and copied by its users **under the MIT license**, with your name as author.
