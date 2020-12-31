import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // GET a list of cars
  // Optionally, results are filterable by make with a query paramater
  app.get("/cars/", (req: Request, res: Response) => {
    let filtered_cars = cars;
    const { make } = req.query;

    if (make) {
       filtered_cars = cars.filter(car => car.make === make);
    }
    return res.status(200).send(filtered_cars);
  });

  // Get a specific car
  // - Status code 200: on success
  // - Status code 400: when id is not provided
  // - Status code 404: when car not found
  app.get("/cars/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('id is requires');
    }

    const query_result = cars.filter(car => car.id == id);
    if (query_result.length === 0) {
      return res.status(404).send(`No car found with id ${id}`);
    }
    return res.status(200).send(query_result);
  });

  /// Post a new car to our list
  // Status code 200: on success
  // Status code 400: required field missing (id, type, model, and cost)
  // Status code 400: car with provided id already exists
  app.post("/cars/", (req: Request, res: Response) => {
    const { id, type, model, make, cost } = req.body;

    if (!id || !type || !model || !cost) {
      return res.status(400).send('The following fields are required: id, type, model, make, cost');
    }

    const found = cars.find(car => car.id == id);

    if (found) {
      return res.status(400).send(`Car with id ${id} already exists`);
    }

    const new_car: Car = {
      id,
      type,
      model,
      make,
      cost
    };

    cars.push(new_car);

    return res.status(201).send([new_car]);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
