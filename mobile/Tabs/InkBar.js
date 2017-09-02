import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
class InkBar extends Component {
    static propTypes = {
        left: PropTypes.number,
        width: PropTypes.number,
        classPrefix: PropTypes.string
    }

    render() {
        const { left, width, classPrefix } = this.props;
        const classes = classnames({
            [`${classPrefix}-ink-bar`]: true
        })

        return (
            <div className={classes} style={{
                width,
                transform: `translate3d(${left}px, 0, 0)`,
                WebkitTransform: `translate3d(${left}px, 0, 0)`,
            }} />
        );
    }
}

export default InkBar;