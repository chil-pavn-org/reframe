# Task

Generate an interactive dual-perspective blog scenario about the following topic:

**Topic:** {{TOPIC}}

# Requirements

You must output a single JSON object with exactly this structure. No extra text, no markdown fences — just raw JSON.

## Structure

```
{
  "meta": {
    "title": "A compelling, short title (3-6 words)",
    "subtitle": "One sentence that sets up the conflict without spoiling it",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "questions": [ ... 3 questions ... ],
  "router": { ... },
  "perspectives": { ... }
}
```

## Questions (exactly 3)

Each question must sort the reader into one of two personality types that map to the two sides of the topic. The types should be named as short, evocative labels (like "fixer"/"feeler", "planner"/"explorer", "doer"/"collaborator").

Each question has:
- `id`: 1, 2, or 3
- `question`: A relatable, pop-culture or everyday scenario (1 sentence)
- `options`: Array of 2 options, each with `id` ("A" or "B"), `text` (the choice, < 8 words), `sub` (a witty one-liner justifying it), and `type` (one of the two personality type keys)

## Router

```
{
  "headline": "A short line after the quiz (e.g. 'We've found your match.')",
  "types": {
    "<typeA>": { "label": "Human-readable label for type A" },
    "<typeB>": { "label": "Human-readable label for type B" }
  },
  "options": {
    "mirror": {
      "title": "Mirror",
      "description": "One sentence — the reader wants validation",
      "footer": "Recommended for comfort"
    },
    "window": {
      "title": "Window",
      "description": "One sentence — the reader wants to be challenged",
      "footer": "Recommended for growth"
    }
  }
}
```

## Perspectives

Two perspective entries (keyed by the type names) + a bridge:

```
{
  "<typeA>": {
    "title": "An evocative title for this perspective",
    "subtitle": "A subtitle in first person, italic-worthy",
    "color": "blue",
    "content": "<p>HTML content — 4-6 paragraphs written in first person. Emotionally rich, literary, with dialogue. The reader should FEEL this person's reality. Use <em> for emphasis. Each paragraph in its own <p> tag.</p>"
  },
  "<typeB>": {
    "title": "...",
    "subtitle": "...",
    "color": "rose",
    "content": "<p>Same rules. The opposing perspective. Also valid. Also human.</p>"
  },
  "bridge": {
    "prompt": "A short philosophical line (e.g. 'There are two sides to every story.')",
    "cta": "Action text for the flip button (e.g. 'Flip the Narrative')"
  }
}
```

## Writing Guidelines

- Both perspectives must be equally sympathetic. No villain.
- Write in first person from each character's POV. Use specific, sensory details.
- Include at least one line of dialogue per perspective.
- The core conflict should be a value clash, not a factual disagreement.
- Keep the HTML clean — only use `<p>` and `<em>` tags.
- Total content per perspective: 150-250 words.
