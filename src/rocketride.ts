import { RocketRideClient } from 'rocketride';
import type { Note } from './notes';

// Vite exposes VITE_* variables to the browser. Fine for a local workshop;
// never ship a real API key in a deployed browser bundle.
const env = {
  ROCKETRIDE_URI: import.meta.env.VITE_ROCKETRIDE_URI ?? 'https://api.rocketride.ai',
  ROCKETRIDE_APIKEY: import.meta.env.VITE_ROCKETRIDE_APIKEY ?? '',
};

let client: RocketRideClient | null = null;

/** One shared, connected client. Connects on first use. */
export async function getClient(): Promise<RocketRideClient> {
  if (!client) {
    client = new RocketRideClient({ uri: env.ROCKETRIDE_URI, auth: env.ROCKETRIDE_APIKEY, env });
  }
  if (!client.isConnected()) await client.connect();
  return client;
}

/** The single pipeline-backed feature. Returns text to show the user. */
export async function runAssist(note: Note): Promise<string> {
  const rr = await getClient();
  // TODO(joshua): start the pipeline and send the note, for example:
  //   const { token } = await rr.use({ pipeline, useExisting: true });
  //   const result = await rr.send(token, note.body, {}, 'text/plain');
  //   return String(result.answers?.[0] ?? '');
  void rr;
  return `TODO(joshua): pipeline result for "${note.title}"`;
}
