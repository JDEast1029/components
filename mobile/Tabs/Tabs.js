import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SwipeableTabContent from 'rc-tabs/lib/SwipeableTabContent';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Seq } from 'immutable';

import TabNav from './TabNav';
import TabContent from './TabContent';

@immutableRenderDecorator
class Tabs extends Component {
    static propTypes = {
        className: PropTypes.string,
        classPrefix: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        defaultActiveIndex: PropTypes.oneOfType([
            PropTypes.number, 
            PropTypes.string
        ]),
        activeIndex: PropTypes.oneOfType([
            PropTypes.number, 
            PropTypes.string
        ]),
        onChange: PropTypes.func
    }

    static defaultProps = {
        classPrefix: 'tabs',
        onChange: () => {}
    }

    constructor(props) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);

        const currProps = this.props;
        this.immChildren = Seq(currProps.children);

        let activeIndex;
        if ('activeIndex' in currProps) {
            activeIndex = currProps.activeIndex;
        } else if ('defaultActiveIndex' in currProps) {
            activeIndex = currProps.defaultActiveIndex;
        }
        this.state = {
            activeIndex,
            prevIndex: activeIndex
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if ('activeIndex' in nextProps) {
            this.setState({
                activeIndex: nextProps.activeIndex
            })
        }   
    }

    handleTabClick(activeIndex) {
        const prevIndex = this.state.activeIndex;

        if (this.state.activeIndex !== activeIndex) {
            this.setState({
                activeIndex,
                prevIndex
            })

            this.props.onChange({activeIndex, prevIndex})
        }
    }

    renderTabNav() {
        const { classPrefix, children } = this.props;

        return (
            <TabNav 
                order='tabNav'
                classPrefix={classPrefix}
                panels={this.immChildren}
                onTabClick={this.handleTabClick}
                activeIndex={this.state.activeIndex}
            />
        )
    }

    renderTabContent() {
        const { classPrefix, children } = this.props;

        return (
            <TabContent
                order='tabContent'
                classPrefix={classPrefix}
                panels={this.immChildren}
                activeIndex={this.state.activeIndex} 
            />
        )
    }

    render() {
        const { className } = this.props;
        const classes = classnames(className, 'tabs')
        return (
            <div className={classes}>
                {this.renderTabNav()}
                {this.renderTabContent()}
            </div>
        );
    }
}

export default Tabs;