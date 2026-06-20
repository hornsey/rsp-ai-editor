import EditorPageClient, { type EditMode } from "@/components/EditorPageClient";

export const dynamic = "force-dynamic";

function normalizeMode(mode: string | string[] | undefined): EditMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  if (value === "enhance" || value === "remove-bg" || value === "restyle") {
    return value;
  }
  return "enhance";
}

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const { mode } = await searchParams;
  return <EditorPageClient initialMode={normalizeMode(mode)} />;
}
