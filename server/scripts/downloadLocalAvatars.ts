import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATAR_MAP: Record<string, string> = {
  'user_me.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'user_me_alt.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'ananya_roy.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'ananya_roy_alt.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'diya_mehta.jpg': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'diya_mehta_alt.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'meera_nambiar.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'meera_nambiar_alt.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'riya_kapoor.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'riya_kapoor_alt.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'tanvi_deshmukh.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'tanvi_deshmukh_alt.jpg': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'isha_sengupta.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'isha_sengupta_alt.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'kavya_venkat.jpg': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
  'kavya_venkat_alt.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'sneha_kulkarni.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'sneha_kulkarni_alt.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'pooja_sharma.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'pooja_sharma_alt.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'aditi_chawla.jpg': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'aditi_chawla_alt.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'default_avatar.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
};

const SERVER_DEST = path.resolve(__dirname, '../public/avatars');
const APP_DEST = path.resolve(__dirname, '../../app/public/avatars');

fs.mkdirSync(SERVER_DEST, { recursive: true });
fs.mkdirSync(APP_DEST, { recursive: true });

function downloadFile(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverFilePath = path.join(SERVER_DEST, filename);
    const appFilePath = path.join(APP_DEST, filename);

    const fileStream = fs.createWriteStream(serverFilePath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location!, filename).then(resolve).catch(reject);
        return;
      }
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          // Copy to app/public/avatars as well
          fs.copyFileSync(serverFilePath, appFilePath);
          console.log(`✅ Saved ${filename} locally to server & app!`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(serverFilePath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('📥 Downloading and storing verified avatars locally in server/public/avatars...');
  for (const [filename, url] of Object.entries(AVATAR_MAP)) {
    try {
      await downloadFile(url, filename);
    } catch (err: any) {
      console.error(`Failed to download ${filename}:`, err.message);
    }
  }
  console.log('🎉 All avatar photos stored locally on our own server!');
}

run();
