// Object Storage Service for TomoTrip
// Uses Replit Object Storage (@replit/object-storage)
const { Client } = require('@replit/object-storage');
const { randomUUID } = require('crypto');

// Replit Object Storage client
const objectStorageClient = new Client();

// Initialize the client asynchronously
let clientReady = false;
objectStorageClient.init().then(() => {
  clientReady = true;
  console.log('✅ Object Storage client initialized successfully');
}).catch(error => {
  console.error('❌ Failed to initialize Object Storage client:', error);
});

class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

class ObjectStorageService {
  constructor() {}
  
  // Ensure client is ready before operations
  async ensureClientReady() {
    if (!clientReady) {
      console.log('⏳ Waiting for Object Storage client to initialize...');
      await objectStorageClient.init();
      clientReady = true;
      console.log('✅ Object Storage client ready');
    }
  }

  // Generate unique filename for uploads
  generateUploadPath(prefix = 'uploads') {
    const objectId = randomUUID();
    return `${prefix}/${objectId}`;
  }

  // Upload file buffer directly to object storage
  async uploadFileBuffer(buffer, objectPath, contentType = 'application/octet-stream') {
    try {
      // Ensure client is initialized
      await this.ensureClientReady();
      
      // Normalize path: remove leading slash if present
      const fileName = objectPath.startsWith('/') ? objectPath.substring(1) : objectPath;
      
      console.log(`📤 Uploading file: objectPath="${objectPath}" → fileName="${fileName}"`);
      console.log(`📤 Buffer type: ${buffer.constructor.name}, size: ${buffer.length} bytes`);
      
      // Convert Buffer to Uint8Array if needed
      const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
      console.log(`📤 Converted to Uint8Array: ${bytes.length} bytes`);
      
      // Upload file buffer using Replit Object Storage
      const result = await objectStorageClient.uploadFromBytes(fileName, bytes);
      
      console.log(`📤 Upload result:`, { ok: result.ok, error: result.error });
      
      if (!result.ok) {
        console.error('❌ Upload failed:', result.error);
        throw new Error(`Upload failed: ${result.error}`);
      }

      console.log(`✅ File uploaded successfully to: ${fileName}`);
      
      return {
        success: true,
        fileName,
        path: objectPath
      };
    } catch (error) {
      console.error('❌ Error uploading file buffer:', error);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  // Download file from object storage and send to response
  async downloadFile(fileName, res, cacheTtlSec = 3600) {
    try {
      // Ensure client is initialized
      await this.ensureClientReady();
      
      console.log(`📥 Downloading file: ${fileName}`);
      
      // Download file as bytes
      const result = await objectStorageClient.downloadAsBytes(fileName);
      
      if (!result.ok) {
        console.error(`❌ Download failed for ${fileName}:`, result.error);
        throw new ObjectNotFoundError();
      }

      // Determine content type from file extension
      const contentType = this.getContentType(fileName);
      
      console.log(`✅ File downloaded successfully: ${fileName} (${result.value.length} bytes, ${contentType})`);
      
      res.set({
        "Content-Type": contentType,
        "Content-Length": result.value.length,
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      res.send(result.value);
    } catch (error) {
      console.error(`❌ Error downloading file ${fileName}:`, error);
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
    let fileName;
    if (urlPath.startsWith('/objects/')) {
      fileName = urlPath.substring(9); // Remove '/objects/'
    } else {
      // Remove leading slash
      fileName = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    }
    console.log(`🔄 Path conversion: "${urlPath}" → "${fileName}"`);
    return fileName;
  }
}

module.exports = {
  ObjectStorageService,
  ObjectNotFoundError,
  objectStorageClient
};