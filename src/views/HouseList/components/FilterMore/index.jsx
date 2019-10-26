import React, { Component } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
import FilterFooter from '../FilterFooter'

export default class FilterMore extends Component {

    state = {
        selectValues: this.props.defaultValue
    }

    // 筛选项目的点击事件
    toggle = (value) => {
        let { selectValues } = this.state
        // console.log(value);

        // 判断点击的选项是否在数组中,在的话就取消,不在的话就加入并高亮
        if (selectValues.includes(value)) {
            // 数组中已存在点击的选项
            // 用filter最终返回除了这次点击的value之外的所有值
            selectValues = selectValues.filter(item => item !== value)

        } else {
            // 数组中不存在点击的选项,加入到数组中去
            selectValues.push(value)
        }

        // 更新值
        this.setState({
            selectValues
        })

    }


    // 根据传过来的值渲染出筛选的户型等选项
    renderItem = data => {
        const { selectValues } = this.state
        return (
            <div>
                {data.map(item => {
                    // 判断遍历的每一项是否应该添加高亮效果
                    // 数组中有的话返回true,没有的话返回false
                    const isSelect = selectValues.includes(item.value)
                    return (
                        <span key={item.value} className={classNames(styles.tag, { [styles.tagActive]: isSelect})} onClick={() => this.toggle(item.value)}>
                            {item.label}
                        </span>
                    )

                })}
            </div>
        )

    }


    render() {

        const { data: { roomType, oriented, floor, characteristic },
            onCancel,
            onSave
        } = this.props

        return (
            <div className={styles.root}>
                {/* 渲染遮罩层 */}
                <div className={styles.mask} onClick={onCancel} ></div>
                {/* 渲染筛选组件 */}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>{this.renderItem(roomType)}</dd>
                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>{this.renderItem(oriented)}</dd>
                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>{this.renderItem(floor)}</dd>
                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>{this.renderItem(characteristic)}</dd>
                    </dl>
                </div>
                <div className={styles.footer}>
                    {/* 清除或者确定组件 */}
                    <FilterFooter cancelText="清除" onCancel={() => this.setState({ selectValues:[]})}  onSave={() => onSave('more', this.state.selectValues)}  />
                </div>
            </div>
        )
    }
}
