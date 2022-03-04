const moment = require('moment')
   
module.exports = {
                    genereteDate: (date, format) => {
                    return moment(date).format(format)},


                    limit: (arr, limit) => {
                        if (!Array.isArray(arr)) return []
                        return arr.slice(0, limit) },

                    truncate: (str, len) => {
                        if (str.length > len) str = str.substring(0,len) + '...';
                        return str} ,
                    paginate: (options)=>{
                        let outputhtml=''
                        if(options.hash.current===1){
                            outputhtml+=`<li class="page-item disabled"><a class="page-link">First</a></li>`
                        }else{
                            outputhtml+= ` <li class="page-item"><a class="page-link" href="?page=1">First</a></li>`
                        }
                
                        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 3 : 1)
                        if(i !==1){
                            outputhtml+=`<li class="page-item disabled"><a class="page-link">...</a></li>`
                        }
                
                        for (; i <= (Number(options.hash.current) + 3) && i <= options.hash.pages; i++) {
                            if(i===options.hash.current){
                                outputhtml+=`<li class="page-item active"><a class="page-link">${i}</a></li>`
                            }else{
                                outputhtml+= ` <li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`
                            }
                            if (i == Number(options.hash.current) + 3 && i < options.hash.pages){
                                outputhtml+=`<li class="page-item disabled"><a class="page-link">...</a></li>`
                            }
                        }
                        
                        if (options.hash.current ==options.hash.pages ){
                            outputhtml+=`<li class="page-item disabled"><a class="page-link">Last</a></li>`
                        }else{
                            outputhtml+= ` <li class="page-item"><a class="page-link" href="?page=${options.hash.pages }">Last</a></li>`
                        }
                
                
                        return outputhtml
                
                    }
                

}