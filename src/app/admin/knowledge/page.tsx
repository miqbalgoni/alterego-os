import { prisma } from "@/lib/db";
import { PageHeader } from "../_components/AdminUI";
import { KnowledgeManager } from "./_KnowledgeManager";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgePage() {
  const docs = await prisma.knowledgeDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { chunks: true } },
      uploadedBy: { select: { email: true, fullName: true } },
    },
  });

  const totalChunks = docs.reduce((s, d) => s + d._count.chunks, 0);

  return (
    <>
      <PageHeader
        title="Knowledge base"
        subtitle="Documents that AskMe consults when answering founder questions. Uploads are chunked and made searchable immediately."
      />
      <KnowledgeManager
        initialDocs={docs.map(d => ({
          id: d.id,
          title: d.title,
          source: d.source,
          filename: d.filename,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          chunks: d._count.chunks,
          status: d.status,
          createdAt: d.createdAt.toISOString(),
          uploadedBy: d.uploadedBy?.fullName || d.uploadedBy?.email || null,
        }))}
        totalChunks={totalChunks}
      />
    </>
  );
}
