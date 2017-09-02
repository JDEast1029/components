import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import * as utils from './utils';

@immutableRenderDecorator
class TabContent extends Component {
     static propTypes = {
        classPrefix: PropTypes.string,
        panels: PropTypes.node,
        activeIndex: PropTypes.oneOfType([
            PropTypes.number, 
            PropTypes.string
        ]),
    }

    getTabPanes() {
        const { classPrefix, panels, activeIndex } = this.props;

        return React.Children.map(panels, (child) => {
            if (!child) return;

            const order = child.props.order;
            const isActive = activeIndex === order;

            return (
                React.cloneElement(child, {
                children: child.props.children,
                isActive,
                classPrefix,
                order: `tabPane-${order}`
            }))
        })
    }

    render() {
        const { classPrefix, activeIndex, panels } = this.props;
        const classes = classnames({
            [`${classPrefix}-content`]: true,
            [`${classPrefix}-content-animated`]: true
        })

        const activeTabIndex = utils.getActiveIndex(panels, activeIndex);

        return (
            <div 
                className={classes}
                style={{
                    transform: `translateX(-${(activeTabIndex) * 100}%) translateZ(0px)`
                }}
            >
                {this.getTabPanes()}        
            </div>
        );
    }
}

export default TabContent;