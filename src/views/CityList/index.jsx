import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity, setCity } from '../../utils/city'
import { AutoSizer, List } from 'react-virtualized'
import styles from './index.module.scss'
import { Toast } from 'antd-mobile'

const CITY_TITLE_HEIGHT = 36
const CITY_ROW_HEIGHT = 50
const HOT_CITIES = ['北京', '上海', '广州', '深圳']


class CityList extends Component {

    constructor() {
        super()

        this.state = {
            // 左边城市数据
            cityListObj: {},
            // 右边城市索引
            cityIndex: [],
            // 激活的索引，默认是第一个
            activeIndex: 0
        }
    }

    // 创建ref,提前知道索引的位置解决bug
    listRef = React.createRef()

    componentDidMount() {
        this.getCityListData()
    }

    // 获取城市数据
    async getCityListData() {
        const res = await this.$axios.get('/area/city?level=1')
        // console.log('城市数据',res);

        // 处理服务器返回的数据，变成 cityListObj 和 cityIndex
        // 1、遍历城市列表数组
        const obj = {}
        // 生成城市数据
        res.data.body.forEach(item => {
            const letter = item.short.substring(0, 1)

            if (obj[letter]) {
                obj[letter].push(item)
            } else {
                obj[letter] = [item]
            }
        })

        // 2、根据 obj 生成 索引数组
        const cityIndex = Object.keys(obj).sort()

        // 3、处理热门城市数据
        const hotRes = await this.$axios.get('/area/hot')
        cityIndex.unshift('hot')
        obj['hot'] = hotRes.data.body

        // 4.增加定位城市数据
        cityIndex.unshift('#')
        const city = await getCurrentCity()
        obj['#'] = [city]

        // 赋值给模型
        this.setState({
            cityListObj: obj,
            cityIndex
        }, () => {
            // 计算所有的行信息，为将来切换表格服务
            this.listRef.current.measureAllRows()
        })
    }

    // 返回热门城市索引
    formatCityTitle = (letter) => {
        switch (letter) {
            case '#':
                return '定位城市'
            case 'hot':
                return '热门城市'
            default:
                return letter.toUpperCase()
        }
    }


    toggleCity = ({ label, value })=>{
        if (!HOT_CITIES.includes(label)){
            Toast.info('该城市暂无房源', 1) 
            return
        }

         // 设置本地的城市数据
        setCity({ label, value })
        // 通过编程式导航，关闭当前页面
        this.props.history.goBack()

    }

    // 渲染每一行的数据
    rowRenderer = ({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        style        // Style object to be applied to row (to position it)
    }) => {
        // 获取到索引的首字母
        const letter = this.state.cityIndex[index]
        // 获取到索引字母对应的城市列表
        const list = this.state.cityListObj[letter]
        // console.log(list);

        return (
            <div key={key} style={style} className={styles.city}>
                <div className={styles.title}>{this.formatCityTitle(letter)}</div>
                {
                    list.map(item => {
                        return (
                            <div key={item.value} onClick={() => this.toggleCity(item)} className={styles.name}>{item.label}</div>
                        )
                    })
                }
            </div>
        )
    }

    // 计算每一行的高度
    calcRowHeight = ({ index }) => {
        // 首先根据索引，拿到cityIndex中的字母
        const letter = this.state.cityIndex[index]
        // 拿到字母对应的城市列表
        const list = this.state.cityListObj[letter]

        return CITY_TITLE_HEIGHT + list.length * CITY_ROW_HEIGHT
    }

    // 当右边的索引被点击之后
    cityIndexClick = index => {
        this.listRef.current.scrollToRow(index)
    }

    // 渲染右侧的索引条
    renderCityIndex = () => {
        return (
            <div className={styles.cityIndex}>
                {this.state.cityIndex.map((item, index) => {
                    return (
                        <div onClick={() => this.cityIndexClick(index)} key={item} className={styles.cityIndexItem}>
                            <span className={
                                index === this.state.activeIndex ? styles.indexActive : ''
                            }>
                                {item === 'hot' ? '热' : item.toUpperCase()}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    // 当List 滚动的时候出发
    // 当我们的列表在滚动的时候，当我们的某一行滚动到表格顶部的时候，就可以获取到 startIndex
    onRowsRendered = ({ startIndex }) => {
        // console.log(startIndex);
        if (startIndex !== this.state.activeIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }

    }

    render() {
        const { cityIndex } = this.state
        return (
            <div className={styles.citylist}>
                {/* 头部导航组件 */}
                <NavHeader>城市列表</NavHeader>
                {/* 渲染城 */}
                {cityIndex.length > 0 && (<AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={this.listRef}
                            width={width}//整个List组件的宽度
                            height={600}//整个List组件的高度,高度很重要，如果是0，则不渲染每一行
                            rowCount={cityIndex.length} // 显示多少条数据
                            rowHeight={this.calcRowHeight} // 每一行数据的高度
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>)}
                {/* 渲染右侧的索引 */}
                {cityIndex.length > 0 && this.renderCityIndex()}
            </div>
        )
    }
}

export default CityList
