import type { APIRoute } from "astro";
// import express from 'express';
// import { connectDB } from '../../config/db.js';
// import dotenv from 'dotenv';
// dotenv.config({ path: './config/.env' });
// const app = express();

// connectDB();

// import indexRouter from '../../routes/index.js';
// import urlsRouter from '../../routes/urls.js';

// app.use( express.urlencoded({ extended: true }) );
// app.use( express.json() );

// app.use('/', indexRouter);
// app.use('/api', urlsRouter);

export const POST: APIRoute = async ( { params, request } ) => {

  // const PORT = process.env.PORT || 3333;
  // app.listen(PORT, () => {
  //   console.log(`Server is running at PORT ${ PORT }`);
  // });

  return new Response( 
    JSON.stringify({
      path: new URL( request.url ).pathname
    })
  )

}

  
  