import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");
  if (!file)
    return new Response(JSON.stringify({ error: "No file" }), { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(process.cwd(), "public", "hero-background.jpg");
  await writeFile(filePath, buffer);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
