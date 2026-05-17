import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return res.status(400).json({ success: false, error: 'public_id is required' });
    }

    const type = resource_type === 'video' ? 'video' : 'image';

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: type
    });

    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
