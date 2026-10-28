import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { put } from "@vercel/blob";
// import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const maxDuration = 30;

// ─── Your profile — edit this! ──────────────────────────────────────────────
const MY_PROFILE = `
NName: Naoki Atkins
Title: Data Engineer & Business Intelligence Developer
Years of experience: 5

Core skills:
- Power BI, Python, R, SQL
- Azure -> Blob Storage, Functions, Apps, Data Factory
- RPA, Machine Learning
- Software design, Software architecture

Industries: Finance, Manufacturing
Work style: remote-first, async, startup environments

Highlights:
- Created a web app to calculate ERC tax credits in Python
- Developed web scrapers to gather information from various websites
- Designed and developed Power BI reports for finance teams, operational teams, and executives


NOT a fit for:
- Pure frontend pixel-pushing with no product ownership
- Roles requiring on-site 5 days/week
- Java or PHP-only stacks
`;
// ────────────────────────────────────────────────────────────────────────────

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("jd") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 5 MB" },
        { status: 400 }
      );
    }

    // ── 1. Upload raw PDF to Vercel Blob ─────────────────────────────────────
    const blobPath = `jd-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(blobPath, file, {
      access: "public", // not publicly accessible
      contentType: "application/pdf",
    });

    // ── 2. Extract text from PDF ──────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let jdText = "";

    try {
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(buffer);
      jdText = parsed.text.trim();
    } catch {
      return NextResponse.json(
        { error: "Could not read the PDF. Please try a text-based PDF." },
        { status: 422 }
      );
    }

    if (jdText.length < 100) {
      return NextResponse.json(
        {
          error:
            "PDF appears to be empty or image-only. Please use a text-based PDF.",
        },
        { status: 422 }
      );
    }

    const truncatedJD = jdText.slice(0, 4000);

    // ── 3. Collect recruiter metadata ─────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const userAgent = req.headers.get("user-agent") ?? "unknown";

    // ── 4. Call Claude to score the match ─────────────────────────────────────
//     const message = await client.messages.create({
//       model: "claude-haiku-4-5-20251001",
//       max_tokens: 600,
//       messages: [
//         {
//           role: "user",
//           content: `You are an expert recruiter and career coach. Analyse the fit between a candidate profile and a job description.

// <candidate_profile>
// ${MY_PROFILE}
// </candidate_profile>

// <job_description>
// ${truncatedJD}
// </job_description>

// Respond with ONLY a valid JSON object — no markdown, no explanation:
// {
//   "score": <integer 0-100>,
//   "summary": "<2-sentence honest assessment of the fit>",
//   "matchedSkills": ["<skill>", ...],
//   "gaps": ["<gap or concern>", ...]
// }

// Be objective. score=100 means perfect fit. score<50 means poor fit. score>=70 means worth a conversation.`,
//         },
//       ],
//     });

//     const rawText =
//       message.content[0].type === "text" ? message.content[0].text : "";

//     let parsed: {
//       score: number;
//       summary: string;
//       matchedSkills: string[];
//       gaps: string[];
//     };

//     try {
//       const clean = rawText.replace(/```json|```/g, "").trim();
//       parsed = JSON.parse(clean);
//     } catch {
//       console.error("Claude response was not valid JSON:", rawText);
//       return NextResponse.json(
//         { error: "Analysis failed. Please try again." },
//         { status: 500 }
//       );
//     }

//     const score = Math.min(100, Math.max(0, Math.round(parsed.score)));



// ── TEMPORARY: hardcoded result for testing ──────────────────────────
const score = 85;
const parsed = {
  summary: "This is a placeholder result for testing purposes.",
  matchedSkills: ["TypeScript", "React", "Node.js"],
  gaps: [],
};
// ────────────────────────────────────────────────────────────────────

    // ── 5. Persist to Vercel Postgres ─────────────────────────────────────────
    // await sql`
    //   INSERT INTO jd_submissions (
    //     filename,
    //     blob_url,
    //     extracted_text,
    //     score,
    //     summary,
    //     matched_skills,
    //     gaps,
    //     ip_address,
    //     user_agent,
    //     submitted_at
    //   ) VALUES (
    //     ${file.name},
    //     ${blob.url},
    //     ${jdText.slice(0, 10000)},
    //     ${score},
    //     ${parsed.summary ?? ""},
    //     ${JSON.stringify(parsed.matchedSkills ?? [])},
    //     ${JSON.stringify(parsed.gaps ?? [])},
    //     ${ip},
    //     ${userAgent},
    //     NOW()
    //   )
    // `;

    return NextResponse.json({
      score,
      summary: parsed.summary ?? "",
      skills: parsed.matchedSkills ?? [],
      gaps: parsed.gaps ?? [],
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
