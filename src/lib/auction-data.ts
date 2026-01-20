export type AuctionCategory =
    | "land"
    | "vehicle"
    | "ngo-asset"
    | "machinery"
    | "electronics"
    | "furniture"
    | "industrial"
    | "agricultural"

export interface Auction {
    id: string
    title: {
        en: string
        am: string
    }
    description: {
        en: string
        am: string
    }
    detailedDescription?: {
        en: string
        am: string
    }
    termsAndConditions?: {
        en: string
        am: string
    }
    attachments?: {
        name: string
        type: "pdf" | "image" | "document"
        url: string
        size: string
    }[]
    category: AuctionCategory
    currentBid: number
    startingBid: number
    bidCount: number
    trustScore: number
    isLive: boolean
    isFeatured?: boolean
    endsAt: Date
    imageUrl: string
    location: {
        en: string
        am: string
    }
    seller: {
        id: string
        name: string
        verified: boolean
    }
    status?: "draft" | "pending" | "active" | "ended" | "cancelled" | "paid"
    winnerId?: string
    winnerName?: string
}

export interface Bid {
    id: string
    auctionId: string
    userId: string
    userName: string
    amount: number
    timestamp: Date
    isAntiSnipe: boolean
}

export const categoryDetails: Record<
    AuctionCategory,
    {
        icon: string
        label: { en: string; am: string }
        description: { en: string; am: string }
    }
> = {
    land: {
        icon: "Building",
        label: { en: "Land & Property", am: "መሬት እና ንብረት" },
        description: { en: "Agricultural, commercial, and residential land", am: "የእርሻ፣ የንግድ እና የመኖሪያ መሬት" },
    },
    vehicle: {
        icon: "Car",
        label: { en: "Vehicles", am: "መኪናዎች" },
        description: { en: "Cars, trucks, and government fleet", am: "መኪናዎች፣ መጫኛዎች እና የመንግስት ተሽከርካሪዎች" },
    },
    "ngo-asset": {
        icon: "Heart",
        label: { en: "NGO Assets", am: "NGO ንብረቶች" },
        description: { en: "Surplus equipment from international organizations", am: "ከዓለም አቀፍ ድርጅቶች የትርፍ መሳሪያዎች" },
    },
    machinery: {
        icon: "Cog",
        label: { en: "Machinery", am: "ማሽነሪዎች" },
        description: { en: "Industrial and construction equipment", am: "የኢንዱስትሪ እና የግንባታ መሳሪያዎች" },
    },
    electronics: {
        icon: "Monitor",
        label: { en: "Electronics", am: "ኤሌክትሮኒክስ" },
        description: { en: "IT equipment, computers, and office tech", am: "የአይቲ መሳሪያዎች፣ ኮምፒውተሮች እና የቢሮ ቴክኖሎጂ" },
    },
    furniture: {
        icon: "Sofa",
        label: { en: "Furniture", am: "ዕቃዎች" },
        description: { en: "Office and institutional furniture", am: "የቢሮ እና ተቋማዊ ዕቃዎች" },
    },
    industrial: {
        icon: "Factory",
        label: { en: "Industrial", am: "ኢንዱስትሪያዊ" },
        description: { en: "Factory equipment and raw materials", am: "የፋብሪካ መሳሪያዎች እና ጥሬ እቃዎች" },
    },
    agricultural: {
        icon: "Wheat",
        label: { en: "Agricultural", am: "ግብርና" },
        description: { en: "Farming equipment and livestock", am: "የእርሻ መሳሪያዎች እና እንስሳት" },
    },
}

export const mockAuctions: Auction[] = [
    {
        id: "AX-2024-001",
        title: {
            en: "Prime Agricultural Land - Oromia Region",
            am: "ዋና የእርሻ መሬት - ኦሮሚያ ክልል",
        },
        description: {
            en: "50 hectares of fertile agricultural land with water access and modern irrigation infrastructure.",
            am: "50 ሄክታር ለም የእርሻ መሬት ከውሃ መዳረሻ እና ዘመናዊ የመስኖ መሰረተ ልማት ጋር።",
        },
        detailedDescription: {
            en: "This exceptional 50-hectare agricultural plot is located in the fertile Jimma Zone of Oromia Region. The land features: Modern drip irrigation system covering 80% of the plot, Direct access to a perennial river, Rich volcanic soil ideal for coffee, teff, and vegetables, Existing storage facilities (500 sqm warehouse), Access road connecting to the main highway, Clear title deed with no encumbrances. The land has been under cultivation for the past 15 years with consistent yields. Current crops include coffee (20 ha), maize (15 ha), and vegetables (15 ha). All existing crops are included in the sale.",
            am: "ይህ ልዩ 50 ሄክታር የእርሻ ቦታ በኦሮሚያ ክልል በለም ጅማ ዞን ይገኛል። መሬቱ የሚከተሉትን ባህሪያት ያካትታል፡ 80% የሚሸፍን ዘመናዊ የጠብታ መስኖ ስርዓት፣ ወደ ዓመታዊ ወንዝ ቀጥተኛ መዳረሻ፣ ለቡና፣ ጤፍ እና አትክልት ተስማሚ ለም የእሳተ ገሞራ አፈር፣ ነባር የማከማቻ ቦታዎች (500 ካሬ ሜትር መጋenze)፣ ከዋናው አውራ ጎዳና ጋር የሚያገናኝ የመዳረሻ መንገድ፣ ምንም ሸክም የሌለበት ግልጽ የባለቤትነት ሰነድ።",
        },
        termsAndConditions: {
            en: "1. Payment Terms: 30% deposit within 48 hours of winning, remaining 70% within 30 days. 2. Transfer: Title transfer completed within 60 days of full payment. 3. Inspection: Buyers encouraged to inspect before bidding. 4. Dispute Resolution: Any disputes shall be resolved through arbitration in Addis Ababa. 5. Withdrawal: Winning bidder cannot withdraw; deposit is non-refundable. 6. Verification: All documents verified by Federal Land Authority.",
            am: "1. የክፍያ ውሎች፡ ከማሸነፍ በኋላ በ48 ሰዓታት ውስጥ 30% ቅድመ ክፍያ፣ ቀሪው 70% በ30 ቀናት ውስጥ። 2. ዝውውር፡ ሙሉ ክፍያ ከተከፈለ በ60 ቀናት ውስጥ የባለቤትነት ዝውውር ይጠናቀቃል። 3. ምርመራ፡ ገዢዎች ከጨረታ በፊት እንዲመረምሩ ይበረታታሉ። 4. የክርክር መፍታት፡ ማንኛውም አለመግባባት በአዲስ አበባ በሽምግልና ይፈታል። 5. ማውጣት፡ አሸናፊ ተጫራች ማውጣት አይችልም፤ ቅድመ ክፍያው ተመላሽ አይደለም። 6. ማረጋገጫ፡ ሁሉም ሰነዶች በፌዴራል የመሬት ባለስልጣን ተረጋግጠዋል።",
        },
        attachments: [
            { name: "Land_Title_Deed.pdf", type: "pdf", url: "/documents/title-deed.pdf", size: "2.4 MB" },
            { name: "Survey_Report.pdf", type: "pdf", url: "/documents/survey.pdf", size: "5.1 MB" },
            { name: "Environmental_Assessment.pdf", type: "pdf", url: "/documents/env-assessment.pdf", size: "3.8 MB" },
        ],
        category: "land",
        currentBid: 4500000,
        startingBid: 3000000,
        bidCount: 23,
        trustScore: 98,
        isLive: true,
        isFeatured: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 45),
        imageUrl: "/aerial-view-fertile-agricultural-land-ethiopia-gre.jpg",
        location: { en: "Jimma Zone, Oromia", am: "ጅማ ዞን፣ ኦሮሚያ" },
        seller: { id: "S-FLA-001", name: "Federal Land Authority", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-002",
        title: {
            en: "Toyota Land Cruiser V8 - Government Fleet",
            am: "ቶዮታ ላንድ ክሩዘር V8 - የመንግስት መኪና",
        },
        description: {
            en: "2021 Toyota Land Cruiser V8, well-maintained government vehicle with complete service history.",
            am: "2021 ቶዮታ ላንድ ክሩዘር V8፣ ሙሉ የአገልግሎት ታሪክ ያለው በጥሩ ሁኔታ የተጠበቀ የመንግስት መኪና።",
        },
        category: "vehicle",
        currentBid: 2800000,
        startingBid: 2000000,
        bidCount: 45,
        trustScore: 95,
        isLive: true,
        isFeatured: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 120),
        imageUrl: "/white-toyota-land-cruiser-v8-suv-ethiopia.jpg",
        location: { en: "Addis Ababa", am: "አዲስ አበባ" },
        seller: { id: "S-MOT-002", name: "Ministry of Transport", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-003",
        title: {
            en: "Medical Equipment Lot - UNICEF Surplus",
            am: "የህክምና መሳሪያዎች - UNICEF ትርፍ",
        },
        description: {
            en: "Complete lot of surplus medical equipment including diagnostic tools, hospital beds, and monitoring devices.",
            am: "የምርመራ መሳሪያዎችን፣ የሆስፒታል አልጋዎችን እና የክትትል መሳሪያዎችን ጨምሮ ሙሉ የትርፍ የህክምና መሳሪያዎች።",
        },
        category: "ngo-asset",
        currentBid: 850000,
        startingBid: 500000,
        bidCount: 12,
        trustScore: 100,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 30),
        imageUrl: "/medical-equipment-hospital-devices-monitors-beds.jpg",
        location: { en: "Hawassa, SNNPR", am: "ሀዋሳ፣ ደቡብ ብሄሮች" },
        seller: { id: "S-UNICEF-003", name: "UNICEF Ethiopia", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-004",
        title: {
            en: "Commercial Plot - Bole District",
            am: "የንግድ ቦታ - ቦሌ አካባቢ",
        },
        description: {
            en: "2,500 sqm commercial plot in prime Bole location, suitable for high-rise development.",
            am: "2,500 ካሬ ሜትር የንግድ ቦታ በዋና ቦሌ አካባቢ፣ ለከፍተኛ ሕንፃ ልማት ተስማሚ።",
        },
        category: "land",
        currentBid: 45000000,
        startingBid: 35000000,
        bidCount: 67,
        trustScore: 97,
        isLive: true,
        isFeatured: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 180),
        imageUrl: "/aerial-commercial-land-plot-urban-addis-ababa-city.jpg",
        location: { en: "Bole, Addis Ababa", am: "ቦሌ፣ አዲስ አበባ" },
        seller: { id: "S-AAC-004", name: "Addis Ababa City Admin", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-005",
        title: {
            en: "Excavator CAT 320 - Construction Fleet",
            am: "ኤክስካቫተር CAT 320 - የግንባታ መኪና",
        },
        description: {
            en: "2019 Caterpillar 320 Excavator with 3,200 operating hours, excellent condition.",
            am: "2019 ካተርፒላር 320 ኤክስካቫተር 3,200 የስራ ሰዓቶች ያለው፣ እጅግ ጥሩ ሁኔታ።",
        },
        category: "machinery",
        currentBid: 6500000,
        startingBid: 5000000,
        bidCount: 18,
        trustScore: 92,
        isLive: false,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        imageUrl: "/yellow-caterpillar-excavator-construction-equipmen.jpg",
        location: { en: "Dire Dawa", am: "ድሬ ዳዋ" },
        seller: { id: "S-ERA-005", name: "Ethiopian Roads Authority", verified: true },
        status: "ended",
    },
    {
        id: "AX-2024-006",
        title: {
            en: "Office Furniture Set - World Bank",
            am: "የቢሮ ዕቃዎች - ዓለም ባንክ",
        },
        description: {
            en: "Complete office furniture set including executive desks, ergonomic chairs, and conference tables.",
            am: "የሥራ አስፈጻሚ ጠረጴዛዎችን፣ ኤርጎኖሚክ ወንበሮችን እና የስብሰባ ጠረጴዛዎችን ጨምሮ ሙሉ የቢሮ ዕቃዎች።",
        },
        category: "furniture",
        currentBid: 320000,
        startingBid: 200000,
        bidCount: 8,
        trustScore: 99,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 90),
        imageUrl: "/modern-office-furniture-executive-desk-chairs-conf.jpg",
        location: { en: "Addis Ababa", am: "አዲስ አበባ" },
        seller: { id: "S-WBE-006", name: "World Bank Ethiopia", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-007",
        title: {
            en: "Dell Server Rack - IT Infrastructure",
            am: "ዴል ሰርቬሮች - IT መሰረተ ልማት",
        },
        description: {
            en: "Complete Dell PowerEdge server rack with 8 servers, networking equipment, and UPS system.",
            am: "8 ሰርቬሮች፣ የኔትወርክ መሳሪያዎች እና UPS ሲስተም ያለው ሙሉ ዴል ፓወር ኤጅ ሰርቬ ራክ።",
        },
        category: "electronics",
        currentBid: 1200000,
        startingBid: 800000,
        bidCount: 15,
        trustScore: 94,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 60),
        imageUrl: "/dell-server-rack-data-center-it-equipment.jpg",
        location: { en: "Addis Ababa", am: "አዲስ አበባ" },
        seller: { id: "S-ETC-007", name: "Ethio Telecom", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-008",
        title: {
            en: "Industrial Generator 500KVA",
            am: "ኢንዱስትሪያዊ ጀነሬተር 500KVA",
        },
        description: {
            en: "Cummins 500KVA industrial generator, low hours, full maintenance records available.",
            am: "ካሚንስ 500KVA ኢንዱስትሪያዊ ጀነሬተር፣ ዝቅተኛ ሰዓቶች፣ ሙሉ የጥገና መዝገቦች አሉ።",
        },
        category: "industrial",
        currentBid: 1800000,
        startingBid: 1200000,
        bidCount: 22,
        trustScore: 96,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 150),
        imageUrl: "/industrial-power-generator-cummins-large.jpg",
        location: { en: "Bahir Dar", am: "ባህር ዳር" },
        seller: { id: "S-EEP-008", name: "Ethiopian Electric Power", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-009",
        title: {
            en: "John Deere Tractor 6155M",
            am: "ጆን ዲር ትራክተር 6155M",
        },
        description: {
            en: "2020 John Deere 6155M tractor with front loader, only 800 hours, excellent condition.",
            am: "2020 ጆን ዲር 6155M ትራክተር ከፊት ጫኝ ጋር፣ 800 ሰዓቶች ብቻ፣ እጅግ ጥሩ ሁኔታ።",
        },
        category: "agricultural",
        currentBid: 3200000,
        startingBid: 2500000,
        bidCount: 31,
        trustScore: 98,
        isLive: true,
        isFeatured: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 200),
        imageUrl: "/john-deere-green-tractor-farm-agriculture.jpg",
        location: { en: "Hawassa, SNNPR", am: "ሀዋሳ፣ ደቡብ ብሄሮች" },
        seller: { id: "S-MOA-009", name: "Ministry of Agriculture", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-010",
        title: {
            en: "Isuzu Truck Fleet - 5 Units",
            am: "ኢሱዙ የጭነት መኪና - 5 ዩኒቶች",
        },
        description: {
            en: "Fleet of 5 Isuzu FTR trucks, 2018-2020 models, ideal for logistics companies.",
            am: "5 ኢሱዙ FTR የጭነት መኪናዎች፣ 2018-2020 ሞዴሎች፣ ለሎጂስቲክስ ኩባንያዎች ተስማሚ።",
        },
        category: "vehicle",
        currentBid: 8500000,
        startingBid: 6000000,
        bidCount: 28,
        trustScore: 93,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 240),
        imageUrl: "/isuzu-truck-fleet-white-commercial-vehicles.jpg",
        location: { en: "Mekelle, Tigray", am: "መቀሌ፣ ትግራይ" },
        seller: { id: "S-FTA-010", name: "Federal Transport Authority", verified: true },
        status: "active",
    },
    {
        id: "AX-2024-011",
        title: {
            en: "Laboratory Equipment - Research Institute",
            am: "የላብራቶሪ መሳሪያዎች - የምርምር ተቋም",
        },
        description: {
            en: "Complete laboratory setup including microscopes, centrifuges, and analytical instruments.",
            am: "ማይክሮስኮፖችን፣ ሴንትሪፊዩጆችን እና ትንተና መሳሪያዎችን ጨምሮ ሙሉ የላብራቶሪ ማዋቀር።",
        },
        category: "ngo-asset",
        currentBid: 2100000,
        startingBid: 1500000,
        bidCount: 9,
        trustScore: 100,
        isLive: false,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
        imageUrl: "/laboratory-equipment-microscope-scientific-instrum.jpg",
        location: { en: "Addis Ababa", am: "አዲስ አበባ" },
        seller: { id: "S-WHO-011", name: "WHO Ethiopia", verified: true },
        status: "ended",
    },
    {
        id: "AX-2024-012",
        title: {
            en: "Warehouse Space - Industrial Zone",
            am: "የመጋenze ቦታ - የኢንዱስትሪ ዞን",
        },
        description: {
            en: "5,000 sqm warehouse lease in Eastern Industrial Zone, 25-year term available.",
            am: "5,000 ካሬ ሜትር የመጋenze ቦታ በምስራቅ ኢንዱስትሪ ዞን፣ 25 ዓመት የኪራይ ጊዜ።",
        },
        category: "land",
        currentBid: 12000000,
        startingBid: 8000000,
        bidCount: 14,
        trustScore: 95,
        isLive: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 300),
        imageUrl: "/large-industrial-warehouse-building-ethiopia.jpg",
        location: { en: "Dukem, Oromia", am: "ዱከም፣ ኦሮሚያ" },
        seller: { id: "S-IPD-012", name: "Industrial Parks Development", verified: true },
        status: "active",
    },
]

export const mockBidHistory: Bid[] = [
    {
        id: "B001",
        auctionId: "AX-2024-001",
        userId: "U-4521",
        userName: "Abebe T.",
        amount: 4500000,
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        isAntiSnipe: true,
    },
    {
        id: "B002",
        auctionId: "AX-2024-001",
        userId: "U-3892",
        userName: "Meron K.",
        amount: 4350000,
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isAntiSnipe: false,
    },
    {
        id: "B003",
        auctionId: "AX-2024-001",
        userId: "U-4521",
        userName: "Abebe T.",
        amount: 4200000,
        timestamp: new Date(Date.now() - 1000 * 60 * 12),
        isAntiSnipe: false,
    },
    {
        id: "B004",
        auctionId: "AX-2024-001",
        userId: "U-2156",
        userName: "Dawit M.",
        amount: 4000000,
        timestamp: new Date(Date.now() - 1000 * 60 * 18),
        isAntiSnipe: false,
    },
    {
        id: "B005",
        auctionId: "AX-2024-001",
        userId: "U-3892",
        userName: "Meron K.",
        amount: 3800000,
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        isAntiSnipe: false,
    },
    {
        id: "B006",
        auctionId: "AX-2024-001",
        userId: "U-7845",
        userName: "Sara G.",
        amount: 3500000,
        timestamp: new Date(Date.now() - 1000 * 60 * 35),
        isAntiSnipe: false,
    },
    {
        id: "B007",
        auctionId: "AX-2024-001",
        userId: "U-2156",
        userName: "Dawit M.",
        amount: 3200000,
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isAntiSnipe: false,
    },
    {
        id: "B008",
        auctionId: "AX-2024-001",
        userId: "U-4521",
        userName: "Abebe T.",
        amount: 3000000,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isAntiSnipe: false,
    },
]

export function formatETB(amount: number): string {
    return new Intl.NumberFormat("en-ET", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatTimeRemaining(endsAt: Date): { text: string; urgent: boolean } {
    const now = new Date()
    const diff = endsAt.getTime() - now.getTime()

    if (diff <= 0) return { text: "Ended", urgent: false }

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return { text: `${days}d ${hours % 24}h`, urgent: false }
    if (hours > 0) return { text: `${hours}h ${minutes % 60}m`, urgent: false }
    if (minutes > 2) return { text: `${minutes}m`, urgent: minutes <= 10 }

    const seconds = Math.floor(diff / 1000)
    return { text: `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`, urgent: true }
}
