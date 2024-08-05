import 'dotenv/config';

export const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string; 
export const frontend_origin = process.env.frontend_host as string;