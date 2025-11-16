// File System Storage Service for TomoTrip
// Simple and reliable file storage using local filesystem
const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

class FileStorageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    this.ensureUploadDirectories();
  }

  // Ensure upload directories exist
  async ensureUploadDirectories() {
    try {
      const dirs = [
        this.uploadDir,
        path.join(this.uploadDir, 'profiles'),
        path.join(this.uploadDir, 'documents')
      ];

      for (const dir of dirs) {
        try {
          await fs.access(dir);
        } catch {
          await fs.mkdir(dir, { recursive: true });
          console.log(`✅ Created directory: ${dir}`);
        }
      }
    } catch (error) {
      console.error('❌ Error creating upload directories:', error);
    }
  }

  // Generate unique filename for uploads
  generateUploadPath(prefix = 'profiles', originalName) {
    const fileId = randomUUID();
    const ext = path.extname(originalName);
    const fileName = `${prefix}_${fileId}${ext}`;
    return {
      fileId,
      fileName,
      relativePath: `uploads/${prefix}/${fileName}`,
      fullPath: path.join(this.uploadDir, prefix, fileName)
    };
  }

  // Upload file buffer to filesystem
  async uploadFileBuffer(buffer, prefix = 'profiles', originalName) {
    try {
      const { fileId, fileName, relativePath, fullPath } = this.generateUploadPath(prefix, originalName);
      
      console.log(`📤 Uploading file: ${relativePath}`);
      console.log(`📤 Buffer size: ${buffer.length} bytes`);
      
      // Write file to disk
      await fs.writeFile(fullPath, buffer);
      
      console.log(`✅ File uploaded successfully: ${relativePath}`);
      
      // Return public URL path
      const publicUrl = `/${relativePath}`;
      
      return {
        success: true,
        fileId,
        fileName,
        relativePath,
        publicUrl
      };
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  }

  // Check if file exists
  async fileExists(relativePath) {
    try {
      const fullPath = path.join(__dirname, '..', 'public', relativePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  // Delete file
  async deleteFile(relativePath) {
    try {
      const fullPath = path.join(__dirname, '..', 'public', relativePath);
      await fs.unlink(fullPath);
      console.log(`✅ File deleted: ${relativePath}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Error deleting file ${relativePath}:`, error);
      throw error;
    }
  }
}

module.exports = {
  FileStorageService
};
