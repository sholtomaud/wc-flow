class FlowPort extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        border: 1px solid #ddd;
        border-radius: 50%;
        background-color: #f9f9f9;
        cursor: crosshair;
        box-sizing: border-box;
      }

      :host(:hover) {
        background-color: #eee;
      }

      span {
        position: absolute;
        visibility: hidden;
        background-color: #fff;
        border: 1px solid #ddd;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
      }

      :host(:hover) span {
        visibility: visible;
      }
    `;

    this.labelSpan = document.createElement('span');
    this.shadowRoot.append(style, this.labelSpan);
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this.labelSpan.textContent = newValue;
    }
  }

  connectedCallback() {
    this.addEventListener('pointerdown', this._onPointerDown);
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this._onPointerDown);
  }

  _onPointerDown(event) {
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent('flow-connect-start', {
      bubbles: true,
      composed: true,
      detail: {
        nodeId: this.closest('flow-node').id,
        portId: this.id,
        pointerId: event.pointerId,
      },
    }));
  }
}

export default FlowPort;
