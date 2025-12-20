export const getBaseURL = (options?: { useCommitURL?: boolean }) => {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const isProd = env === "production";
  const isPreview = env === "preview";
  const url = isProd
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : isPreview
      ? process.env.NEXT_PUBLIC_PREVIEW_DOMAIN
      : options?.useCommitURL
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;

  return url
    ? `https://${url}`
    : `http://localhost:${process.env.PORT || 3000}`;
};
