export interface FirecrawlAgentRequestBody {
    prompt: string;
    urls?: string[];
    schema?: Record<string, any>;
    maxCredits?: number;
    strictConstrainToURLs?: boolean;
}

export interface FirecrawlAgentResponse {
    success: boolean;
    id: string;
    [key: string]: any;
}

export interface FirecrawlAgentStatusResponse {
    success: boolean;
    status: "processing" | "completed" | "failed";
    data?: any;
    expiresAt?: string;
    creditsUsed?: number;
    error?: string;
    [key: string]: any;
}
