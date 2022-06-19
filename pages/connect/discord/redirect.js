import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import AppContext from '../../../components/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const Redirect = (props) => {
  const router = useRouter();
  const appContext = useContext( AppContext );

  useEffect(() => {
    // Successfully logged with the provider
    // Now logging with strapi by using the access_token (given by the provider) in props.location.search
    let status = 200;
    fetch(`${API_URL}/auth/discord/callback${ window.location.search }`)
      .then(res => { status = res.status; return res.json(); })
      .then(res => {
        if (status !== 200) {
            appContext.setUser( null );
            appContext.setIsAuthenticated( false );
            let message = res?.message?.[0]?.messages?.[0];
            message = message?.message ?? message?.id;
            appContext.setNotification( {
                color: 'danger',
                message: 'Error registering user: ' + message
            } );
            setTimeout( () => appContext.setNotification( null ), 3000 );
            return;
        }

        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('username', res.user.username);
        console.log( res.user );
        appContext.setUser( res.user );
        appContext.setIsAuthenticated( true );
        appContext.setNotification( {
            color: 'success',
            message: 'Registration successful'
        } );
        setTimeout(() => appContext.setNotification( null ), 3000);
        router.push('/');
      })
      .catch(err => {
        console.error(err);
      });
  }, [router]);

  return <></>
};

export default Redirect;
