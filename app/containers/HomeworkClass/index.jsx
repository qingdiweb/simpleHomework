/**
 * 我的班级
 */
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link, hashHistory } from 'react-router'
import { Menu, Icon , Button , Input , Dropdown, Modal , message , Breadcrumb,Spin} from 'antd';
import {
    getClassList,
    editCollect,
    addClass,
    delCollect,
    delClass,
    editClass
} from '../../fetch/homework-class/homework-class'
import * as Constants from '../../constants/store'
import './style.less'
import CreateClassModal from "../../components/CreateClassModal";
import {getStageSubject} from '../../fetch/config-info/config-info'
import GlobalStyle from "../../constants/GlobalStyles";
import GeneralEmpty from "../../components/GeneralEmpty";


const loginToken=localStorage.getItem("loginToken");
class HomeworkCollect extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            visible:false,
            isEditClass:false,
            editInfo:null,
            classData:[],//班级列表
            classNameVal:'',//创建-编辑习题集名称
            classNameErrorShow:'none',
            createLoadingShow:'none',
            createLoadingText:'创建中',
            loadingShow:'block',
            flag:true,
            isShowModal:false,
            delContentText:null,
            delectItem:null,
        }
    }
    componentWillMount() {

    }
    componentDidMount(){
        //请求获取收藏班级列表
        this.getClassList.bind(this, loginToken)()
        //通知左侧menu导航-当前在那个menu下
        localStorage.setItem('positionMenu', JSON.stringify(['5']));
    }
    //请求获取班级列表
    getClassList(loginToken){
        const resultClassList=getClassList(loginToken);
                resultClassList.then(res => {
                    return res.json()
                }).then(json => {
                    // 处理获取的数据
                    const data = json
                    if (data.result) {
                        let classData=data.data.content.reverse();
                            this.setState({
                                classData:classData,
                                loadingShow:'none'
                            })
                    }
                }).catch(ex => {
                    // 发生错误
                    if (__DEV__) {
                        console.error('暂无数据, ', ex.message)
                    }
                })
    }

    render() {
        let classData=this.state.classData;
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item key="1">编辑名称</Menu.Item>
                <Menu.Item key="2">删除班级</Menu.Item>
            </Menu>
        );
        return (
            <div className="homework-class">
                <h1 className='header-nav'><Breadcrumb separator=">"><Breadcrumb.Item>我的班级</Breadcrumb.Item></Breadcrumb></h1>
                <Button type="primary" className="create-test-collection" onClick={this.createClass.bind(this)}>创建班级</Button>
                <div className="list-sec no-corrections" style={{"display":this.state.loadingShow}}>
                    <Spin size="large" style={{"fontSize":"30px","display":'block','margin':'300px auto'}}/>
                </div>
                <div className="list-sec no-corrections create-class-corrections" style={{"display":this.state.createLoadingShow}}>
                    <span style={{"fontSize":"18px","display":'block','textAlign':'center','margin':'300px auto 0px'}}>{this.state.createLoadingText}</span>
                    <Spin size="large" style={{"fontSize":"30px","display":'block','margin':'0px auto'}}/>
                </div>
                <div className="test-collection-list" >
                    {
                        classData.length>0 ? classData.map((item,index)=>{
                            return<div className="test-collection-sec" key={index} onClick={this.goClassDetail.bind(this,item)}>
                                <div className="test-collection-logo">
                                </div>
                                <Dropdown overlay={menu} placement="bottomRight" onVisibleChange={this.onVisibleChange.bind(this,item)}>
                                    <Button className="test-collection-dropdown" onClick={(e)=>{
                                        e.stopPropagation();
                                    }}>
                                        <Icon type="ellipsis" />
                                    </Button>
                                </Dropdown>
                                {/*<div className='edit-btn' onClick={this.editBtnClick.bind(this,item)}>编辑</div>*/}
                                {/*<div className='delect-btn' onClick={this.delectBtnClick.bind(this,item)}>删除</div>*/}
                                <p className="test-collection-name" title={item.name}>{item.grade+'('+item.number+')班'}</p>
                                <p className="test-collection-num">共{item.studentCount==null ? 0 : item.studentCount}人</p>
                            </div>
                        }) : this.state.loadingShow==='none'&&this.showListEmpty.bind(this)()
                    }
                </div>
                <CreateClassModal visible={this.state.visible}
                                  isEditClass={this.state.isEditClass}
                                  editInfo={this.state.editInfo}
                                  stageInfoList ={this.state.stageInfoList}
                                  noticeParentCancel={this.noticeParentCancel.bind(this)}
                                  noticeParentOk={this.noticeParentOk.bind(this)}
                />
                <Modal
                    title="删除班级"
                    visible={this.state.isShowModal}
                    cancelText="取消"
                    okText="确定"
                    width={GlobalStyle.popWindowWidth}
                    onOk={this.delClassOk.bind(this)}
                    onCancel={this.delClassCancel.bind(this)}
                >
                    <div className='delect-class-modal'>
                        <div className='delect-class-context'>
                            确认删除<span className='delect-class-name'>‘{!!this.state.delectItem&&this.state.delectItem.name}’</span>整个班级？
                        </div>
                        <div className='delect-class-tip'>
                            (操作不可恢复)
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
    showListEmpty(){
        return <GeneralEmpty hintText='暂无班级～'/>;
    }
    handleMenuClick(e){
        console.log('handleMenuClick');
        console.log(e)
        let key=e.key;
        if(key==1){//编辑习题集
            console.log('编辑');
            this.setState({
                visible:true,
                isEditClass:true,
            });
            this.getStageSubject();
        }else if(key==2){//删除
            this.setState({
                isShowModal: true,
                delContentText:this.state.delectItem.grade+'('+this.state.delectItem.number+')班',
            });
        }
    }
    onVisibleChange(item)
    {
        console.log('onVisibleChange',item);
        this.state.delectItem = item;
        this.state.editInfo = item;
    }
    //创建班级
    createClass(){
        this.setState({
            visible:true,
            isEditClass:false,
        });
       this.getStageSubject();
    }
    getStageSubject(){
        if (this.state.stageInfoList === undefined || this.state.stageInfoList === null)
        {
            const resultGetStageSubject = getStageSubject();
            resultGetStageSubject.then(res =>{
                return res.json()
            }).then(json=>{
                const data = json
                if(data.result){
                    let stageInfoList=data.data.stageInfoList;
                    this.setState({
                        stageInfoList:stageInfoList
                    })
                }
            }).catch(ex => {
                // 发生错误
                if (__DEV__) {
                    console.error('暂无数据, ', ex.message)
                }
            })
        }
    }
    noticeParentCancel(){
        console.log('noticeParentCancel');
        if (this.state.isEditClass === true)
        {
            this.setState({
                visible: false,
            });
        }
        else if (this.state.isEditClass === false)
        {
            this.setState({
                visible: false,
                isEditClass:false,
                editInfo:null,
            });
        }

    }
    noticeParentOk(loginToken,stageId,subjectId,gradeId,number){
        console.log('noticeParentOk');
        if (this.state.isEditClass === true)
        {

            let classId = this.state.editInfo.id;
            console.log('noticeParentOk 2',loginToken,classId,stageId,subjectId,gradeId,number);

            this.setState({
                visible: false,
                isEditClass:false,
                editInfo:null,
                createLoadingShow:'block',
                createLoadingText:'更新中',
            });
            const resultGetEditClass = editClass(loginToken,classId,stageId,subjectId,gradeId,number);
            resultGetEditClass.then(res =>{
                return res.json()
            }).then(json=>{
                const data = json
                this.setState({
                    createLoadingShow:'none',
                    createLoadingText:'',
                });
                this.getClassList.bind(this, loginToken)();
                message.success('更新成功');
            }).catch(ex => {
                message.error('创建失败');
                // 发生错误
                if (__DEV__) {
                    console.error('暂无数据, ', ex.message)
                }
            })

        }
        else if (this.state.isEditClass === false)
        {

            this.setState({
                visible: false,
                createLoadingShow:'block',
                createLoadingText:'创建中',
            });
            const resultGetStageSubject = addClass(loginToken,stageId,subjectId,gradeId,number);
            resultGetStageSubject.then(res =>{
                return res.json()
            }).then(json=>{
                const data = json
                this.setState({
                    createLoadingShow:'none',
                    createLoadingText:'',
                });
                this.getClassList.bind(this, loginToken)();
                message.success('创建成功');
            }).catch(ex => {
                message.error('创建失败');
                // 发生错误
                if (__DEV__) {
                    console.error('暂无数据, ', ex.message)
                }
            })
        }

    }
    goClassDetail(item,e) {
        console.log('去详情',item,e);
        // hashHistory.push('/homework-class-detail/'+item.id);
        hashHistory.push('/class-details/'+item.id);
    }
    editBtnClick(item,e){
        e.stopPropagation();
        console.log('编辑',item);
        this.setState({
            visible:true,
            isEditClass:true,
            editInfo:item,
        });
        this.getStageSubject();
    }
    delectBtnClick(item,e){
        e.stopPropagation();
        console.log('删除',item);
        this.setState({
            isShowModal: true,
            delContentText:item.grade+'('+item.number+')班',
            delectItem:item,
        })
    }
    delClassCancel(){
        this.setState({
            isShowModal: false,
            delContentText:null,
            delectItem:null,
        })
    }
    delClassOk(){
        console.log('delClassOk');
        const resultDelClass=delClass(loginToken,this.state.delectItem.id);
        resultDelClass.then(res => {
            return res.json()
        }).then(json => {
            // 处理获取的数据
            const data = json
            console.log('delClass data',data);
            let delectIndex = -1;
            for (let i=0; i <this.state.classData.length;i++)
            {
                if (this.state.delectItem.id === this.state.classData[i].id)
                {
                    delectIndex = i;
                }
            }
            if (delectIndex!=-1) {
                this.state.classData.splice(delectIndex,1);
                this.setState({
                    isShowModal:false,
                    delectItem:null,
                })
                message.success('删除成功');
            }
        }).catch(ex => {
            // 发生错误
            if (__DEV__) {
                console.error('暂无数据, ', ex.message)
            }
        })
    }

}

export default HomeworkCollect
