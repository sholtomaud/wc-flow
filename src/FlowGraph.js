class FlowGraph extends HTMLElement {
  constructor() {
    super();
    this.tabIndex = 0;

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create elements
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'flow-graph');

    this.viewport = document.createElement('div');
    this.viewport.setAttribute('class', 'flow-graph-viewport');

    this.selectionRect = document.createElement('div');
    this.selectionRect.setAttribute('class', 'selection-rect');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        border: 1px solid black;
        box-sizing: border-box;
        overflow: hidden;
        outline: none;
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

      .selection-rect {
        position: absolute;
        border: 1px dashed blue;
        background-color: rgba(0, 0, 255, 0.1);
        pointer-events: none;
        z-index: 2;
      }
    `;

    // Append elements to the shadow root
    const slot = document.createElement('slot');
    this.viewport.appendChild(slot);
    wrapper.appendChild(this.viewport);
    wrapper.appendChild(this.selectionRect);
    this.shadowRoot.append(style, wrapper);

    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
    this.connecting = false;

    this._updateEdges = this._updateEdges.bind(this);
  }

  connectedCallback() {
    this.addEventListener('wheel', this._onWheel);
    this.addEventListener('pointerdown', this._onPointerDown);
    this.addEventListener('pointerup', this._onPointerUp);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('keydown', this._onKeyDown);
    this.addEventListener('flownodedrag', this._updateEdges);
    this.addEventListener('flow-connect-start', this._onFlowConnectStart);

    this._observer = new MutationObserver(this._updateEdges);
    this._observer.observe(this, { childList: true, subtree: true });

    // Initial update
    requestAnimationFrame(this._updateEdges);
  }

  disconnectedCallback() {
    this.removeEventListener('wheel', this._onWheel);
    this.removeEventListener('pointerdown', this._onPointerDown);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerUp);
    this.removeEventListener('keydown', this._onKeyDown);
    this.removeEventListener('flownodedrag', this._updateEdges);

    this._observer.disconnect();
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
    if (event.target !== this) return;

    if (event.shiftKey) {
      this.selecting = true;
      const rect = this.getBoundingClientRect();
      this.selectionStartX = event.clientX - rect.left;
      this.selectionStartY = event.clientY - rect.top;

      this.selectionRect.style.left = `${this.selectionStartX}px`;
      this.selectionRect.style.top = `${this.selectionStartY}px`;
      this.selectionRect.style.width = '0px';
      this.selectionRect.style.height = '0px';
      this.setPointerCapture(event.pointerId);
    } else if (event.button === 0 && !event.shiftKey) { // Left mouse button without shift
      this.panning = true;
      this.initialPanX = this.panX;
      this.initialPanY = this.panY;
      this.initialMouseX = event.clientX;
      this.initialMouseY = event.clientY;
      this.setPointerCapture(event.pointerId);
    }
  }

  _onPointerMove(event) {
    if (this.panning) {
      const dx = event.clientX - this.initialMouseX;
      const dy = event.clientY - this.initialMouseY;
      this.panX = this.initialPanX + dx;
      this.panY = this.initialPanY + dy;
      this._updateTransform();
    } else if (this.selecting) {
      const rect = this.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      const width = Math.abs(currentX - this.selectionStartX);
      const height = Math.abs(currentY - this.selectionStartY);
      const left = Math.min(currentX, this.selectionStartX);
      const top = Math.min(currentY, this.selectionStartY);

      this.selectionRect.style.width = `${width}px`;
      this.selectionRect.style.height = `${height}px`;
      this.selectionRect.style.left = `${left}px`;
      this.selectionRect.style.top = `${top}px`;
    } else if (this.connecting) {
      const sourcePort = this.querySelector(`#${this.sourcePortId}`);
      const sourceNode = this.querySelector(`#${this.sourceNodeId}`);
      const sourceNodeStyle = window.getComputedStyle(sourceNode);
      const sourcePortStyle = window.getComputedStyle(sourcePort);

      const sourceNodeLeft = parseFloat(sourceNodeStyle.left);
      const sourceNodeTop = parseFloat(sourceNodeStyle.top);
      const sourcePortWidth = parseFloat(sourcePortStyle.width);
      const sourcePortHeight = parseFloat(sourcePortStyle.height);

      const x1 = sourceNodeLeft + sourcePort.offsetLeft + sourcePortWidth / 2;
      const y1 = sourceNodeTop + sourcePort.offsetTop + sourcePortHeight / 2;

      const x2 = (event.clientX - this.getBoundingClientRect().left - this.panX) / this.zoom;
      const y2 = (event.clientY - this.getBoundingClientRect().top - this.panY) / this.zoom;

      const d = `M${x1},${y1} C${x1 + 100},${y1} ${x2 - 100},${y2} ${x2},${y2}`;
      this.tempEdge.setAttribute('d', d);
    }
  }

  _onPointerUp(event) {
    if (this.selecting) {
      const selectionRect = this.selectionRect.getBoundingClientRect();
      const nodes = this.querySelectorAll('flow-node');
      nodes.forEach((node) => {
        const nodeRect = node.getBoundingClientRect();
        const isIntersecting =
          selectionRect.left < nodeRect.right &&
          selectionRect.right > nodeRect.left &&
          selectionRect.top < nodeRect.bottom &&
          selectionRect.bottom > nodeRect.top;

        if (isIntersecting) {
          if (event.shiftKey) {
            node.toggleAttribute('selected');
          } else {
            node.setAttribute('selected', '');
          }
        } else if (!event.shiftKey) {
          node.removeAttribute('selected');
        }
      });
      this.selectionRect.style.width = '0px';
      this.selectionRect.style.height = '0px';
    } else if (this.connecting) {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const targetPort = target ? target.closest('flow-port') : null;

      if (targetPort && targetPort.closest('flow-node').id !== this.sourceNodeId) {
        const targetNode = targetPort.closest('flow-node');
        this.tempEdge.setAttribute('source', this.sourceNodeId);
        this.tempEdge.setAttribute('source-port', this.sourcePortId);
        this.tempEdge.setAttribute('target', targetNode.id);
        this.tempEdge.setAttribute('target-port', targetPort.id);
        this.tempEdge.removeAttribute('temporary');
        this._updateEdges();
      } else {
        this.tempEdge.remove();
      }
    }

    this.panning = false;
    this.selecting = false;
    this.connecting = false;
    this.releasePointerCapture(event.pointerId);
  }

  _updateTransform() {
    this.viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    this.style.setProperty('--flow-zoom', this.zoom);
  }

  _onKeyDown(event) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodes = this.querySelectorAll('flow-node[selected]');
      selectedNodes.forEach(node => node.remove());

      const selectedEdges = this.querySelectorAll('flow-edge[selected]');
      selectedEdges.forEach(edge => edge.remove());
    }
  }

  _onFlowConnectStart(event) {
    this.connecting = true;
    this.sourceNodeId = event.detail.nodeId;
    this.sourcePortId = event.detail.portId;

    this.tempEdge = document.createElement('flow-edge');
    this.tempEdge.setAttribute('temporary', '');
    this.appendChild(this.tempEdge);

    this.setPointerCapture(event.detail.pointerId);
  }

  _updateEdges() {
    const edges = Array.from(this.querySelectorAll('flow-edge'));
    edges.forEach((edge) => {
      const sourceId = edge.getAttribute('source');
      const targetId = edge.getAttribute('target');
      const sourcePortId = edge.getAttribute('source-port');
      const targetPortId = edge.getAttribute('target-port');

      if (!sourceId || !targetId || !sourcePortId || !targetPortId) return;

      const sourceNode = this.querySelector(`#${sourceId}`);
      const targetNode = this.querySelector(`#${targetId}`);
      const sourcePort = this.querySelector(`#${sourcePortId}`);
      const targetPort = this.querySelector(`#${targetPortId}`);

      if (!sourceNode || !targetNode || !sourcePort || !targetPort) return;

      const sourceNodeStyle = window.getComputedStyle(sourceNode);
      const targetNodeStyle = window.getComputedStyle(targetNode);
      const sourcePortStyle = window.getComputedStyle(sourcePort);
      const targetPortStyle = window.getComputedStyle(targetPort);

      const sourceNodeLeft = parseFloat(sourceNodeStyle.left);
      const sourceNodeTop = parseFloat(sourceNodeStyle.top);
      const targetNodeLeft = parseFloat(targetNodeStyle.left);
      const targetNodeTop = parseFloat(targetNodeStyle.top);

      const sourcePortWidth = parseFloat(sourcePortStyle.width);
      const sourcePortHeight = parseFloat(sourcePortStyle.height);
      const targetPortWidth = parseFloat(targetPortStyle.width);
      const targetPortHeight = parseFloat(targetPortStyle.height);

      const x1 = sourceNodeLeft + sourcePort.offsetLeft + sourcePortWidth / 2;
      const y1 = sourceNodeTop + sourcePort.offsetTop + sourcePortHeight / 2;
      const x2 = targetNodeLeft + targetPort.offsetLeft + targetPortWidth / 2;
      const y2 = targetNodeTop + targetPort.offsetTop + targetPortHeight / 2;

      const d = `M${x1},${y1} C${x1 + 100},${y1} ${x2 - 100},${y2} ${x2},${y2}`;
      edge.setAttribute('d', d);
    });
  }
}

export default FlowGraph;
