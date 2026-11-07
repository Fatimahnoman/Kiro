/**
 * The Code Exorcist engine — a real, dependency-free static analyzer for
 * JavaScript / TypeScript snippets. It detects a curated set of common
 * syntax & logic "hauntings" and produces a cleaned version of the code.
 *
 * This runs server-side inside the SSE route so the demo performs genuine
 * work on whatever snippet the user submits (no LLM, no external services).
 */

export type BugSeverity = "syntax" | "logic" | "smell";

export interface Haunting {
  /** 1-based line number where the bug was found. */
  line: number;
  severity: BugSeverity;
  /** Short machine-ish rule id, e.g. "loose-equality". */
  rule: string;
  /** Human (spooky) explanation of the problem. */
  message: string;
  /** How the exorcist banished it. */
  fix: string;
}

export interface ExorcismResult {
  hauntings: Haunting[];
  cleanedCode: string;
  /** True when the input had no detectable demons. */
  pristine: boolean;
}

const MAX_INPUT = 8000;

/** A couple of default cursed snippets used when the user submits nothing. */
export const SAMPLE_CURSED_CODE = `function getUser(id) {
  var result = null
  if (id == null) {
    console.log("no id")
  }
  for (var i = 0; i < users.length; i++) {
    if (users[i].id = id) {
      result == users[i]
    }
  }
  return result
}`;

/** Strip string / comment contents so detectors don't match inside them. */
function maskLiterals(line: string): string {
  return line
    // block/line comments
    .replace(/\/\/.*$/g, (m) => " ".repeat(m.length))
    // double / single / template strings
    .replace(/"(?:[^"\\]|\\.)*"/g, (m) => " ".repeat(m.length))
    .replace(/'(?:[^'\\]|\\.)*'/g, (m) => " ".repeat(m.length))
    .replace(/`(?:[^`\\]|\\.)*`/g, (m) => " ".repeat(m.length));
}

/**
 * Detect and fix a line, returning the (possibly) rewritten line plus any
 * hauntings found on it. Order matters: we fix assignment-in-condition before
 * loose-equality so `=` inside `if(...)` becomes `===`, not skipped.
 */
function exorciseLine(
  raw: string,
  lineNo: number,
): { fixed: string; hauntings: Haunting[] } {
  const hauntings: Haunting[] = [];
  let fixed = raw;
  const masked = maskLiterals(raw);

  // 1. Assignment used inside an if/while condition: `if (x = y)` → `===`
  const condAssign = /\b(if|while)\s*\(([^)]*?[^=!<>])=([^=][^)]*)\)/;
  if (condAssign.test(masked)) {
    fixed = fixed.replace(condAssign, (_m, kw, a, b) => `${kw} (${a}===${b})`);
    hauntings.push({
      line: lineNo,
      severity: "logic",
      rule: "assignment-in-condition",
      message:
        "A single `=` inside a condition assigns instead of compares — a classic poltergeist.",
      fix: "Replaced `=` with strict equality `===`.",
    });
  }

  // 2. Loose equality `==` / `!=` (not already `===`/`!==`) → strict.
  const loose = /([^=!<>])([=!])=([^=])/;
  if (loose.test(maskLiterals(fixed))) {
    fixed = fixed.replace(/([^=!<>])([=!])=([^=])/g, "$1$2==$3");
    hauntings.push({
      line: lineNo,
      severity: "logic",
      rule: "loose-equality",
      message: "Loose equality (`==`/`!=`) summons type-coercion spirits.",
      fix: "Upgraded to strict equality (`===`/`!==`).",
    });
  }

  // 3. `var` declarations → `let` (block scoping).
  if (/\bvar\s+/.test(maskLiterals(fixed))) {
    fixed = fixed.replace(/\bvar\b/g, "let");
    hauntings.push({
      line: lineNo,
      severity: "smell",
      rule: "no-var",
      message: "`var` leaks across scopes like an unquiet ghost.",
      fix: "Rebound the declaration with block-scoped `let`.",
    });
  }

  // 4. Stray `console.log` → removed (commented out).
  if (/\bconsole\.(log|debug)\s*\(/.test(maskLiterals(fixed))) {
    fixed = fixed.replace(/^(\s*)/, "$1// [exorcised] ");
    hauntings.push({
      line: lineNo,
      severity: "smell",
      rule: "no-console",
      message: "A `console.log` haunting was left behind in the crypt.",
      fix: "Banished the debug incantation (commented out).",
    });
  }

  // 5. Missing semicolon on a simple statement (heuristic, literal-masked).
  const trimmed = maskLiterals(fixed).trimEnd();
  const endsClean = /[;{}\s)]\s*$/.test(trimmed) || trimmed === "";
  const looksStatement =
    /\b(return|let|const|var|break|continue)\b/.test(trimmed) ||
    /[)\w\]"'`]\s*$/.test(trimmed);
  const isControl = /\b(if|for|while|else|function|switch|try|catch)\b/.test(
    trimmed,
  );
  if (!endsClean && looksStatement && !isControl && trimmed.length > 0) {
    fixed = fixed.replace(/\s*$/, ";");
    hauntings.push({
      line: lineNo,
      severity: "syntax",
      rule: "missing-semicolon",
      message: "A statement drifts without its closing semicolon.",
      fix: "Sealed the line with a `;`.",
    });
  }

  return { fixed, hauntings };
}

/** Whole-snippet bracket-balance check (syntax demon). */
function checkBracketBalance(code: string): Haunting | null {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const opens = new Set(["(", "[", "{"]);
  const stack: { ch: string; line: number }[] = [];
  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const masked = maskLiterals(lines[i]);
    for (const ch of masked) {
      if (opens.has(ch)) {
        stack.push({ ch, line: i + 1 });
      } else if (ch in pairs) {
        const top = stack.pop();
        if (!top || top.ch !== pairs[ch]) {
          return {
            line: i + 1,
            severity: "syntax",
            rule: "unbalanced-brackets",
            message: `Mismatched '${ch}' — a bracket demon broke the seal.`,
            fix: "Flagged for manual review (brackets left untouched).",
          };
        }
      }
    }
  }
  if (stack.length > 0) {
    const first = stack[0];
    return {
      line: first.line,
      severity: "syntax",
      rule: "unbalanced-brackets",
      message: `Unclosed '${first.ch}' opened here and never sealed.`,
      fix: "Flagged for manual review (brackets left untouched).",
    };
  }
  return null;
}

/** Run the full exorcism on a snippet. */
export function exorcise(input: string): ExorcismResult {
  const code = (input ?? "").slice(0, MAX_INPUT);
  const lines = code.length > 0 ? code.split("\n") : [];

  const hauntings: Haunting[] = [];

  const bracket = checkBracketBalance(code);
  if (bracket) hauntings.push(bracket);

  const fixedLines = lines.map((line, i) => {
    const { fixed, hauntings: found } = exorciseLine(line, i + 1);
    hauntings.push(...found);
    return fixed;
  });

  // Sort hauntings by line for a tidy report.
  hauntings.sort((a, b) => a.line - b.line);

  return {
    hauntings,
    cleanedCode: fixedLines.join("\n"),
    pristine: hauntings.length === 0,
  };
}
