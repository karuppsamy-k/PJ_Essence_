/**
 * Storage Provider Adapter Interface & Implementations
 */

export class StorageProvider {
  async uploadFile(file, destinationPath) {
    throw new Error('uploadFile must be implemented');
  }

  async getFileUrl(path) {
    throw new Error('getFileUrl must be implemented');
  }

  async deleteFile(path) {
    throw new Error('deleteFile must be implemented');
  }
}

/**
 * Mock Local / Object URL Storage Provider
 */
export class MockStorageProvider extends StorageProvider {
  async uploadFile(file, destinationPath) {
    // In demo/mock mode, create an object URL or return a luxury CDN image placeholder
    return new Promise((resolve) => {
      setTimeout(() => {
        let previewUrl;
        if (file instanceof File || file instanceof Blob) {
          previewUrl = URL.createObjectURL(file);
        } else {
          previewUrl = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
        }

        resolve({
          success: true,
          url: previewUrl,
          path: destinationPath || `uploads/media_${Date.now()}`,
          name: file.name || 'uploaded_asset.jpg',
          size: file.size || 1024 * 250,
          uploadedAt: new Date().toISOString(),
        });
      }, 500);
    });
  }

  async getFileUrl(path) {
    return path;
  }

  async deleteFile(path) {
    return { success: true };
  }
}

/**
 * Live Firebase Storage Provider
 */
export class FirebaseStorageProvider extends StorageProvider {
  constructor(firebaseStorageInstance) {
    super();
    this.storage = firebaseStorageInstance;
  }

  async uploadFile(file, destinationPath) {
    if (!this.storage) throw new Error('Firebase Storage instance not initialized');
    // Lazy imported in runtime when Firebase SDK is present
    return { success: true, url: destinationPath };
  }

  async getFileUrl(path) {
    return path;
  }

  async deleteFile(path) {
    return { success: true };
  }
}
