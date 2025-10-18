// This file tells TypeScript how to handle CSS imports
// See: https://github.com/vercel/next.js/discussions/32238

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
