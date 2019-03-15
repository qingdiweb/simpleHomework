
/**
* loading 加载中
  */
import React from 'react'
import { Tree, Input ,Icon,Modal,Radio,Spin} from 'antd';

import './style.less'

export default class  Loading  extends React.Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    render(){
         return  <div className='loading-bg'>
            <Spin size="large" className='spin'/>
        </div>
    }
}
