import { createClient, type Entry, type EntrySkeletonType } from 'contentful';

/* Env variables */
const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_CDA_TOKEN;

if (!space || !environment || !accessToken) {
  throw new Error(
    '❌ Missing Contentful env vars. Set VITE_CONTENTFUL_SPACE_ID, VITE_CONTENTFUL_ENVIRONMENT_ID, VITE_CONTENTFUL_CDA_TOKEN.'
  );
}

/* Production client (Delivery API) */
export const contentful = createClient({
  space,
  environment,
  accessToken,
  host: 'cdn.contentful.com', // switch to 'preview.contentful.com' for draft preview
});

/* Strongly-typed fetch helpers */
export async function getEntries<T extends EntrySkeletonType>(
  params: Record<string, any>
): Promise<Entry<T>[]> {
  const res = await contentful.getEntries<T>(params);
  return res.items;
}

export async function getEntry<T extends EntrySkeletonType>(
  id: string
): Promise<Entry<T>> {
  return await contentful.getEntry<T>(id);
}
