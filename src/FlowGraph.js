class FlowGraph extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create elements
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'flow-graph');

    this.viewport = document.createElement('div');
    this.viewport.setAttribute('class', 'flow-graph-viewport');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        border: 1px solid black;
        box-sizing: border-box;
        overflow: hidden;
      }

      .flow-graph {
        width: 100%;
        height: 100%;
      }

      .flow-graph-viewport {
        width: 100%;
        height: 100%;
        transform-origin: 0 0;
      }
    `;

    // Append elements to the shadow root
    const slot = document.createElement('slot');
    this.viewport.appendChild(slot);
    wrapper.appendChild(this.viewport);
    this.shadowRoot.append(style, wrapper);

    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
  }

  connectedCallback() {
    this.addEventListener('wheel', this._onWheel);
    this.addEventListener('pointerdown', this._onPointerDown);
    this.addEventListener('pointerup', this._onPointerUp);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerleave', this._onPointerUp);
  }

  disconnectedCallback() {
    this.removeEventListener('wheel', this._onWheel);
    this.removeEventListener('pointerdown', this._onPointerDown);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerUp);
  }

  _onWheel(event) {
    event.preventDefault();

    const zoomSpeed = 0.1;
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    const zoomFactor = 1 + zoomSpeed * zoomDirection;

    const rect = this.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newZoom = this.zoom * zoomFactor;

    this.panX = mouseX - (mouseX - this.panX) * zoomFactor;
    this.panY = mouseY - (mouseY - this.panY) * zoomFactor;
    this.zoom = newZoom;

    this._updateTransform();
  }

  _onPointerDown(event) {
    if (event.target.tagName.toLowerCase() === 'flow-node') return;
    this.panning = true;
    this.initialX = event.clientX;
    this.initialY = event.clientY;
    this.initialPanX = this.panX;
    this.initialPanY = this.panY;
    this.setPointerCapture(event.pointerId);
  }

  _onPointerMove(event) {
    if (this.panning) {
      const dx = event.clientX - this.initialX;
      const dy = event.clientY - this.initialY;
      this.panX = this.initialPanX + dx;
      this.panY = this.initialPanY + dy;
      this._updateTransform();
    }
  }

  _onPointerUp(event) {
    this.panning = false;
    this.releasePointerCapture(event.pointerId);
  }

  _updateTransform() {
    this.viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    this.style.setProperty('--flow-zoom', this.zoom);
  }
}

export default FlowGraph;
