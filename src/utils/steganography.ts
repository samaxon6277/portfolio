/**
 * SamaXon Image Steganography Engine
 * 
 * Implements 100% client-side Least Significant Bit (LSB) image steganography
 * with authenticated AES-256-GCM encryption and PBKDF2 key derivation.
 * 
 * Safety & Integrity:
 * - Leaves Alpha channel (A) untouched to avoid canvas premultiplication artifacts
 * - Uses cryptographically secure random salt (16 bytes) and IV (12 bytes)
 * - Embeds a proprietary signature (SMXSTEGO), format version, mode, and payload length
 * - Authenticated decryption with AES-GCM guarantees corruption and incorrect-password detection
 */

export interface StegoSecretPayload {
  type: 'text' | 'file';
  text?: string;
  file?: {
    name: string;
    mime: string;
    size: number;
    base64: string;
  };
  createdAt: number;
}

export interface StegoCapacity {
  width: number;
  height: number;
  totalPixels: number;
  availableChannels: number;
  totalRawBytes: number;
  headerOverheadBytes: number;
  maxPayloadBytes: number;
}

export interface StegoHeaderInfo {
  hasPayload: boolean;
  isCorrupted: boolean;
  version?: number;
  mode?: 1 | 2;
  salt?: Uint8Array;
  iv?: Uint8Array;
  payloadLength?: number;
  errorMessage?: string;
}

// Magic bytes: "SMXSTEGO" (8 bytes)
export const STEGO_MAGIC = new Uint8Array([0x53, 0x4D, 0x58, 0x53, 0x54, 0x45, 0x47, 0x4F]);
export const STEGO_VERSION = 1;

// Header size breakdown:
// Magic (8) + Version (1) + Mode (1) + Salt (16) + IV (12) + Length (4) = 42 bytes
export const HEADER_SIZE_BYTES = 42;

// AES-GCM authentication tag overhead = 16 bytes
export const GCM_TAG_BYTES = 16;

/**
 * Calculates exact steganographic storage capacity for given dimensions
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @param bitsPerChannel Bits embedded per RGB channel (default 1)
 */
export function calculateCapacity(width: number, height: number, bitsPerChannel: 1 | 2 = 1): StegoCapacity {
  const totalPixels = width * height;
  const availableChannels = totalPixels * 3; // RGB channels only (Alpha is preserved)
  const totalRawBits = availableChannels * bitsPerChannel;
  const totalRawBytes = Math.floor(totalRawBits / 8);
  const headerOverheadBytes = HEADER_SIZE_BYTES + GCM_TAG_BYTES;
  const maxPayloadBytes = Math.max(0, totalRawBytes - headerOverheadBytes);

  return {
    width,
    height,
    totalPixels,
    availableChannels,
    totalRawBytes,
    headerOverheadBytes,
    maxPayloadBytes
  };
}

/**
 * Derives an AES-256-GCM key from a user password and cryptographic salt using PBKDF2
 */
export async function deriveKey(password: string, salt: Uint8Array, iterations = 100000): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKeyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations,
      hash: 'SHA-256'
    },
    passwordKeyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary payload bytes with AES-256-GCM
 */
export async function encryptPayload(plaintextBytes: Uint8Array, password: string): Promise<{
  salt: Uint8Array;
  iv: Uint8Array;
  ciphertextWithTag: Uint8Array;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    plaintextBytes as any
  );

  return {
    salt,
    iv,
    ciphertextWithTag: new Uint8Array(encryptedBuffer)
  };
}

/**
 * Decrypts AES-256-GCM ciphertext bytes. Throws an error if password is incorrect or data was modified.
 */
export async function decryptPayload(
  ciphertextWithTag: Uint8Array,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array
): Promise<Uint8Array> {
  const key = await deriveKey(password, salt);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as any },
      key,
      ciphertextWithTag as any
    );
    return new Uint8Array(decryptedBuffer);
  } catch {
    throw new Error('Decryption failed: Incorrect password or image payload was corrupted/modified.');
  }
}

/**
 * Builds the binary steganography frame containing:
 * [Magic (8B)][Version (1B)][Mode (1B)][Salt (16B)][IV (12B)][Length (4B)][Ciphertext + Tag (NB)]
 */
export function constructStegoFrame(
  mode: 1 | 2,
  salt: Uint8Array,
  iv: Uint8Array,
  ciphertextWithTag: Uint8Array
): Uint8Array {
  const totalLength = HEADER_SIZE_BYTES + ciphertextWithTag.length;
  const frame = new Uint8Array(totalLength);
  let offset = 0;

  // 1. Magic
  frame.set(STEGO_MAGIC, offset);
  offset += STEGO_MAGIC.length;

  // 2. Version
  frame[offset] = STEGO_VERSION;
  offset += 1;

  // 3. Mode (1 or 2 bits)
  frame[offset] = mode;
  offset += 1;

  // 4. Salt (16 bytes)
  frame.set(salt, offset);
  offset += salt.length;

  // 5. IV (12 bytes)
  frame.set(iv, offset);
  offset += iv.length;

  // 6. Length (4 bytes Uint32 Big-Endian)
  const lengthView = new DataView(frame.buffer, frame.byteOffset + offset, 4);
  lengthView.setUint32(0, ciphertextWithTag.length, false);
  offset += 4;

  // 7. Ciphertext + Tag
  frame.set(ciphertextWithTag, offset);

  return frame;
}

/**
 * Embeds a binary frame into an ImageData object using LSB on RGB channels only
 */
export function embedFrameIntoImageData(
  imageData: ImageData,
  frame: Uint8Array,
  mode: 1 | 2 = 1
): void {
  const data = imageData.data;
  const totalPixels = imageData.width * imageData.height;
  const availableChannels = totalPixels * 3;
  const bitsNeeded = frame.length * 8;
  const channelsNeeded = mode === 1 ? bitsNeeded : Math.ceil(bitsNeeded / 2);

  if (channelsNeeded > availableChannels) {
    throw new Error(`Data exceeds image capacity. Needed: ${channelsNeeded} channels, Available: ${availableChannels} channels.`);
  }

  let channelIdx = 0;

  if (mode === 1) {
    for (let byteIdx = 0; byteIdx < frame.length; byteIdx++) {
      const byteVal = frame[byteIdx];
      for (let bit = 7; bit >= 0; bit--) {
        const bitVal = (byteVal >> bit) & 1;
        const pixelOffset = Math.floor(channelIdx / 3) * 4 + (channelIdx % 3);
        data[pixelOffset] = (data[pixelOffset] & 0xFE) | bitVal;
        channelIdx++;
      }
    }
  } else {
    // 2-bit mode
    for (let byteIdx = 0; byteIdx < frame.length; byteIdx++) {
      const byteVal = frame[byteIdx];
      for (let pair = 3; pair >= 0; pair--) {
        const twoBits = (byteVal >> (pair * 2)) & 3;
        const pixelOffset = Math.floor(channelIdx / 3) * 4 + (channelIdx % 3);
        data[pixelOffset] = (data[pixelOffset] & 0xFC) | twoBits;
        channelIdx++;
      }
    }
  }
}

/**
 * Reads N bytes from the image data starting from channel 0
 */
function readBytesFromImageData(
  imageData: ImageData,
  byteCount: number,
  mode: 1 | 2 = 1
): Uint8Array {
  const data = imageData.data;
  const totalPixels = imageData.width * imageData.height;
  const maxChannels = totalPixels * 3;
  const channelsToRead = mode === 1 ? byteCount * 8 : byteCount * 4;

  if (channelsToRead > maxChannels) {
    throw new Error('Image too small to read requested bytes');
  }

  const result = new Uint8Array(byteCount);
  let channelIdx = 0;

  if (mode === 1) {
    for (let b = 0; b < byteCount; b++) {
      let currentByte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const pixelOffset = Math.floor(channelIdx / 3) * 4 + (channelIdx % 3);
        const bitVal = data[pixelOffset] & 1;
        currentByte = (currentByte << 1) | bitVal;
        channelIdx++;
      }
      result[b] = currentByte;
    }
  } else {
    for (let b = 0; b < byteCount; b++) {
      let currentByte = 0;
      for (let pair = 0; pair < 4; pair++) {
        const pixelOffset = Math.floor(channelIdx / 3) * 4 + (channelIdx % 3);
        const twoBits = data[pixelOffset] & 3;
        currentByte = (currentByte << 2) | twoBits;
        channelIdx++;
      }
      result[b] = currentByte;
    }
  }

  return result;
}

/**
 * Checks if bytes match the "SMXSTEGO" magic signature
 */
function matchesMagic(bytes: Uint8Array): boolean {
  if (bytes.length < STEGO_MAGIC.length) return false;
  for (let i = 0; i < STEGO_MAGIC.length; i++) {
    if (bytes[i] !== STEGO_MAGIC[i]) return false;
  }
  return true;
}

/**
 * Probes an image to detect if it contains a SamaXon steganography payload
 */
export function probeStegoHeader(imageData: ImageData): StegoHeaderInfo {
  const totalPixels = imageData.width * imageData.height;
  const availableChannels = totalPixels * 3;

  // Header requires at least 42 * 8 = 336 channels (112 pixels) in 1-bit mode
  if (availableChannels < HEADER_SIZE_BYTES * 4) {
    return { hasPayload: false, isCorrupted: false, errorMessage: 'Image is too small to contain a stego header.' };
  }

  // Try 1-bit mode first
  let modeToUse: 1 | 2 = 1;
  let headerBytes: Uint8Array | null = null;

  try {
    const magic1 = readBytesFromImageData(imageData, 8, 1);
    if (matchesMagic(magic1)) {
      modeToUse = 1;
      headerBytes = readBytesFromImageData(imageData, HEADER_SIZE_BYTES, 1);
    } else {
      // Try 2-bit mode
      const magic2 = readBytesFromImageData(imageData, 8, 2);
      if (matchesMagic(magic2)) {
        modeToUse = 2;
        headerBytes = readBytesFromImageData(imageData, HEADER_SIZE_BYTES, 2);
      }
    }
  } catch {
    return { hasPayload: false, isCorrupted: false };
  }

  if (!headerBytes) {
    return { hasPayload: false, isCorrupted: false };
  }

  // Parse Header fields
  let offset = 8;
  const version = headerBytes[offset++];
  const modeVal = headerBytes[offset++];
  const salt = headerBytes.slice(offset, offset + 16);
  offset += 16;
  const iv = headerBytes.slice(offset, offset + 12);
  offset += 12;

  const view = new DataView(headerBytes.buffer, headerBytes.byteOffset + offset, 4);
  const payloadLength = view.getUint32(0, false);

  // Validate payload length against image capacity
  const maxPossibleBytes = modeToUse === 1 
    ? Math.floor(availableChannels / 8) - HEADER_SIZE_BYTES 
    : Math.floor(availableChannels / 4) - HEADER_SIZE_BYTES;

  if (payloadLength <= 0 || payloadLength > maxPossibleBytes) {
    return {
      hasPayload: true,
      isCorrupted: true,
      version,
      mode: modeToUse,
      errorMessage: `Payload length (${payloadLength} bytes) exceeds available image space (${maxPossibleBytes} bytes). Image appears modified or corrupted.`
    };
  }

  return {
    hasPayload: true,
    isCorrupted: false,
    version,
    mode: modeToUse,
    salt,
    iv,
    payloadLength
  };
}

/**
 * Extracts ciphertext bytes from the image data following the header
 */
export function extractCiphertextFromImageData(
  imageData: ImageData,
  mode: 1 | 2,
  payloadLength: number
): Uint8Array {
  const totalBytes = HEADER_SIZE_BYTES + payloadLength;
  const allBytes = readBytesFromImageData(imageData, totalBytes, mode);
  return allBytes.slice(HEADER_SIZE_BYTES);
}

/**
 * Helper to sanitize filenames, preventing directory traversal and malicious characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'secret-document.dat';
  }
  // Strip path traversal sequences like ../ or ..\
  let clean = filename.replace(/\.\.+[/\\]/g, '');
  // Strip illegal filesystem characters: / \ ? % * : | " < >
  clean = clean.replace(/[/\\?%*:|"<>]/g, '_');
  // Trim spaces and dots
  clean = clean.trim().replace(/^\.+/, '');
  if (!clean) {
    return 'secret-document.dat';
  }
  return clean.slice(0, 120);
}

/**
 * Formats byte counts into human-readable strings (B, KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculates a standard entropy score (0 to 100) for passwords
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  tips: string[];
} {
  if (!password) {
    return { score: 0, label: 'Weak', tips: ['Enter a secure password to encrypt your secret data.'] };
  }

  let score = 0;
  const tips: string[] = [];

  // Length
  if (password.length >= 8) score += 25;
  else tips.push('Use at least 8 characters (12+ recommended)');

  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 15;

  // Character diversity
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 15;
  } else {
    tips.push('Mix uppercase and lowercase letters');
  }

  if (/\d/.test(password)) {
    score += 15;
  } else {
    tips.push('Include numbers (0-9)');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 10;
  } else {
    tips.push('Add special symbols (!@#$%^&*)');
  }

  let label: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' = 'Weak';
  if (score >= 80) label = 'Very Strong';
  else if (score >= 60) label = 'Strong';
  else if (score >= 35) label = 'Moderate';

  return { score: Math.min(100, score), label, tips };
}
