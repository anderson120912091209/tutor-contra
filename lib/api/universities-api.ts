// Global University Search API Integration

export interface UniversityAPIResult {
  name: string;
  country: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  state_province?: string;
}

export interface UniversitySearchResult {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  website: string;
  location: string;
  logo: string;
  isLocal: boolean; // 是否是本地台湾大学
}

/**
 * Search universities using Hipolabs University API
 * Free API with 9000+ universities worldwide
 * API: http://universities.hipolabs.com/
 */
export async function searchUniversitiesGlobal(
  query: string,
  country?: string
): Promise<UniversitySearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const params = new URLSearchParams({ name: query });
    if (country) {
      params.append('country', country);
    }

    const response = await fetch(
      `http://universities.hipolabs.com/search?${params.toString()}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) return [];

    const data: UniversityAPIResult[] = await response.json();

    return data.slice(0, 10).map((uni) => ({
      id: generateUniversityId(uni.name),
      name: uni.name,
      nameEn: uni.name,
      country: uni.country,
      website: uni.web_pages[0] || '',
      location: uni.state_province || uni.country,
      logo: getCountryFlag(uni.alpha_two_code),
      isLocal: false,
    }));
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
}

/**
 * Search by country
 */
export async function searchUniversitiesByCountry(
  country: string
): Promise<UniversitySearchResult[]> {
  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) return [];

    const data: UniversityAPIResult[] = await response.json();

    return data.slice(0, 20).map((uni) => ({
      id: generateUniversityId(uni.name),
      name: uni.name,
      nameEn: uni.name,
      country: uni.country,
      website: uni.web_pages[0] || '',
      location: uni.state_province || uni.country,
      logo: getCountryFlag(uni.alpha_two_code),
      isLocal: false,
    }));
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    return [];
  }
}

/**
 * Generate a unique ID for a university
 */
function generateUniversityId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get country flag emoji
 */
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Popular countries for quick access
 */
export const POPULAR_COUNTRIES = [
  { code: 'TW', name: '台灣', nameEn: 'Taiwan' },
  { code: 'US', name: '美國', nameEn: 'United States' },
  { code: 'GB', name: '英國', nameEn: 'United Kingdom' },
  { code: 'CA', name: '加拿大', nameEn: 'Canada' },
  { code: 'AU', name: '澳洲', nameEn: 'Australia' },
  { code: 'JP', name: '日本', nameEn: 'Japan' },
  { code: 'KR', name: '韓國', nameEn: 'South Korea' },
  { code: 'SG', name: '新加坡', nameEn: 'Singapore' },
  { code: 'CN', name: '中國', nameEn: 'China' },
  { code: 'DE', name: '德國', nameEn: 'Germany' },
  { code: 'FR', name: '法國', nameEn: 'France' },
];

