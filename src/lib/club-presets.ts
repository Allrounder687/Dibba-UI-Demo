export interface ClubPreset {
  id: string;
  nameEn: string;
  nameAr: string;
  logo: string;
  stadiumEn: string;
  stadiumAr: string;
}

export interface CuratedAsset {
  url: string;
  label: string;
  category: "player" | "crest" | "match" | "kit";
}

export const UAE_CLUB_PRESETS: ClubPreset[] = [
  {
    id: "dibba-fc",
    nameEn: "Dibba FC",
    nameAr: "نادي دبا",
    logo: "/assets/dibba-fc-logo-glossly-750.png",
    stadiumEn: "Dibba Stadium, Dibba Al Fujairah",
    stadiumAr: "استاد دبا، دبا الفجيرة",
  },
  {
    id: "fujairah-fc",
    nameEn: "Fujairah FC",
    nameAr: "نادي الفجيرة",
    logo: "/assets/fujairah-web-logo.png",
    stadiumEn: "Fujairah Stadium, Fujairah",
    stadiumAr: "استاد الفجيرة، الفجيرة",
  },
  {
    id: "al-hamriyah",
    nameEn: "Al Hamriyah",
    nameAr: "الحمرية",
    logo: "/assets/al-hamriyah-web-logo.png",
    stadiumEn: "Al Hamriyah Sports Club Stadium",
    stadiumAr: "ملعب نادي الحمرية",
  },
  {
    id: "al-arabi",
    nameEn: "Al Arabi",
    nameAr: "العربي",
    logo: "/assets/al-arabi-web-logo.png",
    stadiumEn: "Al Arabi Stadium, Umm Al Quwain",
    stadiumAr: "ملعب العربي، أم القيوين",
  },
  {
    id: "emirates-club",
    nameEn: "Emirates Club",
    nameAr: "نادي الإمارات",
    logo: "/assets/emirates-web-logo.png",
    stadiumEn: "Emirates Club Stadium, RAK",
    stadiumAr: "ملعب نادي الإمارات، رأس الخيمة",
  },
  {
    id: "al-bataeh",
    nameEn: "Al Bataeh",
    nameAr: "البطائح",
    logo: "/assets/al-bataeh-web-logo.png",
    stadiumEn: "Al Bataeh Cultural & Sports Club Stadium",
    stadiumAr: "ملعب نادي البطائح",
  },
  {
    id: "dibba-al-hisn",
    nameEn: "Dibba Al-Hisn",
    nameAr: "دبا الحصن",
    logo: "/assets/diba-al-hissn-web-logo.png",
    stadiumEn: "Dibba Al-Hisn Stadium",
    stadiumAr: "ملعب دبا الحصن",
  },
  {
    id: "al-dhaid",
    nameEn: "Al Dhaid",
    nameAr: "الذيد",
    logo: "/assets/al-dhaid-web-logo.png",
    stadiumEn: "Al Dhaid Cultural & Sports Club Stadium",
    stadiumAr: "ملعب نادي الذيد",
  },
  {
    id: "al-jazira-al-hamra",
    nameEn: "Al Jazira Al Hamra",
    nameAr: "الجزيرة الحمراء",
    logo: "/assets/al-jazira-al-hamra-web-logo.png",
    stadiumEn: "Al Jazira Al Hamra Stadium, RAK",
    stadiumAr: "ملعب الجزيرة الحمراء",
  },
  {
    id: "al-orooba",
    nameEn: "Al Orooba",
    nameAr: "العروبة",
    logo: "/assets/Al-Orooba.png",
    stadiumEn: "Al Orooba Stadium, Fujairah",
    stadiumAr: "ملعب العروبة، الفجيرة",
  },
  {
    id: "gulf-united",
    nameEn: "Gulf United",
    nameAr: "جلف يونايتد",
    logo: "/assets/gulf-united-web-logo.png",
    stadiumEn: "Dubai Sports City Stadium",
    stadiumAr: "ملعب مدينة دبي الرياضية",
  },
];

export const CURATED_MEDIA_ASSETS: CuratedAsset[] = [
  // Player cutouts
  { url: "/assets/player-mid-cutout.png", label: "Midfielder Cutout (#18)", category: "player" },
  { url: "/assets/player-fwd-cutout.png", label: "Forward Cutout (#15)", category: "player" },
  { url: "/assets/player-gk-cutout.png", label: "Goalkeeper Cutout (#1)", category: "player" },
  { url: "/assets/player-def-cutout.png", label: "Defender Cutout (#5)", category: "player" },
  { url: "/assets/15-1.png", label: "Squad Portrait 15", category: "player" },
  { url: "/assets/1-1.png", label: "Squad Portrait 1", category: "player" },
  { url: "/assets/2-1.png", label: "Squad Portrait 2", category: "player" },
  { url: "/assets/3-4.png", label: "Squad Portrait 3", category: "player" },
  { url: "/assets/4.png", label: "Squad Portrait 4", category: "player" },
  { url: "/assets/5-3.png", label: "Squad Portrait 5", category: "player" },
  { url: "/assets/Screenshot-2026-10-25-190154.png", label: "Head Coach Portrait", category: "player" },
  // Match & Club photos
  {
    url: "/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg",
    label: "First Team Stadium Celebration",
    category: "match",
  },
  {
    url: "/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg",
    label: "Dibba Youth Academy Festival",
    category: "match",
  },
  {
    url: "/assets/IMG-20261107-WA0004-rvzyvxah4hvo0qod5hnd9jg7xfu2o6z6cdrxh1j1n2.jpg",
    label: "Matchday Action",
    category: "match",
  },
  {
    url: "/assets/WhatsApp-Image-2026-11-10-at-6.05.56-PM-rw5nmdbqlfgp28oyxelynmtqxfuj3j4ucp7rxpanta.jpeg",
    label: "Cultural & Mind Sports",
    category: "match",
  },
  {
    url: "/assets/12222222.jpg",
    label: "Dibba Stadium Training",
    category: "match",
  },
  {
    url: "/assets/chairman-portrait.jpg",
    label: "Chairman Portrait",
    category: "match",
  },
  // Crests & Kits
  { url: "/assets/dibba-fc-logo-glossly-750.png", label: "Dibba FC Gloss Crest", category: "crest" },
  { url: "/assets/home-kit-cutout.png", label: "2026 Home Jersey Cutout", category: "kit" },
  { url: "/assets/away-kit-cutout.png", label: "2026 Away Jersey Cutout", category: "kit" },
];
