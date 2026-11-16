// Prompt evals for the interviewer (source/handoff/07-test-plan.md, part A).
// Plays scripted respondents against the local eval endpoint and writes
// transcripts plus automatic checks. Pass/fail on each scenario's "pass_if"
// is judged by reading the transcript.
//
// Usage: npm run dev:eval   (in another terminal; needs `wrangler login`)
//        npm run eval -- --model anthropic/claude-haiku-5.5 [--only E-01,E-02] [--fresh] [--label v2]
// --label keeps a separate results folder, so earlier runs stay for comparison.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    model: { type: "string" },
    only: { type: "string" },
    base: { type: "string", default: "http://localhost:8787" },
    fresh: { type: "boolean", default: false },
    label: { type: "string" },
  },
});
if (!args.model) {
  console.error("Missing --model, e.g. --model @cf/openai/gpt-oss-120b");
  process.exit(1);
}

const root = fileURLToPath(new URL("..", import.meta.url));
const { fixtures, filler: defaultFiller, scenarios } = JSON.parse(readFileSync(join(root, "prompt-evals/scenarios.json"), "utf8"));
const templates = JSON.parse(readFileSync(join(root, "src/shared/templates.json"), "utf8"));
const modelDir = args.model.replace(/[@/]/g, "_").replace(/^_+/, "");
const outDir = join(root, "prompt-evals/results", args.label ? `${modelDir}-${args.label}` : modelDir);
if (args.fresh) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// USD per million tokens [input, output], uncached (2026-11-16). Workers AI
// models: Cloudflare pricing page; Claude: Anthropic list prices.
const PRICES = {
  "@cf/openai/gpt-oss-120b": [0.35, 0.75],
  "@cf/aisingapore/gemma-sea-lion-v4-27b-it": [0.351, 0.555],
  "@cf/google/gemma-4-26b-a4b-it": [0.1, 0.3],
  "anthropic/claude-haiku-5.5": [0.1, 0.5],
  "anthropic/claude-sonnet-5.5": [2, 10],
};
const FLATTERY = /\b(great|love that|awesome|amazing|excellent|wonderful|fantastic|perfect|good question|good catch|brilliant)\b/i;
const words = (text) => text.trim().split(/\s+/).length;

function priorityReply(requirements, labels) {
  if (!requirements.length) return `My priorities: the first thing is ${labels[0]}, the rest are ${labels[1]}.`;
  const marks = requirements.map((item, i) => {
    const label = i === 0 ? labels[0] : i === requirements.length - 1 && i > 1 ? labels[2] : labels[1];
    return `"${item.text}": ${label}`;
  });
  return `My priorities: ${marks.join("; ")}.`;
}

async function runScenario(scenario) {
  const fixture = fixtures[scenario.fixture];
  const template = templates[fixture.template];
  const setup = { ...fixture.setup, map: template.map, focus_rule: template.focus_rule };
  const replies = [...scenario.replies];
  const landingReplies = [...(scenario.landing_replies ?? [])];
  const filler = scenario.filler ?? defaultFiller;
  const maxTurns = setup.budget + 8; // NFR-03 per-session AI turn cap

  const history = [];
  const turns = [];
  let state = { panel: [], steps: [], requirements: [] };
  let count = 0;
  let prioritiesDone = false;
  let lastKind = null;
  let fillerIndex = 0;
  let stopReason = "script finished";

  for (let i = 0; i < maxTurns; i++) {
    const response = await fetch(`${args.base}/eval/turn`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: args.model, setup, basics: fixture.basics, priority_labels: template.priority_labels,
        count, priorities_done: prioritiesDone, last_kind: lastKind, history, state,
      }),
    });
    const body = await response.json().catch(() => ({ error: "model_error", message: `HTTP ${response.status}` }));
    if (!response.ok) {
      turns.push({ error: body, usage: body.usage });
      stopReason = body.error;
      if (body.error === "model_error") return { turns, stopReason, fatal: body.message };
      break;
    }
    const { output } = body;
    state = body.state;
    if (["question", "offer"].includes(output.kind)) count++;
    if (output.kind === "priorities") prioritiesDone = true;
    lastKind = output.kind;
    turns.push({ output, usage: body.usage, retried: body.retried, anomalies: body.anomalies, count });
    history.push({ role: "interviewer", text: output.say });

    let reply;
    // The respondent confirms the landing with the app's Confirm button (ADR-002).
    if (output.kind === "landing" && !landingReplies.length) { stopReason = "confirmed"; break; }
    if (output.kind === "landing") reply = landingReplies.shift();
    else if (output.kind === "priorities") reply = priorityReply(state.requirements, template.priority_labels);
    else if (output.kind === "checkpoint") reply = "Keep going.";
    else if (replies.length) reply = replies.shift();
    else if (!scenario.run_to_end) break;
    else reply = filler[fillerIndex++ % filler.length];
    if (i === maxTurns - 1) stopReason = "turn cap reached";
    turns[turns.length - 1].reply = reply;
    history.push({ role: "respondent", text: reply });
  }
  return { turns, stopReason, state, count };
}

function checks(scenario, result) {
  const budget = fixtures[scenario.fixture].setup.budget;
  const ok = result.turns.filter((turn) => turn.output);
  const found = [];
  const invalid = result.turns.filter((turn) => ["invalid_json", "invalid_output"].includes(turn.error?.error)).length;
  const retries = ok.filter((turn) => turn.retried).length;
  if (invalid) found.push(`FAIL invalid or disallowed reply after retry (${invalid})`);
  if (retries) found.push(`note: needed JSON retry ${retries}x`);
  if (result.count > budget) found.push(`FAIL asked ${result.count} questions, budget ${budget}`);
  for (const [i, turn] of ok.entries()) {
    const { say, kind } = turn.output;
    if (FLATTERY.test(say)) found.push(`FAIL flattery at turn ${i + 1}: "${say.match(FLATTERY)[0]}"`);
    if (["question", "offer"].includes(kind) && (say.match(/\?/g) ?? []).length > 1) found.push(`check: turn ${i + 1} has more than one "?"`);
    if (kind === "question" && words(say) > 40) found.push(`check: turn ${i + 1} question is ${words(say)} words (limit 40)`);
    if (kind === "reflect" && words(say) > 80) found.push(`check: turn ${i + 1} reflection is ${words(say)} words (limit 80)`);
    for (const anomaly of turn.anomalies ?? []) found.push(`check: turn ${i + 1} ${anomaly}`);
  }
  if (scenario.run_to_end) {
    const kinds = ok.map((turn) => turn.output.kind);
    if (!kinds.includes("priorities")) found.push("FAIL never reached priorities");
    if (!kinds.includes("landing")) found.push("FAIL never reached landing");
  }
  return found;
}

function cost(turns) {
  const [inRate, outRate] = PRICES[args.model] ?? [0, 0];
  let input = 0, output = 0;
  for (const usage of turns.flatMap((turn) => turn.usage ?? [])) {
    input += usage.prompt_tokens ?? usage.input_tokens ?? 0;
    output += usage.completion_tokens ?? usage.output_tokens ?? 0;
  }
  return { input, output, usd: (input * inRate + output * outRate) / 1e6 };
}

function writeReport() {
  const results = readdirSync(outDir).filter((f) => /^E-\d+\.json$/.test(f)).sort()
    .map((f) => JSON.parse(readFileSync(join(outDir, f), "utf8")));
  // Older records stored neurons; 1,000 neurons = $0.011.
  const total = results.reduce((sum, r) => sum + (r.cost.usd ?? r.cost.neurons * 0.000011), 0);
  const lines = [
    `# Interviewer evals: ${args.model}`,
    "",
    `Estimated cost: $${total.toFixed(3)} (uncached list prices).`,
    "",
    "| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...results.map((r) => `| ${r.id} | ${r.name} | ${r.turns.length} | ${r.count ?? "-"} | ${r.stopReason} | ${r.findings.join("<br>") || "none"} | pending |`),
    "",
  ];
  for (const r of results) {
    lines.push(`## ${r.id} ${r.name}`, "", `Pass if: ${r.pass_if}`, "");
    for (const [i, turn] of r.turns.entries()) {
      if (turn.error) { lines.push(`${i + 1}. **ERROR** \`${JSON.stringify(turn.error).slice(0, 400)}\``); continue; }
      const { say, kind, options = [], their_question } = turn.output;
      lines.push(`${i + 1}. **Interviewer** _(${kind})_: ${say.replace(/\n/g, "\n   ")}`);
      if (options.length) lines.push(`   - options: ${options.join(" | ")}`);
      if (their_question) lines.push(`   - their_question: ${their_question}`);
      if (turn.reply) lines.push(`   - **Respondent**: ${turn.reply}`);
    }
    lines.push("");
  }
  writeFileSync(join(outDir, "REPORT.md"), lines.join("\n"));
  return total;
}

const only = args.only?.split(",");
for (const scenario of scenarios) {
  if (only && !only.includes(scenario.id)) continue;
  const file = join(outDir, `${scenario.id}.json`);
  if (existsSync(file)) { console.log(`${scenario.id} already done, skipping`); continue; }
  process.stdout.write(`${scenario.id} ${scenario.name}... `);
  const result = await runScenario(scenario);
  if (result.fatal) {
    console.log(`\nModel error, stopping (finished scenarios are kept; rerun to resume): ${result.fatal}`);
    break;
  }
  const record = { id: scenario.id, name: scenario.name, pass_if: scenario.pass_if, ...result, cost: cost(result.turns) };
  record.findings = checks(scenario, record);
  writeFileSync(file, JSON.stringify(record, null, 2));
  console.log(`${result.turns.length} turns, ~$${record.cost.usd.toFixed(3)}, ${record.findings.length} findings`);
}
console.log(`Report: ${join(outDir, "REPORT.md")} (~$${writeReport().toFixed(3)} so far)`);
