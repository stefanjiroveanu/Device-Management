import { DataSource } from 'typeorm';
import { Device } from './entity/Device';

export const DevicesDataSource = new DataSource({
    type:"postgres",
    host:"device_database",
    port:5432,
    username:"postgres",
    password:"postgres",
    database:"devices",
    synchronize:true,
    logging:false,
    entities:[Device],
    migrations:[],
    subscribers:[],
}).initialize();

export default DevicesDataSource; 