/**
 * 新班级详情
 */

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link, hashHistory} from 'react-router'
import {Select, Icon, Modal, Input, Upload, message, Button, Progress, Spin, Breadcrumb} from 'antd';

import './style.less'
import GlobalStyle from '../../constants/GlobalStyles'
import * as Constants from "../../constants/store";
import {addStudent, delStudent, getClassDetails, getClassStudent} from "../../fetch/homework-class/homework-class";
import Loading from "../../components/Loading";

const mingdan = require('../../static/mingdan.xlsx');


const loginToken = localStorage.getItem("loginToken");
export default class ClassDetails extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        // 初始状态
        this.state = {
            loadingShow: 'none',
            studentList: null,
            classDetails: null,
            contextState:1,//0 什么不显示 1 显示load  2显示下载模板 3显示导入学生加载状态 4显示成员列表 5删除学生 6 添加学生
            uploadData:{
                loginToken:loginToken,
                classId:this.props.params.classId,
            },
            editStudentName:null,
            editStudentSex:0,
            showAddNameError:false,
            showCompleteStuInfoLoading:false,
            isShowModal:false,
            delectItem:null,
        };
    };
    componentWillMount() {


    }

    componentDidMount() {
        let classId = this.props.params.classId;
        console.log('class detail componentDidMount', classId,this.state.uploadData);
        this.getClassDetails.bind(this, loginToken, classId)();
        this.getClassStudent.bind(this, loginToken, classId)();
    };

    render() {

        let classTitle = !!this.state.classDetails ? this.state.classDetails.name : '';

        return <div className='class-details'>
            <h1 className='header-nav'>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to="/homework-class">我的班级</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>班级详情</Breadcrumb.Item>
                </Breadcrumb>
            </h1>
            <div className='class-info'>
                <div className='class-title'>
                    {classTitle}
                </div>
                {this.showImportExcelBtn.bind(this)()}
            </div>
            {this.showClassContent.bind(this)()}
            <Modal
                title="删除学生"
                visible={this.state.isShowModal}
                cancelText="取消"
                okText="确定"
                width={GlobalStyle.popWindowWidth}
                onOk={this.delStudentOk.bind(this)}
                onCancel={this.delStudentCancel.bind(this)}
            >
                <div className='delect-student-pop'>
                    <div className='delect-student-context'>
                        确认将<span className='delect-student-name'>‘{!!this.state.delectItem&&this.state.delectItem.name}’</span>从{!!this.state.classDetails&&this.state.classDetails.name}名单中删除？
                    </div>
                    <div className='delect-student-tip'>
                        (操作不可恢复)
                    </div>
                </div>
            </Modal>
        </div>
    }

    showImportExcelBtn() {
        if (this.state.contextState === 2 || this.state.contextState === 3)
        {
            // let actionUrl = Constants.baseUrl + "/account/teacher/class/student/importData?loginToken=" + loginToken + '&classId=' + this.props.params.classId;
            let actionUrl = Constants.baseUrl + "/account/teacher/class/student/importData";
            return <Upload
                action={actionUrl}
                name='upload'
                data={this.state.uploadData}
                showUploadList={false}
                onChange={this.handleChange.bind(this)}
            >
                <div className='import-excel-btn-bg'>
                    <div className='import-excel-imag'></div>
                    <div className='import-excel-title'>导入学生名单</div>
                </div>
            </Upload>;
        }
    };
    showClassContent(){
        console.log('this.state.contextState ',this.state.contextState );
        if(this.state.contextState === 1)
        {
            return  <div style={{"display": "block"}}>
                <Spin size="large" style={{"fontSize": "30px", "display": 'block', 'margin': '300px auto'}}/>
            </div>
        }
        else if (this.state.contextState === 2)
        {
            return <div className='download-template'>
                <div className='download-template-top'>
                    <div className='template-des'>
                        暂无学生，请点击右上角“导入学生名单”按钮，导入Excel格式的学生名单。名单样式可下载模板查看。
                    </div>
                    <Button type="primary"  className="download-template-btn" onClick={this.downloadExcelBtn.bind(this)}>
                        下载模板
                    </Button>
                </div>
                <img className='down-template-icon' src={require('../../static/img/down-template.png')}/>
            </div>
        }
        else if(this.state.contextState === 3)
        {

            return <div className='download_loading'>
                <img className='excel-icon' src={require('../../static/img/excel-icon.png')}/>
                <img className='excel-progress' src={require('../../static/img/excel-progress.png')}/>
                <div className='excel-loading-title'>正在导入…</div>
            </div>

        }
        else if (this.state.contextState === 4||this.state.contextState === 5 ||this.state.contextState === 6)
        {
            if (!!this.state.studentList && this.state.studentList.length)
            {
                let numberClass = 'number';
                let nameClass = 'name';
                let sexClass = 'sex';
                let positionDiv = null;

                let itemNum = 'item-number';
                let itemName = 'item-name';
                let itemSex = 'item-sex';

                if (this.state.contextState === 6)
                {
                    numberClass = 'number-offset';
                    nameClass = 'name-offset';
                    sexClass = 'sex-offset';
                    positionDiv = <div className='positionFlex'></div>;

                    itemNum = 'item-number-offset';
                    itemName = 'item-name-offset';
                    itemSex = 'item-sex-offset';
                }

                return<div className='class-member-normarl'>
                    <div className='class-member-header'>
                        <div className={numberClass}>序号</div>
                        <div className={nameClass}>学生姓名</div>
                        <div className={sexClass}>性别</div>
                        {positionDiv}
                    </div>
                    <div className='class-member-content' id='class-member-content-id'>
                        {this.state.studentList.map((item, index) => {

                            return <div className='item-view' style={{backgroundColor:index%2===1?'#E9F8ED':'#FFFFFF'}} key={index}>
                                <div className={itemNum}>
                                    {
                                        this.state.contextState === 5? <img className='delect' src={require('../../static/img/delect-student.png')} onClick={this.delectAStudnetWithItem.bind(this,item,index)}/>:null
                                    }
                                    {item.number}
                                </div>
                                <div className= {itemName}>{item.name}</div>
                                <div className={itemSex}>
                                    {item.gender ===1?'女':'男'}
                                    {
                                        item.gender ===1?<img className='sex-img-nv' src={require('../../static/img/nv-icon.png')}/>:<img className='sex-img-nan' src={require('../../static/img/nan-icon.png')}/>
                                    }
                                    </div>
                                {positionDiv}
                            </div>
                        })
                        }
                        {this.state.contextState=== 6&&<div className='add-a-student-infor'  style={{backgroundColor:this.state.studentList.length%2===1?'#E9F8ED':'#FFFFFF'}}>
                            <div  className='student-number'>
                                {(!!this.state.studentList&&this.state.studentList.length)?(this.state.studentList[this.state.studentList.length-1].number+1):1}
                            </div>
                            <div className='student-name'>
                                <Input
                                    className='student-name-input'
                                    value={this.state.editStudentName}
                                    onChange={this.editStudentNameChange.bind(this)}
                                    maxLength={6}
                                    placeholder="请输入学生名字" />
                                {this.state.showAddNameError&&<p className="error-text"><Icon type="close-circle-o" style={{color:'rgba(247, 79, 44, 1)'}} /><span>名字不能为空</span></p>}
                            </div>
                            <div className='student-sex'>
                                    <Select
                                        className='select-sex'
                                        key={this.state.timeStamp}
                                        placeholder="选择"
                                        showArrow={true}
                                        defaultValue={this.state.editStudentSex===0?'男':'女'}
                                        onChange={this.editSexInforChange.bind(this)}
                                    >
                                        <Select.Option
                                            key = {0}
                                            style={{
                                                marginTop:'3px',
                                                height:'36px',
                                                color: '#444444',
                                                textAlign:'center',
                                                fontSize:'16px',
                                                backgroundColor:'#FFFFFF',
                                            }}>
                                            {this.state.editStudentSex===0?'女':'男'}
                                            </Select.Option>
                                    </Select>
                            </div>
                            {positionDiv}
                            <div className='add-student-operation'>
                                <div className='add-student-cancel-btn' onClick={this.addStudentCancelBtn.bind(this)}>取消</div>
                                <div className='add-student-complete-btn' onClick={this.addStudentCompleteBtn.bind(this)}>完成</div>
                            </div>

                        </div>}
                    </div>
                    <div className='class-member-foot'>
                        <Button type='primary' className="add-student" onClick={this.addStudentBtn.bind(this)}>{this.state.contextState === 6?'取消添加':'添加学生'}</Button>
                        <Button className="delect-student" onClick={this.delectStudentBtn.bind(this)}>{this.state.contextState === 5?'取消删除':'删除学生'}</Button>
                    </div>
                    {this.state.showCompleteStuInfoLoading&&<Loading/>}
                </div>

            }
        }

    };
    downloadExcelBtn() {

        console.log('下载模板');
        window.location.href = mingdan;

        // document.location.href = mingdan;
        // var $eleForm = $("<form method='get'></form>");
        //
        // $eleForm.attr("action","https://codeload.github.com/douban/douban-client/legacy.zip/master");
        //
        // $(document.body).append($eleForm);
        //
        // //提交表单，实现下载
        // $eleForm.submit();
        //
        // window.open("https://codeload.github.com/douban/douban-client/legacy.zip/master");

    }

    handleChange(info) {
        console.log('uploadData',this.state.uploadData);

        if (info.file.status === 'uploading') {
            this.setState({
                contextState: 3,
            });
            console.log('导入学生名单 1 ', info.file);
        }
        else if (info.file.status === 'done') {

            console.log('导入学生名单  2 ', info.file);

            console.log(info.file);
            if (info.file.response.code === 200) {

                message.success(`${info.file.name}上传成功`);
                let classId = this.props.params.classId;
                this.getClassStudent.bind(this, loginToken, classId)();
            }
            else {
                message.error(`${info.file.response.error}`);
                this.setState({
                    contextState: 6,
                });
            }

        } else if (info.file.status === 'error') {
            console.log('导入学生 error');
            message.error(`${info.file.name}上传失败.`);
        }
    }

    addStudentBtn() {
        console.log('添加学生');
        if(this.state.contextState ===6)
        {
            this.setState({
                contextState: 4,
                editStudentName:null,
                editStudentSex:0,
            })
        }
        else {
            this.setState({
                contextState: 6,
            },()=>{
                var ele = document.getElementById('class-member-content-id');
                console.log('添加学生 ele',ele);
                ele.scrollTop = ele.scrollHeight;
            })
        }


    }

    delectStudentBtn() {
        console.log('删除学生');
        if(this.state.contextState ===5)
        {
            this.setState({
                contextState: 4,
            })
        }
        else {
            this.setState({
                contextState: 5,
            })
        }
    }
    delectAStudnetWithItem(item,index){
        console.log('删除一个学生',index);
        this.setState({
            isShowModal:true,
            delectItem:item,
        });
    }
    editStudentNameChange(e){
        console.log('editStudentNameChange',e.target.value);
        this.setState({
            editStudentName:e.target.value,
            showAddNameError:false,
        });
    }
    editSexInforChange(e)
    {
        console.log('编辑性别',e);
        if (this.state.editStudentSex === 0)
        {
            this.setState({
                editStudentSex:1,
                timeStamp:(new Date()).getTime(),
            })
        }
        else {
            this.setState({
                editStudentSex:0,
                timeStamp:(new Date()).getTime(),
            })
        }

    }
    addStudentCancelBtn(){
        console.log('取消');
        this.setState({
            contextState: 4,
            editStudentName:null,
            editStudentSex:0,
        })
    }
    addStudentCompleteBtn(){
        console.log('完成');

        let classId = this.props.params.classId;
        let number = (!!this.state.studentList&&this.state.studentList.length)?(this.state.studentList[this.state.studentList.length-1].number+1):1;
        let name = this.state.editStudentName;
        let gender = this.state.editStudentSex;
        if (!name)
        {
            this.setState({
                showAddNameError:true,
            })
            return;
        }
        this.addStudent.bind(this,loginToken,classId,number,name,gender)();
    }
    delStudentOk(){
        this.setState({
            isShowModal:false,
        })
        let classId = this.props.params.classId;
        let studentId = this.state.delectItem.id;
        this.delStudent(loginToken,classId,studentId);
    }
    delStudentCancel(){
        this.setState({
            isShowModal:false,
        })
    }

    //班级详情
    getClassDetails(loginToken, classId) {
        console.log('classDetails ', loginToken, classId);
        const resultClassDetails = getClassDetails(loginToken, classId);
        resultClassDetails.then(res => {
            return res.json()
        }).then(json => {
            // 处理获取的数据
            const data = json
            if (data.result) {
                let classDetails = data.data;
                console.log('classDetails', classDetails);
                this.setState({
                    classDetails: classDetails
                })
            }
        }).catch(ex => {
            // 发生错误
            if (__DEV__) {
                console.error('暂无数据, ', ex.message)
            }
        })
    }

    //获取班级下成员
    getClassStudent(loginToken, classId) {
        console.log('getClassStudent ', loginToken, classId);
        this.setState({
            contextState: 1,
        })
        const resultStudent = getClassStudent(loginToken, classId);
        resultStudent.then(res => {
            return res.json()
        }).then(json => {
            // 处理获取的数据
            const data = json
            if (data.result) {
                let content = data.data.content;
                if(!!content&&content.length)
                {
                    this.setState({
                        studentList: content,
                        contextState: 4,
                    })
                }
                else
                {
                    this.setState({
                        contextState: 2,
                    })
                }

            }
        }).catch(ex => {
            // 发生错误
            if (__DEV__) {
                console.error('暂无数据, ', ex.message)
            }
        })
    }

    addStudent(loginToken, classId,number,name,gender)
    {
        this.setState({
            showCompleteStuInfoLoading:true,
        })
        console.log('getClassStudent ', loginToken, classId,number,name,gender);
        const resultStudent = addStudent(loginToken, classId,number,name,gender);
        resultStudent.then(res => {
            return res.json()
        }).then(json => {
            // 处理获取的数据
            const data = json
            if (data.code === 200) {
                let content =  this.state.studentList.concat(data.data);
                this.setState({
                    showCompleteStuInfoLoading:false,
                    studentList:content,
                    contextState: 4,
                    editStudentName:null,
                    editStudentSex:0,
                })
            }
            else
            {
                this.setState({
                    showCompleteStuInfoLoading: false,
                })
            }
        }).catch(ex => {
            this.setState({
                showCompleteStuInfoLoading: false,
            })
            // 发生错误
            if (__DEV__) {
                console.error('暂无数据, ', ex.message)
            }
        })

    }
    delStudent(loginToken, classId,studentId)
    {
        this.setState({
            showCompleteStuInfoLoading:true,
        })
        console.log('delStudent ', loginToken, classId,studentId);
        const resultStudent = delStudent(loginToken, classId,studentId);
        resultStudent.then(res => {
            return res.json()
        }).then(json => {
            // 处理获取的数据
            const data = json
            if (data.code === 200) {
                let index = this.state.studentList.indexOf(this.state.delectItem);
                this.state.studentList.splice(index,1);
                if (this.state.studentList.length)
                {
                    this.setState({
                        showCompleteStuInfoLoading:false,
                        studentList: this.state.studentList,
                        contextState: 4,
                    })
                }
                else
                {
                    this.setState({
                        showCompleteStuInfoLoading:false,
                        contextState: 2,
                    })
                }
            }
            else
            {
                this.setState({
                    showCompleteStuInfoLoading: false,
                })
            }
        }).catch(ex => {
            this.setState({
                showCompleteStuInfoLoading: false,
            })
            // 发生错误
            if (__DEV__) {
                console.error('暂无数据, ', ex.message)
            }
        })

    }

}
