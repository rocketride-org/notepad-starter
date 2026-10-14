import type { PipelineConfig } from 'rocketride';
import type { Note } from './notes';
import { getClient } from './rocketride';

/**
 * The Summarize pipeline: the note comes in as text, becomes a question, gets the
 * summarizing instructions, and goes to Claude. The model key is resolved on the
 * server from RocketRide Variables, so it never reaches the browser.
 */
export const ASSIST_PIPELINE: PipelineConfig = {
  name: 'Notepad assist',
  components: [
    {
      id: 'webhook_1',
      provider: 'webhook',
      config: { hideForm: true, mode: 'Source', parameters: {}, type: 'webhook' },
    },
    {
      id: 'question_1',
      provider: 'question',
      config: {},
      input: [{ lane: 'text', from: 'webhook_1' }],
    },
    {
      id: 'prompt_1',
      provider: 'prompt',
      config: {
        instructions: ['Summarize this note in 3 to 5 short bullet points. Reply with only the bullets.'],
        parameters: {},
      },
      input: [{ lane: 'questions', from: 'question_1' }],
    },
    {
      id: 'llm_anthropic_1',
      provider: 'llm_anthropic',
      config: {
        profile: 'claude-sonnet-4-6',
        'claude-sonnet-4-6': { apikey: '${ROCKETRIDE_ANTHROPIC_KEY}' },
        parameters: {},
      },
      input: [{ lane: 'questions', from: 'prompt_1' }],
    },
    {
      id: 'response_answers_1',
      provider: 'response_answers',
      config: { laneName: 'answers' },
      input: [{ lane: 'answers', from: 'llm_anthropic_1' }],
    },
  ],
  source: 'webhook_1',
  project_id: 'd0be2077-032f-4d96-b936-7984da5dd404',
  viewport: { x: 0, y: 0, zoom: 1 },
  version: 1,
};

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
