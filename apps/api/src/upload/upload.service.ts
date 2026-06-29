import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Unknown error uploading image'));
          resolve({ url: result.secure_url, public_id: result.public_id });
        },
      );
      
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.error(`Failed to delete cloudinary image: ${publicId}`, e);
    }
  }

  getPublicIdFromUrl(url: string): string | null {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
      const parts = url.split('/');
      // Expected structure: .../upload/v1234/folder/filename.ext
      // or just .../upload/folder/filename.ext
      const uploadIndex = parts.findIndex(p => p === 'upload');
      if (uploadIndex === -1) return null;
      
      // Skip the version number if it exists (starts with 'v' followed by numbers)
      let startIndex = uploadIndex + 1;
      if (parts[startIndex].match(/^v\d+$/)) {
        startIndex++;
      }
      
      const fileWithExtension = parts.slice(startIndex).join('/');
      return fileWithExtension.split('.')[0];
    } catch {
      return null;
    }
  }
}
