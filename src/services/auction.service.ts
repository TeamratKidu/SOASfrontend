import api from "@/lib/api"
import type { Auction, AuctionCategory } from "@/lib/auction-data"

// DTOs matching backend
export interface CreateAuctionDto {
    title: string
    description: string
    startingPrice: number
    minimumIncrement?: number
    reservePrice?: number
    endTime: string // ISO Date string
    imageUrls?: string[]
    category?: string
}

export interface UpdateAuctionDto {
    title?: string
    description?: string
    imageUrls?: string[]
}

export interface AuctionFilterDto {
    status?: string
    category?: string // Added category filter
    minPrice?: number
    maxPrice?: number
    search?: string
    page?: number
    limit?: number
}

export interface AuctionsResponse {
    data: Auction[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

function mapCategory(rawCategory?: string | null): AuctionCategory {
    const value = (rawCategory || "").toLowerCase()

    if (value.includes("land") || value.includes("plot") || value.includes("real")) return "land"
    if (value.includes("vehicle") || value.includes("car") || value.includes("truck") || value.includes("cruiser")) return "vehicle"
    if (value.includes("ngo")) return "ngo-asset"
    if (value.includes("machinery") || value.includes("excavator") || value.includes("equipment")) return "machinery"
    if (value.includes("electronic") || value.includes("laptop") || value.includes("server") || value.includes("computer")) return "electronics"
    if (value.includes("furniture")) return "furniture"
    if (value.includes("industrial") || value.includes("factory") || value.includes("warehouse")) return "industrial"
    if (value.includes("agri") || value.includes("tractor")) return "agricultural"

    return "land"
}

interface BackendAuction {
    id: string
    title: string
    description: string
    startingPrice: string | number
    currentPrice?: string | number
    minimumIncrement?: string | number
    reservePrice?: string | number | null
    endTime: string
    category?: string | null
    status: string
    imageUrls?: string[]
    sellerId: string
    winnerId?: string | null
    seller?: {
        id: string
        name?: string
        email?: string
        trustScore?: number
    }
    location?: {
        en?: string
        am?: string
    }
    bidCount?: number
}

function mapBackendAuction(raw: BackendAuction): Auction {
    const currentPrice = Number(raw.currentPrice ?? raw.startingPrice ?? 0)
    const startingPrice = Number(raw.startingPrice ?? 0)

    return {
        id: raw.id,
        title: {
            en: raw.title,
            am: raw.title,
        },
        description: {
            en: raw.description,
            am: raw.description,
        },
        category: mapCategory(raw.category),
        currentBid: currentPrice,
        startingBid: startingPrice,
        bidCount: raw.bidCount ?? 0,
        trustScore: raw.seller?.trustScore ?? 95,
        isLive: raw.status === "active",
        isFeatured: false,
        endsAt: new Date(raw.endTime),
        imageUrl: Array.isArray(raw.imageUrls) && raw.imageUrls.length > 0 ? raw.imageUrls[0] : "/placeholder.svg",
        location: {
            en: raw.location?.en || "Addis Ababa",
            am: raw.location?.am || "አዲስ አበባ",
        },
        seller: {
            id: raw.sellerId,
            name: raw.seller?.name || raw.seller?.email || "Seller",
            verified: true,
        },
        status: (raw.status as Auction["status"]) ?? undefined,
        winnerId: raw.winnerId ?? undefined,
    }
}

export const auctionService = {
    async create(data: CreateAuctionDto): Promise<Auction> {
        const response = await api.post("/auctions", data)
        return mapBackendAuction(response.data)
    },

    async getAll(params?: AuctionFilterDto): Promise<AuctionsResponse> {
        const response = await api.get("/auctions", { params })
        const payload = response.data
        const items = Array.isArray(payload) ? payload : payload.data ?? []

        return {
            data: items.map(mapBackendAuction),
            meta: {
                total: payload.total ?? items.length,
                page: payload.page ?? params?.page ?? 1,
                limit: payload.limit ?? params?.limit ?? items.length,
                totalPages: payload.totalPages ?? 1,
            },
        }
    },

    async getMyAuctions(): Promise<Auction[]> {
        const response = await api.get("/auctions/my-auctions")
        const items = Array.isArray(response.data) ? response.data : []
        return items.map(mapBackendAuction)
    },

    async getById(id: string): Promise<Auction> {
        const response = await api.get(`/auctions/${id}`)
        return mapBackendAuction(response.data)
    },

    async update(id: string, data: UpdateAuctionDto): Promise<Auction> {
        const response = await api.patch(`/auctions/${id}`, data)
        return mapBackendAuction(response.data)
    },

    // Admin only
    async approve(id: string): Promise<Auction> {
        const response = await api.patch(`/auctions/${id}/approve`)
        return mapBackendAuction(response.data)
    },

    async cancel(id: string): Promise<Auction> {
        const response = await api.patch(`/auctions/${id}/cancel`)
        return mapBackendAuction(response.data)
    }
}
