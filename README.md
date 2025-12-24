# Web Component Flow

## About The Project

This project is a re-implementation of a flow and diagramming library, similar to Reactflow, built entirely with **native Web Components and standard browser APIs**. The goal is to create a lightweight, dependency-free library for rendering and interacting with node-based graphs.

### Core Principle: Native Implementation

The fundamental rule of this project is to rely exclusively on native browser features.

-   **No 3rd-Party Runtime Libraries:** All rendering, state management, and interaction logic (such as zooming, panning, and dragging) are built from scratch. We do not use any external runtime libraries like Lit, D3, or other utility libraries to ensure the final components are as lightweight and standard-compliant as possible.
-   **Development Tools:** While the runtime is dependency-free, we use a modern toolchain for development, including Vite for a fast development server, Playwright for end-to-end testing, and Prettier for code formatting.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/sholtomaud/wc-flow.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

## Usage

To start the development server, run the following command. This will open the project in your default browser.

```sh
npm run dev
```

### Available Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run test`: Runs the Playwright test suite.

## Tooling and Automation

-   **Vite.js:** Used as the development server for a fast and modern development experience.
-   **Playwright:** Used for end-to-end testing to ensure all interactive features work as expected.
-   **Prettier:** Used for automatic code formatting to maintain a consistent style.
-   **GitHub Actions:** A CI/CD pipeline is set up to automatically run tests on every pull request to the `main` branch, ensuring code quality and stability.
