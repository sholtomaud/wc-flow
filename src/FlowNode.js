class FlowNode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'flow-node');

    const contentWrapper = document.createElement('div');
    contentWrapper.setAttribute('class', 'flow-node-content');
    wrapper.appendChild(contentWrapper);

    const slot = document.createElement('slot');
    contentWrapper.appendChild(slot); // slot for label

    this.labelSpan = document.createElement('span');
    contentWrapper.appendChild(this.labelSpan);

    const portsSlot = document.createElement('slot');
    portsSlot.setAttribute('name', 'ports');
    wrapper.appendChild(portsSlot);

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
        z-index: 1;
        box-sizing: border-box;
      }

      :host(:hover) {
        border-color: #aaa;
        box-shadow: 0 0 5px #aaa;
      }

      :host([selected]) {
        border-color: blue;
        box-shadow: 0 0 5px blue;
      }

      .flow-node {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .flow-node-content {
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

    this.addEventListener('pointerdown', this._onPointerDown);
    this.addEventListener('pointerup', this._onPointerUp);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerleave', this._onPointerUp);
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this._onPointerDown);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerUp);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this._updateLabel();
    }
  }

  _updateLabel() {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    const hasSlottedContent = slot.assignedElements().length > 0;
    this.labelSpan.textContent = hasSlottedContent ? '' : this.getAttribute('label');
  }

  _onPointerDown(event) {
    event.stopPropagation();
    if (event.shiftKey) {
      this.toggleAttribute('selected');
    } else {
      // Deselect all other nodes
      for (const node of this.parentElement.querySelectorAll('flow-node[selected]')) {
        if (node !== this) {
          node.removeAttribute('selected');
        }
      }
      this.toggleAttribute('selected');
    }

    this.dragging = true;
    this.initialX = event.clientX;
    this.initialY = event.clientY;

    const style = window.getComputedStyle(this);
    this.initialTop = parseInt(style.getPropertyValue('top'), 10) || 0;
    this.initialLeft = parseInt(style.getPropertyValue('left'), 10) || 0;

    this.setPointerCapture(event.pointerId);
  }

  _onPointerMove(event) {
    if (this.dragging) {
      const style = window.getComputedStyle(this);
      const zoom = parseFloat(style.getPropertyValue('--flow-zoom')) || 1;
      const dx = (event.clientX - this.initialX) / zoom;
      const dy = (event.clientY - this.initialY) / zoom;
      this.style.top = `${this.initialTop + dy}px`;
      this.style.left = `${this.initialLeft + dx}px`;

      this.dispatchEvent(new CustomEvent('flownodedrag', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  _onPointerUp(event) {
    this.dragging = false;
    this.releasePointerCapture(event.pointerId);
  }

  addPort(port) {
    port.setAttribute('slot', 'ports');
    this.appendChild(port);
  }
}

export default FlowNode;
