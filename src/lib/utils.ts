import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has no way to know about the project's custom type scale
 * (`--text-display`, `--text-h1`, … in globals.css). Left unconfigured it
 * classifies `text-h1` as a *text colour*, so `cn("text-h1", "text-on-night")`
 * silently drops the size. Declaring them as font sizes keeps size and colour
 * in separate conflict groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body-lg",
            "body",
            "small",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
