import React, { Component } from 'react'
import styles from './index.module.scss'
import { getCurrentCity } from '../../../../utils/city'

// 导入子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
// 导入动画组件
import { Spring } from 'react-spring/renderprops'


export class Filter extends Component {

    state = {
        // 值为true就是选中,否则不选中
        titleSelectedStatus: {
            area: false,
            mode: false,
            price: false,
            more: false,
        },
        // 记录当前打开的是哪个类型
        openType: '',
        // 从服务器获取的筛选条件数据
        filterData: {},
        selectValues: {
            area: ['area', 'null'],
            mode: ['null'],
            price: ['null'],
            more: []
        }

    }

    // 一进来就运行函数
    componentDidMount() {
        this.getFilterData()
    }

    async getFilterData() {
        const { value } = await getCurrentCity()
        const res = await this.$axios.get(`/houses/condition?id=${value}`)

        // console.log('getFilterData---',res);
        this.setState({
            filterData: res.data.body
        })

    }

    renderFilterPicker = () => {
        const { openType, filterData: { area, subway, rentType, price }, selectValues } = this.state

        if (openType === '' || openType === 'more') return null

        // 传递给子组件的data
        let data = null
        let cols = 1
        const defaultValue = selectValues[openType]
        console.log(openType, defaultValue);

        switch (openType) {
            case 'area':
                cols = 3
                data = [area, subway]
                break;
            case 'mode':
                data = rentType
                break;
            case 'price':

                data = price
                break;

            default:
                break;
        }

        return <FilterPicker data={data} cols={cols} type={openType} onCancel={this.onCancel}
            onSave={this.onSave} defaultValue={defaultValue} />

    }


    // 筛选更多的方法
    renderFilterMore = () => {
        const { openType, filterData: { roomType, oriented, floor, characteristic }, selectValues } = this.state

        if (openType !== 'more') return null

        // 这就是筛选组件需要的筛选数据
        const data = { roomType, oriented, floor, characteristic }

        // 把上一次选中的值传给FilterMore,这样再次打开选中的值才会高亮
        const defaultValue = selectValues['more']
        // 渲染筛选组件
        return <FilterMore data={data} onCancel={this.onCancel} onSave={this.onSave} defaultValue={defaultValue} />

    }

    // 点击标题后设置标题的高亮状态
    onTitleChange = type => {
        const { titleSelectedStatus } = this.state
        // console.log(type);
        this.setState({
            openType: type,
            titleSelectedStatus: {
                ...titleSelectedStatus,
                [type]: true
            }
        }, () => {
            // 重置标题高亮状态
            this.changeTitleSelectedStatus(type)
        })
    }

    // 只让选中的标题栏高亮,其他没选中的取消高亮方法
    changeTitleSelectedStatus = (type) => {

        const { titleSelectedStatus, selectValues } = this.state

        Object.keys(titleSelectedStatus).forEach(key => {
            // console.log('key', key)

            // 判断点击的是哪个标题
            if (key === 'area') {
                titleSelectedStatus[key] = selectValues[key][1] !== 'null'
            } else if (key === 'mode' || key === 'price') {
                titleSelectedStatus[key] = selectValues[key][0] !== 'null'
            } else if (key === 'more') {
                titleSelectedStatus[key] = selectValues[key].length > 0
            }
        })

        // 把当前点击的type的标题高亮样式设置为true
        if (type) {
            titleSelectedStatus[type] = true
        }

        this.setState({
            titleSelectedStatus
        })

    }

    // 遮罩层
    renderMask = () => {

        const { openType } = this.state

        // if (openType === '' || openType === 'more') return null
        const isHidden = openType === '' || openType === 'more'

        return (
            <Spring to={{ opacity: isHidden ? 0 : 1 }} config={{ duration: 300 }}>
                {
                    props => {
                        // console.log('props---', props);
                        if (props.opacity===0) return null

                        return (
                            <div style={props} className={styles.mask} onClick={this.onCancel} ></div>
                        )
                    }
                }
            </Spring>

        )
    }

    // 取消遮罩层
    onCancel = () => {
        this.setState({
            openType: ''
        }, () => {
            // 处理FilterTitle标题栏是否高亮
            this.changeTitleSelectedStatus()
        })
    }

    //确定的方法 
    onSave = (type, value) => {
        // console.log('type, value', type, value);
        const { selectValues } = this.state
        this.setState({
            openType: '',
            selectValues: {
                ...selectValues,
                [type]: value
            }
        }, () => {
            // 处理FilterTitle标题栏是否高亮
            this.changeTitleSelectedStatus()
            // todo 把收集到的数据，经过处理，然后传递给HouseList作为查询房源列表的参数
            // * 我们给他设置值之后，要想获取到最新值，需要重新获取一下即可
            const { selectValues } = this.state
            const filter = {}

            // 处理区域和地铁
            const key = selectValues['area'][0]

            if (selectValues['area'].length === 2) {
                filter[key] = null
            } else if (selectValues['area'].length === 3) {
                filter[key] = selectValues['area'][2] === null ? selectValues['area'][1] : selectValues['area'][2]
            }


            // 处理方式
            filter.rentType = selectValues['mode'][0]
            // 处理租金
            filter.price = selectValues['price'][0]
            // 处理more
            filter.more = selectValues['more'].join(',')


            // 处理方式和地铁
            this.props.onFilter && this.props.onFilter(filter)

        })
    }


    render() {
        return (
            <div className={styles.root}>
                {/* 遮罩 */}
                {this.renderMask()}
                {/* 内容 */}
                <div className={styles.content}>
                    {/* 过滤条标题组件 */}
                    <FilterTitle titleSelectedStatus={this.state.titleSelectedStatus}
                        onTitleChange={this.onTitleChange} />

                    {/* 过滤条的FilterPicker */}
                    {this.renderFilterPicker()}
                    {/* 过滤条的FilterMore */}
                    {this.renderFilterMore()}
                    {/* 确认或者取消组件 */}

                </div>
            </div>
        )
    }
}

export default Filter
