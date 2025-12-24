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
      }
    `;

    this.shadowRoot.append(style);
  }
}

export default FlowPort;
