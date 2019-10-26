import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'

// 加载导航菜单所需要的图片
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

// 导入搜索子组件
import SearchHeader from '../../components/SearchHeader'
import { getCurrentCity } from '../../utils/city'


export default class Index extends Component {
    constructor() {
        super()

        this.state = {
            // 轮播图的高度
            imgHeight: 212,
            //正在加载轮播图
            isLoadingSwiper: true,
            //轮播图数据
            swipers: [],
            // 租房小组数据
            groups: [],
            // 新闻数组
            news: [],
            // 定位城市的名字
            cityName: '深圳'

        }
    }

    navs = [
        { icon: image1, text: '整租', path: '/home/list' },
        { icon: image2, text: '合租', path: '/home/list' },
        { icon: image3, text: '地图找房', path: '/map' },
        { icon: image4, text: '去出租', path: '/rent/add' }
    ]

    componentDidMount() {
        this.getLocationCity()
        this.getSwipersData()
        this.getGroupsData()
        this.getNewsData()
    }

    // 获取定位城市并且设置
    async getLocationCity() {
        const { label } = await getCurrentCity()
        this.setState({
            cityName: label
        })

    }


    // 获取轮播图数据
    async getSwipersData() {
        const res = await this.$axios.get('/home/swiper')
        // console.log(res);
        this.setState({
            isLoadingSwiper: false,
            swipers: res.data.body
        })

    }

    // 渲染轮播图
    renderSwiper = () => {
        return (
            <Carousel autoplay infinite>
                {this.state.swipers.map(item => (
                    <a
                        key={item.id}
                        href="http://www.alipay.com"
                        style={{
                            display: 'inline-block',
                            width: '100%',
                            height: this.state.imgHeight
                        }}
                    >
                        <img
                            src={`${BASE_URL}${item.imgSrc}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'))
                                this.setState({ imgHeight: 'auto' })
                            }}
                        />
                    </a>
                ))}
            </Carousel>
        )
    }

    //渲染导航菜单
    renderNavs = () => {
        return (
            <Flex className={styles.nav}>
                {
                    this.navs.map(item => {
                        return (
                            <Flex.Item key={item.text}>
                                <Link to={item.path}>
                                    <img src={item.icon} alt="" />
                                    <p>{item.text}</p>
                                </Link>
                            </Flex.Item>
                        )
                    })
                }
            </Flex>
        )
    }

    // 获取租房小组的数据
    async getGroupsData() {
        const res = await this.$axios.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        // console.log(res);
        this.setState({
            groups: res.data.body
        })

    }

    // 渲染租房小组
    renderGroups = () => {
        return (
            <div className={styles.groups}>
                <Flex justify="between">
                    <Flex.Item>
                        <span className={styles.title}>租房小组</span>
                    </Flex.Item>
                    <Flex.Item align="end">
                        <span>更多</span>
                    </Flex.Item>
                </Flex>
                {/* 九宫格 */}
                <Grid
                    data={this.state.groups}
                    columnNum={2}
                    hasLine={false}
                    square={false}
                    renderItem={dataItem => {
                        return (
                            <div className={styles.navItem}>
                                {/* 左边文字 */}
                                <div className={styles.left}>
                                    <p>{dataItem.title}</p>
                                    <p>{dataItem.desc}</p>
                                </div>
                                {/* 右边图片 */}
                                <div className={styles.right}>
                                    <img src={`${BASE_URL}${dataItem.imgSrc}`} alt="" />
                                </div>
                            </div>
                        )
                    }

                    }
                />
            </div>
        )
    }

    // 获取新闻数据
    async getNewsData() {
        const res = await this.$axios.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        // console.log('最新资讯数据---', res);
        this.setState({
            news: res.data.body
        })
    }


    // 渲染新闻数据
    renderNews = () => {
        return (
            <div className={styles.news}>
                <h3 className={styleMedia.groupTitle}>最新资讯</h3>
                {this.state.news.map(item => {
                    return (
                        <WingBlank className={styles.newsItem} size='md' key={item.id}>
                            {/* 最新资讯左边图片 */}
                            <div className={styles.imgWrap}>
                                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
                            </div>
                            <Flex className={styles.content} direction="column" justify="between">
                                {/* 最新资讯标题 */}
                                <h3 className={styles.title}>{item.title}</h3>
                                <Flex className={styles.info} direction="row" justify="between">
                                    {/* 最新资讯来源和时间 */}
                                    <span>{item.from}</span>
                                    <span>{item.date}</span>
                                </Flex>
                            </Flex>
                        </WingBlank>
                    )
                })}
            </div>
        )

    }

    render() {
        return (
            <div className={styles.root}>
                {/*渲染搜索组件  */}
                <SearchHeader cityName={this.state.cityName} />
                {/* 渲染轮播图 */}
                <div className={styles.swiper}>
                    {!this.state.isLoadingSwiper && this.renderSwiper()}
                </div>
                {/* 渲染导航菜单 */}
                {this.renderNavs()}
                {/* 渲染租房小组 */}
                {this.renderGroups()}
                {/* 渲染最新资讯 */}
                {this.renderNews()}
            </div>
        )
    }
}
