import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class AxiumCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }
      .card-container {
        padding: 16px;
      }
      .zone {
        margin-bottom: 16px;
        padding: 16px;
        border-radius: 8px;
        background: var(--card-background-color, var(--ha-card-background, white));
        box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
      }
      .zone-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .zone-name {
        font-weight: bold;
        font-size: 1.2em;
      }
      .zone-power {
        cursor: pointer;
      }
      .source-selector {
        width: 100%;
        margin-bottom: 8px;
      }
      .sliders {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .slider-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .slider-label {
        min-width: 60px;
      }
      .slider {
        flex-grow: 1;
      }
      .disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    `;
  }

  constructor() {
    super();
    this.zones = [];
  }

  setConfig(config) {
    if (!config.zones || !Array.isArray(config.zones)) {
      throw new Error("You need to define at least one zone");
    }
    this.config = config;
    this.zones = config.zones;
  }

  // Configure card size in UI
  getCardSize() {
    return this.config.zones.length * 3;
  }

  _togglePower(entity_id) {
    this.hass.callService('media_player', 'toggle', {
      entity_id: entity_id,
    });
  }

  _selectSource(entity_id, source) {
    this.hass.callService('media_player', 'select_source', {
      entity_id: entity_id,
      source: source,
    });
  }

  _setVolume(entity_id, volume) {
    this.hass.callService('media_player', 'volume_set', {
      entity_id: entity_id,
      volume_level: volume,
    });
  }

  _setBass(entity_id, value) {
    this.hass.callService('number', 'set_value', {
      entity_id: entity_id,
      value: value,
    });
  }

  _setTreble(entity_id, value) {
    this.hass.callService('number', 'set_value', {
      entity_id: entity_id,
      value: value,
    });
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card-container">
          <h2>${this.config.title || 'Axium Amplifier'}</h2>
          ${this.zones.map(zoneId => {
            const mediaPlayerEntity = `media_player.axium_${zoneId}`;
            const bassEntity = `number.${zoneId}_bass`;
            const trebleEntity = `number.${zoneId}_treble`;
            
            const mediaPlayer = this.hass.states[mediaPlayerEntity];
            const bass = this.hass.states[bassEntity];
            const treble = this.hass.states[trebleEntity];
            
            if (!mediaPlayer) {
              return html`<div>Entity not found: ${mediaPlayerEntity}</div>`;
            }
            
            const isPowered = mediaPlayer.state !== 'off';
            const zoneName = mediaPlayer.attributes.friendly_name;
            const currentSource = mediaPlayer.attributes.source;
            const volume = mediaPlayer.attributes.volume_level || 0;
            const sources = mediaPlayer.attributes.source_list || [];
            
            return html`
              <div class="zone">
                <div class="zone-header">
                  <div class="zone-name">${zoneName}</div>
                  <div class="zone-power" @click=${() => this._togglePower(mediaPlayerEntity)}>
                    <ha-icon icon="${isPowered ? 'mdi:power' : 'mdi:power-off'}" 
                             style="color: ${isPowered ? 'var(--success-color, green)' : 'var(--error-color, red)'};">
                    </ha-icon>
                  </div>
                </div>
                
                <div class=${isPowered ? '' : 'disabled'}>
                  <div class="source-control">
                    <select class="source-selector" 
                            @change=${(e) => this._selectSource(mediaPlayerEntity, e.target.value)} 
                            .value=${currentSource}>
                      ${sources.map(source => html`
                        <option value=${source} ?selected=${source === currentSource}>${source}</option>
                      `)}
                    </select>
                  </div>
                  
                  <div class="sliders">
                    <div class="slider-container">
                      <div class="slider-label">Volume</div>
                      <input type="range" class="slider" min="0" max="1" step="0.01" 
                             .value=${volume}
                             @change=${(e) => this._setVolume(mediaPlayerEntity, e.target.value)}>
                      <div>${Math.round(volume * 100)}%</div>
                    </div>
                    
                    ${bass ? html`
                      <div class="slider-container">
                        <div class="slider-label">Bass</div>
                        <input type="range" class="slider" 
                               min=${bass.attributes.min} 
                               max=${bass.attributes.max} 
                               step=${bass.attributes.step} 
                               .value=${bass.state}
                               @change=${(e) => this._setBass(bassEntity, e.target.value)}>
                        <div>${bass.state}</div>
                      </div>
                    ` : ''}
                    
                    ${treble ? html`
                      <div class="slider-container">
                        <div class="slider-label">Treble</div>
                        <input type="range" class="slider" 
                               min=${treble.attributes.min} 
                               max=${treble.attributes.max} 
                               step=${treble.attributes.step} 
                               .value=${treble.state}
                               @change=${(e) => this._setTreble(trebleEntity, e.target.value)}>
                        <div>${treble.state}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('axium-card', AxiumCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "axium-card",
  name: "Axium Amplifier Card",
  description: "Custom card for Axium amplifier control"
}); 