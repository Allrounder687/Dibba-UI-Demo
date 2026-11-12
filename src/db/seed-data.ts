export interface NewsArticleRecord {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  category: "first_team" | "academy" | "club_news" | "community" | "other_sports";
  imageUrl: string;
  published: boolean;
  publishedAt: string;
}

export interface MatchRecord {
  id: number;
  competitionEn: string;
  competitionAr: string;
  homeTeamEn: string;
  homeTeamAr: string;
  homeLogo: string;
  awayTeamEn: string;
  awayTeamAr: string;
  awayLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "finished";
  kickoffAt: string;
  venueEn: string;
  venueAr: string;
  isNextMatch: boolean;
  isDemonstration: boolean;
}

export interface PlayerRecord {
  id: number;
  nameEn: string;
  nameAr: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "FWD" | "STAFF";
  squad: "first_team" | "u23" | "academy";
  nationalityEn: string;
  nationalityAr: string;
  imageUrl: string;
  appearances: number;
  goals: number;
  assists: number;
  bioEn: string;
  bioAr: string;
}

export interface EnquiryRecord {
  id: number;
  type: "academy" | "contact" | "sponsorship" | "ticket_interest" | "merch_order";
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  program?: string | null;
  playerAge?: string | null;
  message: string;
  status: "new" | "in_review" | "resolved";
  createdAt: string;
}

export interface SponsorRecord {
  id: number;
  nameEn: string;
  nameAr: string;
  tier: "principal" | "official" | "partner";
  logoUrl: string;
  websiteUrl: string;
}

export interface StandingRow {
  position: number;
  teamEn: string;
  teamAr: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
}

export interface AuditLogRecord {
  id: number;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  createdAt: string;
}

export interface MerchandiseItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  priceAed: number;
  imageUrl: string;
  badgeEn?: string;
  badgeAr?: string;
}

export const INITIAL_NEWS: NewsArticleRecord[] = [
  {
    id: 1,
    slug: "dibba-prepares-for-decisive-home-clash-at-dibba-stadium",
    titleEn: "First Team Intensifies Preparations Ahead of Home Clash at Dibba Stadium",
    titleAr: "الفريق الأول يكثف استعداداته للمواجهة المرتقبة على استاد دبا",
    excerptEn:
      "The technical staff led high-intensity tactical drills under the floodlights as the squad targets all three points in front of our home supporters.",
    excerptAr:
      "قاد الجهاز الفني تدريبات تكتيكية مكثفة تحت الأضواء الكاشفة مع تركيز اللاعبين على حصد النقاط الثلاث أمام جماهير النادي.",
    bodyEn:
      "Dibba Sports & Cultural Club's First Team completed its primary tactical session at Dibba Stadium this evening ahead of this weekend's First Division League fixture. Head coaching staff emphasized high pressing transitions, compact defensive lines, and clinical finishing in the final third.\n\nSupporters are invited to rally behind the squad at Dibba Stadium as the club continues its upward push in the league standings.",
    bodyAr:
      "اختتم الفريق الأول لنادي دبا الرياضي الثقافي حصته التدريبية الرئيسية على أرضية استاد دبا مساء اليوم، استعداداً لمواجهته المقبلة ضمن منافسات دوري الدرجة الأولى.\n\nوركز الجهاز الفني خلال المران على التنظيم الدفاعي والتحولات الهجومية السريعة واستغلال الكرات الثابتة، وسط روح معنوية عالية من جميع اللاعبين.",
    category: "first_team",
    imageUrl: "/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg",
    published: true,
    publishedAt: "2026-11-10T18:30:00+04:00",
  },
  {
    id: 2,
    slug: "dibba-youth-academy-hosts-east-coast-development-festival",
    titleEn: "Dibba Youth Academy Hosts East Coast Talent Development Festival",
    titleAr: "أكاديمية دبا تستضيف مهرجان تطوير المواهب الكروية بالساحل الشرقي",
    excerptEn:
      "Over 140 young footballers across U10, U12, and U14 age groups competed in a full-day technical showcase at Dibba Stadium training pitches.",
    excerptAr:
      "أكثر من 140 لاعباً ناشئاً من فئات تحت 10 و12 و14 سنة شاركوا في يوم رياضي متكامل على ملاعب التدريب باستاد دبا.",
    bodyEn:
      "In alignment with Dibba SCC's strategic orientation for sustainable talent development, the Football Academy welcomed regional youth squads to Dibba Stadium for an inspiring festival of football.\n\nScouts and academy directors evaluated technical fundamentals, teamwork, and sportsmanship across every match.",
    bodyAr:
      "في إطار التوجه الاستراتيجي لنادي دبا الرياضي الثقافي لتطوير المواهب الصاعدة، استضافت أكاديمية كرة القدم مهرجاناً كروياً ناجحاً بمشاركة فرق البراعم والناشئين.\n\nوشهدت الفعالية حضوراً جماهيرياً مميزاً من أولياء الأمور مع تقييم شامل للمهارات الفنية والروح الرياضية.",
    category: "academy",
    imageUrl: "/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg",
    published: true,
    publishedAt: "2026-11-07T19:00:00+04:00",
  },
  {
    id: 3,
    slug: "intense-derby-battle-against-al-hamriyah-under-the-lights",
    titleEn: "Resilient Performance in High-Tempo Clash Against Al Hamriyah",
    titleAr: "أداء قتالي مميز في المواجهة القوية أمام نادي الحمرية",
    excerptEn:
      "Action highlights and tactical takeaways from a fiercely contested league encounter marked by disciplined midfield transitions.",
    excerptAr:
      "لقطات وأبرز المحطات الفنية من المواجهة التنافسية القوية التي شهدت انضباطاً تكتيكياً عالياً في خط الوسط.",
    bodyEn:
      "Dibba FC showcased strong physical conditioning and tactical discipline against Al Hamriyah. Full match statistics, recovery sessions, and upcoming fixture analysis are now available in the Match Center.",
    bodyAr:
      "أظهر لاعبو دبا جاهزية بدنية عالية وانضباطاً تكتيكياً لافتاً أمام نادي الحمرية، مع استعراض أبرز الإحصائيات الفنية والاستعداد للجولة القادمة عبر مركز المباريات.",
    category: "first_team",
    imageUrl: "/assets/IMG-20261107-WA0004-rvzyvxah4hvo0qod5hnd9jg7xfu2o6z6cdrxh1j1n2.jpg",
    published: true,
    publishedAt: "2026-11-06T21:15:00+04:00",
  },
  {
    id: 4,
    slug: "dibba-cultural-division-chess-championship-success",
    titleEn: "Cultural & Mind Sports Division Concludes Autumn Chess Championship",
    titleAr: "اللجنة الثقافية بنادي دبا تختتم بطولة الخريف للشطرنج بنجاح",
    excerptEn:
      "Youth participants demonstrated strategic focus and community spirit during the club's quarterly cultural and intellectual sports series.",
    excerptAr:
      "مشاركة مميزة من النشء في منافسات الشطرنج التي تعكس التزام النادي بدمج الرياضات الذهنية والثقافية.",
    bodyEn:
      "Beyond football, Dibba Sports & Cultural Club remains committed to nurturing well-rounded youth through cultural programs, chess tournaments, swimming, and table tennis.",
    bodyAr:
      "إلى جانب كرة القدم، يواصل نادي دبا الرياضي الثقافي رسالته المجتمعية في رعاية الشباب عبر البرامج الثقافية وبطولات الشطرنج والسباحة وتنس الطاولة.",
    category: "other_sports",
    imageUrl: "/assets/WhatsApp-Image-2026-11-10-at-6.05.56-PM-rw5nmdbqlfgp28oyxelynmtqxfuj3j4ucp7rxpanta.jpeg",
    published: true,
    publishedAt: "2026-11-03T16:45:00+04:00",
  },
];

export const INITIAL_MATCHES: MatchRecord[] = [
  {
    id: 1,
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Dibba FC",
    homeTeamAr: "نادي دبا",
    homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
    awayTeamEn: "Fujairah FC",
    awayTeamAr: "نادي الفجيرة",
    awayLogo: "/assets/fujairah-web-logo.png",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    kickoffAt: "2026-11-20T18:30:00+04:00",
    venueEn: "Dibba Stadium, Dibba Al Fujairah",
    venueAr: "استاد دبا، دبا الفجيرة",
    isNextMatch: true,
    isDemonstration: true,
  },
  {
    id: 2,
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Dibba FC",
    homeTeamAr: "نادي دبا",
    homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
    awayTeamEn: "Al Hamriyah",
    awayTeamAr: "الحمرية",
    awayLogo: "/assets/al-hamriyah-web-logo.png",
    homeScore: 2,
    awayScore: 1,
    status: "finished",
    kickoffAt: "2026-11-07T17:45:00+04:00",
    venueEn: "Dibba Stadium, Dibba Al Fujairah",
    venueAr: "استاد دبا، دبا الفجيرة",
    isNextMatch: false,
    isDemonstration: true,
  },
  {
    id: 3,
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Al Arabi",
    homeTeamAr: "العربي",
    homeLogo: "/assets/al-arabi-web-logo.png",
    awayTeamEn: "Dibba FC",
    awayTeamAr: "نادي دبا",
    awayLogo: "/assets/dibba-fc-logo-glossly-750.png",
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    kickoffAt: "2026-11-28T17:30:00+04:00",
    venueEn: "Al Arabi Stadium, Umm Al Quwain",
    venueAr: "ملعب العربي، أم القيوين",
    isNextMatch: false,
    isDemonstration: true,
  },
  {
    id: 4,
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Emirates Club",
    homeTeamAr: "نادي الإمارات",
    homeLogo: "/assets/emirates-web-logo.png",
    awayTeamEn: "Dibba FC",
    awayTeamAr: "نادي دبا",
    awayLogo: "/assets/dibba-fc-logo-glossly-750.png",
    homeScore: 1,
    awayScore: 1,
    status: "finished",
    kickoffAt: "2026-10-31T18:00:00+04:00",
    venueEn: "Emirates Club Stadium, RAK",
    venueAr: "ملعب نادي الإمارات، رأس الخيمة",
    isNextMatch: false,
    isDemonstration: true,
  },
  {
    id: 5,
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Dibba FC",
    homeTeamAr: "نادي دبا",
    homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
    awayTeamEn: "Al Dhaid",
    awayTeamAr: "الذيد",
    awayLogo: "/assets/al-dhaid-web-logo.png",
    homeScore: 3,
    awayScore: 0,
    status: "finished",
    kickoffAt: "2026-10-24T17:45:00+04:00",
    venueEn: "Dibba Stadium, Dibba Al Fujairah",
    venueAr: "استاد دبا، دبا الفجيرة",
    isNextMatch: false,
    isDemonstration: true,
  },
];

export const INITIAL_PLAYERS: PlayerRecord[] = [
  {
    id: 1,
    nameEn: "Habib Yousuf",
    nameAr: "حبيب يوسف محمد عبدالله",
    number: 18,
    position: "MID",
    squad: "first_team",
    nationalityEn: "United Arab Emirates",
    nationalityAr: "الإمارات العربية المتحدة",
    imageUrl: "/assets/player-mid-cutout.png",
    appearances: 14,
    goals: 4,
    assists: 6,
    bioEn: "Experienced UAE midfielder known for tactical intelligence, set-piece precision, and midfield composure.",
    bioAr: "لاعب خط وسط إماراتي يتميز بالرؤية التكتيكية العالية والدقة في الكرات الثابتة وبناء اللعب.",
  },
  {
    id: 2,
    nameEn: "Tafadzwa Dhliwayo",
    nameAr: "تافادزوا دهليوايو",
    number: 15,
    position: "FWD",
    squad: "first_team",
    nationalityEn: "Zimbabwe",
    nationalityAr: "زيمبابوي",
    imageUrl: "/assets/player-fwd-cutout.png",
    appearances: 12,
    goals: 7,
    assists: 3,
    bioEn: "Dynamic forward bringing explosive pace, direct wing play, and clinical finishing in high-stakes fixtures.",
    bioAr: "مهاجم سريع يتميز بالاختراقات المباشرة والفاعلية التهديفية العالية أمام المرمى.",
  },
  {
    id: 3,
    nameEn: "Rashed Al-Khodaim",
    nameAr: "راشد الخديم",
    number: 1,
    position: "GK",
    squad: "first_team",
    nationalityEn: "United Arab Emirates",
    nationalityAr: "الإمارات العربية المتحدة",
    imageUrl: "/assets/player-gk-cutout.png",
    appearances: 15,
    goals: 0,
    assists: 0,
    bioEn: "Shot-stopper with commanding box presence, sharp reflexes, and leadership from the backline.",
    bioAr: "حارس مرمى متألق يتميز بردود فعل سريعة وحضور قيادي في منطقة الجزاء.",
  },
  {
    id: 4,
    nameEn: "Luka Petrovic",
    nameAr: "لوكا بيتروفيتش",
    number: 5,
    position: "DEF",
    squad: "first_team",
    nationalityEn: "Serbia",
    nationalityAr: "صربيا",
    imageUrl: "/assets/player-def-cutout.png",
    appearances: 13,
    goals: 2,
    assists: 1,
    bioEn: "Aerial dominant center-back anchoring the defensive unit with progressive passing out from the back.",
    bioAr: "مدافع صلب يمتاز بالتفوق في الكرات الهوائية وبناء الهجمات من الخلف.",
  },
  {
    id: 5,
    nameEn: "First Team Head Coach",
    nameAr: "المدير الفني للفريق الأول",
    number: 99,
    position: "STAFF",
    squad: "first_team",
    nationalityEn: "Dibba SCC Technical Directorate",
    nationalityAr: "الجهاز الفني لنادي دبا",
    imageUrl: "/assets/Screenshot-2026-10-25-190154.png",
    appearances: 15,
    goals: 0,
    assists: 0,
    bioEn: "Pro-licensed head coach leading first-team tactical preparation, match analysis, and youth pathway integration.",
    bioAr: "المدير الفني المحترف المسؤول عن الإعداد التكتيكي للفريق الأول وتحليل المباريات.",
  },
  {
    id: 6,
    nameEn: "Dibba Youth Academy U18",
    nameAr: "أكاديمية نادي دبا تحت 18 سنة",
    number: 23,
    position: "MID",
    squad: "academy",
    nationalityEn: "United Arab Emirates",
    nationalityAr: "الإمارات العربية المتحدة",
    imageUrl: "/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg",
    appearances: 11,
    goals: 3,
    assists: 4,
    bioEn: "Graduating academy prospects progressing directly into Dibba U23 and First Team matchday squads.",
    bioAr: "مواهب أكاديمية نادي دبا الصاعدة نحو فريق تحت 23 سنة والفريق الأول.",
  },
];

export const INITIAL_SPONSORS: SponsorRecord[] = [
  {
    id: 1,
    nameEn: "Fujairah Investment Est.",
    nameAr: "مؤسسة الفجيرة للاستثمار",
    tier: "principal",
    logoUrl: "/assets/fujairah-investment.jpg",
    websiteUrl: "https://dibbaclub.ae",
  },
  {
    id: 2,
    nameEn: "UAE Football Association",
    nameAr: "اتحاد الإمارات لكرة القدم",
    tier: "partner",
    logoUrl: "/assets/FIRST-DIVISION-LEAGUE-LOGO-2.png",
    websiteUrl: "https://www.uaefa.ae/",
  },
  {
    id: 3,
    nameEn: "Dibba Digital Media",
    nameAr: "المركز الإعلامي لنادي دبا",
    tier: "official",
    logoUrl: "/assets/logo-blue-for-footer.png",
    websiteUrl: "https://dibbaclub.ae",
  },
];

export const DEMO_STANDINGS: StandingRow[] = [
  {
    position: 1,
    teamEn: "Dibba FC",
    teamAr: "نادي دبا",
    logo: "/assets/dibba-fc-logo-glossly-750.png",
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalDiff: 14,
    points: 23,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    position: 2,
    teamEn: "Al Bataeh",
    teamAr: "البطائح",
    logo: "/assets/al-bataeh-web-logo.png",
    played: 10,
    won: 6,
    drawn: 3,
    lost: 1,
    goalDiff: 11,
    points: 21,
    form: ["W", "D", "W", "W", "D"],
  },
  {
    position: 3,
    teamEn: "Fujairah FC",
    teamAr: "نادي الفجيرة",
    logo: "/assets/fujairah-web-logo.png",
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goalDiff: 8,
    points: 20,
    form: ["L", "W", "W", "D", "W"],
  },
  {
    position: 4,
    teamEn: "Emirates Club",
    teamAr: "نادي الإمارات",
    logo: "/assets/emirates-web-logo.png",
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    goalDiff: 6,
    points: 18,
    form: ["D", "W", "L", "W", "D"],
  },
  {
    position: 5,
    teamEn: "Al Hamriyah",
    teamAr: "الحمرية",
    logo: "/assets/al-hamriyah-web-logo.png",
    played: 10,
    won: 5,
    drawn: 2,
    lost: 3,
    goalDiff: 4,
    points: 17,
    form: ["W", "L", "W", "L", "W"],
  },
  {
    position: 6,
    teamEn: "Al Arabi",
    teamAr: "العربي",
    logo: "/assets/al-arabi-web-logo.png",
    played: 10,
    won: 4,
    drawn: 3,
    lost: 3,
    goalDiff: 2,
    points: 15,
    form: ["D", "L", "W", "D", "W"],
  },
  {
    position: 7,
    teamEn: "Dibba Al-Hisn",
    teamAr: "دبا الحصن",
    logo: "/assets/diba-al-hissn-web-logo.png",
    played: 10,
    won: 4,
    drawn: 2,
    lost: 4,
    goalDiff: 0,
    points: 14,
    form: ["L", "W", "D", "L", "W"],
  },
  {
    position: 8,
    teamEn: "Al Dhaid",
    teamAr: "الذيد",
    logo: "/assets/al-dhaid-web-logo.png",
    played: 10,
    won: 3,
    drawn: 2,
    lost: 5,
    goalDiff: -5,
    points: 11,
    form: ["L", "L", "W", "D", "L"],
  },
];

export const MERCHANDISE_CATALOG: MerchandiseItem[] = [
  {
    id: "home-kit-2026",
    slug: "dibba-home-kit-2026",
    nameEn: "2026 Official Home Jersey",
    nameAr: "القميص الأساسي الرسمي 2026",
    categoryEn: "Match Kits",
    categoryAr: "أطقم المباريات",
    priceAed: 245,
    imageUrl: "/assets/home-kit-cutout.png",
    badgeEn: "Official Uhlsport",
    badgeAr: "إصدار رسمي",
  },
  {
    id: "away-kit-2026",
    slug: "dibba-away-kit-2026",
    nameEn: "2026 Official Away Jersey",
    nameAr: "القميص الاحتياطي الرسمي 2026",
    categoryEn: "Match Kits",
    categoryAr: "أطقم المباريات",
    priceAed: 245,
    imageUrl: "/assets/away-kit-cutout.png",
    badgeEn: "New Season",
    badgeAr: "موسم 2026",
  },
  {
    id: "club-hoodie",
    slug: "dibba-club-hoodie",
    nameEn: "Dibba SCC Crest Hoodie",
    nameAr: "هودي نادي دبا الرسمي",
    categoryEn: "Training & Travel",
    categoryAr: "ملابس التدريب",
    priceAed: 195,
    imageUrl: "/assets/Hoodie-3.jpg",
  },
  {
    id: "training-tee",
    slug: "dibba-training-tshirt",
    nameEn: "Dibba Training Tee",
    nameAr: "تيشيرت التدريب الرياضي",
    categoryEn: "Training & Travel",
    categoryAr: "ملابس التدريب",
    priceAed: 120,
    imageUrl: "/assets/t-shirt-1-3.jpg",
  },
  {
    id: "supporter-scarf",
    slug: "dibba-supporter-scarf",
    nameEn: "Matchday Supporter Scarf",
    nameAr: "وشاح جماهير نادي دبا",
    categoryEn: "Accessories",
    categoryAr: "إكسسوارات وهدايا",
    priceAed: 65,
    imageUrl: "/assets/scraf-3.jpg",
  },
  {
    id: "club-cap",
    slug: "dibba-club-cap",
    nameEn: "Official Embroidered Cap",
    nameAr: "قبعة شعار النادي المطرزة",
    categoryEn: "Accessories",
    categoryAr: "إكسسوارات وهدايا",
    priceAed: 75,
    imageUrl: "/assets/cap-1-3.jpg",
  },
  {
    id: "club-mug",
    slug: "dibba-collector-mug",
    nameEn: "1967 Heritage Ceramic Mug",
    nameAr: "كوب التراث 1967",
    categoryEn: "Accessories",
    categoryAr: "إكسسوارات وهدايا",
    priceAed: 45,
    imageUrl: "/assets/mug-3.jpg",
  },
  {
    id: "club-pillow",
    slug: "dibba-crest-cushion",
    nameEn: "Dibba Crest Velvet Cushion",
    nameAr: "وسادة شعار نادي دبا",
    categoryEn: "Accessories",
    categoryAr: "إكسسوارات وهدايا",
    priceAed: 85,
    imageUrl: "/assets/pillow-3.jpg",
  },
];
