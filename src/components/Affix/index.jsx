import React, { Component, createRef } from 'react'
import styles from './index.module.scss'

class Affix extends Component {

    onScroll = () => {
        // 拿到占位div的top值,用来判断
        const { top } = this.placeHolderRef.current.getBoundingClientRect()
        // console.log(top);
        if (top < 0) {
            this.placeHolderRef.current.style.height = '40px'
            this.contentRef.current.classList.add(styles.fixed)

        } else {
            this.placeHolderRef.current.style.height = '0px'
            this.contentRef.current.classList.remove(styles.fixed)
        }
    }
    componentDidMount() {

        this.placeHolderRef = createRef()
        this.contentRef = createRef()
        console.log(':componentDidMount---');

        // 监听滚动事件
        window.addEventListener('scroll', this.onScroll)
    }

    // 卸载钩子函数
    componentWillUnmount() {
        console.log('卸载函数:componentWillUnmount');

        window.removeEventListener('scroll', this.onScroll)
    }

    render() {
        return (
            <>
                {/* 占位div,刚开始高度为0 */}
                <div ref={this.placeHolderRef}></div>
                {/* 内容div,高度始终为40 */}
                <div ref={this.contentRef}>{this.props.children}</div>
            </>
        )
    }
}

export default Affix
