import express  from "express";
import router from "./router";
import cors,{CorsOptions} from 'cors'
import swaggerUi from 'swagger-ui-express'
import morgan from "morgan";
import swaggerSpec ,{swaggerUiOptions} from "./config/swagger";
import db from "./config/db";
import colors from 'colors'

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.bold.blue('Conexion exitosa a la base de datos'))
    } catch (error) {
        
        console.log(colors.bold.red('Hubo un error al conectar a la base de datos'))
    }
}

connectDB()

const server = express()


const corsOptions:CorsOptions={
    origin:function(origin,callback){
        if(origin===process.env.FRONTEND_URL){
            callback(null,true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())
server.use(morgan('dev'))
server.use('/api/products',router)

server.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec,swaggerUiOptions))

export default server