export type Locale = "en" | "ar";

export function isValidLocale(val: string): val is Locale {
  return val === "en" || val === "ar";
}

export interface Dictionary {
  meta: {
    siteName: string;
    tagline: string;
    description: string;
  };
  nav: {
    home: string;
    matches: string;
    teams: string;
    academy: string;
    club: string;
    news: string;
    shop: string;
    tickets: string;
    contact: string;
    admin: string;
    switchLang: string;
  };
  hero: {
    established: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stadiumLabel: string;
  };
  matches: {
    nextMatch: string;
    lastResult: string;
    demoBadge: string;
    fullMatchCenter: string;
    upcomingFixtures: string;
    recentResults: string;
    leagueTable: string;
    kickoff: string;
    venue: string;
    vs: string;
    fullTime: string;
    scheduled: string;
    pos: string;
    club: string;
    played: string;
    won: string;
    drawn: string;
    lost: string;
    gd: string;
    pts: string;
    form: string;
    matchDetails: string;
    reserveSeats: string;
  };
  squad: {
    sectionEyebrow: string;
    sectionTitle: string;
    viewAllSquad: string;
    firstTeam: string;
    u23: string;
    academy: string;
    allPositions: string;
    gk: string;
    def: string;
    mid: string;
    fwd: string;
    staff: string;
    appearances: string;
    goals: string;
    assists: string;
    nationality: string;
    closeProfile: string;
  };
  academy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    registerCta: string;
    programs: {
      title: string;
      ageGroup: string;
      schedule: string;
      description: string;
    }[];
    otherSportsTitle: string;
    otherSports: {
      title: string;
      subtitle: string;
      description: string;
    }[];
    formTitle: string;
    formSubtitle: string;
  };
  club: {
    eyebrow: string;
    title: string;
    chairmansTitle: string;
    chairmanName: string;
    chairmanRole: string;
    chairmanQuote: string;
    chairmanBody: string[];
    historyTitle: string;
    historyBody: string;
    heritageCaption: string;
    milestones: { year: string; title: string; desc: string }[];
    stadiumTitle: string;
    stadiumDesc: string;
    stadiumSpecs: { label: string; value: string }[];
    boardTitle: string;
    boardMembers: { name: string; role: string }[];
  };
  news: {
    eyebrow: string;
    title: string;
    viewAll: string;
    readArticle: string;
    searchPlaceholder: string;
    allCategories: string;
    categories: Record<string, string>;
    galleryTitle: string;
    noResults: string;
    backToNews: string;
  };
  commercial: {
    shopTitle: string;
    shopSubtitle: string;
    foundationNotice: string;
    reserveItem: string;
    ticketsTitle: string;
    ticketsSubtitle: string;
    ticketsNotice: string;
    selectStand: string;
    stands: { id: string; name: string; price: string; desc: string }[];
    sponsorshipTitle: string;
    sponsorshipSubtitle: string;
  };
  forms: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    program: string;
    playerAge: string;
    message: string;
    consent: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
  };
  footer: {
    about: string;
    address: string;
    sponsorsTitle: string;
    quickLinks: string;
    governance: string;
    copyright: string;
  };
  interactive: {
    countdownDays: string;
    countdownHours: string;
    countdownMins: string;
    countdownSecs: string;
    matchdayLive: string;
    buildXiCta: string;
    kitStudioCta: string;
    tacticalEyebrow: string;
    tacticalTitle: string;
    tacticalSubtitle: string;
    tabRoster: string;
    tabTactical: string;
    formationLabel: string;
    autoPick: string;
    chemistryLabel: string;
    attackLabel: string;
    defenseLabel: string;
    tapSlotHint: string;
    swapPlayerTitle: string;
    inspectDossier: string;
    predictorTitle: string;
    homeWin: string;
    draw: string;
    awayWin: string;
    fansVoted: string;
    kitEyebrow: string;
    kitTitle: string;
    kitSubtitle: string;
    homeKitLabel: string;
    awayKitLabel: string;
    backNameLabel: string;
    squadNumberLabel: string;
    sizeLabel: string;
    lockKitButton: string;
    stadiumMapEyebrow: string;
    stadiumMapTitle: string;
    stadiumMapSubtitle: string;
    pitchLabel: string;
    reserveStandButton: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      siteName: "Dibba Sports & Cultural Club",
      tagline: "Est. 1967 · Dibba Al Fujairah",
      description:
        "Official digital platform of Dibba Sports & Cultural Club (Dibba SCC). Match Center, First Team, Youth Academy, Club Heritage, and Commercial Hub.",
    },
    nav: {
      home: "Home",
      matches: "Match Center",
      teams: "Teams",
      academy: "Academy & Sports",
      club: "The Club",
      news: "News & Media",
      shop: "Store",
      tickets: "Tickets",
      contact: "Contact",
      admin: "CMS Portal",
      switchLang: "العربية",
    },
    hero: {
      established: "EST. 1967 · DIBBA AL FUJAIRAH, UAE",
      title: "Pride of the East Coast",
      subtitle:
        "Rooted in heritage since 1967, driven by elite football ambition, youth development, and community excellence at Dibba Stadium.",
      ctaPrimary: "Match Center",
      ctaSecondary: "Join Academy",
      stadiumLabel: "Home Ground: Dibba Stadium · Capacity 9,000+",
    },
    matches: {
      nextMatch: "Next Fixture",
      lastResult: "Latest Result",
      demoBadge: "Demonstration Schedule · Live API Ready",
      fullMatchCenter: "Full Match Center",
      upcomingFixtures: "Upcoming Fixtures",
      recentResults: "Recent Results",
      leagueTable: "League Standings",
      kickoff: "Kickoff (UAE)",
      venue: "Venue",
      vs: "VS",
      fullTime: "FT",
      scheduled: "Scheduled",
      pos: "Pos",
      club: "Club",
      played: "P",
      won: "W",
      drawn: "D",
      lost: "L",
      gd: "GD",
      pts: "Pts",
      form: "Form",
      matchDetails: "Match Details",
      reserveSeats: "Request Match Seats",
    },
    squad: {
      sectionEyebrow: "2026 Season Roster",
      sectionTitle: "First Team & Technical Staff",
      viewAllSquad: "Explore All Squads",
      firstTeam: "First Team",
      u23: "U23 Squad",
      academy: "Academy",
      allPositions: "All",
      gk: "Goalkeepers",
      def: "Defenders",
      mid: "Midfielders",
      fwd: "Forwards",
      staff: "Coaching Staff",
      appearances: "Apps",
      goals: "Goals",
      assists: "Assists",
      nationality: "Nationality",
      closeProfile: "Close Profile",
    },
    academy: {
      eyebrow: "Youth Development & Multi-Sport",
      title: "Dibba Academy & Sports Programs",
      subtitle:
        "Structured athletic pathways across Football, Swimming, Table Tennis, and Athletics under licensed UAE and international coaching staff.",
      registerCta: "Submit Academy Application",
      programs: [
        {
          title: "Football Academy (U9 – U14)",
          ageGroup: "Ages 7 – 14",
          schedule: "Sun / Tue / Thu · 17:00 – 18:30",
          description:
            "Foundational ball mastery, spatial awareness, and competitive East Coast festival matches.",
        },
        {
          title: "Youth Development (U15 – U18)",
          ageGroup: "Ages 15 – 18",
          schedule: "Mon – Thu · 18:00 – 19:45",
          description:
            "Tactical periodization, strength conditioning, and direct pathway to Dibba U23 and First Team.",
        },
        {
          title: "Private Football Academy",
          ageGroup: "Ages 6 – 16",
          schedule: "Evening & Weekend Cohorts",
          description:
            "Small-group technical coaching, goalkeeper clinics, and individualized performance reports.",
        },
      ],
      otherSportsTitle: "Olympic & Cultural Disciplines",
      otherSports: [
        {
          title: "Swimming",
          subtitle: "Competitive & Foundation",
          description: "Structured lap technique, endurance conditioning, and UAE federation galas.",
        },
        {
          title: "Table Tennis",
          subtitle: "Youth & Senior Teams",
          description: "High-speed reflex training, spin mechanics, and national league representation.",
        },
        {
          title: "Athletics & Mind Sports",
          subtitle: "Track, Field & Chess",
          description: "Sprint mechanics, endurance track programs, and cultural chess tournaments.",
        },
      ],
      formTitle: "Academy & Sports Registration",
      formSubtitle: "Applications are reviewed directly by the Dibba SCC Academy Directorate.",
    },
    club: {
      eyebrow: "Identity & Governance",
      title: "Dibba Sports & Cultural Club",
      chairmansTitle: "Chairman's Message",
      chairmanName: "H.E. Ahmed Saeed Al-Dhanhani",
      chairmanRole: "Chairman of the Board of Directors",
      chairmanQuote:
        "Since our founding as the Union of Sport Gulf in 1967, Dibba SCC has stood as a beacon of sportsmanship, unity, and ambition for our city.",
      chairmanBody: [
        "Welcome to the official digital home of Dibba Sports & Cultural Club. Established in February 1967 through the dedication of Dibba Al Fujairah's sporting pioneers under the name 'Union of Sport Gulf', our club has grown into a cornerstone of UAE athletics and community culture.",
        "Guided by the vision of the UAE leadership and the Government of Fujairah, our strategic orientation focuses on modern governance, sustainable youth academy investment, and competitive excellence across football and Olympic disciplines.",
      ],
      historyTitle: "Heritage Since 1967",
      historyBody:
        "From humble grassroots pitches in 1967 to competing in the UAE's premier football divisions inside the modern Dibba Stadium.",
      heritageCaption: "Original 1967 Union Gulf Sports Club Founding Emblem",
      milestones: [
        {
          year: "1967",
          title: "Foundation as Union of Sport Gulf",
          desc: "Established on 9 February 1967 by local visionaries in Dibba Al Fujairah.",
        },
        {
          year: "1976",
          title: "Official Incorporation & Merger",
          desc: "Unified local sporting initiatives under Dibba Sports & Cultural Club.",
        },
        {
          year: "2015–2024",
          title: "UAE Pro League & First Division Titles",
          desc: "Multiple First Division League championships and top-flight campaigns.",
        },
        {
          year: "2026",
          title: "Next-Generation Digital & Stadium Era",
          desc: "Modernized Dibba Stadium facilities, youth pathways, and digital ecosystem.",
        },
      ],
      stadiumTitle: "Dibba Stadium",
      stadiumDesc:
        "Framed by the dramatic Hajar Mountains, Dibba Stadium serves as the architectural heart of club football and community events on the East Coast.",
      stadiumSpecs: [
        { label: "Location", value: "Dibba Al Fujairah, UAE" },
        { label: "Pitch", value: "FIFA Quality Pro Natural Turf" },
        { label: "Lighting", value: "Broadcast-Grade LED Floodlights" },
        { label: "Facilities", value: "VIP Royal Box, Media Suite, Training Complex" },
      ],
      boardTitle: "Board & Strategic Orientation",
      boardMembers: [
        { name: "H.E. Ahmed Saeed Al-Dhanhani", role: "Chairman of the Board" },
        { name: "Football Company Executive Committee", role: "First Team & Technical Operations" },
        { name: "Cultural & Community Directorate", role: "Youth & Cultural Initiatives" },
        { name: "Academy & Olympic Sports Board", role: "Grassroots & Multi-Sport" },
      ],
    },
    news: {
      eyebrow: "Official Club Media",
      title: "News, Reports & Galleries",
      viewAll: "All News & Media",
      readArticle: "Read Full Report",
      searchPlaceholder: "Search articles...",
      allCategories: "All",
      categories: {
        first_team: "First Team",
        academy: "Academy",
        club_news: "Club News",
        community: "Community",
        other_sports: "Other Sports",
      },
      galleryTitle: "Matchday & Academy Photography",
      noResults: "No articles match your current filter.",
      backToNews: "Back to Newsroom",
    },
    commercial: {
      shopTitle: "Official Club Store",
      shopSubtitle: "Authentic 2026 Uhlsport Match Kits and Dibba SCC Supporter Apparel.",
      foundationNotice:
        "Commercial Reservation Foundation: Online card checkout is disabled until payment gateway credentials are provisioned. Submit an item reservation enquiry below.",
      reserveItem: "Request Reservation",
      ticketsTitle: "Dibba Stadium Tickets",
      ticketsSubtitle: "Select your preferred grandstand tier for upcoming home fixtures.",
      ticketsNotice:
        "Ticketing Portal Foundation: Seat reservation requests are routed to the Club Ticket Office for confirmation.",
      selectStand: "Select Grandstand Tier",
      stands: [
        {
          id: "vip-box",
          name: "VIP Hospitality Lounge",
          price: "150 AED",
          desc: "Padded central seating, lounge hospitality, and dedicated stadium parking.",
        },
        {
          id: "cat-1",
          name: "Category 1 — Main Stand",
          price: "50 AED",
          desc: "Prime covered view aligned with the center circle.",
        },
        {
          id: "cat-2",
          name: "Category 2 — Supporter Bowl",
          price: "20 AED",
          desc: "Vibrant atmosphere behind the goals and East Stand.",
        },
      ],
      sponsorshipTitle: "Commercial Partnerships & Sponsorships",
      sponsorshipSubtitle:
        "Partner with Dibba Sports & Cultural Club across matchday branding, kit placement, and community activations.",
    },
    forms: {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone / WhatsApp (+971)",
      subject: "Subject",
      program: "Select Program / Tier",
      playerAge: "Player Age (Optional)",
      message: "Message / Notes",
      consent: "I consent to Dibba SCC processing my enquiry data in accordance with club privacy standards.",
      submit: "Submit Request",
      submitting: "Submitting...",
      successTitle: "Request Recorded",
      successBody:
        "Thank you. Your submission has been securely stored in our club administration system and will be reviewed shortly.",
      errorGeneric: "Please check the highlighted fields and try again.",
    },
    footer: {
      about:
        "Dibba Sports & Cultural Club — Official digital home since 1967. Dedicated to football excellence, youth development, and community pride in Dibba Al Fujairah.",
      address: "P.O. Box 11494, Dibba Al Fujairah, United Arab Emirates",
      sponsorsTitle: "Official Partners & Federations",
      quickLinks: "Club Navigation",
      governance: "Administration & Legal",
      copyright: "2026 © Dibba Sports & Cultural Club. All Rights Reserved.",
    },
    interactive: {
      countdownDays: "Days",
      countdownHours: "Hrs",
      countdownMins: "Min",
      countdownSecs: "Sec",
      matchdayLive: "Matchday Countdown",
      buildXiCta: "Tactical XI Builder",
      kitStudioCta: "2026 Kit Studio",
      tacticalEyebrow: "Interactive Matchday Lab",
      tacticalTitle: "Build Your Dibba Starting XI",
      tacticalSubtitle:
        "Switch formations, tap any position on the Dibba Stadium turf to swap players, and inspect live tactical ratings.",
      tabRoster: "Full Squad Roster",
      tabTactical: "Playable Starting XI",
      formationLabel: "Formation",
      autoPick: "Auto-Optimize XI",
      chemistryLabel: "Team Chemistry",
      attackLabel: "Attack Index",
      defenseLabel: "Defense Index",
      tapSlotHint: "Tap any pitch node to swap player or inspect dossier",
      swapPlayerTitle: "Select Player for Slot",
      inspectDossier: "View Player Dossier",
      predictorTitle: "Matchday Fan Predictor",
      homeWin: "Home Win",
      draw: "Draw",
      awayWin: "Away Win",
      fansVoted: "supporters predicted",
      kitEyebrow: "Bespoke 2026 Studio",
      kitTitle: "Personalize Your Matchday Kit",
      kitSubtitle:
        "Preview your custom name and squad number live on the 2026 Uhlsport Home or Away jersey before reserving.",
      homeKitLabel: "2026 Home Kit",
      awayKitLabel: "2026 Away Kit",
      backNameLabel: "Custom Back Print",
      squadNumberLabel: "Squad Number",
      sizeLabel: "Jersey Size",
      lockKitButton: "Reserve This Custom Kit",
      stadiumMapEyebrow: "Interactive Dibba Stadium Bowl",
      stadiumMapTitle: "Choose Your Matchday Vantage",
      stadiumMapSubtitle:
        "Explore stands overlooking the FIFA Quality Pro pitch and Hajar Mountains, then lock in your tier.",
      pitchLabel: "DIBBA STADIUM PITCH",
      reserveStandButton: "Select This Stand",
    },
  },
  ar: {
    meta: {
      siteName: "نادي دبا الرياضي الثقافي",
      tagline: "تأسس 1967 · دبا الفجيرة",
      description:
        "المنصة الرقمية الرسمية لنادي دبا الرياضي الثقافي. مركز المباريات، الفريق الأول، الأكاديمية، تاريخ النادي، والمتجر الرسمي.",
    },
    nav: {
      home: "الرئيسية",
      matches: "مركز المباريات",
      teams: "الفرق",
      academy: "الأكاديمية والرياضات",
      club: "النادي",
      news: "الأخبار والإعلام",
      shop: "المتجر",
      tickets: "التذاكر",
      contact: "اتصل بنا",
      admin: "بوابة الإدارة",
      switchLang: "English",
    },
    hero: {
      established: "تأسس عام 1967 · دبا الفجيرة، الإمارات العربية المتحدة",
      title: "فخر الساحل الشرقي",
      subtitle:
        "إرث رياضي عريق منذ عام 1967، وطموح متجدد في كرة القدم، ورعاية المواهب الشابة، والريادة المجتمعية في استاد دبا.",
      ctaPrimary: "مركز المباريات",
      ctaSecondary: "انضم للأكاديمية",
      stadiumLabel: "الملعب الرئيسي: استاد دبا · سعة تتجاوز 9,000 متفرج",
    },
    matches: {
      nextMatch: "المباراة القادمة",
      lastResult: "آخر نتيجة",
      demoBadge: "جدول تجريبي · جاهز لربط البيانات المباشرة",
      fullMatchCenter: "مركز المباريات الكامل",
      upcomingFixtures: "المباريات القادمة",
      recentResults: "النتائج السابقة",
      leagueTable: "جدول الترتيب",
      kickoff: "موعد الانطلاق (الإمارات)",
      venue: "الملعب",
      vs: "ضد",
      fullTime: "نهاية المباراة",
      scheduled: "مجدولة",
      pos: "المركز",
      club: "النادي",
      played: "لعب",
      won: "فاز",
      drawn: "تعادل",
      lost: "خسر",
      gd: "فارق",
      pts: "نقاط",
      form: "السجل",
      matchDetails: "تفاصيل المباراة",
      reserveSeats: "طلب حجز مقاعد",
    },
    squad: {
      sectionEyebrow: "قائمة موسم 2026",
      sectionTitle: "الفريق الأول والجهاز الفني",
      viewAllSquad: "استكشف جميع الفرق",
      firstTeam: "الفريق الأول",
      u23: "فريق تحت 23",
      academy: "الأكاديمية",
      allPositions: "الكل",
      gk: "حراسة المرمى",
      def: "الدفاع",
      mid: "الوسط",
      fwd: "الهجوم",
      staff: "الجهاز الفني",
      appearances: "مباريات",
      goals: "أهداف",
      assists: "تمريرات حاسمة",
      nationality: "الجنسية",
      closeProfile: "إغلاق البطاقة",
    },
    academy: {
      eyebrow: "تطوير المواهب والرياضات",
      title: "أكاديمية دبا والبرامج الرياضية",
      subtitle:
        "مسارات تدريبية معتمدة في كرة القدم، والسباحة، وتنس الطاولة، وألعاب القوى بإشراف مدربين مرخصين.",
      registerCta: "تقديم طلب التسجيل بالأكاديمية",
      programs: [
        {
          title: "أكاديمية كرة القدم (تحت 9 – 14 سنة)",
          ageGroup: "الأعمار 7 – 14 سنة",
          schedule: "الأحد / الثلاثاء / الخميس · 17:00 – 18:30",
          description:
            "تأسيس المهارات الكروية الأساسية، الوعي المكاني، والمشاركة في مهرجانات الساحل الشرقي.",
        },
        {
          title: "قطاع المراحل السنية (تحت 15 – 18 سنة)",
          ageGroup: "الأعمار 15 – 18 سنة",
          schedule: "الإثنين – الخميس · 18:00 – 19:45",
          description:
            "الإعداد التكتيكي والبدني المتقدم كمسار مباشر للانضمام لفريق تحت 23 سنة والفريق الأول.",
        },
        {
          title: "الأكاديمية الخاصة لكرة القدم",
          ageGroup: "الأعمار 6 – 16 سنة",
          schedule: "فترات مسائية وعطلات نهاية الأسبوع",
          description:
            "تدريب فني مكثف في مجموعات مصغرة، وتدريب متخصص لحراس المرمى، وتقارير أداء فردية.",
        },
      ],
      otherSportsTitle: "الرياضات الفردية والثقافية",
      otherSports: [
        {
          title: "السباحة",
          subtitle: "الفرق التنافسية والتأسيس",
          description: "تطوير تقنيات السباحة السريعة والتحمل البدني والمشاركة في بطولات اتحاد الإمارات.",
        },
        {
          title: "تنس الطاولة",
          subtitle: "فرق الناشئين والرجال",
          description: "تدريبات سرعة رد الفعل والمهارات التنافسية وتمثيل النادي في الدوري العام.",
        },
        {
          title: "ألعاب القوى والشطرنج",
          subtitle: "المضمار والرياضات الذهنية",
          description: "برامج السرعة والتحمل والبطولات الثقافية للشطرنج التي ترسخ التوازن الفكري.",
        },
      ],
      formTitle: "استمارة التسجيل والاستفسار الرياضي",
      formSubtitle: "تتم مراجعة الطلبات مباشرة من قبل إدارة الأكاديمية في نادي دبا الرياضي الثقافي.",
    },
    club: {
      eyebrow: "الهوية والحوكمة",
      title: "نادي دبا الرياضي الثقافي",
      chairmansTitle: "كلمة رئيس مجلس الإدارة",
      chairmanName: "سعادة / أحمد سعيد الظنحاني",
      chairmanRole: "رئيس مجلس الإدارة",
      chairmanQuote:
        "منذ تأسيس النادي باسم اتحاد الخليج الرياضي عام 1967، ظل نادي دبا منارة للروح الرياضية والوحدة والطموح.",
      chairmanBody: [
        "يسعدني أن أرحب بكم في المنصة الرقمية الرسمية لنادي دبا الرياضي الثقافي. تجدر الإشارة إلى أن تأسيس النادي كان في فبراير عام 1967 تحت مسمى «نادي اتحاد الخليج الرياضي» بجهود مخلصة من أبناء مدينة دبا.",
        "انطلاقاً من توجيهات قيادتنا الرشيدة وحكومة الفجيرة، ترتكز استراتيجيتنا على الحوكمة المؤسسية الحديثة، والاستثمار المستدام في أكاديميات الناشئين، وتعزيز التنافسية في كرة القدم والرياضات الأولمبية.",
      ],
      historyTitle: "إرث يمتد منذ 1967",
      historyBody:
        "من الملاعب الشعبية الأولى عام 1967 إلى المنافسة في البطولات الاحترافية الإماراتية على أرضية استاد دبا الحديث.",
      heritageCaption: "الشعار التأسيسي التاريخي لنادي اتحاد الخليج الرياضي 1967",
      milestones: [
        {
          year: "1967",
          title: "التأسيس تحت اسم اتحاد الخليج الرياضي",
          desc: "تأسس في 9 فبراير 1967 بمبادرة شبابية رياضية رائدة في دبا الفجيرة.",
        },
        {
          year: "1976",
          title: "الدمج والاشهار الرسمي",
          desc: "توحيد الجهود الرياضية والثقافية تحت راية نادي دبا الرياضي الثقافي.",
        },
        {
          year: "2015–2024",
          title: "إنجازات المحترفين والدرجة الأولى",
          desc: "تحقيق بطولات دوري الدرجة الأولى والمشاركة المشرفة في دوري المحترفين.",
        },
        {
          year: "2026",
          title: "عصر التحول الرقمي واستاد دبا",
          desc: "تطوير البنية التحتية الرقمية ومرافق استاد دبا ومسارات تطوير المواهب.",
        },
      ],
      stadiumTitle: "استاد دبا",
      stadiumDesc:
        "بإطلالة جبال الحجر الشامخة، يمثل استاد دبا القلب النابض لمباريات النادي والفعاليات المجتمعية في الساحل الشرقي.",
      stadiumSpecs: [
        { label: "الموقع", value: "دبا الفجيرة، الإمارات العربية المتحدة" },
        { label: "أرضية الملعب", value: "عشب طبيعي بمعايير FIFA Quality Pro" },
        { label: "الإضاءة", value: "أبراج LED مطابقة لمعايير البث التلفزيوني" },
        { label: "المرافق", value: "منصة كبار الشخصيات، المركز الإعلامي، وملاعب التدريب" },
      ],
      boardTitle: "مجلس الإدارة والتوجه الاستراتيجي",
      boardMembers: [
        { name: "سعادة / أحمد سعيد الظنحاني", role: "رئيس مجلس الإدارة" },
        { name: "اللجنة التنفيذية لشركة كرة القدم", role: "إدارة الفريق الأول والعمليات الفنية" },
        { name: "الإدارة الثقافية والمجتمعية", role: "البرامج المجتمعية والثقافية" },
        { name: "إدارة الأكاديمية والألعاب الفردية", role: "الناشئين والرياضات الأولمبية" },
      ],
    },
    news: {
      eyebrow: "المركز الإعلامي الرسمي",
      title: "الأخبار والتقارير ومعرض الصور",
      viewAll: "كافة الأخبار والإعلام",
      readArticle: "قراءة التقرير الكامل",
      searchPlaceholder: "ابحث في الأخبار...",
      allCategories: "الكل",
      categories: {
        first_team: "الفريق الأول",
        academy: "الأكاديمية",
        club_news: "أخبار النادي",
        community: "المجتمع",
        other_sports: "رياضات أخرى",
      },
      galleryTitle: "لقطات المباريات والأكاديمية",
      noResults: "لا توجد مقالات مطابقة لخيار البحث الحالي.",
      backToNews: "العودة للأخبار",
    },
    commercial: {
      shopTitle: "متجر النادي الرسمي",
      shopSubtitle: "الأطقم الرسمية من Uhlsport لموسم 2026 ومقتنيات جماهير نادي دبا.",
      foundationNotice:
        "منصة الحجز التجاري: تم تعطيل الدفع الإلكتروني بالبطاقات لحين تفعيل بوابة الدفع الرسمية. يمكنك تقديم طلب حجز للمقتنيات أدناه.",
      reserveItem: "طلب حجز المنتج",
      ticketsTitle: "تذاكر استاد دبا",
      ticketsSubtitle: "اختر فئة المدرج المفضلة للمباريات القادمة على أرضنا.",
      ticketsNotice:
        "نظام حجز التذاكر: يتم تحويل طلبات حجز المقاعد مباشرة إلى مكتب التذاكر بالنادي لتأكيدها.",
      selectStand: "اختر فئة المدرج",
      stands: [
        {
          id: "vip-box",
          name: "منصة كبار الشخصيات (VIP)",
          price: "150 درهم",
          desc: "مقاعد رئيسية مريحة مع ضيافة خاصة ومواقف مخصصة.",
        },
        {
          id: "cat-1",
          name: "الدرجة الأولى — المدرج الرئيسي",
          price: "50 درهم",
          desc: "رؤية بانورامية مميزة ومظللة بمحاذاة منتصف الملعب.",
        },
        {
          id: "cat-2",
          name: "الدرجة الثانية — مدرج الجماهير",
          price: "20 درهم",
          desc: "أجواء جماهيرية حماسية خلف المرمى والمدرج الشرقي.",
        },
      ],
      sponsorshipTitle: "الشراكات التجارية والرعاية",
      sponsorshipSubtitle:
        "كن شريكاً لنادي دبا الرياضي الثقافي في رعاية القمصان، اللوحات الإعلانية، والمبادرات المجتمعية.",
    },
    forms: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف / واتساب (+971)",
      subject: "الموضوع",
      program: "اختر البرنامج / الفئة",
      playerAge: "عمر اللاعب (اختياري)",
      message: "الرسالة / التفاصيل",
      consent: "أوافق على معالجة بيانات طلبي من قبل نادي دبا وفق سياسة الخصوصية المعتمدة.",
      submit: "إرسال الطلب",
      submitting: "جاري الإرسال...",
      successTitle: "تم استلام طلبك بنجاح",
      successBody:
        "شكراً لتواصلك مع نادي دبا. تم تسجيل طلبك بأمان في نظام الإدارة وسيتم التواصل معك قريباً.",
      errorGeneric: "يرجى مراجعة الحقول المحددة والمحاولة مرة أخرى.",
    },
    footer: {
      about:
        "نادي دبا الرياضي الثقافي — المنصة الرسمية منذ 1967. ملتزمون بالتميز الكروي، وتطوير المواهب، وخدمة مجتمع دبا الفجيرة.",
      address: "صندوق بريد 11494، دبا الفجيرة، الإمارات العربية المتحدة",
      sponsorsTitle: "الشركاء والاتحادات الرياضية",
      quickLinks: "روابط النادي",
      governance: "الإدارة والخصوصية",
      copyright: "2026 © نادي دبا الرياضي الثقافي. جميع الحقوق محفوظة.",
    },
    interactive: {
      countdownDays: "يوم",
      countdownHours: "ساعة",
      countdownMins: "دقيقة",
      countdownSecs: "ثانية",
      matchdayLive: "العد التنازلي للمباراة",
      buildXiCta: "تشكيلة المباراة التفاعلية",
      kitStudioCta: "استوديو تصميم القميص",
      tacticalEyebrow: "المختبر التكتيكي التفاعلي",
      tacticalTitle: "كوّن تشكيلة نادي دبا الأساسية",
      tacticalSubtitle:
        "بدّل الخطط التكتيكية واضغط على أي مركز فوق أرضية استاد دبا لتبديل اللاعبين واستعراض التقييم الفني.",
      tabRoster: "قائمة الفريق الكاملة",
      tabTactical: "بناء التشكيلة التفاعلية",
      formationLabel: "الخطة",
      autoPick: "التشكيلة المثالية",
      chemistryLabel: "الانسجام التكتيكي",
      attackLabel: "قوة الهجوم",
      defenseLabel: "الصلابة الدفاعية",
      tapSlotHint: "اضغط على أي مركز لتبديل اللاعب أو عرض ملفه",
      swapPlayerTitle: "اختر اللاعب لهذا المركز",
      inspectDossier: "عرض ملف اللاعب",
      predictorTitle: "توقعات جماهير دبا",
      homeWin: "فوز المضيف",
      draw: "تعادل",
      awayWin: "فوز الضيف",
      fansVoted: "مشارك في التوقع",
      kitEyebrow: "استوديو أطقم 2026",
      kitTitle: "خصّص قميصك الرسمي لموسم 2026",
      kitSubtitle:
        "عاين اسمك ورقمك المفضل مباشرة على قميص Uhlsport الأساسي أو الاحتياطي قبل إرسال طلب الحجز.",
      homeKitLabel: "القميص الأساسي 2026",
      awayKitLabel: "القميص الاحتياطي 2026",
      backNameLabel: "الاسم على القميص",
      squadNumberLabel: "رقم القميص",
      sizeLabel: "المقاس",
      lockKitButton: "احجز هذا القميص المخصص",
      stadiumMapEyebrow: "خريطة مدرجات استاد دبا التفاعلية",
      stadiumMapTitle: "اختر موقعك في المدرجات",
      stadiumMapSubtitle:
        "استكشف فئات المدرجات المطلة على أرضية الملعب وجبال الحجر، ثم انتقل مباشرة لحجز مقعدك.",
      pitchLabel: "أرضية استاد دبا",
      reserveStandButton: "اختر هذا المدرج",
    },
  },
};
