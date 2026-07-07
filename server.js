/**
 * server.js — Express adapter for Render deployment
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { handler as statsHandler }       from './netlify/functions/stats.js';
import { handler as sportsHandler }      from './netlify/functions/sports.js';
import { handler as teamsHandler }       from './netlify/functions/teams.js';
import { handler as leaderboardHandler } from './netlify/functions/leaderboard.js';
import { handler as bracketHandler }     from './netlify/functions/bracket.js';
import { handler as scorersHandler }     from './netlify/functions/scorers.js';
import { handler as scheduleHandler }    from './netlify/functions/schedule.js';
import { handler as galleryHandler }      from './netlify/functions/gallery.js';
import { handler as participantsHandler } from './netlify/functions/participants.js';
import { handler as medalsHandler }       from './netlify/functions/medals.js';
import { handler as debugHandler }        from './netlify/functions/debug.js';

const app  = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

function adapt(handler) {
  return async (req, res) => {
    const event = {
      httpMethod:            req.method,
      queryStringParameters: req.query || {},
      headers:               req.headers,
      body:                  JSON.stringify(req.body),
    };
    try {
      const result = await handler(event);
      res.status(result.statusCode).set(result.headers || {}).send(result.body);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
}

app.all('/api/stats',       adapt(statsHandler));
app.all('/api/sports',      adapt(sportsHandler));
app.all('/api/teams',       adapt(teamsHandler));
app.all('/api/leaderboard', adapt(leaderboardHandler));
app.all('/api/bracket',     adapt(bracketHandler));
app.all('/api/scorers',     adapt(scorersHandler));
app.all('/api/schedule',    adapt(scheduleHandler));
app.all('/api/gallery',       adapt(galleryHandler));
app.all('/api/participants', adapt(participantsHandler));
app.all('/api/medals',      adapt(medalsHandler));
app.all('/api/debug',       adapt(debugHandler));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
