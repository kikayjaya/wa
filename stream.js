// api/stream.js
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const stream = ytdl(url, {
      quality: 'highest',
      filter: 'audioandvideo',
      requestOptions: {
        headers: {
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        }
      }
    });

    stream.on('info', (info, format) => {
      res.setHeader('Content-Type', format.mimeType || 'video/mp4');
    });

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to stream from YouTube' });
  }
}
