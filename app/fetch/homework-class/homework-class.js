import { get } from '../get'
import { post } from '../post'

//请求获取班级列表
export function getClassList(loginToken) {
    const result = post('/account/teacher/class/list',{
    	loginToken:loginToken
    })
    return result
}
/**
 *新建班级
 */
export function addClass(loginToken,stageId,subjectId,gradeId,number,name) {
    const result = post('/account/teacher/class/add',{
        loginToken:loginToken,
        stageId:stageId,
        subjectId:subjectId,
        gradeId:gradeId,
        number:number,
        name:name,
    })
    return result
}

//编辑班级
export function editClass(loginToken,classId,stageId,subjectId,gradeId,number,name) {
    const result = post('/account/teacher/class/update',{
        loginToken:loginToken,
        classId:classId,
        stageId:stageId,
        subjectId:subjectId,
        gradeId:gradeId,
        number:number,
        name:name,
    })
    return result
}
//删除班级
export function delClass(loginToken,classId) {
    const result = post('/account/teacher/class/delete',{
        loginToken:loginToken,
        classId:classId
    })
    return result
}
//班级详情
export function getClassDetails(loginToken,classId) {
    const result = post('/account/teacher/class/detail',{
        loginToken:loginToken,
        classId:classId
    })
    return result
}
//获取班级下成员
export function getClassStudent(loginToken,classId) {
    const result = post('/account/teacher/class/student/list',{
        loginToken:loginToken,
        classId:classId,
        pageSize:1000,
    })
    return result
}
//添加学生
export function addStudent(loginToken, classId,number,name,gender) {
    const result = post('/account/teacher/class/student/add',{
        loginToken:loginToken,
        classId:classId,
        number:number,
        name:name,
        gender:gender,
    })
    return result
}
//删除指定学生
export function delStudent(loginToken,classId,studentId) {
    const result = post('/account/teacher/class/student/del',{
        loginToken:loginToken,
        classId:classId,
        studentId:studentId
    })
    return result
}
//获取班级下历史作业
export function getClassHomework(loginToken,classId) {
    const result = post('/account/teacher/homework/list', {
        loginToken:loginToken,
        classId:classId,
    })
    return result
}
//删除指定作业
export function delHomework(loginToken,homeworkId) {
    const result = post('/account/teacher/homework/delete', {
        loginToken:loginToken,
        homeworkId:homeworkId
    })
    return result
}
//班级下指定学生作业列表
export function classStuHomework(loginToken,classId,studentId,pageNumber,pageSize) {
    const result = post('/account/teacher/class/student/homework', {
        loginToken:loginToken,
        classId:classId,
        studentId:studentId,
        pageNumber:pageNumber,
        pageSize:pageSize
    })
    return result
}
