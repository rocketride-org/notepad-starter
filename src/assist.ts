import type { PipelineConfig } from 'rocketride';
import pipeline from './assist-pipeline.json';
import type { Note } from './notes';
import { getClient } from './rocketride';

/**
 * The Summarize pipeline (src/assist-pipeline.json): the note comes in as text,
 * becomes a question, gets the summarizing instructions, and goes to Claude. The
 * model key is resolved on the server from RocketRide Variables, so it never
 * reaches the browser.
 */
export const ASSIST_PIPELINE: PipelineConfig = pipeline;

/** Summarizes the note with the pipeline. Returns the text to show under the editor. */
export async function runAssist(note: Note): Promise<string> {
  if (!note.body.trim()) {
    return 'Write something first.';
  }
  const rr = await getClient();
  // useExisting attaches to the running pipeline instead of failing with "already running".
  const { token } = await rr.use({ pipeline: ASSIST_PIPELINE, useExisting: true });
  const result = await rr.send(token, note.body, {}, 'text/plain');
  const answers = result?.answers as unknown[] | undefined;
  return String(answers?.[0] ?? 'No answer came back.');
}
