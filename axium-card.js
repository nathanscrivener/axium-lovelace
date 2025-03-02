import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

// Version and timestamp for cache busting
const CARD_VERSION = '1.1.0';

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
        --mmp-accent-color: var(--accent-color, #f39c12);
        --mmp-text-color: var(--primary-text-color, #212121);
        --mmp-icon-color: var(--paper-item-icon-color, #44739e);
        --mmp-button-color: var(--paper-item-icon-active-color, #fdd835);
        --mmp-info-opacity: 0.7;
        --mmp-bg-opacity: 0.2;
        --mmp-border-radius: 12px;
        --mmp-unit-opacity: 0.6;
      }
      
      ha-card {
        padding: 8px;
        border-radius: var(--ha-card-border-radius, 4px);
        background: var(--ha-card-background, var(--card-background-color, white));
      }
      
      .card-content {
        padding: 8px;
      }
      
      .card-heading {
        padding: 0 8px 12px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.1));
        margin-bottom: 8px;
      }
      
      .card-heading .title {
        font-weight: 500;
        font-size: 1.2em;
        color: var(--mmp-text-color);
      }
      
      .zone {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: var(--mmp-border-radius);
        background: var(--ha-card-background, var(--card-background-color, white));
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .zone:last-child {
        margin-bottom: 0;
      }
      
      .zone-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.06));
      }
      
      .zone-name {
        font-weight: 500;
        font-size: 1.1em;
        letter-spacing: 0.01em;
        text-transform: capitalize;
        color: var(--mmp-text-color);
      }
      
      .zone-power {
        cursor: pointer;
      }
      
      .zone-power ha-icon {
        --mdc-icon-size: 20px;
        padding: 6px;
        border-radius: 50%;
        background: var(--secondary-background-color, rgba(0,0,0,0.06));
        transition: all 0.2s ease;
      }
      
      .zone-power ha-icon:hover {
        background: var(--primary-color);
        color: var(--primary-text-color) !important;
      }
      
      .source-selector {
        width: 100%;
        margin-bottom: 12px;
        border: none;
        background: var(--secondary-background-color, rgba(0,0,0,0.06));
        border-radius: 4px;
        padding: 10px 32px 10px 12px;
        color: var(--primary-text-color);
        font-size: 0.9em;
        appearance: none;
        -webkit-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M7 10l5 5 5-5z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 8px center;
        transition: all 0.2s ease;
      }
      
      .source-selector:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--mmp-accent-color);
      }
      
      .sliders {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .slider-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .slider-icon {
        --mdc-icon-size: 22px;
        color: var(--mmp-icon-color);
        opacity: var(--mmp-info-opacity);
      }
      
      .slider {
        flex-grow: 1;
        height: 36px;
        cursor: pointer;
        border-radius: 28px;
        --paper-slider-active-color: var(--mmp-accent-color);
        --paper-slider-knob-color: var(--mmp-accent-color);
        --paper-slider-pin-color: var(--mmp-accent-color);
        --paper-slider-container-color: var(--slider-track-color, rgba(0,0,0,0.1));
      }
      
      .slider-value {
        min-width: 38px;
        text-align: right;
        opacity: var(--mmp-unit-opacity);
        font-size: 0.9em;
        font-variant-numeric: tabular-nums;
      }
      
      .error-text {
        color: var(--error-color);
        font-size: 0.85em;
        font-style: italic;
        opacity: 0.8;
        padding: 4px 0;
      }
      
      .disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      
      .hidden {
        display: none;
      }
    `;
  }

  constructor() {
    super();
    this.zones = [];
    
    // Log version
    console.log(`Axium Card v${CARD_VERSION} loading...`);
  }

  setConfig(config) {
    if (!config.zones || !Array.isArray(config.zones)) {
      throw new Error("You need to define at least one zone");
    }
    
    // Set defaults and store config
    this.config = {
      ...config,
      show_error_messages: config.show_error_messages !== false, // default to true
      show_as_cards: config.show_as_cards !== false, // default to true
    };
    
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
      value: Number(value),
    });
  }

  _setTreble(entity_id, value) {
    this.hass.callService('number', 'set_value', {
      entity_id: entity_id,
      value: Number(value),
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
      const zoneName = partialId.split('_').slice(0, -1).join('_');
      return friendlyName.toLowerCase().includes(zoneName.toLowerCase());
    });
    
    return nameMatch || null;
  }

  render() {
    if (!this.hass || !this.config) {
      return html`<ha-card><div class="card-content">Loading Axium Card...</div></ha-card>`;
    }

    // Debug: List all number entities to console
    console.log("Available number entities:", Object.keys(this.hass.states)
      .filter(key => key.startsWith('number.'))
      .join(', '));

    return html`
      <ha-card>
        <div class="card-heading">
          <div class="title">${this.config.title || 'Axium Amplifier'}</div>
          <div class="version-info" style="font-size: 0.7em; opacity: 0.6;">v${CARD_VERSION}</div>
        </div>
        
        <div class="card-content">
          ${this.zones.map(zoneId => this._renderZone(zoneId))}
        </div>
      </ha-card>
    `;
  }
  
  _renderZone(zoneId) {
    // Get the media player entity
    const mediaPlayerEntity = `media_player.axium_${zoneId}`;
    const mediaPlayer = this.hass.states[mediaPlayerEntity];
    
    if (!mediaPlayer) {
      return this.config.show_error_messages ? html`
        <div class="zone" style="border: 1px solid var(--error-color, red); opacity: 0.8;">
          <div class="error-text">
            <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 16px;"></ha-icon>
            Media player entity not found: ${mediaPlayerEntity}
          </div>
        </div>
      ` : html``;
    }
    
    // Try to find bass and treble entities using the correct naming convention
    const bassEntity = `number.axium_${zoneId}_bass`;
    const trebleEntity = `number.axium_${zoneId}_treble`;
    
    const bass = this.hass.states[bassEntity];
    const treble = this.hass.states[trebleEntity];
    
    // Log debug info for this zone
    console.log(`Zone ${zoneId}:`, {
      mediaPlayer: mediaPlayerEntity,
      bassEntity: bassEntity,
      trebleEntity: trebleEntity,
      bassFound: bass ? 'found' : 'not found',
      trebleFound: treble ? 'found' : 'not found',
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
                     style="color: ${isPowered ? 'var(--success-color, #28a745)' : 'var(--error-color, #dc3545)'};">
            </ha-icon>
          </div>
        </div>
        
        <div class=${isPowered ? '' : 'disabled'}>
          <!-- Source selector with improved styling -->
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
            <!-- Volume control with icon -->
            <div class="slider-container">
              <ha-icon class="slider-icon" icon="mdi:volume-high"></ha-icon>
              <input type="range" class="slider" min="0" max="1" step="0.01" 
                     .value=${volume}
                     @change=${(e) => this._setVolume(mediaPlayerEntity, e.target.value)}>
              <div class="slider-value">${Math.round(volume * 100)}%</div>
            </div>
            
            <!-- Bass control with icon -->
            ${bass ? html`
              <div class="slider-container">
                <ha-icon class="slider-icon" icon="mdi:tune-vertical-variant"></ha-icon>
                <input type="range" class="slider" 
                       min=${bass.attributes.min || -10} 
                       max=${bass.attributes.max || 10} 
                       step=${bass.attributes.step || 1} 
                       .value=${bass.state}
                       @change=${(e) => this._setBass(bassEntity, e.target.value)}>
                <div class="slider-value">${bass.state}</div>
              </div>
            ` : this.config.show_error_messages ? html`
              <div class="error-text">
                <ha-icon icon="mdi:tune-vertical-variant" style="--mdc-icon-size: 16px;"></ha-icon>
                Bass control not available
              </div>
            ` : html``}
            
            <!-- Treble control with icon -->
            ${treble ? html`
              <div class="slider-container">
                <ha-icon class="slider-icon" icon="mdi:tune"></ha-icon>
                <input type="range" class="slider" 
                       min=${treble.attributes.min || -10} 
                       max=${treble.attributes.max || 10} 
                       step=${treble.attributes.step || 1} 
                       .value=${treble.state}
                       @change=${(e) => this._setTreble(trebleEntity, e.target.value)}>
                <div class="slider-value">${treble.state}</div>
              </div>
            ` : this.config.show_error_messages ? html`
              <div class="error-text">
                <ha-icon icon="mdi:tune" style="--mdc-icon-size: 16px;"></ha-icon>
                Treble control not available
              </div>
            ` : html``}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('axium-card', AxiumCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "axium-card",
  name: "Axium Amplifier Card",
  description: `Custom card for Axium amplifier control (v${CARD_VERSION})`
});

// Log confirmation message
console.log(`Axium Card v${CARD_VERSION} registered successfully!`); 