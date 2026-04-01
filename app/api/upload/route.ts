import { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api";
import { requireRequestRole } from "@/lib/auth";
import { uploadPhotoToBlob } from "@/lib/blob";

export async function POST(request: NextRequest) {
  const auth = await requireRequestRole(request, ["admin", "user"]);
  if (auth.error) {
    return auth.error;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return fail("File upload is required", 400);
  }

  try {
    const upload = await uploadPhotoToBlob(file);
    return ok(upload, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return fail(message, 400);
  }
}

