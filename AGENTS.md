# Portfolio Project - Codex Instructions

## 1. Development Philosophy

This is a long-term portfolio project.

The goal is not simply to make code work. The developer is learning while building the project, so every change should remain understandable.

Work incrementally.

Make one meaningful change at a time.

After every meaningful change:

1. Explain what changed.
2. Explain why it changed.
3. Explain the expected behavior.
4. Explain what should be tested.

Let the developer test and confirm the result before moving to the next meaningful change.

Do not combine several unrelated changes into one step.

## 2. Continue From the Existing Project

This project is already in active development.

Do not restart, rebuild, or redesign the project from scratch.

The existing codebase is the source of truth.

Before changing anything:

1. Inspect the current implementation.
2. Understand how the existing code works.
3. Identify the smallest necessary change.
4. Preserve existing working behavior.

Never assume that the current code matches an example or previous conversation.

Always inspect the actual files before modifying them.

## 3. Do Not Guess

Never invent:

- File paths
- Existing code
- Props
- APIs
- Components
- Functions
- Architecture
- Dependencies
- Behavior

If something is unclear, inspect the relevant files first.

If the required information cannot be determined from the project, ask the developer.

## 4. Code Changes

Keep changes small and focused.

Do not rewrite working code unnecessarily.

Do not modify unrelated files.

Preserve existing comments unless they are no longer accurate.

Do not introduce new libraries or dependencies unless the developer explicitly agrees.

Prefer simple, readable, production-quality solutions over clever solutions.

## 5. Project Architecture

This portfolio is centered around one rigid 3D cube.

The cube is one physical object.

The six screens are permanently attached to physical cube faces.

The current physical face mapping is:

- Front = Home
- Back = Projects
- Right = About
- Left = Skills
- Top = Blog
- Bottom = Contact

Screen content must remain permanently attached to its physical face.

Navigation rotates the entire cube.

Screens must never be swapped between faces after navigation.

Screens must never independently rotate to compensate for cube movement.

## 6. CubeTest Architecture

CubeTest.tsx owns the cube's main navigation and orientation system.

It is responsible for:

- Cube orientation
- Quaternion calculations
- Cube navigation
- Navigation animation
- Orientation correction
- Determining which physical face is facing the camera
- Active screen state
- Cube size measurement

The cube uses quaternion-based rotation.

Navigation moves the cube in exact 90-degree steps.

SLERP is used to smoothly animate between exact orientations.

Orientation correction rotates the entire cube rather than rotating an individual screen.

Do not redesign this architecture unless explicitly requested.

## 7. Responsive Design

The cube changes size dynamically depending on the viewport.

CubeTest.tsx measures the rendered cube using ResizeObserver.

The resulting cube size is used as a reference for responsive UI and 3D components.

UI inside cube faces should generally scale relative to the cube rather than using arbitrary fixed viewport dimensions.

Prefer container-relative sizing such as cqw where appropriate.

Avoid solutions that only work at one screen size.

## 8. Reusable Components

Prefer existing reusable components before creating new ones.

Current reusable components include:

- NeonText
- DecodeText
- SplashScreen
- SpaceDefender
- Cube/3D components
- Navigation components

Do not create duplicate components when an existing component can reasonably provide the required behavior.

If something should become reusable, explain that before implementing it.

## 9. Current About Screen

The About screen is currently being developed.

Current structure:

1. STICKFORYOU
   - Uses NeonText
   - Right aligned

2. Tagline
   - Uses NeonText
   - Left aligned

3. Description
   - Uses DecodeText

The About screen currently uses cyan bordered boxes and container-relative sizing.

The description uses the existing DecodeText component.

The current AboutScreen props are:

```tsx
type AboutScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
};
```

## 10. Projects Activation Pattern

Projects already uses:

- isActive
- hasBeenActivated

CubeTest.tsx tracks whether Projects has ever been activated.

About is now using the same basic activation pattern.

Important:

hasBeenActivated does not automatically mean that an animation should play every time the screen becomes active.

Keep these concepts separate:

- Whether a screen has ever been activated
- Whether a screen is currently active
- Whether a first-open animation should run

## 11. NeonText

NeonText is an existing reusable component.

It currently supports the following prop:

`textAlign?: "left" | "center" | "right";`

The textAlign prop controls the horizontal flex positioning of the text.

Do not remove or redesign this behavior unless specifically requested.

## 12. DecodeText

DecodeText is an existing reusable text animation component.

Use DecodeText when its existing behavior is appropriate.

Do not create another text-decoding implementation unnecessarily.

## 13. Learning While Building

The developer is learning while building this project.

Do not simply produce code without explaining important decisions.

For every meaningful code change, briefly explain:

- What changed
- Why it changed
- How it works
- What to test

Keep explanations focused.

Do not overwhelm the developer with unnecessary theory or huge code dumps.

The developer prefers understanding the reasoning behind important architectural decisions.

## 14. One Change at a Time

Prefer this workflow:

1. Inspect
2. Explain the proposed change
3. Make one focused change
4. Test
5. Confirm the result
6. Continue to the next change

If a change does not work, diagnose that specific change before introducing another solution.

Do not make multiple speculative fixes at once.

## 15. Testing

Do not assume a change works simply because the project compiles.

After every meaningful change, provide a concise testing checklist.

Testing should focus on the behavior that the change was intended to affect.

Do not change unrelated code while diagnosing a problem.

## 16. Git Checkpoints

When a stable milestone is reached, remind the developer to create a Git checkpoint.

Suggest a concise commit message.

Never claim that a commit was made unless the developer explicitly confirms it.

## 17. Developer Workflow

The developer wants to learn how Codex works.

Do not hide the agent workflow.

When useful, explain:

- What files Codex inspected
- Why those files matter
- What Codex plans to change
- What files are being modified
- What the resulting diff means
- What should be tested

The developer should remain in control of the project.

Do not make broad autonomous changes without clear justification.

## 18. Important Rule

The existing project and its current architecture are more important than finding a theoretically cleaner implementation.

Preserve working behavior.

Prefer incremental improvements.

Do not solve future problems before they are needed.

Continue from the exact state of the project rather than assuming the project should be rebuilt.
