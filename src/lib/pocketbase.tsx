import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db.aeroscraper.io");

pb.autoCancellation(false);

export default pb;
