class FlowEdge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'flow-edge');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 C50,0 50,100 100,100');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: absolute;
        width: 100px;
        height: 100px;
        pointer-events: none; /* Edges shouldn't block interaction */
      }

      .flow-edge {
        width: 100%;
        height: 100%;
      }
    `;

    svg.appendChild(path);
    this.shadowRoot.append(style, svg);
  }

  static get observedAttributes() {
    return ['d'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'd') {
      this.shadowRoot.querySelector('path').setAttribute('d', newValue);
    }
  }
}

export default FlowEdge;
