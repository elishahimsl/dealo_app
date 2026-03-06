/**
 * Simple module-level cache to pass a base64 image between the camera
 * screen and the results screen without stuffing it into URL params.
 *
 * The camera screen sets the cached image after capture.
 * The results screen reads (and clears) it on mount.
 */

let _cachedBase64: string | null = null;

export function setCachedImageBase64(b64: string | null): void {
  _cachedBase64 = b64;
}

export function getCachedImageBase64(): string | null {
  return _cachedBase64;
}

export function clearCachedImageBase64(): void {
  _cachedBase64 = null;
}
