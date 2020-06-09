import { LitElement, html, css } from 'lit-element';
import { fireEvent } from 'custom-card-helpers';
import localize from './localize';

export class VacuumCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      _config: Object,
      _toggle: Boolean,
    };
  }

  setConfig(config) {
    this._config = config;

    if (!this._config.entity) {
      this._config.entity = this.getEntitiesByType('switch')[0] || '';
      fireEvent(this, 'config-changed', { config: this._config });
    }
  }

  get _entity() {
    if (this._config) {
      return this._config.entity || '';
    }

    return '';
  }

  get _next_cycle_sensor() {
    if (this._config) {
      return this._config.next_cycle_sensor || '';
    }

    return '';
  }

  get _watering_time_sensor() {
    if (this._config) {
      return this._config.watering_time_sensor || '';
    }

    return '';
  }

  get _image() {
    if (this._config) {
      return this._config.image || '';
    }

    return '';
  }

  get _show_name() {
    if (this._config) {
      return this._config.show_name || true;
    }

    return '';
  }

  get _show_toolbar() {
    if (this._config) {
      return this._config.show_toolbar || true;
    }

    return true;
  }

  get _compact_view() {
    if (this._config) {
      return this._config.compact_view || false;
    }

    return false;
  }

  getEntitiesByType(type) {
    return Object.keys(this.hass.states).filter(
      (eid) => eid.substr(0, eid.indexOf('.')) === type
    );
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const sprinklerEntities = this.getEntitiesByType('switch');
    const sensorEntities = this.getEntitiesByType('sensor');

    return html`
      <div class="card-config">
        <paper-dropdown-menu
          label="${localize('editor.entity')}"
          @value-changed=${this._valueChanged}
          .configValue=${'entity'}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${sprinklerEntities.indexOf(this._entity)}
          >
            ${sprinklerEntities.map((entity) => {
              return html` <paper-item>${entity}</paper-item> `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu
          label="${localize('editor.watering_time')}"
          @value-changed=${this._valueChanged}
          .configValue=${'watering_time_sensor'}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${sensorEntities.indexOf(this._watering_time_sensor)}
          >
            ${sensorEntities.map((entity) => {
              return html` <paper-item>${entity}</paper-item> `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu
          label="${localize('editor.next_cycle')}"
          @value-changed=${this._valueChanged}
          .configValue=${'next_cycle_sensor'}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${sensorEntities.indexOf(this._next_cycle_sensor)}
          >
            ${sensorEntities.map((entity) => {
              return html` <paper-item>${entity}</paper-item> `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-input
          hidden=true
          label="${localize('editor.image')}"
          .value=${this._image}
          .configValue=${'image'}
          @value-changed=${this._valueChanged}
        ></paper-input>

        <ha-switch
          hidden=true
          style="margin: 10px auto;"
          aria-label=${localize(
            this._compact_view
              ? 'editor.compact_view_aria_label_off'
              : 'editor.compact_view_aria_label_on'
          )}
          .checked=${this._compact_view !== false}
          .configValue=${'compact_view'}
          @change=${this._valueChanged}
        >
          ${localize('editor.compact_view')}
        </ha-switch>

        <ha-switch
          style="margin: 10px auto;"
          aria-label=${localize(
            this._show_name
              ? 'editor.show_name_aria_label_off'
              : 'editor.show_name_aria_label_on'
          )}
          .checked=${this._show_name !== false}
          .configValue=${'show_name'}
          @change=${this._valueChanged}
        >
          ${localize('editor.show_name')}
        </ha-switch>

        <ha-switch
          style="margin: 10px auto;"
          aria-label=${localize(
            this._show_name
              ? 'editor.show_toolbar_aria_label_off'
              : 'editor.show_toolbar_aria_label_on'
          )}
          .checked=${this._show_toolbar !== false}
          .configValue=${'show_toolbar'}
          @change=${this._valueChanged}
        >
          ${localize('editor.show_toolbar')}
        </ha-switch>

        <strong>
          ${localize('editor.code_only_note')}
        </strong>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles() {
    return css`
      .card-config paper-dropdown-menu {
        width: 100%;
      }
    `;
  }
}

customElements.define('sprinkler-card-editor', VacuumCardEditor);
