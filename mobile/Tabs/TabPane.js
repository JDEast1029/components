import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
class TabPane extends Component {
    static propTypes = {
        isActive: PropTypes.bool,
        classPrefix: PropTypes.string,
        order: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.rendered = false;
    }

    /**
     * 初始化时，未显示的TabPane中的组件不挂载
     */
    renderChildren() {
        if (this.props.isActive && !this.rendered) {
            this.rendered = true;
            return this.props.children;
        } else if (this.rendered) {
            return this.props.children;
        }
        return null;
    }

    render() {
        const { classPrefix, className, isActive, children } = this.props;
        const classes = classnames({
            [className]: className,
            [`${classPrefix}-panel`]: true,
            [`${classPrefix}-active`]: isActive
        })

        return (
            <div className={classes}>
                {this.renderChildren()}
            </div>
        );
    }
}

export default TabPane;