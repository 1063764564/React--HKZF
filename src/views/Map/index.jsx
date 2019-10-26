import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.scss'
import { getCurrentCity } from '../../utils/city'
import { Toast } from 'antd-mobile'
import classNames from 'classnames'

// 房源组件
import HouseItem from '../../components/HouseItem'


// 先把BMap从window中取出来
const BMap = window.BMap

// label 样式：
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

class Map extends Component {

    state = {
        // 是否显示房源列表
        isShowHouseList: false,
        // 房源列表
        houseList: []
    }

    componentDidMount() {
        this.initMap()
    }

   componentWillUnmount(){
       this.map.removeEventListener('touchmove',()=>{})
   }

    initMap = async () => {
        // 获取到定位城市的名字
        const { label, value } = await getCurrentCity()
        this.value = value
        // 创建地图实例  
        var map = new BMap.Map("container");
        this.map = map
        // 给map添加事件,手指触摸移动就让弹出的房源框消失
        this.map.addEventListener('touchmove',()=>{
            this.setState({
                isShowHouseList:false
            })
        })




        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(label, (point) => {
            if (point) {
                map.centerAndZoom(point, 11);
                // 添加控件【可选】
                map.addControl(new BMap.NavigationControl())
                map.addControl(new BMap.ScaleControl())
                // 开始渲染覆盖物

                this.renderOverlays(value)
            }
        },
            label);
    }

    // 获取当前的地图级别，然后决定渲染什么类型的覆盖物（圆形和方形）
    //  并且还需要知道点击当前覆盖物之后，下一个级别的地图级别是多少
    getTypeAndNextZoom = () => {
        let type, nextZoom
        const zoom = this.map.getZoom()
        if ((zoom > 10) && (zoom < 12)) {
            // 渲染第一级覆盖物
            type = 'circle'
            nextZoom = 13

        } else if ((zoom > 12) & (zoom < 14)) {

            // 渲染第二级覆盖物
            type = 'circle'
            nextZoom = 15

        } else {
            // 渲染第三级覆盖物
            type = 'rect'
        }

        return { type, nextZoom }
    }

    // 渲染覆盖物
    renderOverlays = async (id) => {
        Toast.loading('拼命加载中...',0)
        // 发送网络请求，获取数据
        const res = await this.$axios.get(`/area/map?id=${id}`)
        // console.log('res', res);
        Toast.hide()
        // 确定我们地图的渲染的样子和点击之后的缩放级别
        const { type, nextZoom } = this.getTypeAndNextZoom()

        res.data.body.forEach(item => {

            if (type === 'circle') {
                this.createCircleOverlays(item, nextZoom)
            } else {
                this.createRectOverlays(item)
            }

        })
    }

    // 这个方法给一二级地图覆盖物使用
    createCircleOverlays = (item, nextZoom) => {
        const {
            label: name,
            coord: { latitude, longitude },
            value: id,
            count
        } = item
        // 创建覆盖物的点
        var point = new BMap.Point(longitude, latitude)
        // 创建选项
        var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30) //设置文本偏移量
        }
        // 创建文本标注对象
        var label = new BMap.Label('', opts)
        // 设置label的样式
        label.setStyle(labelStyle)
        // 设置内容
        label.setContent(`
      <div class=${styles.bubble}>
        <p class=${styles.name}>${name}</p>
        <p class=${styles.name}>${count}套</p>
      </div>  
    `)

        // 添加点击事件
        label.addEventListener('click', () => {
            // 清除所有的覆盖物
            setTimeout(() => {
                this.map.clearOverlays()
            }, 0)

            // 重置中心点和地图级别
            this.map.centerAndZoom(point, nextZoom)

            // 加载下一级的覆盖物，并且渲染
            this.renderOverlays(id)
        })

        // 添加到地图地图上
        this.map.addOverlay(label)
    }



    // 这个方法给三级地图覆盖物使用
    createRectOverlays = (item) => {
        const {
            label: name,
            coord: { latitude, longitude },
            value: id,
            count
        } = item

        // 创建覆盖物的点
        var point = new BMap.Point(longitude, latitude)
        // 创建选项
        var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-50, -20) //设置文本偏移量
        }
        // 创建文本标注对象
        var label = new BMap.Label('', opts)

        // 设置label的样式
        label.setStyle(labelStyle)
        // 设置内容
        label.setContent(`<div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}套</span>
        <i class='iconfont icon-arrow ${styles.arrow}'/>
    <div>`)

        // 添加事件
        label.addEventListener('click', e => {
            if (!e || !e.changedTouches) return

            const { clientX, clientY } = e.changedTouches[0]
            const moveX = window.innerWidth/2 - clientX
            const moveY = (window.innerHeight - 330) /2 - clientY

            // 在地图上平移 x 和 y 像素
            this.map.panBy(moveX, moveY)

            // 显示房源列表面板
            this.setState({
                isShowHouseList: true
            })

            // 发送请求，获取房源列表
            this.getHouseListById(id)

        })

        // 添加到地图上
        this.map.addOverlay(label)

    }

    // 房源数据
    getHouseListById = async id => {
        Toast.loading('拼命加载中...', 0)
        const res = await this.$axios.get(`/houses?cityId=${id}`)
        Toast.hide()
        this.setState({
            houseList: res.data.body.list
        })

    }


    // 渲染房源视图
    renderHouseList = () => {
        const { isShowHouseList, houseList } = this.state

        return (

            <div className={classNames(styles.houseList, {
                [styles.show]: isShowHouseList
            })}>

                <div className={styles.titleWrap}>
                    <div className={styles.listTitle}>房屋列表</div>
                    <div className={styles.titleMore}>更多房源</div>
                </div>
                <div className={styles.houseItems}>
                    {houseList.map(item=>{
                        return <HouseItem key={item.houseCode} {...item} />
                    })}
                </div>

            </div>

        )

    }


    render() {
        return (
            <div className={styles.warp}>
                <div className={styles.map}>
                    {/* 导航菜单 */}
                    <NavHeader>找房地图</NavHeader>
                    {/* 显示地图 */}
                    <div id="container"></div>
                    {/* 渲染房源列表 */}
                    {this.renderHouseList()}
                </div>
            </div>

        )
    }
}

export default Map
