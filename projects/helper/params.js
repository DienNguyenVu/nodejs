
let getParam= (params,property, defaultValue)=>{
    // có thuộc tính status hay ko
  if(params.hasOwnProperty(property) &&  params[property] !== undefined){
    // nếu có status thì cập nhật lại
    return params[property];
  }
  return defaultValue;
}
module.exports = {
    getParam
}