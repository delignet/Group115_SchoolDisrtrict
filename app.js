/*
    SETUP for a simple web app
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT        = 65291;                 // Set a port number at the top so it's easy to change in the future

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// Static files
app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res)
//     {
//         res.render('index');
//     });

app.get('/', function(req, res){
    res.render('index');
});

app.get('/schools.hbs', function(req, res){
    // Declare Query 1
    
    let query1;

    // If there is no query string, we fjust perform a basic SELECT
    if (req.query.sname === undefined)
    {
        query1 = "SELECT * FROM Schools;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Schools WHERE school_name LIKE "${req.query.sname}%"`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Schools;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save schools
        let search_schools = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save schools
            let all_schools = rows;

            return res.render('schools', {data: search_schools, all_schools: all_schools});
        })
    })

});

app.post('/add-school-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Schools (school_name) VALUES ('${data.school_name}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Schools;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-school-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query2 = `INSERT INTO Schools (school_name) VALUES ('${data['input-school_name']}')`;
    
    //`INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data['input-fname']}', '${data['input-lname']}', ${homeworld}, ${age})`;
    db.pool.query(query2, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})

app.delete('/delete-person-ajax/', function(req,res,next){
    let data = req.body;
    let schoolID = parseInt(data.id);
    let deleteSchoolTeachers = `DELETE FROM Teachers WHERE pid = ?`;
    let deleteSchool= `DELETE FROM Schools WHERE id = ?`;
  
  
          // Run the 1st query
        db.pool.query(deleteSchoolTeachers, [schoolID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteSchool, [schoolID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});