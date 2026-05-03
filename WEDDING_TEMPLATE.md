# Wedding Template Component

## Overview

`WeddingTemplate` is an elegant, minimal wedding website component that displays complete wedding information with a beautiful, mobile-first design. It automatically renders all sections based on available wedding data.

**File:** `src/components/WeddingTemplate.tsx`

## Design Philosophy

- **Minimal & Elegant**: Clean typography, generous whitespace, subtle colors
- **Mobile-First**: Fully responsive design optimized for all screen sizes
- **Smooth Experience**: Subtle animations and transitions
- **Accessible**: Clear hierarchy and readable text
- **Data-Driven**: Automatically adapts to available wedding data

## Component Props

```typescript
interface WeddingTemplateProps {
  wedding: WeddingData;
}

interface WeddingData {
  slug: string;
  groomName: string;
  brideName: string;
  title: string;
  description?: string;
  date: Date;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  events?: Array<{
    name: string;
    type: string;
    date: Date;
    time: string;
    location?: string;
    description?: string;
  }>;
  gallery?: string[];
  contacts?: Array<{
    name: string;
    relationship?: string;
    email?: string;
    phone?: string;
  }>;
  coverImage?: string;
}
```

## Sections

### 1. Hero Section
**Display:** Full-screen hero with animated scroll indicator

**Content:**
- "We are getting married" headline
- Groom name
- Ampersand separator
- Bride name
- Wedding title
- RSVP and "Our Story" action buttons
- Cover image (if available) or gradient background

**Features:**
- Responsive text sizing (5xl mobile → 7xl desktop)
- Beautiful background image with dark overlay
- Animated scroll indicator with bounce effect
- Clear call-to-action buttons

### 2. Wedding Details
**Display:** Save the date section on slate background

**Content:**
- Formatted wedding date (e.g., "Saturday, June 15, 2024")
- Venue name
- Full venue address
- City, State, Country

**Features:**
- Centered, focused layout
- Readable date formatting
- Complete address information

### 3. Our Story
**Display:** Large typography section with generous spacing

**Content:**
- Wedding description text
- Full width on mobile, centered on desktop
- Large, light typography for impact

**Features:**
- Only renders if description exists
- Elegant font-light styling
- Excellent readability

### 4. Events Timeline
**Display:** Vertical timeline with visual indicators

**Content:**
- Event name and type
- Date and time
- Location (if available)
- Event description (if available)

**Features:**
- Visual timeline line connecting events
- Dark circle indicators for each event
- Organized chronologically
- Only renders if events exist

**Timeline Design:**
```
● Event 1
│
● Event 2
│
● Event 3
```

### 5. Gallery
**Display:** Featured image with thumbnail navigation

**Content:**
- Large featured image display
- Thumbnail grid below
- Interactive navigation between images

**Features:**
- Only renders if gallery images exist
- Click thumbnails to change featured image
- Active thumbnail has dark ring border
- Inactive thumbnails fade to 50% opacity
- Hover effect on thumbnails
- Responsive grid (4 columns mobile, 6 columns desktop)
- Maintains aspect ratio

### 6. Get in Touch
**Display:** Contact information section on slate background

**Content:**
- Contact name
- Relationship type (optional)
- Email (clickable mailto link)
- Phone (clickable tel link)

**Features:**
- Only renders if contacts exist
- Multiple contacts in vertical list
- Hover transitions on links
- Mobile-friendly link behavior

### 7. Footer CTA
**Display:** Dark background call-to-action section

**Content:**
- "Will you celebrate with us?" heading
- RSVP description
- RSVP button linking to `/weddings/[slug]/rsvp`

**Features:**
- Strong visual contrast
- Clear action button
- Prominent placement at end of page

### 8. Footer
**Display:** Minimal footer with attribution

**Content:**
- "Created with ForeverStory" text
- Subtle border divider

## Usage

### Basic Implementation

```typescript
import WeddingTemplate from '@/components/WeddingTemplate';
import { Wedding } from '@/models/Wedding';

export default async function WeddingPage({ params }) {
  const wedding = await Wedding.findOne({ slug: params.slug });
  
  if (!wedding) {
    notFound();
  }

  return <WeddingTemplate wedding={wedding} />;
}
```

### Current Integration

The component is already integrated into the wedding page:
**File:** `src/app/weddings/[slug]/page.tsx`

This page:
1. Fetches wedding data from MongoDB
2. Returns 404 if wedding not found
3. Passes wedding data to WeddingTemplate
4. Generates dynamic SEO metadata

## Color Palette

- **Primary**: `slate-900` (dark text and borders)
- **Secondary**: `slate-600` (secondary text)
- **Accent**: `slate-300` (dividers and subtle elements)
- **Background**: `white` and `slate-50` (alternating sections)

## Typography

- **Headers**: `font-light` with generous letter-spacing
- **Body**: `font-light` for minimal, elegant feel
- **Uppercase Labels**: `uppercase` with `tracking-widest`

## Responsive Breakpoints

- **Mobile**: Single column, larger padding
- **Small (640px+)**: sm: prefix utilities
- **Medium (768px+)**: md: prefix utilities  
- **Large (1024px+)**: lg: prefix utilities

## Interactive Features

### Gallery Navigation
```typescript
const [activeImageIndex, setActiveImageIndex] = useState(0);

<button onClick={() => setActiveImageIndex(index)}>
  // Click to change featured image
</button>
```

### Smooth Scrolling
- Scroll anchor links (e.g., `#story`)
- Animated scroll indicator
- Bounce animation on scroll indicator

## Accessibility

- Semantic HTML structure
- Clear hierarchy and visual flow
- Readable contrast ratios
- Descriptive alt text for images
- Clickable phone and email links
- Mobile-touch friendly buttons

## Performance

- Client-side component for interactivity
- Lazy image loading (native browser)
- Minimal animations (no heavy JavaScript)
- CSS-based transitions
- Efficient use of Tailwind utilities

## Customization

### Adjust Color Scheme
Change `slate-*` classes to other Tailwind colors:
- `slate` → `gray`, `zinc`, `stone`, etc.

### Modify Section Spacing
Adjust `py-16 sm:py-24` for vertical spacing
Adjust `px-4 sm:px-6` for horizontal padding

### Change Typography
Modify `font-light` to `font-normal` or `font-semibold`
Adjust text sizes (e.g., `text-5xl → text-4xl`)

### Toggle Sections
Sections automatically hide if data is missing:
- Gallery hides if no images
- Events hide if no events
- Story hides if no description
- Contacts hide if no contacts

## SEO

Dynamic metadata is generated in the wedding page:
- Page title: `"{Groom} & {Bride} - {Title}"`
- Meta description: Wedding description or couple intro
- OpenGraph tags for social sharing

## Future Enhancements

1. **Animations**
   - Fade-in sections as user scrolls
   - Image parallax on scroll
   - Staggered timeline animations

2. **Customization**
   - Theme selection (color presets)
   - Font customization
   - Layout variants

3. **Interactive Features**
   - Lightbox/modal gallery
   - Google Maps integration for venue
   - Guest comment section
   - RSVP statistics dashboard

4. **Rich Content**
   - Video support for gallery
   - Embedded music/audio
   - Countdown timer
   - Weather forecast for wedding day

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
- IE11: Not supported (modern CSS)

## Dependencies

- Next.js 14+
- React 18+
- Tailwind CSS 3.4+
- TypeScript 5+

No external component libraries required.
