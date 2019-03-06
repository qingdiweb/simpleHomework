/**
 * 练习详情->正在答题
 */

import React from 'react'
import './style.less'
import { Radio , Checkbox , Select , Icon , Input , Modal , Row , Col , Button,Breadcrumb,Spin} from 'antd';
import { Link, hashHistory } from 'react-router'


export default class ExerciseAnsweringquestion extends React.Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
      };

      render(){

          let exerciseId = this.props.params.exerciseId;

          return <div className='exercise-answering-question'>
              <h1 className='header-nav'>
                  <Breadcrumb separator=">">
                      <Breadcrumb.Item><Link to='/classroom-exercise'>课堂作业</Link></Breadcrumb.Item>
                      <Breadcrumb.Item><Link to={'/exercise-detail/'+exerciseId}>练习详情</Link></Breadcrumb.Item>
                      <Breadcrumb.Item>正在答题</Breadcrumb.Item>
                  </Breadcrumb>
              </h1>
          </div>
      };




}
