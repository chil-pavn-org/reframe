import { LLMAdapter } from './base.js';
import { spawn } from 'child_process';

export class ClaudeCLIAdapter extends LLMAdapter {
  get name() { return 'claude-cli'; }

  async generate(prompt) {
    return new Promise((resolve, reject) => {
      // Use claude -p (print/non-interactive mode) — uses the existing Claude Code
      // subscription, no API key required. Prompt is passed via stdin to avoid
      // any argument length limits on long prompts.
      // Unset CLAUDECODE so the child doesn't think it's a nested session.
      const env = { ...process.env };
      delete env.CLAUDECODE;

      const proc = spawn('claude', ['-p', '--output-format', 'text'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => { stdout += data.toString(); });
      proc.stderr.on('data', (data) => { stderr += data.toString(); });

      proc.on('error', (err) => {
        reject(new Error(`Failed to spawn claude CLI: ${err.message}`));
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`claude CLI exited ${code}: ${stderr.trim()}`));
        } else {
          resolve(stdout.trim());
        }
      });

      proc.stdin.write(prompt);
      proc.stdin.end();
    });
  }
}
