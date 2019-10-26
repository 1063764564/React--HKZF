const KEY = 'hkzf_token'

export const setToken = token => {
    window.localStorage.setItem(KEY, token)
}
export const getToken = () => {
    window.localStorage.getItem(KEY)
}

