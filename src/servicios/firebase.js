import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { useState, useEffect } from 'react'; 


const DEFAULT_PROJECT_ID = "gym-tense-e-commerce";
const dynamicAppId = typeof __app_id !== 'undefined' ? __app_id : DEFAULT_PROJECT_ID;

setLogLevel('Debug');

const yourFirebaseConfig = {
    apiKey: "AIzaSyB-QxUIunVr2mNbp92YbfzCOR2LiMola38",
    authDomain: "gym-tense-e-commerce.firebaseapp.com",
    projectId: "gym-tense-e-commerce",
    storageBucket: "gym-tense-e-commerce.firebasestorage.app",
    messagingSenderId: "926863960478",
    appId: "1:926863960478:web:709905c7634e5e23ca4e8f"
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