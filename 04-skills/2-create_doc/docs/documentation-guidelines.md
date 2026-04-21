# 🎯 Documentation guidelines

## Structure

Each documentation file follows this template:

```markdown
# 🎯 [Category]: [Title]

## 💡 Convention

[Convention summary - 1-2 sentences explaining the rule.]

## 🏆 Benefits

- [Benefit 1.]
- [Benefit 2.]
- [Benefit 3.]

## 👀 Examples

### ✅ Good: [Brief description of the good practice]

[Code block or description.]

### ❌ Bad: [Brief description of the bad practice]

[Code block or description.]

## 🧐 Real world examples

- [`Component/File Name`](./path/to/file.tsx)
- [`Another Component`](./path/to/another/file.ts)

## ☝️ Exceptional cases: When to not take into account this convention

[List of cases where exceptions are valid.]

### 🥽 Example of exceptional case

[Description of the exceptional case context.]

[Code block or description showing the valid exception.]

## 🔗 Related agreements

- [Related agreement title](./path-to-related-agreement.md).
- [Another related agreement](./path-to-another-agreement.md).
```

## Title and file name

The filename is critical: AI agents use it to decide whether to load the document or not. A descriptive filename ensures the convention is discovered and applied; a vague one means it will be ignored.

Use kebab-case for the filename, derived from the title. Reflect in the title and filename the actual convention instead of the generic category or concept. That is, if the convention is about "Frontend and backend communication", the title should be "Frontend and Backend Communication via Use Cases" instead of "Frontend and Backend Communication", and the filename should be "frontend-backend-communication-via-use-cases.md" instead of "frontend-and-backend-communication.md".

Examples:

- "Frontend and backend communication via use cases" → `frontend-backend-communication-via-use-cases.md`.
- "Use NOT NULL in fields" → `not-null-fields.md`.
- "Avoid premature abstractions" → `avoid-premature-abstractions.md`.
- "React hooks organization" → `react-hooks-organization.md`.

## Good and bad examples

- Use H4 (`####`) sub-headings only when there are multiple examples within a good or bad section.
- Use the appropriate code language in fenced code blocks.
- Avoid code comments in the example snippets. Provide a brief description between the heading and the code block only if really necessary. It is important to keep the examples as brief as possible, so try to avoid adding a description if you can already express the idea in the example heading.

## Optional sections

- If the convention doesn't have exceptional cases, omit the "Exceptional cases" section entirely.
- If there are no real world examples, omit the "Real world examples" section entirely.
- If there are no related agreements, omit the "Related agreements" section entirely.

## Style

- Maximize information density: convey as much as possible in as few words as possible.
- End each phrase with a period, including bullet point items.
- Avoid documenting with the whole phrase in strong emphasis.

## Reference example

See [`docs/database/not-null-fields.md`](database/not-null-fields.md) as a complete example of correctly structured documentation.
