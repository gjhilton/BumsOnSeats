# Font Fallback System

This project uses Adobe Caslon Pro from Typekit with a local Libre Caslon Text fallback for when Typekit is unavailable.

## How It Works

1. **Detection**: A script in `src/html/index.html` detects if Typekit loads successfully
2. **Data Attribute**: The `<html>` element gets a `data-font-source` attribute set to either `"typekit"` or `"local"`
3. **CSS Variables**: The font-family is controlled via CSS custom properties that change based on the data attribute
4. **Automatic Fallback**: If Typekit fails to load or takes longer than 3 seconds, the system automatically switches to local fonts

## Setup Instructions

### 1. Download Libre Caslon Text Fonts

Download the font files from:
- Google Fonts: https://fonts.google.com/specimen/Libre+Caslon+Text
- GitHub: https://github.com/google/fonts/tree/main/ofl/librecaslontext

### 2. Convert to WOFF2 Format

If you downloaded TTF files, convert them to WOFF2 for better web performance:
- Online: https://cloudconvert.com/ttf-to-woff2
- CLI: Use `woff2_compress` tool

### 3. Add Font Files

Place these files in `src/assets/fonts/`:
- `LibreCaslonText-Regular.woff2`
- `LibreCaslonText-Italic.woff2`
- `LibreCaslonText-Bold.woff2` (optional)

## Usage

### In CSS

Use the CSS custom property:

```css
.my-element {
    font-family: var(--font-caslon);
}
```

### In React with Panda CSS

```jsx
import { css } from '@generated/css';

function MyComponent() {
    return (
        <div className={css({
            fontFamily: 'var(--font-caslon)'
        })}>
            Text in Caslon font
        </div>
    );
}
```

### Conditional Styling Based on Font Source

#### CSS Method

```css
/* Adjust spacing when using local fonts */
html[data-font-source="local"] .headline {
    letter-spacing: 0.03em;
}

html[data-font-source="typekit"] .headline {
    letter-spacing: 0.05em;
}
```

#### JavaScript/React Method

```jsx
import { useFontSource } from './utils/useFontSource';

function MyComponent() {
    const fontSource = useFontSource();

    return (
        <div style={{
            letterSpacing: fontSource === 'local' ? '0.03em' : '0.05em'
        }}>
            Conditionally styled text
        </div>
    );
}
```

#### Panda CSS Method

```jsx
import { css } from '@generated/css';
import { useFontSource } from './utils/useFontSource';

function MyComponent() {
    const fontSource = useFontSource();

    return (
        <div className={css({
            letterSpacing: fontSource === 'local' ? '0.03em' : '0.05em',
            fontWeight: fontSource === 'local' ? '700' : '600'
        })}>
            Conditionally styled text
        </div>
    );
}
```

## Detection Behavior

The detection script:
1. Sets initial `data-font-source="typekit"` on the `<html>` element
2. Waits up to 3 seconds for Typekit to load
3. Checks if `adobe-caslon-pro` font is available using the Font Loading API
4. Falls back to `data-font-source="local"` if:
   - Typekit stylesheet fails to load (network error)
   - Adobe Caslon font is not found after 3 seconds
   - Document fonts are ready but Adobe Caslon is not present

Console messages will indicate which font source is being used:
- Success: `"Typekit fonts loaded successfully"`
- Fallback: `"Typekit fonts failed to load, using local fallback"` or `"Adobe Caslon not found, using local fallback"`
- Error: `"Typekit stylesheet failed to load, using local fallback"`

## CSS Custom Properties

Available CSS variables:

- `--font-caslon`: Main font stack (changes based on data-font-source)
- `--font-caslon-fallback`: Local font stack only

## Files Modified/Created

- `src/html/index.html` - Added detection script and data attribute
- `src/style/fonts.css` - @font-face declarations and CSS variables
- `src/style/index.css` - Import fonts.css
- `src/routes/index.jsx` - Updated to use CSS custom property
- `src/utils/useFontSource.js` - React hook for detecting font source
- `src/style/conditional-fonts-example.css` - Examples of conditional styling
- `src/assets/fonts/` - Directory for local font files

## Testing

To test the fallback system:

1. **Block Typekit**: Use browser DevTools Network tab to block `use.typekit.net`
2. **Slow Network**: Throttle network to "Slow 3G" to trigger timeout
3. **Check Console**: Look for font source messages
4. **Inspect Element**: Check `<html data-font-source="...">` attribute

## Why Libre Caslon Text?

Libre Caslon Text is a free, open-source font that closely resembles Adobe Caslon Pro:
- Similar proportions and character shapes
- Good web rendering quality
- Free to use and distribute
- Available in Regular, Italic, and Bold weights

While not identical to Adobe Caslon Pro, it provides a graceful fallback that maintains the design intent.
