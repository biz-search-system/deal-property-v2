import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

interface ParsedData {
  mimeType: string;
  extension: string;
  blob: Buffer;
}

interface FileUploadOptions {
  key: string;
  file: File;
}

interface DataUrlUploadOptions {
  key: string;
  dataUrl: string;
}

// 環境変数のバリデーション
const getS3Config = (): S3Config => {
  const config = {
    endpoint: process.env.CLOUDFLARE_S3_ENDPOINT,
    accessKeyId: process.env.CLOUDFLARE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_S3_SECRET_ACCESS_KEY,
    bucket: process.env.CLOUDFLARE_S3_BUCKET,
    publicUrl: process.env.CLOUDFLARE_S3_PUBLIC_URL,
  };
  // console.log(config);

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(
        `Missing required environment variable: CLOUDFLARE_S3_${key.toUpperCase()}`
      );
    }
  }

  return config as S3Config;
};

// S3クライアントの初期化
const createS3Client = (config: S3Config) => {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

const config = getS3Config();
const S3 = createS3Client(config);

/**
 * dataUrl の場合画像をアップロードし、URLを返す
 * @param key
 * @param imageURL imageUrl or dataUrl
 * @returns
 */
export const resolveImageUpload = async (
  key: string,
  imageUrl: string
): Promise<string> => {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  } else {
    return upload({ key, dataUrl: imageUrl });
  }
};

export const upload = async (
  options: FileUploadOptions | DataUrlUploadOptions
): Promise<string> => {
  const isDataUrl = "dataUrl" in options;
  const data = isDataUrl
    ? parseDataUrl(options.dataUrl)
    : await parseFile(options.file);

  const key = `${options.key}.${data.extension}`;
  console.log("key", key);

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: data.blob,
    ContentEncoding: isDataUrl ? "base64" : undefined,
    ContentType: data.mimeType,
  });

  await S3.send(command);

  // console.log(`${config.publicUrl}/${key}`);

  return `${config.publicUrl}/${key}`;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: fileName,
  });

  await S3.send(command);
};

const parseDataUrl = (dataUrl: string): ParsedData => {
  const [mimeTypeWithPrefix, base64] = dataUrl.split(";base64,");
  const mimeType = mimeTypeWithPrefix?.replace("data:", "");
  const extension = mimeType?.split("/")[1];

  if (!mimeType || !extension || !base64) {
    throw new Error("Invalid data URL format");
  }

  try {
    return {
      mimeType,
      extension,
      blob: Buffer.from(base64, "base64"),
    };
  } catch (error) {
    throw new Error("Failed to decode base64 data");
  }
};

const parseFile = async (file: File): Promise<ParsedData> => {
  if (!file.type) {
    throw new Error("File type is required");
  }

  const extension = file.type.split("/")[1];

  if (!extension) {
    throw new Error("Invalid file type");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    return {
      mimeType: file.type,
      extension,
      blob: Buffer.from(arrayBuffer),
    };
  } catch (error) {
    throw new Error(
      `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
