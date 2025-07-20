# PM Tools Brand Assets

This directory contains all PM Tools logo assets in SVG format.

## Available Files

### logo.svg
- **Description**: Main logo icon in black
- **Size**: 24x24px
- **Use case**: Default logo on light backgrounds

### logo-white.svg
- **Description**: Logo icon in white
- **Size**: 24x24px
- **Use case**: Logo on dark backgrounds

### logo-with-text.svg
- **Description**: Logo with "PM Tools" text
- **Size**: 120x24px
- **Use case**: Headers, marketing materials

### logo-favicon.svg
- **Description**: Logo with dark background
- **Size**: 32x32px with 6px border radius
- **Use case**: Browser favicon, app icons

## Usage Guidelines

1. **Never modify the SVG paths** - Use as-is to maintain brand consistency
2. **Maintain aspect ratio** - Don't stretch or distort the logo
3. **Ensure contrast** - Use appropriate variant for background color
4. **Minimum size** - Don't use smaller than 20x20px for icon only

## Color Values

- **Black**: #000000
- **White**: #FFFFFF
- **Dark Background**: #0F172A
- **Light Stroke**: #F8FAFC

## Need Different Formats?

These SVGs can be easily converted to:
- PNG (using online converters or design tools)
- ICO (for Windows favicons)
- PDF (for print materials)

## React Component

To use in React applications, import from:
```tsx
import { Logo, LogoIcon } from "@/components/ui/logo";
```