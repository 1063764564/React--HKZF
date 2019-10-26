import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from "react-router"
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'
import classnames from 'classnames'


function NavHeader({ history, children, className, rightContent }) {
    return (
        <NavBar
            className={classnames(styles.navBar, className)}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={() => history.goBack()}
            rightContent={rightContent}
        >{children}</NavBar>
    )

}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string
}
export default withRouter(NavHeader)