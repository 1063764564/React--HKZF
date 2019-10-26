import React, { Component } from 'react'
import { PickerView } from 'antd-mobile';
import FilterFooter from '../FilterFooter'

export default class FilterPicker extends Component {

    constructor(props){
        super()

        this.state = {
            value: props.defaultValue
        }
    }


    // 这样才能再次触发props然后渲染组件
    componentWillReceiveProps(props){
        this.setState({
            value: props.defaultValue
        })
    }


    onChange = value => {
        // console.log(value);
        this.setState({
            value
        })
    }

    render() {
        // console.log(this.props);
        const { data, cols, type, onCancel, onSave } = this.props
        const { value } = this.state
        return (
            <div>
                <PickerView data={data} cols={cols} onChange={this.onChange} value={value} />
                <FilterFooter onCancel={onCancel} onSave={() => onSave(type, value)} />
            </div>

        )
    }
}
