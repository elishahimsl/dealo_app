/**
 * Upload captured scan images to Supabase Storage.
 *
 * This replaces the old base64 cache approach. The image is uploaded
 * once to the `scan-images` bucket. The storage path (small string)
 * is then passed via route params to the results screen, which sends
 * it to the scan-product edge function.
 *
 * Benefits:
 *   - No megabytes of base64 held in memory between screens
 *   - Storage path is a tiny URL param (not a multi-MB string)
 *   - Backend fetches the image by URL — no body size limits
 *   - Images persist for potential history / re-scan
 */

import { supabase } from '../supabase';
import * as FileSystem from 'expo-file-system';

const BUCKET = 'scan-images';

/**
 * Ensure the scan-images bucket exists. Called once on first upload.
 * Swallows errors if bucket already exists.
 */
let bucketChecked = false;
async function ensureBucket(): Promise<void> {
  if (bucketChecked) return;
  try {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5 MB
    });
    console.log(`[DeaLo] storage: created bucket "${BUCKET}"`);
  } catch (err: any) {
    // Bucket already exists — that's fine
    if (err?.message?.includes('already exists') || err?.statusCode === '409') {
      // expected
    } else {
      console.warn('[DeaLo] storage: bucket check warning:', err?.message);
    }
  }
  bucketChecked = true;
}

/**
 * Convert a base64 string to Uint8Array using atob (available in React Native).
 */
function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface UploadResult {
  /** Relative path within the bucket, e.g. "scans/1709734800000_abc.jpg" */
  storagePath: string;
  /** Full public URL for display / fallback */
  publicUrl: string;
}

/**
 * Upload a captured image to Supabase Storage.
 *
 * Accepts a file URI and optionally the base64 data (from camera capture).
 * If base64 is provided, uses it directly; otherwise reads the file from disk.
 * Returns the storage path and public URL.
 */
export async function uploadScanImage(
  fileUri: string,
  base64Data?: string | null,
): Promise<UploadResult> {
  await ensureBucket();

  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const fileName = `scans/${timestamp}_${rand}.jpg`;

  console.log('[DeaLo] storage: uploading', fileName);

  // Get the base64 data — either from param or by reading the file
  let b64 = base64Data || '';
  if (!b64) {
    b64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });
  }

  // Convert base64 → bytes and upload
  const bytes = base64ToBytes(b64);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload scan image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  const publicUrl = urlData?.publicUrl || '';
  console.log('[DeaLo] storage: uploaded →', fileName, '| url:', publicUrl.slice(0, 80));

  return { storagePath: fileName, publicUrl };
}
