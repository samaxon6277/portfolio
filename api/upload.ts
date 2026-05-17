import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB

const ALLOWED_MIMES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'application/pdf'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // Setting overall max to 100MB, we validate granularly later
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable parse error:", err);
        return res.status(400).json({ success: false, error: 'Failed to parse upload form' });
      }

      const fileObj = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!fileObj) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const mimeType = fileObj.mimetype || '';
      
      if (!ALLOWED_MIMES.includes(mimeType)) {
        fs.unlink(fileObj.filepath, () => {});
        return res.status(400).json({ success: false, error: 'Invalid file type' });
      }

      const fileSize = fileObj.size;
      if (mimeType.startsWith('image/') && fileSize > MAX_IMAGE_SIZE) {
        fs.unlink(fileObj.filepath, () => {});
        return res.status(400).json({ success: false, error: 'Image exceeds 10MB limit' });
      }
      if (mimeType.startsWith('video/') && fileSize > MAX_VIDEO_SIZE) {
        fs.unlink(fileObj.filepath, () => {});
        return res.status(400).json({ success: false, error: 'Video exceeds 100MB limit' });
      }
      if (mimeType === 'application/pdf' && fileSize > MAX_DOC_SIZE) {
        fs.unlink(fileObj.filepath, () => {});
        return res.status(400).json({ success: false, error: 'Document exceeds 20MB limit' });
      }

      const folderField = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
      const folderPath = String(folderField || process.env.VITE_CLOUDINARY_UPLOAD_PRESET || "portfolio_uploads");

      try {
        const result = await cloudinary.uploader.upload(fileObj.filepath, {
          folder: folderPath,
          resource_type: "auto",
        });

        fs.unlink(fileObj.filepath, () => {});

        return res.status(200).json({
          success: true,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resource_type: result.resource_type,
          url: result.url,
        });
      } catch (uploadError: any) {
        console.error("Cloudinary error:", uploadError);
        fs.unlink(fileObj.filepath, () => {});
        return res.status(500).json({ success: false, error: 'Failed to upload to Cloudinary' });
      }
    });
  } catch (error: any) {
    console.error("API error:", error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
