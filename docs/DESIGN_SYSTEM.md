# 🌿 TOUCH GRASS — Design System & Visual Rules

> **16-bit Cozy Nature World Specification**

---

## 1. Design Tokens & Palette Specifications

The visual environment evokes a cozy 16-bit forest landscape. All primary colors are declared as CSS custom properties in [`src/styles/variables.css`](file:///d:/TouchGrass/src/styles/variables.css).

```css
:root {
  --color-forest-dark: #0D2D20;   /* Deep canvas background */
  --color-forest: #174B35;        /* Card & container background */
  --color-emerald: #23834F;       /* Structural borders & accents */
  --color-leaf: #76CF45;          /* Vibrant outlines & plant details */
  --color-lime: #C8F36A;          /* Mascot spirit body & active text */
  --color-warm-sunlight: #F5D66C; /* Badges, sunbeams & focus highlights */
  --color-sunlight-glow: #FFF3AA; /* Hover highlight glow */
  --color-sky-day: #78C6EB;       /* Sky elements */
  --color-earth-brown: #4A3525;   /* Soil & bark accents */
  --color-petal-pink: #F8A5C2;    /* Rosy cheek highlights */
}
```

---

## 2. Typography Rules

- **Pixel Heading Font**: `'VT323', monospace, sans-serif` — Used for titles, pixel buttons, badges, section numbers, and mascot speech bubbles.
- **Readable Body Font**: `'Outfit', sans-serif` — Used for descriptions, feature lists, and long text passages.

---

## 3. Crisp Pixel Art Rendering

All images, SVGs, and pixel canvas surfaces strictly enforce pixel sharpness:

```css
img, svg, canvas, .pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

---

## 4. Reusable Pixel UI Components

1. **PixelButton** (`<PixelButton variant="primary | secondary | accent | ghost">`):
   - 3px solid dark border (`#0D2D20`), 4px box shadow offset, 2px active click translation (`translateY(2px)`).
2. **PixelCard** (`<PixelCard interactive={true}>`):
   - 3px solid leaf green border, dashed subtitle separator, smooth hover translation (`translateY(-4px)`).
3. **MascotDisplay** (`<MascotDisplay expression="happy | waving | excited | thinking | resting">`):
   - Teardrop-shaped lime spirit SVG, rosy cheeks, floating CSS animation (`@keyframes pixelFloat`), and speech bubble with arrow tip.
4. **NatureBackground** (`<NatureBackground>`):
   - Layered forest background, animated sunbeams, falling pixel leaves, and SVG tree horizon.

---

## 5. Accessibility & Responsiveness

- **Keyboard Navigation**: Focus outlines are highlighted with `3px solid var(--color-warm-sunlight)` and `2px` offset.
- **Mobile Bottom Navigation**: Screen widths $\le 768\text{px}$ automatically show the fixed mobile bottom bar (`Navigation.css`).
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling non-essential keyframe animations.
