/**
 * Utility functions for subdomain detection and handling
 */

interface SubdomainInfo {
  subdomain: string | null;
  isWeddingSubdomain: boolean;
  slug: string | null;
}

/**
 * Extract subdomain from hostname
 * Examples:
 * - varunwedspriya.foreverstory.in -> varunwedspriya
 * - foreverstory.in -> null
 * - localhost:3000 -> null
 * - wedding-example.localhost:3000 -> wedding-example
 */
export function getSubdomainInfo(hostname: string): SubdomainInfo {
  if (!hostname) {
    return { subdomain: null, isWeddingSubdomain: false, slug: null };
  }

  // Remove port if present
  const host = hostname.split(':')[0];

  // Split by dots
  const parts = host.split('.');

  // Local development with subdomain (e.g., wedding-slug.localhost)
  if (host.includes('localhost') && parts.length >= 2) {
    const subdomain = parts[0];
    return {
      subdomain,
      isWeddingSubdomain: true,
      slug: subdomain,
    };
  }

  // Production domain (e.g., subdomain.foreverstory.in)
  // We expect 3 parts: [subdomain, foreverstory, in]
  if (parts.length >= 3) {
    // Check if it's our domain (foreverstory.in or foreverstory.com, etc.)
    const domain = parts.slice(-2).join('.');

    // Common domain patterns we support
    const supportedDomains = [
      'foreverstory.in',
      'foreverstory.com',
      'foreverstory.co',
      'foreverstory.io',
    ];

    if (supportedDomains.some((d) => domain.endsWith(d))) {
      const subdomain = parts[0];

      // Don't treat certain subdomains as wedding subdomains
      const systemSubdomains = ['www', 'api', 'admin', 'mail', 'ftp'];
      if (systemSubdomains.includes(subdomain)) {
        return { subdomain, isWeddingSubdomain: false, slug: null };
      }

      return {
        subdomain,
        isWeddingSubdomain: true,
        slug: subdomain,
      };
    }
  }

  return { subdomain: null, isWeddingSubdomain: false, slug: null };
}

/**
 * Check if a request is for a wedding subdomain
 */
export function isWeddingSubdomainRequest(hostname: string): boolean {
  const info = getSubdomainInfo(hostname);
  return info.isWeddingSubdomain;
}

/**
 * Get the wedding slug from hostname
 */
export function getWeddingSlugFromHostname(hostname: string): string | null {
  const info = getSubdomainInfo(hostname);
  return info.slug;
}

/**
 * Validate wedding slug format
 * Slugs should only contain lowercase letters, numbers, and hyphens
 */
export function isValidWeddingSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
