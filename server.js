import express from 'express';
import ytdl from '@distube/ytdl-core';

const app = express();

app.get('/api/stream', async (req, res) => {
  const { url } = req.query;

  // Validasi URL YouTube
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

    // Menetapkan header konten
    stream.on('info', (info, format) => {
      res.setHeader('Content-Type', format.mimeType || 'video/mp4');
    });

    // Mengalirkan data ke client
    stream.pipe(res);
  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: 'Failed to stream from YouTube', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
