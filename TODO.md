# Web Component Reactflow Reimplementation TODO List

This document outlines the tasks required to re-implement Reactflow using **only Web Components and native browser features**.

## 1. Development, Tooling, and CI/CD

- [x] **Project Setup:**
    - [x] Initialize a `package.json` file.
    - [x] Add `devDependencies`: `vite`, `playwright`, and `prettier`.
    - [x] Configure `npm` scripts for `dev` (runs vite) and `test` (runs playwright).
- [x] **CI/CD Pipeline:**
    - [x] Create a `.github/workflows/ci.yml` file for GitHub Actions.
    - [x] Configure the workflow to trigger on pull requests to the `main` branch.
    - [x] The workflow must run jobs to install dependencies (`npm install`) and run tests (`npm test`).
    - [x] Configure `main` branch protection rules to require the CI check to pass before merging.

## 2. Core Component Implementation

### Rendering
- [x] Create a main container Web Component for the graph (`<flow-graph>`).
- [ ] Implement a Web Component for nodes (`<flow-node>`).
- [ ] Implement a Web Component for edges (`<flow-edge>`).
- [ ] Ensure nodes and edges support customization through attributes and slots.

### Interaction (Native Implementation)
- [ ] **Zoom/Pan:** Implement seamless zooming and panning from scratch using native Pointer Events and CSS Transforms.
- [ ] **Node Dragging:** Implement node dragging from scratch using native Pointer Events.
- [ ] **Selection:**
    - [ ] Enable single and multi-selection of graph elements.
    - [ ] Implement a drag-to-select rectangle using native browser APIs.
- [ ] **Keyboard Shortcuts:** Add keyboard shortcuts for common actions (e.g., delete, copy, paste).
- [ ] **State Management:** Implement a state management solution for nodes, edges, and viewport without external libraries.

### Customization
- [ ] Support different node and edge types through component composition or extension.
- [ ] Allow custom nodes with multiple handles for connecting edges.
- [ ] Enable custom edges with different pathing and styling options.

## 3. Plugin Components

### UI Controls
- [ ] Create a `<flow-minimap>` to display a preview of the graph.
- [ ] Create a `<flow-controls>` with buttons for zooming in, zooming out, and fitting the view.

### Background
- [ ] Create a `<flow-background>` with configurable dot or line patterns.

## 4. Event System and Advanced Features

### Event System
- [ ] Implement a custom event system using `CustomEvent` for user interactions.
- [ ] Dispatch `node-click`, `node-drag-start`, `node-drag`, and `node-drag-stop` events.
- [ ] Dispatch `connect` event when a connection is made.

### Advanced Features
- [ ] Implement different edge types (smoothstep, step, bezier) using SVG paths.
- [ ] Implement a `<flow-connection-line>` component that appears when dragging from a node handle.

## 5. Programmatic API and Accessibility

### Programmatic API
- [ ] Expose a programmatic API on the `<flow-graph>` component.
- [ ] Implement methods like `fitView()`, `zoomTo()`, and functions for adding/removing elements.

### Accessibility
- [ ] Implement keyboard navigation for nodes and edges.
- [ ] Add appropriate ARIA roles and attributes to all components.

