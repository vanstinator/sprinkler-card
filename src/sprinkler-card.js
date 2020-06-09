import { LitElement, html } from 'lit-element';
import { fireEvent } from 'custom-card-helpers';
import './sprinkler-card-editor';
import localize from './localize';
import styles from './styles';
import defaultImage from './sprinkler.png';

if (!customElements.get('ha-icon-button')) {
  customElements.define(
    'ha-icon-button',
    class extends customElements.get('paper-icon-button') {}
  );
}

class SprinklerCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      mapUrl: String,
      requestInProgress: Boolean,
    };
  }

  static get styles() {
    return styles;
  }

  static async getConfigElement() {
    return document.createElement('sprinkler-card-editor');
  }

  static getStubConfig(hass, entities) {
    const [sprinklerEntity] = entities.filter(
      (eid) => eid.substr(0, eid.indexOf('.')) === 'sprinkler'
    );

    return {
      entity: sprinklerEntity || '',
      image: 'default',
    };
  }

  get entity() {
    return this.hass.states[this.config.entity];
  }

  get watering_time_sensor() {
    return this.hass.states[this.config.watering_time_sensor];
  }

  get image() {
    if (this.config.image === 'default') {
      return defaultImage;
    }

    return this.config.image || defaultImage;
  }

  get showName() {
    if (this.config.show_name === undefined) {
      return true;
    }

    return this.config.show_name;
  }

  get showToolbar() {
    if (this.config.show_toolbar === undefined) {
      return true;
    }

    return this.config.show_toolbar;
  }

  get compactView() {
    if (this.config.compact_view === undefined) {
      return false;
    }

    return this.config.compact_view;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error(localize('error.missing_entity'));
    }
    this.config = config;
  }

  getCardSize() {
    return 2;
  }

  shouldUpdate() {
    return true;
    // return hasConfigOrEntityChanged(this, changedProps);
  }

  updated(changedProps) {

    if (
      changedProps.get('hass') &&
      changedProps.get('hass').states[this.config.entity].state !== this.hass.states[this.config.entity].state &&
      changedProps.get('hass').states[this.config.watering_time_sensor].state !== this.hass.states[this.config.watering_time_sensor].state
    ) {
      this.requestInProgress = false;
    }
  }

  handleMore() {
    fireEvent(
      this,
      'hass-more-info',
      {
        entityId: this.entity.entity_id,
      },
      {
        bubbles: true,
        composed: true,
      }
    );
  }

  handleSpeed(e) {
    const fan_speed = e.target.getAttribute('value');
    this.callService('set_fan_speed', false, { fan_speed });
  }

  callService(service, isRequest = false, options = {}) {
    this.hass.callService('sprinkler', service, {
      entity_id: this.config.entity,
      ...options,
    });

    if (isRequest) {
      this.requestInProgress = true;
      this.requestUpdate();
    }
  }

  toggle() {
    this.hass.callService('switch', 'toggle', {
      entity_id: this.config.entity
    });
  }

  getAttributes(entity) {
    const {
      status,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
      valetudo_state,
    } = entity.attributes;

    const valetudoStatus = valetudo_state ? valetudo_state.name : '';

    return {
      status: status || valetudoStatus,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
    };
  }

  renderImage(state) {
    if (this.compactView) {
      return html``;
    }

    if (this.image) {
      return html` <img class="sprinkler ${state}" src="${this.image}" /> `;
    }

    return html``;
  }

  renderStats(state) {
    const { stats = {} } = this.config;

    const statsList = stats[state] || stats.default || [];

    return statsList.map(({ attribute, unit, subtitle }) => {
      return html`
        <div class="stats-block">
          <span class="stats-hours">${this.entity.attributes[attribute]}</span>
          ${unit}
          <div class="stats-subtitle">${subtitle}</div>
        </div>
      `;
    });
  }

  renderName() {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.showName) {
      return html``;
    }

    return html`
      <div class="sprinkler-name">
        ${friendly_name}
      </div>
    `;
  }

  renderToolbar(state) {
    if (!this.showToolbar) {
      return html``;
    }

    switch (state) {
      case 'on': {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.toggle()}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
          </div>
        `;
      }

      case 'paused': {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.callService('start')}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${() => this.callService('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'returning': {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.callService('start')}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${() => this.callService('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
          </div>
        `;
      }
      case 'off':
      case 'idle':
      default: {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.toggle()}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.start')}
            </paper-button>
          </div>
        `;
      }
    }
  }

  render() {
    const { state } = this.entity;
    const { battery_level, battery_icon } = this.getAttributes(
      this.entity
    );

    let localizedStatus = '';
    if (this.watering_time_sensor) {
      localizedStatus = `${this.watering_time_sensor.state} ${localize('status.watering_remaining')}`;
    }

    return html`
      <ha-card>
        <div
          class="preview"
          @click="${() => this.handleMore()}"
          ?more-info="true"
        >
          <div class="header">
            <div class="status">
              <span class="status-text" alt=${localizedStatus}>
                ${localizedStatus}
              </span>
            </div>
            <div class="battery">
              ${battery_level}% <ha-icon icon="${battery_icon}"></ha-icon>
            </div>
          </div>

          ${this.renderImage(state)} ${this.renderName()}

          <div class="stats">
            ${this.renderStats(state)}
          </div>
        </div>

        ${this.renderToolbar(state)}
      </ha-card>
    `;
  }
}

customElements.define('sprinkler-card', SprinklerCard);

window.customCards = window.customCards || [];
window.customCards.push({
  preview: false,
  type: 'sprinkler-card',
  name: localize('common.name'),
  description: localize('common.description'),
});
