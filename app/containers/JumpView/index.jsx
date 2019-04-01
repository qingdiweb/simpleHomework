
/**
 * 跳转界面
 */
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {GetQueryString} from "../../constants/store";
import { Link, hashHistory } from 'react-router'

export default class JumpView extends React.Component {

    // 构造
      constructor(props) {
        super(props);
          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
          // 初始状态
        this.state = {
            page:null,
            loginToken:null
        };

        console.log('跳转界面',this.props);
        console.log('window.location.search',window.location.search);
        console.log('this.props.location',this.props.location.search);
        let page = GetQueryString(this.props.location.search,'page');
        let loginToken = GetQueryString(this.props.location.search,'loginToken');
        console.log('page',page,' loginToken',loginToken);

        this.state.page = page;
        this.state.loginToken = loginToken;
      }

      componentWillMount(){
          console.log('JumpView componentWillMount');
          // homework-class   我的班级
          // homework-collect   我的习题
          // no-publish-homework 作业草稿
          // classroom-record  课堂记录
          // decorate-homework 布置作业
          // classroom-exercise 课堂作业
          // personal-center 个人中心

          if (!!this.state.page && !!this.state.loginToken )
          {
              localStorage.setItem("loginToken",this.state.loginToken);

              if (this.state.page ==='classroom-exercise')
              {
                  hashHistory.push('/classroom-exercise');
                  localStorage.setItem('positionMenu',JSON.stringify(['6']));//课堂作业
              }
              else  if(this.state.page ==='decorate-homework')
              {
                  hashHistory.push('/decorate-homework/0/0');
                  localStorage.setItem('positionMenu',JSON.stringify(['1']));//布置作业
              }
              else  if(this.state.page ==='classroom-record')
              {
                  hashHistory.push('/classroom-record');
                  localStorage.setItem('positionMenu',JSON.stringify(['7']));//课堂记录
              }
              else  if(this.state.page ==='no-publish-homework')
              {
                  hashHistory.push('/no-publish-homework');
                  localStorage.setItem('positionMenu',JSON.stringify(['2']));//作业草稿
              }
              else  if(this.state.page ==='homework-collect')
              {
                  hashHistory.push('/homework-collect');
                  localStorage.setItem('positionMenu',JSON.stringify(['4']));//我的习题
              }
              else  if(this.state.page ==='homework-class')
              {
                  hashHistory.push('/homework-class');
                  localStorage.setItem('positionMenu',JSON.stringify(['5']));//定位班级
              }
              else  if(this.state.page ==='personal-center')
              {
                  hashHistory.push('/personal-center');//个人中心
              }

          }
          else
          {
              console.log('数据异常');
          }
      }
      render()
      {
          console.log('JumpView render');
          return <div style={{
              backgroundColor:'#FFFFFF'
          }}>

        </div>

      }

}
