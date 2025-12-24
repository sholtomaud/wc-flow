class FlowEdge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'flow-edge');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: stroke;
        z-index: 0;
      }

      path {
        stroke: black;
        stroke-width: 2;
        fill: none;
      }

      path:hover {
        stroke: #aaa;
      }

      :host([selected]) path {
        stroke: blue;
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
    return ['d', 'source', 'target'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'd') {
      this.shadowRoot.querySelector('path').setAttribute('d', newValue);
    }
  }

  connectedCallback() {
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
  }

  _onClick(event) {
    if (event.shiftKey) {
      this.toggleAttribute('selected');
    } else {
      for (const edge of this.parentElement.querySelectorAll('flow-edge[selected]')) {
        if (edge !== this) {
          edge.removeAttribute('selected');
        }
      }
      this.toggleAttribute('selected');
    }
  }
}

export default FlowEdge;
