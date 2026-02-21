# Task

Generate a narrative blog post (a story/parable) about the following topic:

**Topic:** {{TOPIC}}

# Requirements

You must output a single JSON object with exactly this structure. No extra text, no markdown fences — just raw JSON.

## Structure

```
{
  "meta": {
    "title": "A compelling, short title (2-5 words)",
    "subtitle": "One sentence that hints at the theme without spoiling the ending",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "content": {
    "sections": [ ... ]
  }
}
```

## Sections

The story should be told through a sequence of typed sections. Use these section types:

### `narrative`
Opening or connecting prose. Sets the scene. No label needed.
```
{ "type": "narrative", "content": "<p>HTML paragraphs...</p>" }
```

### `scene`
A distinct beat/chapter in the story. Has a label (short chapter title).
```
{ "type": "scene", "label": "A Short Label", "content": "<p>HTML paragraphs...</p>" }
```

### `reflection`
A pause — the narrator steps back to reflect on what just happened. Feels philosophical. Usually shorter, more poetic.
```
{ "type": "reflection", "content": "<p>HTML paragraphs...</p>" }
```

### `takeaway`
The closing message. The moral or insight. This renders in a dark callout box, so make it punchy and memorable.
```
{ "type": "takeaway", "content": "<p>HTML paragraphs...</p>" }
```

## Recommended Structure

1. Start with a `narrative` section (set the scene, introduce characters)
2. 2-4 `scene` sections (the story beats, each with a label)
3. A `reflection` section (the philosophical turn)
4. End with a `takeaway` section (the punchline/moral)

## Writing Guidelines

- Tell a story, not an essay. Use characters, dialogue, sensory details.
- The story should be a metaphor that maps to a real-life lesson.
- Write in third person or second person. Literary but accessible.
- Use `<em>` for internal thoughts or emphasis. Use `<p>` for paragraphs.
- Keep it vivid but concise. Total length: 400-700 words across all sections.
- The takeaway should be 1-3 sentences. Pithy. Quotable.
- No lists, no headers inside content — pure prose.
