# PM Tools Brand Assets

## Logo Design: Ultra-Minimal Mark

The PM Tools logo embodies the transformation from multiple hypotheses to validated decisions through an ultra-minimal geometric design.

### Design Philosophy

Inspired by modern SaaS brands like Linear, Vercel, and Clerk, our logo uses the absolute minimum elements needed to convey meaning. The design represents:

1. **Multiple Starting Points** → Three horizontal lines of varying lengths
2. **Convergence & Direction** → Lines converge into a forward-pointing arrow
3. **Validated Progress** → The arrow indicates forward movement and decision

### The Mark

The logo consists of a single SVG path that creates:
- Three horizontal lines (left side) representing multiple hypotheses
- A forward-pointing arrow (right side) representing validated direction
- The middle line extends fully, showing the "winning" hypothesis

```
───
─────────►
───
```

### Technical Specifications

- **Viewbox**: 24x24 (optimal for stroke-based design)
- **Stroke Width**: 2.5px (scales proportionally)
- **Line Cap**: Round (softer, friendlier appearance)
- **Fill**: None (stroke only)
- **Color**: currentColor (adapts to context)

### Logo Variants

#### 1. Main Logo (`<Logo />`)
- Sizes: `sm` (24x24), `md` (32x32), `lg` (48x48)
- Optional text pairing
- Simple hover scale animation

#### 2. Icon Logo (`<LogoIcon />`)
- Same as main logo without text
- Perfect for app icons and favicons

#### 3. Animated Logo (`<LogoAnimated />`)
- Simple pulse animation for loading states
- No complex multi-stage animations

### Usage Guidelines

1. **Clear Space**
   - Minimum clear space: 50% of logo height on all sides
   - Never crowd the logo

2. **Minimum Size**
   - Digital: 20x20px
   - Print: 6mm x 6mm

3. **Color Usage**
   - Always monochrome
   - Use sufficient contrast with background
   - No gradients or opacity variations

4. **Don'ts**
   - Don't rotate or skew
   - Don't add effects or shadows
   - Don't change stroke width ratio
   - Don't fill the strokes

### Color Values

```css
/* Light Mode */
--primary: oklch(0.205 0 0);  /* Near black */

/* Dark Mode */
--primary: oklch(0.922 0 0);  /* Near white */

/* Favicon Background */
--bg-dark: #0F172A            /* Dark slate */
--stroke: #F8FAFC             /* Off white */
```

### Implementation Examples

```tsx
// Logo with text
<Logo size="md" showText animated />

// Icon only
<LogoIcon size="sm" />

// Loading state
<LogoAnimated size="lg" />
```

### Animation

The logo uses minimal animation:
- **Hover**: Simple scale to 110%
- **Loading**: Subtle pulse effect
- **Transition**: 200ms ease-out

### Accessibility

- High contrast ratios (WCAG AAA)
- Respects prefers-reduced-motion
- Semantic SVG structure
- Appropriate ARIA labels

### File Locations

- **Component**: `/client/src/components/ui/logo.tsx`
- **Favicon**: `/client/public/favicon.svg`

## Design Rationale

This ultra-minimal approach was chosen to:
1. **Stand alongside modern SaaS brands** - Matches the aesthetic of Linear, Vercel, Clerk
2. **Ensure scalability** - Works perfectly from favicon to billboard
3. **Maintain clarity** - Instantly readable at any size
4. **Express the concept** - Multiple inputs → single validated output
5. **Stay timeless** - Geometric simplicity doesn't age

The design successfully balances meaningful symbolism with the radical simplicity expected of modern tech brands.