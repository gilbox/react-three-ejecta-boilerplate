import { Component, PropTypes } from 'react';
import { raf, cancelRaf } from './raf';

export default class Ticker extends Component {
  static propTypes = {
    onTick: PropTypes.func.isRequired,
    value: PropTypes.number,
    max: PropTypes.number,
  }

  componentDidMount() {
    const tick = () => {
      const { value, max } = this.props;

      if (typeof max !== 'number' || value < max) {
        this.props.onTick();
        this.rafIndex = raf(tick);
        return;
      }

      if (value >= max) {
        this.props.onComplete();
      }
    };
    this.rafIndex = raf(tick);
  }

  componentWillUnmount() {
    cancelRaf(this.rafIndex)
  }

  render() {
    return this.props.children || null;
  }
}
