import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore'; 
import { db, PRODUCTS_COLLECTION } from '../servicios/firebase.js'; 
import { Spin, Alert, Card, Typography, Image, Button, Space, message } from 'antd';
import { RollbackOutlined, DollarOutlined } from '@ant-design/icons';
import ItemCount from './ItemCount.jsx'; 
import { useCart } from '../contexto/CartContext.jsx';

const { Title, Text, Paragraph } = Typography;

const ItemDetail = ({ item, onAdd }) => { 
    
    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return price.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        });
    };

    const imgSrc = item.imageUrl || item.img || `https://placehold.co/300x300/1C1C1C/FFFFFF?text=${item.name.substring(0, 1)}`;

    return (
        <Card 
            title={item.name} 
            variant="default"
            style={{ 
                maxWidth: 800, 
                margin: '40px auto', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                borderRadius: '12px' 
            }}
        >
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                    
                    <div style={{ flex: 1, minWidth: '250px', maxWidth: '300px' }}>
                        <Image
                            src={imgSrc}
                            alt={item.name}
                            style={{ borderRadius: '8px', width: '100%', height: 'auto', minHeight: '200px', objectFit: 'cover' }}
                            placeholder={<div style={{ height: '300px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Imagen...</div>}
                        />
                    </div>
                    
                    <div style={{ flex: 2, minWidth: '350px' }}>
                        <Title level={3} style={{ marginTop: 0 }}>
                            {item.name}
                        </Title>
                        
                        <Text strong style={{ color: '#FF4500', fontSize: '28px', display: 'block', marginBottom: '15px' }}>
                            {formatPrice(item.price)}
                        </Text>
                        
                        <Paragraph style={{ color: '#666', marginBottom: '20px' }}>
                            {item.description}
                        </Paragraph>

                        <Text type="secondary" style={{ display: 'block', marginBottom: '30px', fontSize: '14px' }}>
                            Categoría: <span style={{ fontWeight: 'bold', color: '#1C1C1C' }}>{item.category.toUpperCase()}</span>
                        </Text>
                        
                        <ItemCount 
                            initial={1} 
                            stock={item.stock} 
                            onAdd={onAdd}      
                            item={item}
                        />

                    </div>
                </div>
                <Link to="/">
                    <Button 
                        icon={<RollbackOutlined />} 
                        style={{ marginTop: '30px' }}
                    >
                        Volver al listado
                    </Button>
                </Link>
                
            </Space>
        </Card>
    );
};

const ItemDetailContainer = () => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qtyAdded, setQtyAdded] = useState(0); 

    const { addItem, getProductQuantity } = useCart();

    const { itemId } = useParams(); 
    const navigate = useNavigate();

    const handleOnAdd = (quantity) => {
        addItem(item, quantity);
        setQtyAdded(quantity);
    };


    useEffect(() => {
        if (!itemId || !db) {
            setLoading(false);
            if (!itemId) setError("ID de producto no especificado en la URL.");
            return;
        }

        setLoading(true);
        setItem(null);
        setError(null);
        
        const docRef = doc(db, PRODUCTS_COLLECTION, itemId);

        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const productData = {
                        id: docSnapshot.id,
                        ...docSnapshot.data()
                    };
                    setItem(productData);
                } else {
                    setError(`No se encontró ningún producto con ID: ${itemId}.`);
                }
            })
            .catch((err) => {
                console.error("Error al obtener el documento:", err);
                setError("Hubo un error al conectar con la base de datos.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [itemId]); 

    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Spin tip={`Cargando detalles de ${itemId}...`} size="large" />
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
                style={{ margin: '20px auto', maxWidth: '800px' }}
            />
        );
    }

    if (!item) {
         return (
            <Alert 
                message="Producto No Disponible" 
                description={`El producto con ID ${itemId} no se pudo cargar o no existe.`} 
                type="warning" 
                showIcon 
                style={{ margin: '20px auto', maxWidth: '800px' }}
            />
        );
    }

    return (
        <ItemDetail 
            item={item} 
            onGoBack={() => navigate(-1)} 
            onAdd={handleOnAdd} 
        />
    );
};

export default ItemDetailContainer;

