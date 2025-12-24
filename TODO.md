# Web Component Reactflow Reimplementation TODO List

This document outlines the tasks required to re-implement Reactflow using Web Components and native browser features.

## 1. Project Setup and Core Component Implementation

### Rendering
- [ ] Create a main container Web Component for the graph (`<graph-container>`).
- [ ] Implement a Web Component for nodes (`<graph-node>`).
- [ ] Implement a Web Component for edges (`<graph-edge>`).
- [ ] Ensure nodes and edges support customization through attributes and slots.

### Interaction and State Management
- [ ] Implement seamless zooming and panning within the `<graph-container>`.
- [ ] Enable single and multi-selection of graph elements.
- [ ] Add keyboard shortcuts for common actions (e.g., delete, copy, paste).
- [ ] Implement a state management solution for nodes, edges, and viewport.

### Customization
- [ ] Support different node and edge types through component composition or extension.
- [ ] Allow custom nodes with multiple handles for connecting edges.
- [ ] Enable custom edges with different pathing and styling options.

## 2. Plugin Components

### UI Controls
- [ ] Create a `<minimap-component>` to display a preview of the graph.
- [ ] Create a `<controls-component>` with buttons for zooming in, zooming out, and fitting the view.

### Background
- [ ] Create a `<background-component>` with configurable dot or line patterns.

## 3. Event System and Advanced Features

### Event System
- [ ] Implement a custom event system for user interactions.
- [ ] Dispatch `node-click` event on node click.
- [ ] Dispatch `node-drag-start`, `node-drag`, and `node-drag-stop` events.
- [ ] Dispatch `connect` event when a connection is made.
- [ ] Dispatch `pane-click` and `pane-context-menu` events.
- [ ] Dispatch selection events (`selection-drag-start`, `selection-drag`, `selection-drag-stop`).

### Advanced Features
- [ ] Implement different edge types:
    - [ ] `smoothstep` edge
    - [ ] `step` edge
    - [ ] `bezier` edge
- [ ] Implement a `<connection-line>` component that appears when dragging from a node handle.
- [ ] Implement a drag-selection rectangle for selecting multiple nodes.

## 4. Programmatic API and Accessibility

### Programmatic API
- [ ] Expose a programmatic API on the `<graph-container>` component.
- [ ] Implement a `fitView()` method to adjust the viewport to fit all nodes.
- [ ] Implement a `zoomTo()` method to zoom to a specific level.
- [ ] Implement methods for adding, removing, and updating nodes and edges.

### Accessibility
- [ ] Implement keyboard navigation for nodes and edges.
- [ ] Add appropriate ARIA roles and attributes to all components.
- [ ] Ensure the graph is accessible to screen readers.
