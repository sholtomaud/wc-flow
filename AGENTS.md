# AGENTS.md: Instructions for Building the Web Component Flow Library

This document provides guidance for an AI agent to implement the Web Component-based flow library as specified in `TODO.md`.

## 1. Core Principle: Native Browser Implementation

**This is the most important rule:** The component library must be implemented using **only native browser features**.

-   **No 3rd-Party Runtime Libraries:** Do not use any third-party libraries like D3.js, Lit, or any other utility that is not a development tool. All rendering, state management, and interaction logic (zooming, dragging, etc.) must be built from scratch using standard Web APIs (e.g., Pointer Events, CSS Transforms, Custom Events).
-   **Development Tools are Allowed:** You may use `devDependencies` for tooling purposes, such as testing (Playwright), development servers (Vite.js), or formatters (Prettier). These tools are not part of the final component runtime code.

## 2. Project Structure

Organize the repository as follows:

```
/
├── .github/
│   └── workflows/
│       └── ci.yml
├── components/
│   ├── flow-graph.js
│   ├── flow-node.js
│   ├── flow-edge.js
│   ├── flow-minimap.js
│   ├── flow-controls.js
│   └── flow-background.js
├── styles/
│   ├── main.css
│   └── theme.css
├── utils/
│   ├── drag-handler.js
│   ├── zoom-handler.js
│   └── state-manager.js
├── examples/
│   ├── index.html
│   └── main.js
├── tests/
│   └── playwright/
│       └── *.spec.js
├── TODO.md
├── AGENTS.md
└── package.json
```

## 3. Coding Conventions

### Web Components
-   **Naming:** Use custom element names with a prefix, e.g., `<flow-graph>`, `<flow-node>`. The filename should match the component name (e.g., `flow-graph.js` defines `<flow-graph>`).
-   **Modularity:** Each component should be in its own file.
-   **API:** Use attributes for configuration and custom events for communication.
-   **Styling:** Use a Shadow DOM for encapsulation. Define styles in a `<style>` tag within the component's template. Use CSS Custom Properties for theming, defined in `styles/theme.css`.

### JavaScript
-   **ES Modules:** Use ES Modules (`import`/`export`) for all JavaScript files.
-   **No Build Step:** Write code that can run directly in modern browsers without a build or transpilation step.
-   **Formatting:** Use Prettier for consistent code formatting.

## 4. Tooling and Development

-   **Dev Server:** Use Vite.js as a development server. Configure it in `package.json`.
-   **Testing:** Use Playwright for end-to-end testing.
-   **Formatting:** Use Prettier for consistent code formatting.

## 5. CI/CD and Automation

-   **GitHub Actions:** Implement a CI/CD pipeline using GitHub Actions.
-   **Workflow File:** The workflow should be defined in `.github/workflows/ci.yml`.
-   **Trigger:** The workflow must trigger on every pull request targeting the `main` branch.
-   **Jobs:** The workflow must include a job that:
    1.  Checks out the code.
    2.  Installs dependencies using `npm install`.
    3.  Runs all Playwright tests using `npm test`.
-   **Branch Protection:** The `main` branch must be protected, requiring the CI checks to pass before a pull request can be merged.

## 6. Programmatic Checks

After implementing the core components and features, you must write and run a series of programmatic checks to verify the implementation. These checks should be implemented as Playwright tests.

### Verification Script (`tests/playwright/verify.spec.js`)
-   **Test 1: Core Rendering:**
    -   Verify that the `<flow-graph>` component renders without errors.
    -   Verify that nodes and edges are rendered correctly within the graph.
-   **Test 2: Interaction:**
    -   Verify that zooming and panning work as expected.
    -   Verify that nodes can be dragged and selected.
-   **Test 3: Events:**
    -   Verify that custom events (`node-click`, `connect`, etc.) are dispatched correctly.
-   **Test 4: API:**
    -   Verify that the programmatic API (`fitView()`, `zoomTo()`) works as expected.

You must run these tests and ensure they pass before submitting the final implementation.

## 7. Task Management

After completing any task or a set of tasks outlined in `TODO.md`, you must update the `TODO.md` file to mark those tasks as complete. This ensures the project's progress is accurately tracked.
