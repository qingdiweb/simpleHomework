/**
 * 通用空白页
* */
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import './style.less'

export default class GeneralEmpty extends React.Component  {
    // 构造
      constructor(props) {
        super(props);
          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
          // 初始状态
        this.state = {

        };
      }

      render(){
          let tempStyle = {};
          if (this.props.imageWidth && this.props.imageHeight&&this.props.imageTop)
          {
              tempStyle = {
                  marginTop:this.props.imageTop,
                  width:this.props.imageWidth,
                  height:this.props.imageHeight
              }
          }
          return <div className='classroom-empty'>
              <img className='classroom-empty-img' style={tempStyle} src={this.props.imageSource}/>
              <div className='classroom-empty-title'>{this.props.hintText}</div>
          </div>
      }


}
GeneralEmpty.defaultProps = {
    hintText:'暂无数据～',
    imageSource:require('../../static/img/classroom-empty-img.png'),
};
