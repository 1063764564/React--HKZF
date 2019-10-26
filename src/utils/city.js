
import {axios} from './axios'

const KEY = 'hkzf_city_key'

// * 获取本地存储的定位城市对象
const getCity = () => {
    return window.localStorage.getItem(KEY)
}

// 保存定位城市对象到本地 {label:'深圳',value:'AREA|a6649a11-be98-b150'}
 export const setCity = city => {
    window.localStorage.setItem(KEY, JSON.stringify(city))
}

const BMap = window.BMap

export function getCurrentCity() {
    // setCity({ label: '深圳', value: 'AREA|a6649a11-be98-b150' })

    const city = getCity()

    if (!city) {
        //本地没有城市数据 
        // console.log('本地没有城市数据 ');
        return new Promise((resolve, reject) => {
            var myCity = new BMap.LocalCity();
            myCity.get(async result => {
                // console.log(result);
                //2、根据定位到的城市名称，调用后台的接口，获取城市信息（{label、value}）
                const res = await axios.get(`/area/info?name=${result.name}`)
                // console.log(res);  
                //3、resolve 出去
                resolve(res.data.body)
                 //4、保存到本地
                setCity(res.data.body)
            });

        })

    } else {
        // 本地有城市数据
        //  console.log('111');
        return Promise.resolve(JSON.parse(city))
    }

}