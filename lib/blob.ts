import { BlobServiceClient } from "@azure/storage-blob";

function getBlobContainer() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER;

  if (!connectionString || !containerName) {
    return null;
  }

  const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
  return serviceClient.getContainerClient(containerName);
}

export async function uploadPhotoToBlob(file: File) {
  const container = getBlobContainer();

  if (!container) {
    throw new Error("Azure Blob is not configured");
  }

  await container.createIfNotExists({ access: "blob" });

  const blobName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const blob = container.getBlockBlobClient(blobName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await blob.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type
    }
  });

  return {
    blobName,
    url: blob.url
  };
}

