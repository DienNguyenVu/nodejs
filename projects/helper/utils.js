const ItemsModel = require('./../schemas/items');
let createFilterStatus =()=>{
    let statusFilter = [
        { name:'all',value:'all',count: 1, link: '#', class:'default'},
        { name:'Active',value:'active',count: 2, link: '#', class:'success'},
        { name:'Inactive',value:'inactive',count: 3, link: '#', class:'warning'},
      ];
    
      statusFilter.forEach((item,index)=>{
        let condition={};
        if(item.value !== "all")
          condition= {status: item.value};
        ItemsModel.count(condition).then((data)=>{
          statusFilter[index].count = data;
        });
      });
    return statusFilter; 
}
module.exports = {
    createFilterStatus: createFilterStatus
} 
