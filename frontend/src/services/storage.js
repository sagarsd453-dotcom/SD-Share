import localforage from 'localforage';

// Configure separate stores for metadata and chunks
localforage.config({
  name: 'SD-Share',
  version: 1.0,
  storeName: 'chunks',
  description: 'Stores file chunks for resumable downloads'
});

const metadataStore = localforage.createInstance({
  name: 'SD-Share',
  storeName: 'metadata'
});

export const storageService = {
  async saveChunk(fileId, chunkIndex, chunkData) {
    const key = `${fileId}_chunk_${chunkIndex}`;
    await localforage.setItem(key, chunkData);
  },

  async getChunk(fileId, chunkIndex) {
    const key = `${fileId}_chunk_${chunkIndex}`;
    return await localforage.getItem(key);
  },

  async hasChunk(fileId, chunkIndex) {
    const key = `${fileId}_chunk_${chunkIndex}`;
    const chunk = await localforage.getItem(key);
    return chunk !== null;
  },

  async getMissingChunks(fileId, totalChunks) {
    const missing = [];
    for (let i = 0; i < totalChunks; i++) {
      const exists = await this.hasChunk(fileId, i);
      if (!exists) {
        missing.push(i);
      }
    }
    return missing;
  },

  async clearFileChunks(fileId, totalChunks) {
    let batchIndex = 0;
    while (true) {
      const key = `${fileId}_chunk_batch_${batchIndex}`;
      const exists = await localforage.getItem(key);
      if (!exists) break;
      await localforage.removeItem(key);
      batchIndex++;
    }
    await metadataStore.removeItem(fileId);
  },

  async saveFileMetadata(fileId, metadata) {
    await metadataStore.setItem(fileId, metadata);
  },

  async getFileMetadata(fileId) {
    return await metadataStore.getItem(fileId);
  },

  async clearAllData() {
    await localforage.clear();
    await metadataStore.clear();
    console.log('Orphaned chunk data cleared from IndexedDB');
  }
};
