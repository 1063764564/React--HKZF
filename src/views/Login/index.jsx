import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { setToken } from '../../utils/token'
import { Flex, WingBlank, Toast } from 'antd-mobile'
import * as Yup from 'yup'
import { Form, Field, withFormik, ErrorMessage } from 'formik'
import { axios } from '../../utils/axios'

class Login extends Component {

    render() {
        return (
            <div className={styles.root}>
                <NavHeader>账号登录</NavHeader>
                <WingBlank size="lg">
                    <Form onSubmit={this.login}>
                        {/* 账号输入框 */}
                        <div className={styles.formSubmit}>
                            <Field
                                placeholder="请输入用户名"
                                className={styles.input}
                                type="text"
                                name="username"
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className={styles.error}
                            />
                        </div>
                        {/* 密码输入框 */}
                        <div className={styles.formSubmit}>
                            <Field
                                placeholder="请输入密码"
                                className={styles.input}
                                type="password"
                                name="password"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className={styles.error}
                            />
                        </div>
                        <div className={styles.formSubmit}>
                            <input className={styles.submit} type="submit" />
                        </div>
                    </Form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>还没有账号，去注册~</Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

// 校验正则
const USERNAME_REGEX = /^[a-zA-Z0-9]{5,8}$/
const PASSWORD_REGEX = /^[a-zA-Z0-9]{5,12}$/


// 通过高阶组件增强Login组件
const EnhancedLogin = withFormik({
    mapPropsToValues: () => ({ username: 'test2', password: 'test2' }),

    // 校验 username 和 password
    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('用户名不能为空')
            .matches(USERNAME_REGEX, '必须是5-8位'),
        password: Yup.string()
            .required('密码不能为空')
            .matches(PASSWORD_REGEX, '必须是5-12位')
    }),

    // 处理提交请求
    handleSubmit: async (values, { props }) => {
        const result = await axios.post('/user/login', values)
        // console.log(res);
        const { status, description, body } = result.data
        if (status === 200) {
            // 把token保存起来
            setToken(body.token)
            // 跳转
            if (props.location.state) {
                props.history.replace(props.location.state.from.pathname)
            } else {
                // 正常通过编程式导航跳转过来的
                props.history.goBack()
            }

        } else {
            Toast.info(description, 1.5)
        }
    }
})(Login)

export default EnhancedLogin