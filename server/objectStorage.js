// Object Storage Service for TomoTrip
// Uses Replit Object Storage (@replit/object-storage)
const { Client } = require('@replit/object-storage');
const { randomUUID } = require('crypto');

// Replit Object Storage client
const objectStorageClient = new Client();

class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

class ObjectStorageService {
  constructor() {}

  // Generate unique filename for uploads
  generateUploadPath(prefix = 'uploads') {
    const objectId = randomUUID();
    return `${prefix}/${objectId}`;
  }

  // Upload file buffer directly to object storage
  async uploadFileBuffer(buffer, objectPath, contentType = 'application/octet-stream') {
    try {
      // Remove leading slash and convert path to simple filename
      const fileName = objectPath.startsWith('/') ? objectPath.substring(1) : objectPath;
      
      // Upload file buffer using Replit Object Storage
      const result = await objectStorageClient.uploadFromBytes(fileName, buffer);
      
      if (!result.ok) {
        console.error('❌ Upload failed:', result.error);
        throw new Error(`Upload failed: ${result.error}`);
      }

      console.log(`✅ File uploaded to ${fileName}`);
      
      return {
        success: true,
        fileName,
        path: objectPath
      };
    } catch (error) {
      console.error('❌ Error uploading file buffer:', error);
      throw error;
    }
  }

  // Download file from object storage and send to response
  async downloadFile(fileName, res, cacheTtlSec = 3600) {
    try {
      // Download file as bytes
      const result = await objectStorageClient.downloadAsBytes(fileName);
      
      if (!result.ok) {
        console.error('❌ Download failed:', result.error);
        throw new ObjectNotFoundError();
      }

      // Determine content type from file extension
      const contentType = this.getContentType(fileName);
      
      res.set({
        "Content-Type": contentType,
        "Content-Length": result.value.length,
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      res.send(result.value);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        if (error instanceof ObjectNotFoundError) {
          res.status(404).json({ error: "File not found" });
        } else {
          res.status(500).json({ error: "Error downloading file" });
        }
      }
    }
  }

  // Get content type from file extension
  getContentType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'json': 'application/json',
      'txt': 'text/plain'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  // Check if file exists
  async fileExists(fileName) {
    try {
      const result = await objectStorageClient.list();
      if (!result.ok) {
        return false;
      }
      return result.value.some(file => file.name === fileName);
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  // Get file path from URL path (removes /objects/ prefix)
  getFileNameFromPath(urlPath) {
    // /objects/uploads/abc-123 -> uploads/abc-123
    if (urlPath.startsWith('/objects/')) {
      return urlPath.substring(9); // Remove '/objects/'
    }
    // Remove leading slash
    return urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
  }
}

module.exports = {
  ObjectStorageService,
  ObjectNotFoundError,
  objectStorageClient
};