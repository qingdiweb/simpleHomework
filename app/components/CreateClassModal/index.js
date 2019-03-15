/**
 * 创建班级弹框
 *
 */

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Modal, message , Button , Input ,InputNumber, Select ,DatePicker , Icon , Row , Col} from 'antd';
import './style.less'
const loginToken=localStorage.getItem("loginToken");

import GlobalStyle from '../../constants/GlobalStyles'


export default class CreateClassModal extends React.Component {


    // 构造
      constructor(props) {
        super(props);
          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
          // 初始状态
        this.state = {
            visible: false,
            clasNumError: null,
            defaultStageTitle: undefined,
            stageInfoList: [],
            defaultGradeTitle: undefined,
            gradeInfoList: [],
            stageId:null,
            gradeId:null,
            isEditClass:false,
            editInfo:null,
            inputValue:null,
        };

      }
    componentWillReceiveProps(nextProps){

        this.setState({
            visible: nextProps.visible,
            isEditClass:nextProps.isEditClass===undefined?this.state.isEditClass:nextProps.isEditClass,
            editInfo:nextProps.editInfo===undefined?this.state.editInfo:nextProps.editInfo,
            stageInfoList:nextProps.stageInfoList ===undefined?this.state.stageInfoList:nextProps.stageInfoList,
        },()=>{

            let stageInfoList = this.state.stageInfoList;
            if (!!stageInfoList) {
                let stageInfoLenght = stageInfoList.length;
                    if (this.state.isEditClass === true) {
                        console.log('aStageInfo',this.state.editInfo.stageId);
                        console.log('stageInfoList',stageInfoList);

                    for (let i = 0; i < stageInfoLenght; i++) {
                        let aStageInfo = stageInfoList[i];


                        if (this.state.editInfo.stageId === aStageInfo.id) {

                            this.state.stageId = this.state.editInfo.stageId;
                            this.state.gradeId = this.state.editInfo.gradeId;

                            console.log('aStageInfo====', aStageInfo.id,  this.state.stageId);

                            this.setState({
                                defaultStageTitle: this.state.editInfo.stage,
                                defaultGradeTitle:this.state.editInfo.grade,
                                gradeInfoList: aStageInfo.gradeInfoList,
                                timeStamp: (new Date()).getTime(),
                                timeStamps:(new Date()).getTime(),
                                inputValue: this.state.editInfo.number,
                            })
                        }
                    }
                }
                else if (this.state.isEditClass === false) {
                    let teacherInfo = JSON.parse(localStorage.getItem("teacherInfo")),//教师信息
                        stageId = teacherInfo.stageId,//学段
                        subjectId = teacherInfo.subjectId;//学科
                    for (let i = 0; i < stageInfoLenght; i++) {
                        let aStageInfo = stageInfoList[i];
                        if (stageId === aStageInfo.id) {
                            this.state.stageId = aStageInfo.id;
                            console.log('aStageInfo====', aStageInfo, stageId);
                            this.setState({
                                defaultStageTitle: aStageInfo.title,
                                gradeInfoList: aStageInfo.gradeInfoList,
                                defaultGradeTitle:undefined,
                                timeStamp: (new Date()).getTime(),
                                timeStamps:(new Date()).getTime(),
                                inputValue:null,
                            })
                        }
                    }
                }
            }


        });

        }

      render(){
          console.log('CreateClassModel render');

          return <Modal
                  title={this.state.isEditClass === true?'编辑班级':"创建班级"}
                  visible={this.state.visible}
                  width='494px'
                  cancelText="取消"
                  okText="确定"
                  onOk={this.handleOk.bind(this)}
                  onCancel={this.handleCancel.bind(this)}
              >
                  <div className='creatClass-model'>
                      <div className='content'>
                          <div className="stage-title">学段:</div>
                          <div className='stage-infor'>
                              <Select
                                  style={{ width: '100%' }}
                                  key={this.state.timeStamp}
                                  placeholder="选择"
                                  showArrow={true}
                                  defaultValue={this.state.defaultStageTitle}
                                  onChange={this.stageInfoChange.bind(this)}
                              >
                                  {
                                      this.state.stageInfoList.map((item,index)=>{
                                          return <Select.Option key={item.id}>{item.title}</Select.Option>
                                      })
                                  }
                              </Select>
                          </div>
                          <div className="grade-title">年级:</div>
                          <div className='grade-infor'>
                              <Select
                                  style={{ width: '100%' }}
                                  key={this.state.timeStamps}
                                  placeholder="选择"
                                  showArrow={true}
                                  defaultValue={this.state.defaultGradeTitle}
                                  onChange={this.gradeInfoChange.bind(this)}
                              >
                                  {
                                      this.state.gradeInfoList.map((item,index)=>{
                                          return <Select.Option title={item.title} key={item.id}>{item.title}</Select.Option>
                                      })
                                  }
                              </Select>
                          </div>
                          <div className="class-num-title">班号:</div>
                          <div className="class-num-input">
                          <Input
                              value={this.state.inputValue}
                              onChange={this.classNumInputChange.bind(this)}
                              maxLength={2}
                          />
                          </div>
                          <div className='class-num-des'>(班)</div>
                      </div>

                      {/*错误提示*/}
                      {
                          !!this.state.clasNumError? <div className="creat-class-error">
                              <Icon type="close-circle-o" style={{color:'rgba(247, 79, 44, 1)'}} />
                              <div className='class-num-error-text'>{this.state.clasNumError}</div>
                          </div>:null
                      }

                  </div>

              </Modal>

      }
    handleOk(e){
        console.log(e);

        let teacherInfo=JSON.parse(localStorage.getItem("teacherInfo")),//教师信息
            subjectId=teacherInfo.subjectId;//学科

        let number=this.state.inputValue,
            stageId=this.state.stageId,
            gradeId=this.state.gradeId;
        if (stageId === null)
        {
            this.setState({
                clasNumError: '请选择学段'
            });
            return;
        }
        if (gradeId === null)
        {
            this.setState({
                clasNumError: '请选择年级'
            });
            return;
        }
        if (number < 1) {
            this.setState({
                clasNumError: '班号必须大于0'
            });
            return;
        }
        this.setState({
            visible: false,
        });
        this.props.noticeParentOk(loginToken,stageId,subjectId,gradeId,number);

    }
    //取消
    handleCancel(e){
        console.log(e);
        console.log('------');
        this.setState({
            visible: false,
        });
        this.props.noticeParentCancel();
    }
    stageInfoChange(e)
    {
        console.log(e);
        this.state.stageId = e;
        this.state.gradeId = null;
        this.setState({
            clasNumError:null,
        })
        let stageLength = this.state.stageInfoList.length;
        for (let i = 0;i<stageLength;i++)
        {
            let aStageInfo = this.state.stageInfoList[i];
            if (aStageInfo.id.toString() === e)
            {
                console.log('aStageInfo====',aStageInfo);
                this.setState({
                    defaultGradeTitle:undefined,
                    gradeInfoList:aStageInfo.gradeInfoList,
                    timeStamps:(new Date()).getTime()
                })
            }
        }

    }
    gradeInfoChange(e)
    {
        console.log(e);
        this.state.gradeId = e;
        this.setState({
            clasNumError:null,
        })
        let gradeLength = this.state.gradeInfoList.length;
        for (let i = 0;i<gradeLength;i++)
        {
            let aGradeInfo = this.state.gradeInfoList[i];
            if (aGradeInfo.id.toString() === e)
            {
                console.log('aGradeInfo====',aGradeInfo);
                // this.state.defaultGrade = aGradeInfo;
            }
        }
    }
    classNumInputChange(e)
    {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                inputValue:value,
                clasNumError:null,
            });
        }
    }


}
