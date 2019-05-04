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
start();
});


function start(){

let sql= 'CALL allproducts(?)';

 connection.query(sql,0, (error, results, fields)=> {

      if (error) { return  console.error(error.message);
      
        connection.end();
      }
          
      var resultArr = Object.values(JSON.parse(JSON.stringify(results)));
      var myobject = resultArr[0];
     // console.log( myobject);
     
    //  console.log(results[0]);
      for (var i= 0; i< myobject.length; i++){
          console.log(clc.yellowBright("id: " + myobject[i].id + "| product: " + myobject[i].item + "| price: $" + myobject[i].price + "| quantity: " + myobject[i].available  ));
          
     }

     whichId();
 });



  
}

function whichId() {
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
    message: "Choose Quantity",
    validate: function(value) {if (isNaN(value)=== false)
        {return true;}
         return false;
    }


}
  ])
  .then(function(answer){
    var query = "Select stock_quantity from products where item_id= ? AND stock_quantity >= ? ";
    connection.query(query, [answer.chooseId, answer.chooseQty], function(err,res){
            
         if (err) {
           console.log(err.message);
           connection.end();
           return;
         }

         //console.log("results of checking quantity " + res[0].stock_quantity );
         if (res == 0) {
           console.log(clc.redBright("Insufficient Available Quantity"));
         } else {
           //fulfill order calling productOrder Stored Procedure
           console.log(clc.redBright("full filling order"));
           let sql = "CALL productOrder(?,?,@result)";
           connection.query(
             sql,
             [answer.chooseId, answer.chooseQty, "@result"],
             (error, results, fields) => {
               if (error) {
                 return console.error(clc.redBright(error.message));
               }

             // console.log("My results " + results[0]);
               var resultArr = Object.values(
                 JSON.parse(JSON.stringify(results))
               );
             // console.log("Result of SP " + resultArr[0]);
               var myobject = resultArr[0];
               if (myobject[0].cost == 1) {
                 console.log(clc.redBright("Insufficient quantity for to full fill"));
               } else {
                 console.log(clc.greenBright(
                   "Quantity Left: " +
                     myobject[0].stock_quantity +
                     " total Cost: $" +
                     myobject[0].cost)
                 );
               }
             }
           );
         }
          
            connection.end();

    }


  );
  


});

}