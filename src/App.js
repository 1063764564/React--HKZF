import React from 'react';
// 全局的样式
import './App.css';

// 导入字体图标样式
import './assets/fonts/iconfont.css'
// 虚拟化长列表优化的样式
import 'react-virtualized/styles.css'

import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// 导入子组件
import Home from './views/Home'
import Login from './views/Login'
import CityList from './views/CityList'
import Map from './views/Map'
import Detail from './views/Detail'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/home' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/citylist' component={CityList} />
          <Route path='/map' component={Map} />
          <Route path='/detail/:id' component={Detail} />
          <Redirect exact from='/' to='/home' />
        </Switch>
      </div>
    </Router>

  );
}

export default App;
