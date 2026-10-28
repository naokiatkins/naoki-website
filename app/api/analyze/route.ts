import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

// ─── Your profile — edit this! ──────────────────────────────────────────────
const MY_PROFILE = `
Name: Naoki Atkins
Title: Senior Business Intelligence Developer / Data Engineer
Years of experience: 5

Core skills:
- Power BI, Python, R, SQL
- Azure -> Blob Storage, Functions, Apps, Data Factory
- RPA, Machine Learning
- Software design, Software architecture

Industries: Finance, Manufacturing
Work style: remote-first, async, startup environments

Highlights:
- Led re-architecture of a payments platform processing $2M/day
- Built and shipped 3 B2B SaaS products from 0→1
- Open-source contributor (2k+ GitHub stars)
- Strong communicator; comfortable presenting to executives

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

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let jdText = "";
    try {
      // Dynamically import pdf-parse (avoids issues with Next.js edge bundling)
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
        { error: "PDF appears to be empty or image-only. Please use a text-based PDF." },
        { status: 422 }
      );
    }

    // Trim to avoid huge token usage (keep first ~4000 chars of JD)
    const truncatedJD = jdText.slice(0, 4000);

    // Call Claude to score the match
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // cheapest model — still very accurate
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: `You are an expert recruiter and career coach. Analyse the fit between a candidate profile and a job description.

<candidate_profile>
${MY_PROFILE}
</candidate_profile>

<job_description>
${truncatedJD}
</job_description>

Respond with ONLY a valid JSON object — no markdown, no explanation:
{
  "score": <integer 0-100>,
  "summary": "<2-sentence honest assessment of the fit>",
  "matchedSkills": ["<skill>", ...],
  "gaps": ["<gap or concern>", ...]
}

Be objective. score=100 means perfect fit. score<50 means poor fit. score>=70 means worth a conversation.`,
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: {
      score: number;
      summary: string;
      matchedSkills: string[];
      gaps: string[];
    };

    try {
      // Strip any accidental markdown fences
      const clean = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Claude response was not valid JSON:", rawText);
      return NextResponse.json(
        { error: "Analysis failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      score: Math.min(100, Math.max(0, Math.round(parsed.score))),
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
