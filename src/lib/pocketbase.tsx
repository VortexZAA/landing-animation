import PocketBase from 'pocketbase';

const pb = new PocketBase("https://db.aeroscraper.io");

pb.autoCancellation(false);

export default pb;
