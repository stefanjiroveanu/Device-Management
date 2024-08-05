import { DataSource } from 'typeorm';
import { DeviceMeasurement } from './entity/DeviceMeasurement';
import { Device } from './entity/Device';

export const DevicesManagementDataSource = new DataSource({
    type:"postgres",
    host:"device_management_database",
    port:5432,
    username:"postgres",
    password:"postgres",
    database:"devices",
    synchronize:true,
    logging:false,
    entities:[DeviceMeasurement, Device],
    migrations:[],
    subscribers:[],
}).initialize(); 

export default DevicesManagementDataSource; 