import { searchUniversitiesGlobal, type UniversitySearchResult } from "@/lib/api/universities-api";
import { searchUniversities, type University } from "@/lib/data/universities";

/**
 * Validates if an email domain matches the selected university
 */
export async function validateEmailDomain(
  email: string,
  universityName: string,
  universityWebsite?: string
): Promise<{ valid: boolean; error?: string }> {
  // Extract domain from email
  const emailDomain = email.split("@")[1]?.toLowerCase();
  
  if (!emailDomain) {
    return { valid: false, error: "無效的 email 格式" };
  }

  // Check local Taiwan universities first
  const localResults = searchUniversities(universityName);
  if (localResults.length > 0) {
    const university = localResults[0];
    // For Taiwan universities, check if domain matches common patterns
    // Common patterns: ntu.edu.tw, mail.ntu.edu.tw, etc.
    const universityDomain = extractDomainFromWebsite(university.website);
    if (universityDomain && emailDomain.includes(universityDomain)) {
      return { valid: true };
    }
  }

  // Check global universities
  if (universityWebsite) {
    const websiteDomain = extractDomainFromWebsite(universityWebsite);
    if (websiteDomain) {
      // Check if email domain matches or is a subdomain
      if (emailDomain === websiteDomain || emailDomain.endsWith(`.${websiteDomain}`)) {
        return { valid: true };
      }
    }
  }

  // Try to fetch university data from API to get domains
  try {
    const globalResults = await searchUniversitiesGlobal(universityName);
    if (globalResults.length > 0) {
      const university = globalResults[0];
      const websiteDomain = extractDomainFromWebsite(university.website);
      if (websiteDomain) {
        if (emailDomain === websiteDomain || emailDomain.endsWith(`.${websiteDomain}`)) {
          return { valid: true };
        }
      }
    }
  } catch (error) {
    console.error("Error validating email domain:", error);
  }

  // If we have a website, do a more lenient check
  if (universityWebsite) {
    const websiteDomain = extractDomainFromWebsite(universityWebsite);
    if (websiteDomain) {
      // Extract main domain (e.g., ntu.edu.tw from www.ntu.edu.tw)
      const mainDomain = websiteDomain.replace(/^www\./, "");
      const emailMainDomain = emailDomain.replace(/^mail\.|^email\./, "");
      
      if (emailMainDomain === mainDomain || emailMainDomain.endsWith(`.${mainDomain}`)) {
        return { valid: true };
      }
    }
  }

  return {
    valid: false,
    error: `Email 域名與選擇的大學不匹配。請使用 ${universityName} 的官方 email 地址。`,
  };
}

/**
 * Extract domain from website URL
 */
function extractDomainFromWebsite(website: string): string | null {
  if (!website) return null;
  
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    // If URL parsing fails, try to extract domain manually
    const match = website.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1].toLowerCase() : null;
  }
}

/**
 * Get expected email domains for a university
 */
export function getExpectedEmailDomains(
  universityName: string,
  universityWebsite?: string
): string[] {
  const domains: string[] = [];
  
  if (universityWebsite) {
    const domain = extractDomainFromWebsite(universityWebsite);
    if (domain) {
      domains.push(domain);
      // Add common email subdomains
      domains.push(`mail.${domain}`);
      domains.push(`email.${domain}`);
    }
  }
  
  return domains;
}

