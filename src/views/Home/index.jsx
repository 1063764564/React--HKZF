import React, { Component } from 'react'

import { Route } from 'react-router-dom'

// 导入子组件
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

import { TabBar } from 'antd-mobile'

import styles from './index.module.scss'

export default class Home extends Component {

    constructor(props) {
        super()

        this.state = {
            selectedTab: props.location.pathname,
            hidden: false,
            fullScreen: false,
        };

    }

    // tabs数组
    TABS = [
        {
            title: '首页',
            icon: 'icon-index',
            path: '/home'
        },
        {
            title: '找房',
            icon: 'icon-findHouse',
            path: '/home/list'
        },
        {
            title: '资讯',
            icon: 'icon-info',
            path: '/home/news'
        },
        {
            title: '我的',
            icon: 'icon-my',
            path: '/home/profile'
        }
    ]

    // 方式2
    componentDidUpdate(prevProps) {
        // console.log('上一次', prevProps.location.pathname, '这次的', this.props.location.pathname);
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }


    }

    // 渲染底部导航栏
    renderTabBar = () => {
        return (
            <TabBar
                tintColor="#21B97A"
                noRenderContent
            >
                {
                    this.TABS.map(item => {
                        return <TabBar.Item
                            icon={<i className={`iconfont ${item.icon}`}></i>}
                            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                            title={item.title}
                            key={item.path}
                            selected={this.state.selectedTab === item.path}
                            onPress={() => {
                                // this.setState({
                                //     selectedTab: item.path,
                                // });

                                this.props.history.push(item.path)
                            }}
                        >

                        </TabBar.Item>
                    })
                }
            </TabBar>
        )
    }

    render() {
        return (
            <div className={styles.home}>
                {/* 路由切换部分 */}
                <Route exact path="/home" component={Index} />
                <Route path="/home/list" component={HouseList} />
                <Route path="/home/news" component={News} />
                <Route path="/home/profile" component={Profile} />
                {/* tabBar */}

                <div className={styles.tabbar}>
                    {this.renderTabBar()}
                </div>

            </div>
        )
    }
}
