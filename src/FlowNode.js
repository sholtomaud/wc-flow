class FlowNode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'flow-node');

    const slot = document.createElement('slot');
    wrapper.appendChild(slot);

    this.labelSpan = document.createElement('span');
    wrapper.appendChild(this.labelSpan);

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: absolute;
        width: 150px;
        height: 50px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
      }

      .flow-node {
        padding: 10px;
      }
    `;

    this.shadowRoot.append(style, wrapper);
  }

  static get observedAttributes() {
    return ['label'];
  }

  connectedCallback() {
    if (!this.hasAttribute('label')) {
      this.setAttribute('label', 'Node');
    }

    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => this._updateLabel());

    this._updateLabel();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this._updateLabel();
    }
  }

  _updateLabel() {
    const slot = this.shadowRoot.querySelector('slot');
    const hasSlottedContent = slot.assignedNodes().length > 0;
    this.labelSpan.textContent = hasSlottedContent ? '' : this.getAttribute('label');
  }
}

export default FlowNode;
