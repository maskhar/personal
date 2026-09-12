# Domain Configuration Guide

## Primary Domain: maskhar.com
## Secondary Domain: maskhar.site

## DNS Configuration

### For maskhar.com (Primary - already configured)
- CNAME file: maskhar.com
- GitHub Pages custom domain setting: maskhar.com

### For maskhar.site (Secondary)
You need to configure DNS at your domain registrar:

**Option 1: Point to primary domain (Recommended)**
- Type: CNAME
- Name: @ (or maskhar.site)
- Value: maskhar.com
- TTL: 3600 (or Auto)

**Option 2: Point directly to GitHub Pages**
- Type: A Records (for apex domain)
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

- Type: CNAME (for www subdomain)
  - Name: www
  - Value: maskhar2708.github.io

## CORS Configuration
Both domains are now allowed via:
1. public/_headers file with wildcard CORS
2. src/middleware.ts for request handling

## Verification Steps
1. Add DNS records for maskhar.site at your registrar
2. Wait for DNS propagation (can take 24-48 hours)
3. Optionally add maskhar.site to GitHub Pages custom domains
4. Test both domains after deployment

## Notes
- GitHub Pages officially supports only ONE custom domain per repository
- To fully support both domains, consider:
  - Using Cloudflare or another CDN in front
  - Deploying to Vercel/Netlify which support multiple domains natively
  - Using DNS redirect from maskhar.site → maskhar.com
