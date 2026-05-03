# Subdomain Detection & Dynamic Wedding Pages

## Overview

ForeverStory uses subdomain detection to display wedding pages. A wedding created with the slug `varunwedspriya` can be accessed via:

- **Subdomain:** `varunwedspriya.foreverstory.in`
- **Path:** `/weddings/varunwedspriya`
- **Localhost Dev:** `varunwedspriya.localhost:3000`

## How It Works

### 1. Subdomain Detection

The middleware detects subdomains and rewrites requests to the appropriate page.

**File:** `src/lib/subdomain.ts`

```typescript
// Extract subdomain from hostname
getSubdomainInfo('varunwedspriya.foreverstory.in')
// Returns: {
//   subdomain: 'varunwedspriya',
//   isWeddingSubdomain: true,
//   slug: 'varunwedspriya'
// }
```

**Supported Domain Patterns:**
- `{slug}.foreverstory.in`
- `{slug}.foreverstory.com`
- `{slug}.foreverstory.co`
- `{slug}.foreverstory.io`
- `{slug}.localhost:3000` (development)

### 2. Middleware Processing

**File:** `src/middleware.ts`

**Flow:**
1. Request arrives (e.g., to `varunwedspriya.foreverstory.in/`)
2. Middleware extracts hostname
3. Subdomain detection identifies `varunwedspriya` as the slug
4. Request is rewritten to `/weddings/varunwedspriya`
5. Next.js renders the wedding page

**Code:**
```typescript
const weddingSlug = getWeddingSlugFromHostname(hostname);

if (weddingSlug && isValidWeddingSlug(weddingSlug) && nextUrl.pathname === '/') {
  // Rewrite to wedding page route
  const weddingUrl = new URL(`/weddings/${weddingSlug}`, nextUrl);
  return NextResponse.rewrite(weddingUrl);
}
```

### 3. Dynamic Wedding Page

**File:** `src/app/weddings/[slug]/page.tsx`

**Features:**
- Fetches wedding data from MongoDB
- Displays complete wedding information
- Shows timeline of events
- Lists important contacts
- Gallery placeholder
- RSVP call-to-action
- Dynamic metadata for SEO

**Data Fetched:**
```typescript
const wedding = await Wedding.findOne({ slug: params.slug })
  .populate('organizers', 'name email');
```

## Setup Instructions

### Local Development

#### 1. Configure Hosts File

Edit your system's hosts file to map local subdomains:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 localhost
127.0.0.1 varunwedspriya.localhost
127.0.0.1 johnsarah.localhost
127.0.0.1 mytest.localhost
```

**Mac/Linux:** `/etc/hosts`
```
127.0.0.1 localhost
127.0.0.1 varunwedspriya.localhost
127.0.0.1 johnsarah.localhost
127.0.0.1 mytest.localhost
```

#### 2. Run Development Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

#### 3. Access Wedding Pages

- **Subdomain:** `http://varunwedspriya.localhost:3000`
- **Path:** `http://localhost:3000/weddings/varunwedspriya`

Both routes display the same wedding page.

### Production Setup

#### 1. DNS Configuration

Add wildcard DNS record to point all subdomains to your server:

```
*.foreverstory.in    A    YOUR_SERVER_IP
foreverstory.in      A    YOUR_SERVER_IP
www.foreverstory.in  A    YOUR_SERVER_IP
```

#### 2. SSL Certificate

Get a wildcard SSL certificate for `*.foreverstory.in`:

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --dns-route53 -d 'foreverstory.in' -d '*.foreverstory.in'
```

#### 3. Web Server Configuration

**Nginx Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name *.foreverstory.in foreverstory.in;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. Environment Variables

Update `.env.local` for production:

```env
NEXTAUTH_URL=https://foreverstory.in
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=your-production-mongodb-uri
```

## URL Slug Validation

**Valid Slugs:**
- `john-sarah-2024`
- `varunwedspriya`
- `the-johnsons`
- `wedding123`
- `mr-and-mrs-smith`

**Invalid Slugs:**
- `john sarah` (spaces)
- `John-Sarah` (uppercase)
- `john_sarah` (underscores)
- `john..sarah` (consecutive hyphens)
- `.john` (starts with hyphen)
- `john.` (ends with hyphen)

**Validation Regex:** `^[a-z0-9]+(?:-[a-z0-9]+)*$`

## Wedding Page Content

### Automatic Display

The wedding page displays all information from the MongoDB wedding document:

**Header Section:**
- Groom and bride names
- Wedding title
- Description
- Cover image (if provided)

**Wedding Details:**
- Date and time
- Venue (name, address, city, state, zip, country)
- Expected guest count
- Budget
- Tags

**Timeline:**
- All events with:
  - Event name and type
  - Date and time
  - Location
  - Description

**Contacts:**
- All contacts with:
  - Name and relationship
  - Email and phone (clickable)

**Gallery:**
- Images from gallery array

**RSVP Section:**
- Call-to-action button
- Links to `/weddings/[slug]/rsvp`

## Performance Optimization

### Static Generation

The wedding page uses ISR (Incremental Static Regeneration):

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

**Benefits:**
- Fast page loads from cache
- Automatic updates every minute
- Reduced database queries

**To increase frequency:**
```typescript
export const revalidate = 10; // Update every 10 seconds
```

### Metadata

Automatic SEO metadata generation:

```typescript
export async function generateMetadata({ params }: WeddingPageProps) {
  // Generates:
  // - Page title: "John & Sarah - John & Sarah's Wedding"
  // - Meta description
  // - OpenGraph tags for social sharing
}
```

## Subdomain Utility Functions

**File:** `src/lib/subdomain.ts`

### getSubdomainInfo(hostname)

Extract full subdomain information.

```typescript
const info = getSubdomainInfo('varunwedspriya.foreverstory.in');
// {
//   subdomain: 'varunwedspriya',
//   isWeddingSubdomain: true,
//   slug: 'varunwedspriya'
// }
```

### isWeddingSubdomainRequest(hostname)

Check if request is for a wedding subdomain.

```typescript
if (isWeddingSubdomainRequest(hostname)) {
  // Handle wedding subdomain
}
```

### getWeddingSlugFromHostname(hostname)

Get just the wedding slug.

```typescript
const slug = getWeddingSlugFromHostname('varunwedspriya.foreverstory.in');
// 'varunwedspriya'
```

### isValidWeddingSlug(slug)

Validate slug format.

```typescript
isValidWeddingSlug('john-sarah-2024') // true
isValidWeddingSlug('john_sarah') // false
```

## Example Wedding URLs

**Local Development:**
```
http://varunwedspriya.localhost:3000          → Wedding page
http://varunwedspriya.localhost:3000/rsvp     → RSVP page
http://localhost:3000/weddings/varunwedspriya → Same wedding page (path-based)
```

**Production:**
```
https://varunwedspriya.foreverstory.in        → Wedding page
https://varunwedspriya.foreverstory.in/rsvp   → RSVP page
https://foreverstory.in/weddings/varunwedspriya → Same wedding page (path-based)
```

## System Subdomains

These subdomains are reserved and won't be treated as wedding subdomains:

- `www` → Main website
- `api` → API endpoints
- `admin` → Admin panel
- `mail` → Mail server
- `ftp` → FTP server

Example: `www.foreverstory.in` → routes to `/` (main site)

## Troubleshooting

### Wedding Page Shows 404

**Causes:**
1. Wedding slug doesn't exist in MongoDB
2. Slug format is invalid (uppercase, spaces, etc.)
3. Wedding not public (isPublic: false)

**Solutions:**
- Verify wedding exists: `db.weddings.findOne({ slug: 'your-slug' })`
- Check slug format matches pattern
- Verify isPublic is true
- Check MongoDB connection

### Subdomain Not Working Locally

**Causes:**
1. Hostname not in hosts file
2. Server not running
3. Port mismatch

**Solutions:**
- Add entry to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows)
- Run `npm run dev`
- Access with `localhost:3000`, not `localhost:3001`

### DNS Not Resolving in Production

**Causes:**
1. Wildcard DNS not configured
2. TTL not expired
3. SSL certificate issue

**Solutions:**
- Check DNS propagation: `nslookup testslug.foreverstory.in`
- Wait for TTL expiration (usually 24 hours)
- Verify SSL certificate is valid: `openssl s_client -connect varunwedspriya.foreverstory.in:443`

## Security Considerations

### Slug Injection

Slugs are validated to prevent injection attacks:

```typescript
// Only allows: a-z, 0-9, and hyphens
isValidWeddingSlug('varunwedspriya') // true
isValidWeddingSlug('varunwedspriya; DROP TABLE weddings') // false
```

### Rate Limiting

Consider adding rate limiting to wedding pages:

```typescript
// Middleware for rate limiting
import { Ratelimit } from '@upstash/ratelimit';
```

### Privacy

- Only public weddings are displayed
- Check `isPublic: true` before rendering
- Consider adding password protection for private weddings

## Future Enhancements

1. **Custom Domains**
   - Allow users to use their own domain
   - Setup CNAME records to `*.foreverstory.in`

2. **Themed Pages**
   - Different templates based on wedding style
   - Customizable colors and fonts

3. **Guest Accounts**
   - Guests log in to RSVP
   - View photos from other guests

4. **Email Notifications**
   - Notify organizers of new RSVPs
   - Send event reminders to guests

5. **Analytics**
   - Track page views
   - Monitor RSVP status
   - Get insights about guests
