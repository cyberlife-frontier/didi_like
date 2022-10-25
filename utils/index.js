// opt没有传该传的
import  Mock from './mock'
const DEFAULT_REQUEST_OPTIONS = {
    url: '',
    data: {},
}
let util = {
    request(opt){
        // 生成对象 结构
        let options = Object.assign({},DEFAULT_REQUEST_OPTIONS,opt);
        let {url,data, } = options;
        // console.log(url,data,header,method,dataType,mock);
        return new Promise((resolve,reject)=>{
            wx.request({
                url,
                data,
                success(res){
                    resolve(res.data)
                },
                fail(err){
                    reject(err)
                }
            })
        })
    }

}

export default util