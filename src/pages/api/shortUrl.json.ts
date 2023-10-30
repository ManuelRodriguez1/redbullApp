import type { APIRoute } from "astro";
import axios, { Axios } from "axios";

export const POST: APIRoute = async ( { params, request } ) => {

    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'sk_gR8CywIYdWYKuAqS'
        },
        // body: JSON.stringify({
        //   domain: 'l.rblab.io',
        //   originalURL:  'https://stackoverflow.com/questions/48413050/missing-headers-in-fetch-response'
        // })
        // body: JSON.stringify( request.body )
        body: request.body 
      };
    // const options = {
    //   method: 'POST',
    //   url: 'https://api.short.io/links',
    //   headers: {
    //     accept: 'application/json',
    //     'content-type': 'application/json',
    //     Authorization: 'sk_gR8CywIYdWYKuAqS'
    //   },
    //   // data: {domain: 'yourdomai.in', originalURL: 'http://yourlongdomain.com/yourlonglink'}
    //   data: request.body
    // };
    const response = await fetch('https://api.short.io/links', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
    
      return new Response( 
        JSON.stringify( response ), {
          status: 200,
        }
      )
    // const response = axios.request( options )
    // .then((res) => JSON.stringify( res ))
    // const response = await fetch('https://api.short.io/links', options)
    // console.log(response)
    // return new Response( await response )
    // return new Response( response )
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));
    
}

  
  