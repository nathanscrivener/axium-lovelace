import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element@2.4.0';

// Version and timestamp for cache busting
const CARD_VERSION = '1.4.4';

class AxiumCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _showSourceMenu: { type: Object },
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
        --mmp-progress-height: 4px;
        --mmp-border-radius: 12px;
        --ha-card-border-radius: 12px;
        
        display: block;
        transition: all 0.5s ease;
        margin-bottom: 0.5rem;
        border-radius: 12px;
      }

      ha-card {
        cursor: default;
        display: flex;
        flex-direction: column;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: 12px !important;
        padding: 16px;
        overflow: hidden;
        box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
      }
      
      .mmp-title {
        font-weight: 500;
        margin-bottom: 16px;
        color: var(--mmp-text-color);
        font-size: 1.7em;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .mmp-title__version {
        display: none; /* Hide version number */
        font-size: 0.7em;
        opacity: 0.5;
      }
      
      /* Zone styling */
      .mmp-player {
        position: relative;
        margin-bottom: 16px;
        background: transparent;
        border-radius: 4px;
        overflow: visible;
      }

      .mmp-player:last-child {
        margin-bottom: 0;
      }

      .mmp-player__inner {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      
      .mmp-player__row {
        display: flex;
        align-items: center;
        position: relative;
      }
      
      .mmp-player__icon {
        min-width: 42px;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
      }
      
      .mmp-player__icon ha-icon {
        --mdc-icon-size: 22px;
        display: flex;
        color: var(--mmp-icon-color);
      }
      
      .mmp-player__info {
        flex: 1;
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 42px;
      }
      
      .mmp-player__name {
        font-weight: var(--mmp-name-font-weight);
        font-size: 1.1rem;
        color: var(--mmp-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .mmp-player__source {
        font-size: 1.1rem;
        opacity: var(--mmp-info-opacity);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 0;
      }
      
      .mmp-player__controls-flex {
        display: flex;
        align-items: center;
        margin-left: auto;
        gap: 4px;
      }
      
      .mmp-player__media-dropdown {
        position: relative;
        height: 42px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .mmp-player__media-dropdown ha-icon {
        --mdc-icon-size: 22px;
        color: var(--mmp-icon-color);
        opacity: var(--mmp-info-opacity);
        transform: rotate(90deg);
        transition: transform 0.2s ease;
      }
      
      .mmp-player__media-dropdown.open ha-icon {
        transform: rotate(270deg);
      }
      
      .mmp-player__media-dropdown-list {
        position: absolute;
        right: 0;
        top: 42px;
        z-index: 2;
        width: auto;
        min-width: 180px;
        max-width: 250px;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        padding: 4px 0;
        display: none;
      }
      
      .mmp-player__media-dropdown-list.open {
        display: block;
      }
      
      .mmp-player__source-option {
        padding: 8px 16px;
        cursor: pointer;
        font-size: 1.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .mmp-player__source-option:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      }
      
      .mmp-player__source-option.active {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
        color: var(--mmp-accent-color);
      }
      
      .mmp-player__power {
        height: 42px;
        width: 42px;
        min-width: 42px;
        margin-left: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .mmp-player__power ha-icon {
        --mdc-icon-size: 26px;
        display: flex;
        color: var(--mmp-text-color);
        transition: color 0.25s ease, transform 0.15s ease;
        opacity: var(--mmp-info-opacity);
      }
      
      .mmp-player__power ha-icon.active {
        color: var(--mmp-accent-color);
        opacity: 1;
      }
      
      .mmp-player__power:hover ha-icon {
        transform: scale(1.1);
      }
      
      .mmp-player__power:active ha-icon {
        transform: scale(0.95);
      }
      
      .mmp-player__controls {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 16px;
        margin-left: 48px;
        gap: 12px;
        padding-right: 60px;
      }
      
      .mmp-player__slider-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        padding-right: 42px;
      }
      
      .mmp-player__slider-label {
        min-width: 70px; /* Increased from 60px to prevent overlap */
        width: 70px; /* Fixed width for consistent alignment */
        font-size: 1rem;
        opacity: var(--mmp-info-opacity);
        display: flex;
        align-items: center;
      }
      
      .mmp-player__slider-label ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 4px;
      }
      
      .mmp-player__slider-container {
        position: relative;
        flex: 1;
        height: 4px;
        cursor: pointer;
        border-radius: calc(4px / 2);
        overflow: visible;
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
      }
      
      .mmp-player__slider-track {
        position: absolute;
        height: 100%;
        background-color: var(--mmp-accent-color);
        transition: transform 0.15s ease;
      }
      
      .mmp-player__slider-thumb {
        position: absolute;
        top: 50%;
        height: 16px;
        width: 16px;
        border-radius: 50% !important;
        background-color: var(--mmp-accent-color);
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        z-index: 1;
        display: block;
      }
      
      /* Add tooltip container */
      .mmp-player__slider-tooltip {
        visibility: hidden;
        position: absolute;
        background-color: var(--mmp-accent-color);
        color: var(--mmp-text-color-inverted);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
        bottom: 24px;
        transform: translateX(-50%);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        z-index: 10;
        pointer-events: none;
        transition: visibility 0.1s ease, opacity 0.1s ease;
        opacity: 0;
      }
      
      /* Add the triangle pointer */
      .mmp-player__slider-tooltip:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: var(--mmp-accent-color) transparent transparent transparent;
      }
      
      /* Show tooltip on hover */
      .mmp-player__slider-container:hover .mmp-player__slider-tooltip {
        visibility: visible;
        opacity: 1;
      }
      
      .mmp-player__slider-value {
        min-width: 30px;
        width: 30px; /* Fixed width for consistent alignment */
        text-align: right;
        font-size: 1rem;
        opacity: var(--mmp-info-opacity);
        display: none; /* Hide the static value display */
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
    `;
  }

  constructor() {
    super();
    this.zones = [];
    this._sliderUpdateInterval = {};
    this._showSourceMenu = {};
    
    // Bind global click handler to close dropdown menus when clicking outside
    this._boundHandleClick = this._handleGlobalClick.bind(this);
    document.addEventListener('click', this._boundHandleClick);
    
    // Log version
    console.log(`Axium Card v${CARD_VERSION} loading...`);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundHandleClick);
  }

  setConfig(config) {
    if (!config.zones || !Array.isArray(config.zones)) {
      throw new Error("You need to define at least one zone");
    }
    
    // Set defaults and store config
    this.config = {
      ...config,
      show_error_messages: config.show_error_messages !== false, // default to true
    };
    
    this.zones = config.zones;
  }

  // Close dropdowns when clicking outside
  _handleGlobalClick(event) {
    const path = event.composedPath();
    
    // Only process if we have a shadowRoot (component is initialized)
    if (this.shadowRoot) {
      const dropdowns = this.shadowRoot.querySelectorAll('.mmp-player__media-dropdown');
      
      // For each dropdown, check if the click was outside it
      dropdowns.forEach(dropdown => {
        if (!path.includes(dropdown)) {
          const zoneId = dropdown.getAttribute('data-zone-id');
          if (this._showSourceMenu[zoneId]) {
            this._showSourceMenu = {
              ...this._showSourceMenu,
              [zoneId]: false
            };
            this.requestUpdate();
          }
        }
      });
    }
  }
  
  // Configure card size in UI
  getCardSize() {
    return 1 + (this.config.zones.length * 2);
  }

  _togglePower(entity_id) {
    this.hass.callService('media_player', 'toggle', {
      entity_id: entity_id,
    });
  }

  _selectSource(entity_id, source, zoneId) {
    // Close the dropdown menu
    this._showSourceMenu = {
      ...this._showSourceMenu,
      [zoneId]: false
    };
    
    // Select the source
    this.hass.callService('media_player', 'select_source', {
      entity_id: entity_id,
      source: source,
    });
    
    this.requestUpdate();
  }

  _toggleSourceMenu(zoneId, event) {
    // Stop event propagation to prevent the global click handler from closing it immediately
    event.stopPropagation();
    
    // Toggle menu for this zone only
    this._showSourceMenu = {
      ...this._showSourceMenu,
      [zoneId]: !this._showSourceMenu[zoneId]
    };
    
    this.requestUpdate();
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
    
    // Initialize this value if not yet set
    if (!container._lastSentValue) {
      container._lastSentValue = value;
    }
    
    // Update thumb position visually
    this._updateSliderPosition(container, value, min, max);
    
    // Update tooltip position and value
    this._updateTooltip(container, value);
    
    // Track interaction - used to prevent race conditions
    container._userInteracting = true;
    
    // Call the callback with the new value only if it's significantly different
    if (Math.abs(container._lastSentValue - value) > (step * 2)) {
      container._lastSentValue = value;
      if (callback) {
        callback(value);
      }
    }
    
    // Set up move and release handlers
    const moveHandler = (e) => {
      e.preventDefault();
      const newValue = this._calculateSliderValue(e, rect, min, max);
      
      // Always update visually for smooth appearance
      this._updateSliderPosition(container, newValue, min, max);
      this._updateTooltip(container, newValue);
      
      // Apply step to the actual value we'll send
      let steppedValue = Math.round(newValue / step) * step;
      // Ensure the value is within bounds
      steppedValue = Math.max(min, Math.min(max, steppedValue));
      
      // Only send updates when value changes significantly to reduce traffic
      if (Math.abs(container._lastSentValue - steppedValue) > (step * 0.9)) {
        clearTimeout(this._sliderUpdateInterval[container.id]);
        this._sliderUpdateInterval[container.id] = setTimeout(() => {
          container._lastSentValue = steppedValue;
          if (callback) {
            callback(steppedValue);
          }
        }, 100); // Increased from 50ms to 100ms for better stability
      }
    };
    
    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', upHandler);
      
      // Clear user interaction flag after a delay to prevent race conditions
      setTimeout(() => {
        container._userInteracting = false;
      }, 500);
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
    const track = container.querySelector('.mmp-player__slider-track');
    const thumb = container.querySelector('.mmp-player__slider-thumb');
    
    if (track && thumb) {
      const percentage = (value - min) / (max - min) * 100;
      track.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
    }
  }
  
  // Add method to update tooltip
  _updateTooltip(container, value) {
    let tooltip = container.querySelector('.mmp-player__slider-tooltip');
    const thumb = container.querySelector('.mmp-player__slider-thumb');
    
    // Create tooltip if it doesn't exist
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'mmp-player__slider-tooltip';
      container.appendChild(tooltip);
    }
    
    // Determine what kind of slider this is and format accordingly
    let displayValue;
    if (container.id.startsWith('volume')) {
      displayValue = `${Math.round(value * 100)}%`;
    } else {
      displayValue = Math.round(value);
    }
    
    // Update tooltip content
    tooltip.textContent = displayValue;
    
    // Position tooltip to follow thumb
    if (thumb) {
      const percentage = (value - parseFloat(container.getAttribute('data-min') || 0)) / 
                        (parseFloat(container.getAttribute('data-max') || 1) - parseFloat(container.getAttribute('data-min') || 0)) * 100;
      tooltip.style.left = `${percentage}%`;
    }
  }

  // Setup slider with correct initial position
  _setupSlider(container, value, min, max) {
    if (!container) return;
    
    // Store min/max as data attributes for tooltip calculations
    container.setAttribute('data-min', min);
    container.setAttribute('data-max', max);
    
    // CHANGE: Only prefer the last sent value during active interaction
    // When not interacting, always use the provided entity state value
    const displayValue = container._userInteracting ? 
      (container._lastSentValue !== undefined ? container._lastSentValue : value) : 
      value;
    
    const percentage = (displayValue - min) / (max - min) * 100;
    const track = container.querySelector('.mmp-player__slider-track');
    const thumb = container.querySelector('.mmp-player__slider-thumb');
    
    if (track && thumb) {
      track.style.width = `${percentage}%`;
      thumb.style.left = `${percentage}%`;
      
      // Force the thumb to be visible and circular
      thumb.style.borderRadius = '50%';
    }
    
    // Create tooltip for this slider
    let tooltip = container.querySelector('.mmp-player__slider-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'mmp-player__slider-tooltip';
      container.appendChild(tooltip);
      
      // Determine what kind of slider this is and format accordingly
      let displayTooltipValue;
      if (container.id.startsWith('volume')) {
        displayTooltipValue = `${Math.round(displayValue * 100)}%`;
      } else {
        displayTooltipValue = Math.round(displayValue);
      }
      
      // Set tooltip content
      tooltip.textContent = displayTooltipValue;
      
      // Position tooltip
      tooltip.style.left = `${percentage}%`;
    }
    
    // Store the last value only if we're actively interacting
    if (container._userInteracting && container._lastSentValue === undefined) {
      container._lastSentValue = value;
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
      return html`<ha-card>Loading Axium Card...</ha-card>`;
    }

    return html`
      <ha-card>
        <div class="mmp-title">
          <span>${this.config.title || 'Axium Amplifier'}</span>
        </div>
        ${this.zones.map(zoneId => this._renderZone(zoneId))}
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
    
    // Initialize source menu state if not already defined
    if (this._showSourceMenu[zoneId] === undefined) {
      this._showSourceMenu[zoneId] = false;
    }
    
    return html`
      <div class="mmp-player">
        <div class="mmp-player__inner">
          <!-- Top row with controls -->
          <div class="mmp-player__row">
            <!-- Speaker icon -->
            <div class="mmp-player__icon">
              <ha-icon icon="mdi:speaker"></ha-icon>
            </div>
            
            <!-- Zone info -->
            <div class="mmp-player__info">
              <div class="mmp-player__name">${zoneName}</div>
            </div>
            
            <!-- Controls on the right -->
            <div class="mmp-player__controls-flex">
              <!-- Source name to the left of dropdown -->
              ${isPowered && currentSource ? html`
                <div class="mmp-player__source">${currentSource}</div>
              ` : html``}
              
              <!-- Source dropdown menu -->
              <div class="mmp-player__media-dropdown ${this._showSourceMenu[zoneId] ? 'open' : ''}" 
                  data-zone-id="${zoneId}"
                  @click=${(e) => this._toggleSourceMenu(zoneId, e)}>
                <ha-icon icon="mdi:chevron-right"></ha-icon>
                
                <!-- Dropdown content -->
                <div class="mmp-player__media-dropdown-list ${this._showSourceMenu[zoneId] ? 'open' : ''}">
                  ${sources.map(source => html`
                    <div class="mmp-player__source-option ${source === currentSource ? 'active' : ''}"
                        @click=${(e) => {
                          e.stopPropagation();
                          this._selectSource(mediaPlayerEntity, source, zoneId);
                        }}>
                      ${source}
                    </div>
                  `)}
                </div>
              </div>
              
              <!-- Power toggle -->
              <div class="mmp-player__power" @click=${() => this._togglePower(mediaPlayerEntity)}>
                <ha-icon 
                  icon="mdi:power" 
                  class="${isPowered ? 'active' : ''}">
                </ha-icon>
              </div>
            </div>
          </div>
          
          <!-- Controls section - only shown when powered on -->
          ${isPowered ? html`
            <div class="mmp-player__controls">
              <!-- Volume slider -->
              <div class="mmp-player__slider-row">
                <div class="mmp-player__slider-label">
                  <ha-icon icon="mdi:volume-high"></ha-icon>
                  <span>Volume</span>
                </div>
                <div 
                  class="mmp-player__slider-container" 
                  id="volume-${zoneId}"
                  @mousedown=${(e) => this._handleSliderDown(e, (val) => this._setVolume(mediaPlayerEntity, val), 0, 1, 0.01)}
                  @touchstart=${(e) => this._handleSliderDown(e, (val) => this._setVolume(mediaPlayerEntity, val), 0, 1, 0.01)}>
                  <div class="mmp-player__slider-track"></div>
                  <div class="mmp-player__slider-thumb" style="border-radius: 50% !important; display: block;"></div>
                </div>
                <div class="mmp-player__slider-value">${Math.round(volume * 100)}%</div>
              </div>
              
              <!-- Bass slider -->
              ${bass ? html`
                <div class="mmp-player__slider-row">
                  <div class="mmp-player__slider-label">
                    <ha-icon icon="mdi:tune-vertical-variant"></ha-icon>
                    <span>Bass</span>
                  </div>
                  <div 
                    class="mmp-player__slider-container" 
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
                    <div class="mmp-player__slider-track"></div>
                    <div class="mmp-player__slider-thumb" style="border-radius: 50% !important; display: block;"></div>
                  </div>
                  <div class="mmp-player__slider-value">${bass.state}</div>
                </div>
              ` : html``}
              
              <!-- Treble slider -->
              ${treble ? html`
                <div class="mmp-player__slider-row">
                  <div class="mmp-player__slider-label">
                    <ha-icon icon="mdi:tune"></ha-icon>
                    <span>Treble</span>
                  </div>
                  <div 
                    class="mmp-player__slider-container" 
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
                    <div class="mmp-player__slider-track"></div>
                    <div class="mmp-player__slider-thumb" style="border-radius: 50% !important; display: block;"></div>
                  </div>
                  <div class="mmp-player__slider-value">${treble.state}</div>
                </div>
              ` : html``}
            </div>
          ` : html``}
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
        if (mediaPlayer && mediaPlayer.state !== 'off') {
          const volume = mediaPlayer.attributes.volume_level || 0;
          const volumeSlider = this.shadowRoot.querySelector(`#volume-${zoneId}`);
          if (volumeSlider && !volumeSlider._userInteracting) {
            this._setupSlider(volumeSlider, volume, 0, 1);
          }
          
          const bassEntity = `number.axium_${zoneId}_bass`;
          const bass = this.hass.states[bassEntity];
          if (bass) {
            const bassSlider = this.shadowRoot.querySelector(`#bass-${zoneId}`);
            if (bassSlider && !bassSlider._userInteracting) {
              const min = bass.attributes.min || -10;
              const max = bass.attributes.max || 10;
              this._setupSlider(bassSlider, Number(bass.state), min, max);
            }
          }
          
          const trebleEntity = `number.axium_${zoneId}_treble`;
          const treble = this.hass.states[trebleEntity];
          if (treble) {
            const trebleSlider = this.shadowRoot.querySelector(`#treble-${zoneId}`);
            if (trebleSlider && !trebleSlider._userInteracting) {
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