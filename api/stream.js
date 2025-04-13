// api/stream.js
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  console.log(`Requesting stream for URL: ${url}`);

  try {
    // Set the headers to avoid CORS errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store'); // Prevent caching

    // Request and pipe the stream from YouTube
    const stream = ytdl(url, {
      quality: 'highest',
      filter: 'audioandvideo',
      requestOptions: {
        headers: {
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        }
      }
    });

    // Send the video stream to the client
    stream.on('info', (info, format) => {
      res.setHeader('Content-Type', format.mimeType || 'video/mp4');
    });

    stream.pipe(res);  // Pipe the stream response directly to the client

  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: 'Failed to stream from YouTube' });
  }
}
