import { css } from 'lit-element';

export default css`
  :host {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  ha-card {
    flex-direction: column;
    flex: 1;
    position: relative;
    padding: 0px;
    border-radius: 4px;
    overflow: hidden;
  }

  .preview {
    background: var(--primary-color);
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }

  .map {
    display: block;
    max-width: 90%;
    image-rendering: crisp-edges;
  }

  @keyframes cleaning {
    0% {
      // transform: rotate(0) translate(0);
    }
    5% {
      // transform: rotate(0) translate(0, -10px);
    }
    10% {
      // transform: rotate(0) translate(0, 5px);
    }
    15% {
      // transform: rotate(0) translate(0);
    }
    /* Turn left */
    20% {
      // transform: rotate(30deg) translate(0);
    }
    25% {
      // transform: rotate(30deg) translate(0, -10px);
    }
    30% {
      // transform: rotate(30deg) translate(0, 5px);
    }
    35% {
      // transform: rotate(30deg) translate(0);
    }
    40% {
      // transform: rotate(0) translate(0);
    }
    /* Turn right */
    45% {
      // transform: rotate(-30deg) translate(0);
    }
    50% {
      // transform: rotate(-30deg) translate(0, -10px);
      opacity: 25%;
    }
    55% {
      // transform: rotate(-30deg) translate(0, 5px);
    }
    60% {
      // transform: rotate(-30deg) translate(0);
    }
    70% {
      // transform: rotate(0deg) translate(0);
    }
    /* Staying still */
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes returning {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(0);
    }
    75% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0);
    }
  }

  .sprinkler {
    display: block;
    max-width: 90%;
    max-height: 150px;
    image-rendering: crisp-edges;
    margin: 0px auto 0px auto;
  }

  .sprinkler.on {
    animation: cleaning 1.5s linear infinite;
  }

  .sprinkler.returning {
    animation: returning 2s linear infinite;
  }

  .sprinkler.on {
    opacity: 100%;
  }

  .sprinkler.off {
    opacity: 50%;
  }

  .fill-gap {
    flex-grow: 1;
  }

  .battery {
    text-align: right;
    font-weight: bold;
    padding: 9px 20px;
  }

  .source {
    text-align: center;
  }

  .status {
    height: 40px;
    display: flex;
    align-items: center;
    font-weight: bold;
    padding: 9px 10px;
    text-align: left;
  }

  .status-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sprinkler-name {
    text-align: center;
    font-weight: bold;
    margin: 10px auto 20px;
    color: var(--text-primary-color);
    font-size: 16px;
  }

  .stats {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    color: var(--text-primary-color);
  }

  .stats-block {
    margin: 10px 0px;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    flex-grow: 1;
  }

  .stats-block:last-child {
    border: 0px;
  }

  .stats-hours {
    font-size: 20px;
    font-weight: bold;
  }

  ha-icon {
    color: #fff;
  }

  .toolbar {
    background: var(--lovelace-background, var(--primary-background-color));
    min-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .toolbar ha-icon-button {
    color: var(--primary-color);
    flex-direction: column;
    width: 44px;
    height: 44px;
    --mdc-icon-button-size: 44px;
    margin: 5px 0;
  }

  .toolbar ha-icon-button:first-child {
    margin-left: 5px;
  }

  .toolbar ha-icon-button:last-child {
    margin-right: 5px;
  }

  .toolbar paper-button {
    color: var(--primary-color);
    flex-direction: column;
    margin-right: 10px;
    padding: 15px 10px;
    cursor: pointer;
  }

  .toolbar ha-icon-button:active,
  .toolbar paper-button:active {
    opacity: 0.4;
    background: rgba(0, 0, 0, 0.1);
  }

  .toolbar paper-button {
    color: var(--primary-color);
    flex-direction: row;
  }

  .toolbar ha-icon {
    color: var(--primary-color);
    padding-right: 15px;
  }

  .header {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--text-primary-color);
  }

  .header div {
    width: 76.66%;
    box-sizing: border-box;
  }

  .toolbar-split {
    padding-right: 15px;
  }
`;
