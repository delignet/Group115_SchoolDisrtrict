// function deleteSchool(schoolID) {
//     let link = '/delete-school-ajax/';
//     let data = {
//       id: schoolID
//     };
  
//     $.ajax({
//       url: link,
//       type: 'DELETE',
//       data: JSON.stringify(data),
//       contentType: "application/json; charset=utf-8",
//       success: function(result) {
//         deleteRow(schoolID);
//       }
//     });
//   }
  
//   function deleteRow(schoolID){
//       let table = document.getElementById("school-table");
//       for (let i = 0, row; row = table.rows[i]; i++) {
//          if (table.rows[i].getAttribute("data-value") == schoolID) {
//               table.deleteRow(i);
//               break;
//          }
//       }
//   }

function deleteSchool(schoolID) {
  // Put our data we want to send in a javascript object
  let data = {
      id: schoolID
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-school-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(schoolID);

      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}


function deleteRow(schoolID){

  let table = document.getElementById("school-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == schoolID) {
          table.deleteRow(i);
          break;
     }
  }
}