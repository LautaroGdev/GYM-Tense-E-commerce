import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { useState, useEffect } from 'react'; 


const DEFAULT_PROJECT_ID = "gym-tense-e-commerce";
const dynamicAppId = typeof __app_id !== 'undefined' ? __app_id : DEFAULT_PROJECT_ID;

setLogLevel('Debug');

const yourFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};


const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : yourFirebaseConfig;

// inicializar la app y servicios
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);    

//rutas
export const PRODUCTS_COLLECTION = `artifacts/${dynamicAppId}/public/data-root/data/products-container/products`;
export const ORDERS_COLLECTION = `artifacts/${dynamicAppId}/public/data/orders`;
//manejar la autenticación del usuario
export const useUserAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        // funcion para la autenticacion
        const initAuth = async () => {
            let initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase Auth Error:", error);
            }
        };

        //ej inicialización
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
        });

        //limpieza al desmontar el componente
        return () => unsubscribe();
    }, []);

    return { userId, isAuthReady };
};