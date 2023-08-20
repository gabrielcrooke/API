//Llamaos a express
const express = require('express');

const fs = require('fs');
//Iniciamos express
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//Definir y crear el servidor. Indicar que puerto estoy utilizando o quiero utilizar.
app.listen(3000, () => {
    console.log('Estoy escuchando por el puerto 3000');
});

//Metodo GET--------------------------------------------------------------------
app.get('/', function (request, response){
    response.send('Movies API');
});

app.get('/movies', (req, res) => {
    fs.readFile('movies.json', (error, file) => {
        if (error){
            console.log("No se puede leer el archivo", error);
            return;
        }
        const movies = JSON.parse(file);
        return res.json(movies);
    });
});

//Metodo POST------------------------------------------------------------------
app.post('/movies', (req, res) =>{
    fs.readFile('movies.json', (err, data) =>{
        if (err){
            console.log("No se puede leer el archivo", err);
        }
        const movies = JSON.parse(data);
        const newMovieID = movies.length + 1;
        req.body.id = newMovieID;
        movies.push(req.body);

 //El array movies ahora tiene la nueva pelicula
        const newMovie = JSON.stringify(movies, null, 2);
        
        fs.writeFile('movies.json', newMovie, (err) => {
            if (err){
                console.log("Ha ocurrido un error al escribir en el archivo");
            }
            return res.status(200).send("New movie added");
        })
        
    })
});

//Metodo PATCH-----------------------------------------------------------------
app.patch('/movie/:id', (req, res) => {
    const mid = req.params.id; //Rescatamos el id del endpoint => localhost
    const {name, year} = req.body; //Rescatamos de la peticion todos los datos

    fs.readFile('movies.json', (err, data) => {
        if (err){
            console.log("Ha ocurrido un error al leer el fichero", err);
        }
        const movies = JSON.parse(data); // Rescato las pelis de mi movies.json

        movies.forEach(movie =>{
            if  (movie.id === Number(mid)){
                if (name != undefined){ //Si name no tiene valor undefined
                    movie.name = name;
                }
                if (year != undefined){
                    movie.year = year;
                }
                //Tengo la pelicula actualizada en el array movies pero falta el update
                const movieUpdated = JSON.stringify(movies, null, 2);

                fs.writeFile('movies.json', movieUpdated, (err) => { //Escribir en mi archivo movies.json
                    if (err){
                        console.log("Ha ocurrido un error al escribir en el archivo");
                    }
                    return res.status(200).json({message: "Movie Updated"});
                })
            }
        });
    })
});

//Metodo DELETE-----------------------------------------------------------------
app.delete('/movie/:id', (req, res) => {
    const mid = req.params.id;

    fs.readFile('movies.json', (err, data) => {
        if (err){
            console.log("Ha ocurrido un error al leer el fichero", err);
        }
        const movies = JSON.parse(data);
        movies.forEach(movie => {
            if (movie.id === Number(mid)){
                movies.splice(movies.indexOf(movie), 1);

                const movieDeleted = JSON.stringify(movies, null, 2)

                fs.writeFile('movies.json', movieDeleted, (err) => {
                    if (err){
                        console.log("Ha ocurrido un error al escribir en el archivo");
                    }
                    return res.status(200).json({message:"Movie deleted"});
                })
            }
        })
    })
});