class FlowGraph extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create elements
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'flow-graph');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        border: 1px solid black;
        box-sizing: border-box;
      }

      .flow-graph {
        width: 100%;
        height: 100%;
      }
    `;

    // Append elements to the shadow root
    this.shadowRoot.append(style, wrapper);
  }
}

export default FlowGraph;
