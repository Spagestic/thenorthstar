import { NextRequest } from "next/server";
import * as cheerio from "cheerio";
import { z } from "zod";

const UrlSchema = z.string().url();

function pickFirst(...vals: Array<string | undefined | null>) {
    return vals.find((v) => typeof v === "string" && v.trim().length > 0)
        ?.trim() ?? null;
}

export async function GET(req: NextRequest) {
    const target = req.nextUrl.searchParams.get("url");
    const parsed = UrlSchema.safeParse(target);

    if (!parsed.success) {
        return Response.json({ error: "Invalid url" }, { status: 400 });
    }

    const url = parsed.data;

    const res = await fetch(url, {
        redirect: "follow",
        headers: {
            // Some sites return different HTML depending on UA
            "user-agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
            "accept": "text/html,application/xhtml+xml",
        },
    });

    if (!res.ok) {
        return Response.json({ error: `Upstream status ${res.status}` }, {
            status: 502,
        });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const abs = (
        maybe: string | null,
    ) => (maybe ? new URL(maybe, url).toString() : null);

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDesc = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");

    const twTitle = $('meta[name="twitter:title"]').attr("content");
    const twDesc = $('meta[name="twitter:description"]').attr("content");
    const twImage = $('meta[name="twitter:image"]').attr("content");

    const titleTag = $("title").first().text();

    // Icon/logo candidates
    const appleTouch = $('link[rel="apple-touch-icon"]').attr("href");
    const icon = $('link[rel="icon"]').attr("href");

    const title = pickFirst(ogTitle, twTitle, titleTag);
    const description = pickFirst(
        ogDesc,
        twDesc,
        $('meta[name="description"]').attr("content"),
    );
    const image = abs(pickFirst(ogImage, twImage)); // often best “logo-like” image for cards

    // A more “favicon-like” logo:
    const logo = abs(pickFirst(appleTouch, icon)) ??
        new URL("/favicon.ico", url).toString();

    return Response.json({
        url,
        title,
        description,
        image, // social card image
        logo, // favicon/apple-touch-icon fallback
    });
}
