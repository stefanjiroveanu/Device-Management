import {Response, Request, NextFunction} from 'express';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next:NextFunction) => {
    console.log('Executing error handling middleware');
    res.status(500).json({ error: 'Internal Server Error' });
  };