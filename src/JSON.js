//对象深拷贝
export function jsonParseObj(obj){
    return JSON.parse(JSON.stringify(obj))
}