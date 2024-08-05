import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const UsersDataSource = new DataSource({
    type:"postgres",
    host:"user_database",
    port:5432,
    username:"postgres",
    password:"postgres",
    database:"appusers",
    synchronize:true,
    logging:false,
    entities:[User],
    migrations:[],
    subscribers:[],
}).initialize();

export default UsersDataSource; 