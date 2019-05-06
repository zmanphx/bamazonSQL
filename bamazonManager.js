var mysql= require("mysql");
var inquirer = require("inquirer");
const clc = require("cli-color");
var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user:"root",
    password: "Mboost1895",
    database:"bamazon"
})

connection.connect(function(err){

if (err) throw err;

console.log("connection made " + connection.threadId);
//run code stuff
runManager();
});


function allproducts(param){

let sql= 'CALL allproducts(?)';

 connection.query(sql, param, (error, results, fields)=> {

      if (error) { return  console.error(error.message);
        connection.end();
      }
          
      var resultArr = Object.values(JSON.parse(JSON.stringify(results)));
      var myobject = resultArr[0];
     // console.log( myobject);
   if (param ==1){
     console.log( clc.redBright("\r\n\r\n" + "***************Low Inventory*************************" +"\r\n"  ));
     
    }
else
{
  console.log( clc.yellowBright("\r\n\r\n" + "***************Current Products For Sale*************************" +"\r\n"  ));

}

    //  console.log(results[0]);
    console.table(myobject);
    /* for (var i= 0; i< myobject.length; i++){
          console.log("id: " + myobject[i].id + "| product: " + myobject[i].item + "| price: $" + myobject[i].price + "| quantity: " + myobject[i].available  );
          
     } */

   
 });
 connection.end();
}

function checkId(param){

  let sql= 'CALL checkProductid(?)';
  
   connection.query(sql, param, (error, results, fields)=> {
  
        if (error) { return  console.error(error.message);
          connection.end();
        }
            
        var resultArr = Object.values(JSON.parse(JSON.stringify(results)));
        var myobject = resultArr[0];
        var result = myobject[0].validation;
           return result;
         
  
     
   });
   connection.end();
  }


  function addinVentory() {
    inquirer
    .prompt([
        
      { name: "chooseId",
              type: "input",
               message: "Choose item id",
               validate: function(value) {if (isNaN(value)=== false)
                  {return true;}
                   return false;
              }
         
    } 
     , 
  {   name: "chooseQty",
      type: "input",
      message: "Choose Quantity to add",
      validate: function(value) {if (isNaN(value)=== false)
          {return true;}
           return false;
      }
  
  
  }
  
  
  ])
    .then(function(answer)
      {
        // call procedure to add inventory
        let sql= 'CALL addInventory(?,?)';
    
        connection.query(sql,  [answer.chooseId, answer.chooseQty], (error, results, fields)=> {
       
          
            if (error) {
              return console.error(clc.redBright(error.message));
            }
  
          // console.log("My results " + results[0]);
            var resultArr = Object.values(
              JSON.parse(JSON.stringify(results))
            );
          // console.log("Result of SP " + resultArr[0]);
            var myobject = resultArr[0];
           
              console.log(clc.greenBright(
                "\r\n\r\n" +
                "***************Updated Inventory*************************" +
                "\r\n\r\n" +
  
                "Item Id: " +
                  myobject[0].item_id +
                  " Product_name: " +
                  myobject[0].product_name  + "  stock quantity : "+  myobject[0].stock_quantity)
              );
            
          }   
  
         
      );
      connection.end();
  
        });
  }





function addproduct() {
  inquirer
  .prompt([
      
    { name: "chooseName",
            type: "input",
             message: "Product Name to add to inventory"
            
       
  } 
   , 
{   name: "chooseDept",
    type: "list",
    message: "Which Department item belongs to?",
    choices:['camping', 'gardening','electronics','painting']
    


}
,
{ name:"choosePrice",
 type:"input",
 message:"Item Price ?",
 validate: function(value) {if (isNaN(value)=== false)
  {return true;}
   return false;

} 
}
,
{ name:"chooseQty",
type:"input",
message:"Quantity to add?",
validate: function(value) {if (isNaN(value)=== false)
  {return true;}
   return false;



}
}



])
  .then(function(answer)
    {
      // call procedure to add inventory
      let sql= 'CALL addNewItem(?,?,?,?)';
  
      connection.query(sql,  [answer.chooseName, answer.chooseDept,answer.choosePrice,answer.chooseQty ], (error, results, fields)=> {
     
        
          if (error) {
            return console.error(clc.redBright(error.message));
          }

        // console.log("My results " + results[0]);
          var resultArr = Object.values(
            JSON.parse(JSON.stringify(results))
          );
        // console.log("Result of SP " + resultArr[0]);
          var myobject = resultArr[0];
         
            console.log(clc.greenBright(
              "\r\n\r\n" +
              "***************Added New Product*************************" +
              "\r\n\r\n" 
            ));

            console.table(myobject);


          /*     "Item Id: " +
                myobject[0].item_id +
                " Product_name: " +
                myobject[0].product_name  + "  stock quantity : "+  myobject[0].stock_quantity)
            );
           */
        }   

       
    );
    connection.end();

      });
}

function runManager() {
inquirer
  .prompt(
      
    { name: "choice",
            type: "list",
             message: "Choose Inventory Action",
             choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products",
            "Exit"]
            
       
  })
   .then(function(answer){
  
    switch(answer.choice){
     case "View Products for Sale":
           allproducts(0);
         break;

    case "View Low Inventory":
         allproducts(1)
        break;

    case  "Add to Inventory":
       addinVentory();
        break;
      
    case 
    "Add New Products" :
      addproduct();
     break;
    
    case "Exit":
      connection.end();
     break;
  

    }


});

}