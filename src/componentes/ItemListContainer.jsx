import React, { useState, useEffect } from 'react';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db, PRODUCTS_COLLECTION, useUserAuth } from '../servicios/firebase.js'; 
import { Spin, Alert, Typography } from 'antd';
import ItemList from './ItemList.jsx';
import { useParams } from 'react-router-dom'; 

const { Title } = Typography;


const ItemListContainer = () => { 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { categoryId } = useParams(); 

    const { isAuthReady } = useUserAuth();

    useEffect(() => {

        if (!db) {
            console.error(" Firebase DB no inicializada.");
            return;
        }

        setLoading(true);
        setError(null);
        
        const collectionRef = collection(db, PRODUCTS_COLLECTION);
        
        const q = categoryId 
            ? query(collectionRef, where('category', '==', categoryId)) 
            : collectionRef; 

        getDocs(q)
            .then((snapshot) => {
                console.log(`Documentos encontrados: ${snapshot.size}`); 

                if (snapshot.empty) {
                    console.warn(`La consulta devolvió 0 resultados para el filtro: ${categoryId}`);
                    setError(`No se encontraron productos para la categoría: ${categoryId}.`);
                    setProducts([]);
                    return;
                }

                const productList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log(` Producto ID ${doc.id} con categoría DB: "${data.category}"`);
                    return {
                        id: doc.id,
                        ...data
                    };
                });
                setProducts(productList);
            })
            .catch((err) => {
                console.error("Error al obtener productos:", err);
                setError("Hubo un error al cargar los productos. Por favor, revisa la consola.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [categoryId]); 

    // renderizado 

    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Spin tip="Cargando productos..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert 
                message="Error de Carga" 
                description={error} 
                type="error" 
                showIcon 
                style={{ margin: '20px auto', maxWidth: '600px' }}
            />
        );
    }

    return (
        <div>
            <Title level={2} style={{ textAlign: 'center', margin: '20px 0', color: '#1C1C1C' }}>
                {categoryId ? `Productos - ${categoryId.toUpperCase()}` : 'TODOS NUESTROS PRODUCTOS'}
            </Title>
            
            <ItemList products={products} /> 
        </div>
    );
};

export default ItemListContainer;