import { RocketRideClient } from 'rocketride';

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
