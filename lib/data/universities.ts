// Taiwan Universities Data with Rankings and Info

export interface University {
  id: string;
  name: string;
  nameEn: string;
  shortName: string;
  logo: string; // URL or emoji for MVP
  description: string;
  ranking: number; // Taiwan ranking
  website: string;
  location: string;
}

export const taiwanUniversities: University[] = [
  {
    id: "ntu",
    name: "國立台灣大學",
    nameEn: "National Taiwan University",
    shortName: "台大",
    logo: "🏛️", // Will be replaced with actual logo URL
    description: "台灣最頂尖的綜合型大學，QS 世界排名前 100",
    ranking: 1,
    website: "https://www.ntu.edu.tw",
    location: "台北市",
  },
  {
    id: "nthu",
    name: "國立清華大學",
    nameEn: "National Tsing Hua University",
    shortName: "清大",
    logo: "🎓",
    description: "以理工科聞名的頂尖研究型大學",
    ranking: 2,
    website: "https://www.nthu.edu.tw",
    location: "新竹市",
  },
  {
    id: "nctu",
    name: "國立陽明交通大學",
    nameEn: "National Yang Ming Chiao Tung University",
    shortName: "陽明交大",
    logo: "🔬",
    description: "由陽明大學與交通大學合併，理工醫學並重",
    ranking: 3,
    website: "https://www.nycu.edu.tw",
    location: "新竹市/台北市",
  },
  {
    id: "ncku",
    name: "國立成功大學",
    nameEn: "National Cheng Kung University",
    shortName: "成大",
    logo: "🏫",
    description: "南部首屈一指的綜合型大學",
    ranking: 4,
    website: "https://www.ncku.edu.tw",
    location: "台南市",
  },
  {
    id: "ncu",
    name: "國立中央大學",
    nameEn: "National Central University",
    shortName: "中央",
    logo: "📚",
    description: "歷史悠久的綜合型大學",
    ranking: 5,
    website: "https://www.ncu.edu.tw",
    location: "桃園市",
  },
  {
    id: "nsysu",
    name: "國立中山大學",
    nameEn: "National Sun Yat-sen University",
    shortName: "中山",
    logo: "🌊",
    description: "位於高雄的濱海大學",
    ranking: 6,
    website: "https://www.nsysu.edu.tw",
    location: "高雄市",
  },
  {
    id: "nchu",
    name: "國立中興大學",
    nameEn: "National Chung Hsing University",
    shortName: "中興",
    logo: "🌳",
    description: "農業與生命科學領域的重點大學",
    ranking: 7,
    website: "https://www.nchu.edu.tw",
    location: "台中市",
  },
  {
    id: "ntnu",
    name: "國立台灣師範大學",
    nameEn: "National Taiwan Normal University",
    shortName: "師大",
    logo: "👨‍🏫",
    description: "台灣師資培育的搖籃",
    ranking: 8,
    website: "https://www.ntnu.edu.tw",
    location: "台北市",
  },
  {
    id: "ncu-taipei",
    name: "國立政治大學",
    nameEn: "National Chengchi University",
    shortName: "政大",
    logo: "⚖️",
    description: "人文社會科學領域的頂尖大學",
    ranking: 9,
    website: "https://www.nccu.edu.tw",
    location: "台北市",
  },
  {
    id: "tku",
    name: "淡江大學",
    nameEn: "Tamkang University",
    shortName: "淡江",
    logo: "🏰",
    description: "歷史悠久的私立綜合型大學",
    ranking: 10,
    website: "https://www.tku.edu.tw",
    location: "新北市",
  },
  // Add more universities as needed
];

export function searchUniversities(query: string): University[] {
  if (!query) return taiwanUniversities.slice(0, 5);
  
  const lowerQuery = query.toLowerCase();
  return taiwanUniversities.filter(
    (uni) =>
      uni.name.includes(query) ||
      uni.nameEn.toLowerCase().includes(lowerQuery) ||
      uni.shortName.includes(query)
  ).slice(0, 5); // Limit to 5 results
}

export function getUniversityById(id: string): University | undefined {
  return taiwanUniversities.find((uni) => uni.id === id);
}

