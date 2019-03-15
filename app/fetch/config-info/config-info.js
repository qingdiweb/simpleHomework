
import { post } from '../post'



//获取阶段以及科目
export function getStageSubject() {
    const result = post('/config/subject',{

    })
    return result
}
