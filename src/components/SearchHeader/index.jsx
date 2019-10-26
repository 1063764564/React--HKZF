import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { withRouter } from "react-router"
import { Flex } from 'antd-mobile'
import classNames from 'classnames'

function SearchHeader({ cityName, history, className }) {
    return (
        <div className={classNames(styles.root, className)}>
            <Flex>
                <Flex className={styles.searchLeft}>
                    <div className={styles.location}>
                        <span onClick={() => history.push('/citylist')}>{cityName}</span>
                        <i className="iconfont icon-arrow"></i>
                    </div>
                    <div className={styles.searchForm}>
                        <i className="iconfont icon-search"></i>
                        <span>请输入小区或者地址</span>
                    </div>
                </Flex>
                <i onClick={() => history.push('/map')} className="iconfont icon-map"></i>
            </Flex>


        </div>
    )
}

SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired,
    classNmae: PropTypes.string
}

export default withRouter(SearchHeader)
