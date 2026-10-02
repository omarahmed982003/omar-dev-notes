# Astro Starlight Multi-Course Instructions

This repository contains one Astro Starlight website with multiple independent course modules, including Git, .NET, and Object-Oriented Programming (OOP).

These instructions define how to select the active module, conduct a study session, turn completed material into documentation, and avoid mixing courses.

## Mandatory Session Bootstrap

At the beginning of every new conversation or study session, read `STUDY_SESSION_CONTEXT.md` completely before teaching, assessing, choosing a module, or editing course content.

- Use it as the central router and session handoff document.
- Then read the selected track's complete Master Prompt and Progress file.
- The selected track's Progress file remains the only source of truth for its exact current checkpoint, status, score, evidence, and next action.
- If the summary in `STUDY_SESSION_CONTEXT.md` conflicts with a Progress file, follow the Progress file and update the summary.
- After a study session changes progress, update both the track's Progress file and the concise current-state section in `STUDY_SESSION_CONTEXT.md`.

## Development

When starting the development server, use the project's supported background command when available:

```bash
astro dev --background
```

Manage it with:

```bash
astro dev status
astro dev logs
astro dev stop
```

If these commands are not supported by the installed Astro version or package scripts, inspect `package.json` and use the project's existing development command instead.

Before changing Astro behavior, consult the relevant official Astro documentation when necessary:

- Routing: https://docs.astro.build/en/guides/routing/
- Astro components: https://docs.astro.build/en/basics/astro-components/
- Framework components: https://docs.astro.build/en/guides/framework-components/
- Content collections: https://docs.astro.build/en/guides/content-collections/
- Styling: https://docs.astro.build/en/guides/styling/
- Internationalization: https://docs.astro.build/en/guides/internationalization/

## Mandatory Module Router

Determine the active module from the student's current request before teaching, creating lessons, or editing files.

Recognized commands include:

- `Git Mode`
- `كمل Git`
- `اعمل درس Git`
- `عدّل Git`
- `OOP Mode`
- `كمل OOP`
- `اعمل درس OOP`
- `عدّل OOP`
- `.NET Mode`
- `اشرح .NET`
- `اعمل درس .NET`
- `ضيفه في الدوكس`
- `عدّل .NET`

If the active module is genuinely unclear and the requested action could modify files, ask whether the target is Git, OOP, or .NET before editing.

Once selected, keep that module active for the current discussion until the student explicitly switches modules or clearly identifies another module.

Never mix:

- Content directories.
- Routes.
- Sidebars.
- Phase groups.
- Study progress.
- Lesson source material.

## Inspect Before Editing

Before creating or modifying any public lesson:

1. Inspect the current project structure.
2. Inspect `astro.config.mjs` and relevant configuration files.
3. Find the existing module registration.
4. Find that module's existing English and Arabic Overview pages.
5. Find existing lessons for the same module.
6. Inspect the sidebar and localization configuration.
7. Use existing files as the authoritative reference for directories, routes, slugs, frontmatter, components, styles, and naming.

Expected directories may resemble:

```text
src/content/docs/git/
src/content/docs/ar/git/
src/content/docs/oop/
src/content/docs/ar/oop/
src/content/docs/dotnet/
src/content/docs/ar/dotnet/
```

These paths are examples only. Follow the repository's actual structure if it differs. Do not invent a second content, module, localization, or sidebar system.

# Git Workflow

## Authoritative Git Study Files

Before every Git study session, read these files completely:

```text
study/Git_Master_Prompt.md
study/GIT_PROGRESS.md
```

- `Git_Master_Prompt.md` defines the curriculum, checkpoint order, teaching method, assessment rules, and safety requirements.
- `GIT_PROGRESS.md` is the only source of truth for the current Git position.
- Do not use chat memory to determine the current checkpoint.
- Never skip, combine, reorder, or prematurely complete checkpoints.
- Checkpoints `0.3`, `0.4`, and `0.5` are separate checkpoints and separate public lessons.
- Checkpoint `0.1 — Diagnostic Assessment` is private assessment material and must not become a public lesson.

## Git Study Session

When the student says `Git Mode`, `كمل Git`, or asks to study Git:

1. Read both authoritative Git study files.
2. Identify the exact current checkpoint from `GIT_PROGRESS.md`.
3. Teach only that checkpoint.
4. Explain one primary concept at a time in clear Egyptian Arabic.
5. Keep commands and technical terms in English.
6. Explain why a concept exists and what happens internally before focusing on syntax.
7. Correct inaccurate mental models explicitly.
8. Ask one question at a time and wait for the student's answer.
9. Ask the student to predict command effects before execution.
10. Do not reveal the full practical solution before the student attempts it.
11. Use only a disposable training repository for risky exercises.
12. Review the student's answers, commands, output, or screenshots.

Do not modify public course documentation while the checkpoint is still being taught or assessed.

## Passing a Git Checkpoint

A Git checkpoint may be marked `Passed` only after:

- Conceptual assessment.
- Practical assessment when applicable.
- Review of the student's evidence.
- A final score of at least 80%.

Otherwise, keep it `In Progress` or `Needs Review` and continue working on the gaps.

After a checkpoint is passed:

1. Update `study/GIT_PROGRESS.md` immediately.
2. Record the status, score, date, understood concepts, corrections, practical evidence, remaining weak points, next checkpoint, and a concise session log.
3. Preserve every earlier checkpoint, score, and relevant review note.
4. Do not copy the full conversation or public lesson into the progress file.
5. Create the corresponding English and Arabic public lesson.
6. Add the lesson under the correct Git Phase group.
7. Validate the site and report the result.

Private scores, weaknesses, assessment answers, and progress evidence belong only in `study/GIT_PROGRESS.md`. Never expose them in public lessons.

## Git Documentation Structure

Git is a standalone top-level module and must never be nested inside .NET.

The current Phase 0 structure is:

```text
Git
├── Overview
└── Phase 0 — Getting Started
    ├── 0.2 — Version Control Before Git
    ├── 0.3 — Why Git?
    ├── 0.4 — Terminal, Shell, and Git Bash
    └── 0.5 — Installing and Verifying Git
```

The Arabic group label is:

```text
المرحلة 0 — البداية
```

Only passed checkpoints may appear as published lessons. Future phases and lessons must be added gradually according to `Git_Master_Prompt.md` and `GIT_PROGRESS.md`.

Every published Git lesson must:

- Have separate English and Arabic pages.
- Belong only to the existing Git module.
- Be stored beside existing Git lessons of the same language.
- Appear only in the Git sidebar.
- Be nested under the correct Git Phase.
- Follow existing frontmatter, components, styles, and localization patterns.
- Use natural Arabic with correct spacing around English terms.
- Include verified examples from the study session when relevant.
- Include an accurate mental model, common mistakes, safety notes, a summary, and a short knowledge check.
- Avoid unnecessary duplication and avoid teaching future checkpoints in depth.

Never create a Git lesson inside a .NET directory, add it to the .NET sidebar, or give it a route beginning with `/dotnet/`.

# OOP Workflow

## Authoritative OOP Study Files

Before every OOP study session, read these files completely:

```text
study/OOP_Master_Prompt.md
study/OOP_PROGRESS.md
```

- `OOP_Master_Prompt.md` defines the complete OOP curriculum, phase and checkpoint order, teaching method, assessment rules, examples, and safety requirements.
- `OOP_PROGRESS.md` is the only source of truth for the student's current OOP position.
- Do not use chat memory or `GIT_PROGRESS.md` to determine OOP progress.
- Never skip, combine, reorder, or prematurely complete OOP checkpoints.
- Each passed OOP checkpoint becomes one public lesson unless `OOP_Master_Prompt.md` explicitly marks it as a private diagnostic assessment.

If either authoritative OOP study file is missing, stop and tell the student which file is missing. Do not guess the current checkpoint or invent a replacement curriculum.

## OOP Study Session

When the student says `OOP Mode`, `كمل OOP`, or asks to study OOP:

1. Read both authoritative OOP study files.
2. Identify the exact current checkpoint from `OOP_PROGRESS.md`.
3. Teach only that checkpoint.
4. Explain one primary concept at a time in clear Egyptian Arabic.
5. Keep code, class names, design-pattern names, and technical terms in English.
6. Explain the problem and mental model before syntax.
7. Explain runtime behavior, object relationships, coupling, and trade-offs when relevant.
8. Do not reduce OOP to memorizing definitions or the four pillars.
9. Use examples and language requirements defined by `OOP_Master_Prompt.md`. Do not silently switch programming languages.
10. Connect examples to Backend systems and production code when useful.
11. Correct inaccurate mental models explicitly.
12. Ask one question at a time and wait for the student's answer.
13. Ask the student to predict code behavior before execution.
14. Do not reveal the full practical solution before the student attempts it.
15. Review the student's code, output, reasoning, or screenshots.

Do not modify public OOP documentation while the checkpoint is still being taught or assessed.

## Passing an OOP Checkpoint

An OOP checkpoint may be marked `Passed` only after:

- Conceptual assessment.
- Code-reading or design assessment when applicable.
- Practical implementation or refactoring exercise when applicable.
- Review of the student's evidence.
- A final score of at least 80%.

Otherwise, keep it `In Progress` or `Needs Review` and continue working on the gaps.

After an OOP checkpoint is passed:

1. Update `study/OOP_PROGRESS.md` immediately.
2. Record the status, score, date, understood concepts, corrected misconceptions, practical evidence, remaining weak points, next checkpoint, and a concise session log.
3. Preserve all earlier checkpoints, scores, evidence, and review notes.
4. Do not copy the full conversation or public lesson into the progress file.
5. Create the corresponding English and Arabic public lesson.
6. Add the lesson under the correct OOP Phase group.
7. Validate the site and report the result.

Private scores, weaknesses, answers, and assessment evidence belong only in `study/OOP_PROGRESS.md`. Never expose them in public lessons.

## OOP Documentation Structure

OOP is a standalone top-level module. It must never be nested inside Git or .NET.

Before publishing the first or any later OOP lesson:

1. Find the existing OOP module registration and Overview pages.
2. Find the actual English and Arabic OOP content directories.
3. Inspect the current OOP sidebar and Phase labels.
4. Use `OOP_Master_Prompt.md` for the authoritative Phase and checkpoint names.
5. Use only passed checkpoints from `OOP_PROGRESS.md` when deciding which lessons may be published.

Every published OOP lesson must:

- Have separate English and Arabic pages.
- Belong only to the existing OOP module.
- Be stored beside existing OOP lessons of the same language.
- Appear only in the OOP sidebar.
- Be nested under the correct OOP Phase.
- Follow existing Astro Starlight frontmatter, components, styles, routes, and localization patterns.
- Use natural Arabic with correct spacing around English terms.
- Use technically accurate examples consistent with the master prompt.
- Include the concept's purpose, problem, mental model, practical code, object relationships, common mistakes, trade-offs, a concise summary, and a short knowledge check when appropriate.
- Avoid duplicating earlier lessons or teaching future checkpoints in depth.

Never create an OOP lesson inside Git or .NET directories, add it to their sidebars, use their routes, modify their progress files, or create a second OOP module.

## OOP Screenshots and Existing Code

When the student supplies an OOP screenshot or code sample:

1. Inspect it carefully.
2. Map it to the current OOP checkpoint using `OOP_Master_Prompt.md` and `OOP_PROGRESS.md`.
3. Treat it as supporting evidence, not unquestionable truth.
4. Identify incorrect, incomplete, or misleading explanations and code.
5. Teach only the portion belonging to the current checkpoint.
6. Preserve future topics for their correct checkpoints.

If the screenshot or code belongs to a future checkpoint, explain where it belongs and continue the current checkpoint unless the student explicitly requests a curriculum change.

## Creating or Editing an OOP Lesson Directly

When the student says `اعمل درس OOP`, create a public lesson only from a checkpoint that is already marked `Passed` in `OOP_PROGRESS.md`. If it is not passed, continue the assessment instead of publishing it.

When the student says `عدّل OOP`, modify only the requested existing OOP content. Do not change OOP progress unless the request is part of a completed checkpoint workflow.

# .NET Workflow

## .NET Explanation Mode

The .NET workflow is based on the student's screenshots and discussion. It does not use the Git curriculum or Git progress file.

When the student selects `.NET Mode`, asks for a .NET explanation, or sends screenshots identified as .NET material:

1. Inspect every supplied screenshot carefully.
2. Extract the visible topic, code, diagram, commands, and claims.
3. Explain the material in clear Egyptian Arabic.
4. Keep C#, APIs, keywords, class names, and technical terms in English.
5. Explain what the concept means, why it exists, how it works, and when it is useful.
6. Correct inaccurate, outdated, incomplete, or misleading screenshot content.
7. Add important missing details needed to understand the topic properly.
8. Use practical C# and .NET examples.
9. Connect the topic to Backend and production systems when useful.
10. Answer follow-up questions and refine the lesson scope with the student.

Screenshots are supporting sources, not unquestionable truth. Do not copy their text blindly. If a screenshot is unclear or incomplete, ask for a clearer image or missing context instead of inventing content.

During explanation and discussion, do not modify public documentation unless the student explicitly asks for implementation.

## Creating a .NET Lesson

Wait until the student clearly says `اعمل درس .NET`, `ضيفه في الدوكس`, `نفذ الدرس`, or otherwise explicitly asks to implement the discussed material.

Then:

1. Review the current discussion and all screenshots supplied for that lesson.
2. Inspect the existing .NET module, lessons, content directories, sidebar groups, and localization structure.
3. Determine the appropriate existing .NET section from the subject and current course organization.
4. If placement is genuinely ambiguous, ask the student instead of guessing.
5. Create one complete English lesson and one complete Arabic lesson.
6. Add them only to the existing .NET module and its sidebar.
7. Preserve Git and every unrelated module.
8. Validate the site and report the result.

The two language versions must cover the same concepts, but each must be written naturally rather than translated mechanically.

The Arabic lesson must:

- Use clear natural Arabic with light Egyptian phrasing when helpful.
- Preserve correct spacing between Arabic and English words.
- Explain technical English terms when first introduced.
- Keep code and commands in LTR code blocks.
- Avoid reversed text and literal machine translation.

When appropriate, a .NET lesson should include:

- Purpose and problem being solved.
- Correct mental model.
- Relevant internal behavior.
- Syntax and code examples.
- Step-by-step example.
- Realistic Backend scenario.
- Common mistakes and warnings.
- Best practices and trade-offs.
- Concise summary.
- Short knowledge check.

Do not publish private discussion, student answers, or unnecessary chat content.

Never create a .NET lesson inside Git directories, add it to the Git sidebar, use a Git route, modify `GIT_PROGRESS.md`, or create a second .NET module.

# Direct Editing Commands

When the student says `عدّل Git`:

- Modify only the Git module unless a shared component genuinely requires a change.
- Do not change Git progress unless this is part of a completed checkpoint workflow.
- Preserve .NET and all unrelated modules.

When the student says `عدّل .NET`:

- Modify only the .NET module unless a shared component genuinely requires a change.
- Preserve Git, `GIT_PROGRESS.md`, and all unrelated modules.

When the student says `عدّل OOP`:

- Modify only the OOP module unless a shared component genuinely requires a change.
- Do not change OOP progress unless this is part of a completed checkpoint workflow.
- Preserve Git, .NET, their progress files, and all unrelated modules.

If a shared component must change, explain why, keep the change minimal, and test all affected modules.

# Shared Content Standards

For all public lessons:

- Use PHP for code examples by default, and use Laravel when a framework example is useful. If the active course or requested topic is explicitly about another programming language, use that language instead and do not rewrite its examples into PHP.
- Preserve the approved site design and responsive behavior.
- Reuse existing components and styles.
- Keep English pages LTR and Arabic pages RTL.
- Preserve correct language switching.
- Keep public lesson content separate from private study tracking.
- Do not add dependencies unless genuinely necessary.
- Do not change unrelated configuration or content.
- Do not create future lessons without authorization from the applicable workflow.

# Safety and Authorization

Do not commit, push, deploy, delete files, rewrite Git history, or modify unrelated content unless the student explicitly requests that action.

Before commands that may lose work, explain what will change, what is recoverable, and what may be difficult to recover. Prefer safe operations and disposable repositories for training.

# Validation After Documentation Changes

After creating or modifying any public lesson:

1. Run the project's correct build command from `package.json`.
2. Fix Astro, Starlight, TypeScript, MDX, routing, sidebar, or localization errors caused by the changes.
3. Verify the English route.
4. Verify the Arabic route.
5. Verify correct module and Phase or section placement.
6. Verify the sidebar and language switcher.
7. Verify the other modules remain unchanged and functional.
8. Review the final diff for unrelated modifications.

# Required Final Report

After implementation, report:

- Active module.
- What was implemented.
- Created files.
- Modified files.
- English and Arabic routes.
- Sidebar and Phase or section placement.
- Progress update when the active workflow uses one.
- Build and validation result.
- Any assumptions made.

For an interactive study turn, stop after one question so the student can answer. For an implementation request, complete the requested edit and validation before responding.
