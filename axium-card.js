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

  // Find entity by a partial name match
  _findEntity(entityType, partialId) {
    if (!this.hass) return null;
    
    // Look through all entities of the specified type
    const entities = Object.keys(this.hass.states)
      .filter(key => key.startsWith(entityType + '.'))
      .map(key => this.hass.states[key]);
    
    // Try exact match first
    const exactMatch = entities.find(entity => 
      entity.entity_id.includes(partialId)
    );
    
    if (exactMatch) return exactMatch;
    
    // Try to match by the unique_id in attributes if available
    const attributeMatch = entities.find(entity => 
      entity.attributes.unique_id && entity.attributes.unique_id.includes(partialId)
    );
    
    if (attributeMatch) return attributeMatch;
    
    // Try to match by friendly name containing the zone name
    const nameMatch = entities.find(entity => {
      const friendlyName = entity.attributes.friendly_name;
      if (!friendlyName) return false;
      
      // Extract zone name from partialId (e.g., "master_bedroom" from "master_bedroom_bass")
      const zoneName = partialId.split('_')[0];
      return friendlyName.toLowerCase().includes(zoneName.toLowerCase());
    });
    
    return nameMatch || null;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    // Debug: List all number entities to console
    console.log("Available number entities:", Object.keys(this.hass.states)
      .filter(key => key.startsWith('number.'))
      .join(', '));

    return html`
      <ha-card>
        <div class="card-container">
          <h2>${this.config.title || 'Axium Amplifier'}</h2>
          ${this.zones.map(zoneId => {
            // Get the media player entity
            const mediaPlayerEntity = `media_player.axium_${zoneId}`;
            const mediaPlayer = this.hass.states[mediaPlayerEntity];
            
            if (!mediaPlayer) {
              return html`<div>Media player entity not found: ${mediaPlayerEntity}</div>`;
            }
            
            // Try to find bass and treble entities using a fuzzy search
            const bassSearchId = `${zoneId}_bass`;
            const trebleSearchId = `${zoneId}_treble`;
            
            const bass = this._findEntity('number', bassSearchId);
            const treble = this._findEntity('number', trebleSearchId);
            
            // Log debug info for this zone
            console.log(`Zone ${zoneId}:`, {
              mediaPlayer: mediaPlayerEntity,
              bassSearchId: bassSearchId,
              trebleSearchId: trebleSearchId,
              bassFound: bass ? bass.entity_id : 'not found',
              trebleFound: treble ? treble.entity_id : 'not found',
            });
            
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
                               min=${bass.attributes.min || -10} 
                               max=${bass.attributes.max || 10} 
                               step=${bass.attributes.step || 1} 
                               .value=${bass.state}
                               @change=${(e) => this._setBass(bass.entity_id, e.target.value)}>
                        <div>${bass.state}</div>
                      </div>
                    ` : html`<div>Bass control not found for ${zoneId}</div>`}
                    
                    ${treble ? html`
                      <div class="slider-container">
                        <div class="slider-label">Treble</div>
                        <input type="range" class="slider" 
                               min=${treble.attributes.min || -10} 
                               max=${treble.attributes.max || 10} 
                               step=${treble.attributes.step || 1} 
                               .value=${treble.state}
                               @change=${(e) => this._setTreble(treble.entity_id, e.target.value)}>
                        <div>${treble.state}</div>
                      </div>
                    ` : html`<div>Treble control not found for ${zoneId}</div>`}
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