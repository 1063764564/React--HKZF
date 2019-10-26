import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

// 所有房屋配置项
const HOUSE_PACKAGE = [
    {
        id: 1,
        name: '衣柜',
        icon: 'icon-wardrobe'
    },
    {
        id: 2,
        name: '洗衣机',
        icon: 'icon-wash'
    },
    {
        id: 3,
        name: '空调',
        icon: 'icon-air'
    },
    {
        id: 4,
        name: '天然气',
        icon: 'icon-gas'
    },
    {
        id: 5,
        name: '冰箱',
        icon: 'icon-ref'
    },
    {
        id: 6,
        name: '暖气',
        icon: 'icon-Heat'
    },
    {
        id: 7,
        name: '电视',
        icon: 'icon-vid'
    },
    {
        id: 8,
        name: '热水器',
        icon: 'icon-heater'
    },
    {
        id: 9,
        name: '宽带',
        icon: 'icon-broadband'
    },
    {
        id: 10,
        name: '沙发',
        icon: 'icon-sofa'
    }
]

class HousePackage extends Component {

    renderItems = () => {
        let data = null
        if(this.props.list){
            data = HOUSE_PACKAGE.filter(item => this.props.list.includes(item.name))
        }

        // 根据筛选出来的数据，遍历生成房屋配套项
        return (
            data.map(item=>{
                return (
                    <li key={item.id} className={styles.item}>
                        <p>
                            <i className={`iconfont ${item.icon} ${styles.icon}`}></i>
                        </p>
                        {item.name}
                    </li>
                )
            })
        )

    }
                                                                                                                                
    render() {
        return (
            <ul>
                <li className={styles.root}>{this.renderItems()}</li>
            </ul>
        )
    }
}

HousePackage.propTypes = {
    list: PropTypes.array
}

export default HousePackage
