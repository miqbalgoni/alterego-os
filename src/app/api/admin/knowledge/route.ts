import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { extractText, ingestDocument } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const docs = await prisma.knowledgeDocument.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { chunks: true } },
        uploadedBy: { select: { email: true, fullName: true } },
      },
    });
    return NextResponse.json({ documents: docs });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const PasteBody = z.object({
  mode: z.literal("paste"),
  title: z.string().min(1).max(200),
  source: z.string().min(1).max(200),
  text: z.string().min(20),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // File upload path
      const form = await req.formData();
      const file = form.get("file");
      const title = String(form.get("title") || "").trim();
      const source = String(form.get("source") || title).trim();
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());
      const { text, warning } = await extractText({
        buffer,
        mimeType: file.type || null,
        filename: file.name || null,
      });
      if (!text) {
        return NextResponse.json({ error: warning || "Could not extract text" }, { status: 400 });
      }
      const { documentId, chunkCount } = await ingestDocument({
        title,
        source: source || title,
        filename: file.name,
        mimeType: file.type || null,
        sizeBytes: buffer.length,
        uploadedById: admin.id,
        rawText: text,
      });
      await logAdminAction({
        adminId: admin.id,
        action: "doc.upload",
        resourceType: "document",
        resourceId: documentId,
        metadata: { title, chunkCount, filename: file.name },
      });
      return NextResponse.json({ ok: true, documentId, chunkCount });
    }

    // JSON paste path
    const parsed = PasteBody.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { documentId, chunkCount } = await ingestDocument({
      title: parsed.data.title,
      source: parsed.data.source,
      rawText: parsed.data.text,
      uploadedById: admin.id,
      tags: parsed.data.tags,
    });
    await logAdminAction({
      adminId: admin.id,
      action: "doc.paste",
      resourceType: "document",
      resourceId: documentId,
      metadata: { title: parsed.data.title, chunkCount },
    });
    return NextResponse.json({ ok: true, documentId, chunkCount });
  } catch (e) {
    if (String(e).includes("Forbidden")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
