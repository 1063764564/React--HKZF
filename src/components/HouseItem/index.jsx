import React, { Component } from 'react'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withRouter} from 'react-router-dom'


function HouseItem({ houseCode, desc, houseImg, price, tags, title, history }) {

    return (
        <div className={styles.house} onClick={() => history.push(`/detail/${houseCode}`)} >
            {/* 房源图 */}
            <div className={styles.imgWrap}>
                <img src={`${BASE_URL}${houseImg}`} className={styles.img} alt="" />
            </div>
            {/* 房源信息 */}
            <div className={styles.content}>
                {/* 房源标题 */}
                <h3 className={styles.title}>{title}</h3>
                {/* 房源介绍 */}
                <div className={styles.desc}>{desc}</div>
                {tags.map((item, index) => {
                    const tagName = `tag${(index % 3) + 1}`

                    return (
                        <span key={item} className={classNames(styles.tag, styles[tagName])}>
                            {item}
                        </span>
                    )
                })}
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span>元/月
                </div>
            </div>
        </div>
    )
}

HouseItem.propTypes = {
    houseCode: PropTypes.string.isRequired,
    houseImg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    tags: PropTypes.array,
    price: PropTypes.number.isRequired
}

export default withRouter(HouseItem) 