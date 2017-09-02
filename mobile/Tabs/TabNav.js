import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Motion, spring } from 'react-motion';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import * as utils from './utils.js';
import InkBar from './InkBar';
import './Tabs.scss';

/**
 * 获取nav 标签的宽度
 * @param {*} el 
 */
function getOuterWidth(el) {
    return el.firstChild.offsetWidth;
}

function getOffset(el) {
    const html = el.ownerDocument.documentElement;
    const box = el.getBoundingClientRect();
    const tabLeft = (el.offsetWidth - el.firstChild.offsetWidth) / 2;

    return {
        top: box.top + window.pageYOffset - html.clientTop,
        left: box.left + tabLeft + window.pageXOffset - html.clientLeft,
    };
}

@immutableRenderDecorator
class TabNav extends Component {
    static propTypes = {
        classPrefix: PropTypes.string,
        panels: PropTypes.node,
        activeIndex: PropTypes.oneOfType([
            PropTypes.number, 
            PropTypes.string
        ]),
    }

    constructor(props) {
        super(props);
        this.state = {
            inkBarWidth: 0,
            inkBarLeft: 0
        }
        this.first = true;
    }

    componentDidMount() {
        const { activeIndex, panels } = this.props;
        const node = ReactDom.findDOMNode(this);
        const activeTabIndex = utils.getActiveIndex(panels, activeIndex);

        const el = node.querySelectorAll('li')[activeTabIndex];

        this.setState({
            inkBarLeft: getOffset(el).left,
            inkBarWidth: getOuterWidth(el)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeIndex !== this.props.activeIndex) {
            const { activeIndex, panels } = this.props;
            const node = ReactDom.findDOMNode(this);
            const activeTabIndex = utils.getActiveIndex(panels, activeIndex);

            const el = node.querySelectorAll('li')[activeTabIndex];

            this.setState({
                inkBarLeft: getOffset(el).left,
                inkBarWidth: getOuterWidth(el)
            })
        }
    }

    getTabs() {
        const { classPrefix, panels, activeIndex } = this.props;

        return React.Children.map(panels, (child) => {
            if (!child) return;

            const order = child.props.order;

            let classes = classnames({
                [`${classPrefix}-tab`]: true,
                [`${classPrefix}-active`]: activeIndex === order,
                [`${classPrefix}-disabled`]: child.props.disabled
            })

            let events = {};
            if (!child.props.disabled) {
                events = {
                    onClick: this.props.onTabClick.bind(this, order)
                }
            }

            const ref = {};
            if (activeIndex === order) {
                ref.ref = 'activeTab'
            }

            return (
                <li
                    order={order}
                    {...ref}
                    {...events}
                    className={classes}
                >
                    <div>{child.props.tab}</div>
                </li>
            )
        })
    }

    /**
     * 渲染下划线
     */
    renderInkBar() {
        const { classPrefix } = this.props;

        //取消第一次渲染时下划线的动画
        if (this.first) {
            this.first = false;
            return (
                <InkBar width={this.state.inkBarWidth} left={this.state.inkBarLeft} classPrefix={classPrefix} />
            )
        } else {
            return (
                <Motion style={{left: spring(this.state.inkBarLeft)}}> 
                    {({left}) => <InkBar width={this.state.inkBarWidth} left={left} classPrefix={classPrefix} />}
                </Motion>
            )
        }
    }

    render() {
        const { classPrefix } = this.props;

        const rootClasses = classnames({
            [`${classPrefix}-bar`]: true
        })
        const classes = classnames({
            [`${classPrefix}-nav`]: true
        })

        return (
            <div className={rootClasses}>
                {this.renderInkBar()}
                <ul className={classes}>
                    {this.getTabs()}
                </ul>
            </div>
        );
    }
}

export default TabNav;