import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import cors from 'cors';
import * as dotenv from 'dotenv';
import { services } from "./services";
const app = express();
const swaggerUi = require("swagger-ui-express");
const documentation = require('./libs/Swagger/rule.json');
app.use("/docs", swaggerUi.serve, swaggerUi.setup(documentation));


createConnection().then(async connection => {
    dotenv.config();
    // setup swagger 

    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Swagger',
                version: '1.0.0',
            },
        },
        apis: ['*.js', "routers/*/*.js"],
    };
    // const openapiSpecification = swaggerJsdoc(options);

    // create express app
    app.use(express.static('tmp/uploads'));
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/api', services);
    app.listen(process.env.PORT);
    console.log("DSC backend server has started. PORT: ", process.env.PORT);
}).catch((error: any) => console.log(error));