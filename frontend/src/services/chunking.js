// Safe chunk size for WebRTC Data Channels is 64KB
export const CHUNK_SIZE = 64 * 1024;

export const generateFileId = (file) => {
  return `${file.name}-${file.size}-${file.lastModified}`.replace(/[^a-zA-Z0-9-]/g, '');
};

export const sliceFile = (file, chunkSize = CHUNK_SIZE) => {
  const chunks = [];
  let offset = 0;
  
  while (offset < file.size) {
    chunks.push(file.slice(offset, offset + chunkSize));
    offset += chunkSize;
  }
  
  return chunks;
};

// Generate SHA-256 hash for a ArrayBuffer chunk
export const hashChunk = async (arrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const mergeChunks = async (fileId, totalChunks, storageService) => {
  const chunks = [];
  let batchIndex = 0;
  while (true) {
    const chunkData = await storageService.getChunk(fileId, `batch_${batchIndex}`);
    if (!chunkData) {
      if (batchIndex === 0) throw new Error(`No data found for file ${fileId}`);
      break;
    }
    chunks.push(chunkData);
    batchIndex++;
  }
  return new Blob(chunks);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
