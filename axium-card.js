import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

// Version and timestamp for cache busting
const CARD_VERSION = '1.2.0';

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
        --mmp-scale: var(--mini-media-player-scale, 1);
        --mmp-unit: calc(var(--mmp-scale) * 40px);
        --mmp-name-font-weight: 400;
        --mmp-accent-color: var(--accent-color, #f39c12);
        --mmp-text-color: var(--primary-text-color, #212121);
        --mmp-text-color-inverted: var(--text-primary-color, #fff);
        --mmp-icon-color: var(--paper-item-icon-color, #44739e);
        --mmp-info-opacity: 0.7;
        --mmp-bg-opacity: 0.1;
        --mmp-artwork-opacity: 1;
        --mmp-progress-height: 6px;
        --mmp-border-radius: 12px;
        --ha-card-border-radius: 0;
        
        display: block;
        transition: all 0.5s ease;
        margin-bottom: 0.5rem;
      }

      ha-card {
        cursor: default;
        display: flex;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: var(--ha-card-border-radius);
        border: none;
        box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2));
        overflow: hidden;
      }
      
      .mmp-card__inner {
        padding: 16px;
        position: relative;
        width: 100%;
      }
      
      .mmp__bg {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: var(--mmp-bg-opacity);
      }
      
      .mmp-container {
        position: relative;
      }
      
      .mmp-title {
        padding: 0 0 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        font-size: 1.1em;
        color: var(--mmp-text-color);
      }
      
      .mmp-title__version {
        font-size: 0.7em;
        opacity: 0.5;
      }
      
      /* Zone styling */
      .mmp-zone {
        position: relative;
        margin-bottom: 10px;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
      }

      .mmp-zone:last-child {
        margin-bottom: 0;
      }

      .mmp-zone__container {
        padding: 8px;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      
      .mmp-zone__row {
        display: flex;
        align-items: center;
        position: relative;
      }
      
      .mmp-zone__power {
        min-width: 28px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .mmp-zone__power ha-icon {
        --mdc-icon-size: 20px;
        display: flex;
        color: var(--mmp-icon-color);
        padding: 5px;
        border-radius: 50%;
        transition: all 0.25s ease;
      }
      
      .mmp-zone__power ha-icon.active {
        color: var(--mmp-accent-color);
      }
      
      .mmp-zone__power ha-icon:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      }
      
      .mmp-zone__power ha-icon.active:hover {
        color: var(--mmp-text-color-inverted);
        background-color: var(--mmp-accent-color);
      }
      
      .mmp-zone__info {
        flex: 1;
        margin-right: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .mmp-zone__name {
        font-weight: var(--mmp-name-font-weight);
        font-size: 0.95rem;
        line-height: 1.2;
        color: var(--mmp-text-color);
      }
      
      .mmp-zone__source {
        font-size: 0.75rem;
        opacity: var(--mmp-info-opacity);
        line-height: 1.2;
        margin-top: 2px;
      }
      
      .mmp-zone__controls-row {
        display: flex;
        align-items: center;
        margin-top: 8px;
      }
      
      .mmp-zone__controls {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      
      .mmp-zone__slider-row {
        display: flex;
        align-items: center;
      }
      
      .mmp-control-label {
        min-width: 60px;
        font-size: 0.75rem;
        opacity: var(--mmp-info-opacity);
        display: flex;
        align-items: center;
      }
      
      .mmp-control-label ha-icon {
        --mdc-icon-size: 16px;
        margin-right: 4px;
      }
      
      .mmp-slider-container {
        position: relative;
        flex: 1;
        height: var(--mmp-progress-height);
        cursor: pointer;
        border-radius: calc(var(--mmp-progress-height) / 2);
        overflow: hidden;
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      }
      
      .mmp-slider-track {
        position: absolute;
        height: 100%;
        background-color: var(--mmp-accent-color);
        transition: transform 0.15s ease;
      }
      
      .mmp-slider-thumb {
        position: absolute;
        top: 50%;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: var(--mmp-accent-color);
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      
      .mmp-slider-container:hover .mmp-slider-thumb {
        transform: translate(-50%, -50%) scale(1.2);
      }
      
      .mmp-slider-value {
        min-width: 30px;
        text-align: right;
        font-size: 0.75rem;
        margin-left: 8px;
        opacity: var(--mmp-info-opacity);
      }
      
      .mmp-source-select {
        width: 100%;
        margin-top: 8px;
        display: flex;
        align-items: center;
        position: relative;
      }
      
      .mmp-source-select label {
        min-width: 60px;
        font-size: 0.75rem;
        opacity: var(--mmp-info-opacity);
        display: flex;
        align-items: center;
      }
      
      .mmp-source-select label ha-icon {
        --mdc-icon-size: 16px;
        margin-right: 4px;
      }
      
      .mmp-source-select select {
        flex: 1;
        border: none;
        cursor: pointer;
        padding: 4px 24px 4px 8px;
        border-radius: 4px;
        -webkit-appearance: none;
        appearance: none;
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
        color: var(--primary-text-color);
        font-size: 0.8rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M7 10l5 5 5-5z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 4px center;
      }
      
      .mmp-source-select select:focus {
        outline: none;
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      }
      
      .mmp-error {
        padding: 8px;
        border-radius: 4px;
        background-color: rgba(var(--rgb-error-color, 220, 53, 69), 0.1);
        color: var(--error-color);
        font-size: 0.8rem;
        display: flex;
        align-items: center;
      }
      
      .mmp-error ha-icon {
        --mdc-icon-size: 16px;
        margin-right: 8px;
        color: var(--error-color);
      }
      
      .mmp-disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      
      .mmp-hidden {
        display: none;
      }
    `;
  }

  constructor() {
    super();
    this.zones = [];
    this._sliderUpdateInterval = {};
    
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
    return this.config.zones.length * 2.5;
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

  // Helper to clean up zone names - remove "Axium" prefix
  _cleanZoneName(zoneName) {
    if (!zoneName) return '';
    return zoneName.replace(/^Axium\s+/i, '');
  }

  // Custom slider handlers
  _handleSliderDown(e, callback, min, max, step) {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const value = this._calculateSliderValue(e, rect, min, max);
    
    // Update thumb position visually
    this._updateSliderPosition(container, value, min, max);
    
    // Call the callback with the new value
    if (callback) {
      callback(value);
    }
    
    // Set up move and release handlers
    const moveHandler = (e) => {
      e.preventDefault();
      const newValue = this._calculateSliderValue(e, rect, min, max);
      // Update in smaller increments for smoother appearance
      this._updateSliderPosition(container, newValue, min, max);
      
      // Apply step to the actual value we'll send
      let steppedValue = Math.round(newValue / step) * step;
      // Ensure the value is within bounds
      steppedValue = Math.max(min, Math.min(max, steppedValue));
      
      // Throttle actual calls to avoid overwhelming the system
      clearTimeout(this._sliderUpdateInterval[container.id]);
      this._sliderUpdateInterval[container.id] = setTimeout(() => {
        if (callback) {
          callback(steppedValue);
        }
      }, 50);
    };
    
    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
    };
    
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('touchend', upHandler);
  }

  _calculateSliderValue(e, rect, min, max) {
    let clientX;
    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + percentage * (max - min);
  }

  _updateSliderPosition(container, value, min, max) {
    const track = container.querySelector('.mmp-slider-track');
    const thumb = container.querySelector('.mmp-slider-thumb');
    
    if (track && thumb) {
      const percentage = (value - min) / (max - min) * 100;
      track.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
    }
  }

  // Setup slider with correct initial position
  _setupSlider(container, value, min, max) {
    const percentage = (value - min) / (max - min) * 100;
    const track = container.querySelector('.mmp-slider-track');
    const thumb = container.querySelector('.mmp-slider-thumb');
    
    if (track && thumb) {
      track.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
    }
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
      return html`<ha-card><div class="mmp-card__inner">Loading Axium Card...</div></ha-card>`;
    }

    return html`
      <ha-card>
        <div class="mmp-card__inner">
          <div class="mmp__bg"></div>
          <div class="mmp-container">
            <div class="mmp-title">
              <span>${this.config.title || 'Axium Amplifier'}</span>
              <span class="mmp-title__version">v${CARD_VERSION}</span>
            </div>
            ${this.zones.map(zoneId => this._renderZone(zoneId))}
          </div>
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
        <div class="mmp-error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>Media player entity not found: ${mediaPlayerEntity}</span>
        </div>
      ` : html``;
    }
    
    // Try to find bass and treble entities using the correct naming convention
    const bassEntity = `number.axium_${zoneId}_bass`;
    const trebleEntity = `number.axium_${zoneId}_treble`;
    
    const bass = this.hass.states[bassEntity];
    const treble = this.hass.states[trebleEntity];
    
    const isPowered = mediaPlayer.state !== 'off';
    const zoneName = this._cleanZoneName(mediaPlayer.attributes.friendly_name);
    const currentSource = mediaPlayer.attributes.source;
    const volume = mediaPlayer.attributes.volume_level || 0;
    const sources = mediaPlayer.attributes.source_list || [];
    
    return html`
      <div class="mmp-zone">
        <div class="mmp-zone__container">
          <!-- Top row with power, name and source -->
          <div class="mmp-zone__row">
            <div class="mmp-zone__power" @click=${() => this._togglePower(mediaPlayerEntity)}>
              <ha-icon 
                icon="${isPowered ? 'mdi:power' : 'mdi:power-off'}" 
                class="${isPowered ? 'active' : ''}">
              </ha-icon>
            </div>
            
            <div class="mmp-zone__info">
              <div class="mmp-zone__name">${zoneName}</div>
              ${isPowered && currentSource ? html`
                <div class="mmp-zone__source">${currentSource}</div>
              ` : html``}
            </div>
          </div>
          
          <div class="${isPowered ? '' : 'mmp-disabled'}">
            <!-- Volume slider -->
            <div class="mmp-zone__controls">
              <div class="mmp-zone__slider-row">
                <div class="mmp-control-label">
                  <ha-icon icon="mdi:volume-high"></ha-icon>
                  <span>Volume</span>
                </div>
                <div 
                  class="mmp-slider-container" 
                  id="volume-${zoneId}"
                  @mousedown=${(e) => this._handleSliderDown(e, (val) => this._setVolume(mediaPlayerEntity, val), 0, 1, 0.01)}
                  @touchstart=${(e) => this._handleSliderDown(e, (val) => this._setVolume(mediaPlayerEntity, val), 0, 1, 0.01)}>
                  <div class="mmp-slider-track"></div>
                  <div class="mmp-slider-thumb"></div>
                </div>
                <div class="mmp-slider-value">${Math.round(volume * 100)}%</div>
              </div>
              
              <!-- Bass slider -->
              ${bass ? html`
                <div class="mmp-zone__slider-row">
                  <div class="mmp-control-label">
                    <ha-icon icon="mdi:tune-vertical-variant"></ha-icon>
                    <span>Bass</span>
                  </div>
                  <div 
                    class="mmp-slider-container" 
                    id="bass-${zoneId}"
                    @mousedown=${(e) => this._handleSliderDown(
                      e, 
                      (val) => this._setBass(bassEntity, val), 
                      bass.attributes.min || -10, 
                      bass.attributes.max || 10,
                      bass.attributes.step || 1
                    )}
                    @touchstart=${(e) => this._handleSliderDown(
                      e, 
                      (val) => this._setBass(bassEntity, val), 
                      bass.attributes.min || -10, 
                      bass.attributes.max || 10,
                      bass.attributes.step || 1
                    )}>
                    <div class="mmp-slider-track"></div>
                    <div class="mmp-slider-thumb"></div>
                  </div>
                  <div class="mmp-slider-value">${bass.state}</div>
                </div>
              ` : html``}
              
              <!-- Treble slider -->
              ${treble ? html`
                <div class="mmp-zone__slider-row">
                  <div class="mmp-control-label">
                    <ha-icon icon="mdi:tune"></ha-icon>
                    <span>Treble</span>
                  </div>
                  <div 
                    class="mmp-slider-container" 
                    id="treble-${zoneId}"
                    @mousedown=${(e) => this._handleSliderDown(
                      e, 
                      (val) => this._setTreble(trebleEntity, val), 
                      treble.attributes.min || -10, 
                      treble.attributes.max || 10,
                      treble.attributes.step || 1
                    )}
                    @touchstart=${(e) => this._handleSliderDown(
                      e, 
                      (val) => this._setTreble(trebleEntity, val), 
                      treble.attributes.min || -10, 
                      treble.attributes.max || 10,
                      treble.attributes.step || 1
                    )}>
                    <div class="mmp-slider-track"></div>
                    <div class="mmp-slider-thumb"></div>
                  </div>
                  <div class="mmp-slider-value">${treble.state}</div>
                </div>
              ` : html``}
            </div>
            
            <!-- Source selector -->
            <div class="mmp-source-select">
              <label>
                <ha-icon icon="mdi:music-box-multiple"></ha-icon>
                <span>Source</span>
              </label>
              <select @change=${(e) => this._selectSource(mediaPlayerEntity, e.target.value)}>
                ${sources.map(source => html`
                  <option value=${source} ?selected=${source === currentSource}>${source}</option>
                `)}
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProps) {
    super.updated(changedProps);
    
    // Initialize sliders after they've been rendered
    if (changedProps.has('hass')) {
      this.zones.forEach(zoneId => {
        const mediaPlayerEntity = `media_player.axium_${zoneId}`;
        const mediaPlayer = this.hass.states[mediaPlayerEntity];
        if (mediaPlayer) {
          const volume = mediaPlayer.attributes.volume_level || 0;
          const volumeSlider = this.shadowRoot.querySelector(`#volume-${zoneId}`);
          if (volumeSlider) {
            this._setupSlider(volumeSlider, volume, 0, 1);
          }
          
          const bassEntity = `number.axium_${zoneId}_bass`;
          const bass = this.hass.states[bassEntity];
          if (bass) {
            const bassSlider = this.shadowRoot.querySelector(`#bass-${zoneId}`);
            if (bassSlider) {
              const min = bass.attributes.min || -10;
              const max = bass.attributes.max || 10;
              this._setupSlider(bassSlider, Number(bass.state), min, max);
            }
          }
          
          const trebleEntity = `number.axium_${zoneId}_treble`;
          const treble = this.hass.states[trebleEntity];
          if (treble) {
            const trebleSlider = this.shadowRoot.querySelector(`#treble-${zoneId}`);
            if (trebleSlider) {
              const min = treble.attributes.min || -10;
              const max = treble.attributes.max || 10;
              this._setupSlider(trebleSlider, Number(treble.state), min, max);
            }
          }
        }
      });
    }
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