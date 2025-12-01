import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Result, Spin, Divider, Form, Input, message } from 'antd';
import { UserOutlined, MailOutlined, HomeOutlined, CheckCircleOutlined, PhoneOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../contexto/CartContext'; 
import { useNavigate } from 'react-router-dom';
import { 
    collection, 
    serverTimestamp, 
    writeBatch, 
    doc, 
    getDocs, 
    query, 
    where,
    documentId 
} from 'firebase/firestore'; 

//imports db
import { db, PRODUCTS_COLLECTION, ORDERS_COLLECTION } from '../servicios/firebase.js'; 
import { useUserAuth } from '../servicios/firebase.js';

const { Title, Text } = Typography;

const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    
    // tomo el id
    const { userId } = useUserAuth();

    // redireccion
    useEffect(() => {
        if (cart.length === 0 && !orderId) {
             const timeout = setTimeout(() => navigate('/'), 500);
             return () => clearTimeout(timeout);
        }
    }, [cart, orderId, navigate]);

    // funcion principal para crear orden y actualizar stock
    const handleSubmit = async (values) => {
        if (cart.length === 0) return;
        if (!db) { message.error('Error: Conexión a la base de datos no disponible.'); return; }

        setLoading(true);

        try {
            //datos de la orden
            const order = {
                buyer: values, // datos formulario 
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: totalPrice,
                date: serverTimestamp(), // fecha exacta del servidor de firestore
                status: 'generada',
                userId: userId, // id del usuario que compra
            };

            // init batch y consultar s tock
            const batch = writeBatch(db);
            const productsRef = collection(db, PRODUCTS_COLLECTION);
            const outOfStock = [];

            const ids = cart.map(item => item.id);
            
            // 
            const productsQuery = query(productsRef, where(documentId(), 'in', ids));
            const querySnapshot = await getDocs(productsQuery);
            
            // check stock y preparar actualizaciones
            querySnapshot.docs.forEach(docSnapshot => {
                const productData = docSnapshot.data();
                const stockDb = productData.stock;

                const productInCart = cart.find(item => item.id === docSnapshot.id);
                const prodQuantity = productInCart?.quantity;

                if (stockDb >= prodQuantity) {
                    batch.update(docSnapshot.ref, { stock: stockDb - prodQuantity });
                } else {
                    outOfStock.push({ id: docSnapshot.id, name: productData.name, available: stockDb });
                }
            })

            if (outOfStock.length === 0) {
                const ordersRef = collection(db, ORDERS_COLLECTION);
                const newOrderRef = doc(ordersRef); 
                
                batch.set(newOrderRef, order); 

                await batch.commit();

                setOrderId(newOrderRef.id);
                clearCart();
                message.success("¡Orden generada con éxito!");
            } else {
                //error si falta stock
                const outOfStockNames = outOfStock.map(i => `${i.name} (Disp: ${i.available})`).join(', ');
                message.error(`Stock insuficiente: ${outOfStockNames}`);
            }

        } catch (error) {
            console.error("Error al procesar la orden o stock:", error);
            message.error("Error en el servidor al procesar la compra.");
        } finally {
            setLoading(false);
        }
    };

    // vista de orden finalizada
    if (orderId) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <Result
                    status="success"
                    title="¡Orden Generada!"
                    subTitle={
                        <span>
                            Tu ID de compra es: <Text copyable strong>{orderId}</Text>
                            <br />
                            Guárdalo para el seguimiento. Gracias por tu compra.
                        </span>
                    }
                    extra={[
                        <Button type="primary" key="console" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />} style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}>
                            Volver a la Tienda
                        </Button>,
                    ]}
                />
            </div>
        );
    }
    
    // vista de formulario
    if (cart.length === 0) return <div style={{textAlign:'center', padding: 50}}><Spin tip="Redirigiendo..." /></div>;

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
            <Card 
                title={<Title level={3} style={{ margin: 0, textAlign: 'center' }}>Finalizar Compra</Title>}
                bordered={false} 
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            >
                <Title level={5}>Resumen</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text>Total a pagar:</Text>
                    <Text strong style={{ fontSize: '1.2em', color: '#FF4500' }}>
                        {totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </Text>
                </div>
                <Divider />
                
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Nombre Completo" rules={[{ required: true, message: 'Ingresa tu nombre' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Ej: Lautaro Gómez" />
                    </Form.Item>
                    
                    <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Ingresa tu teléfono' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Ej: 11 5555 5555" />
                    </Form.Item>
                    
                    <Form.Item 
                        name="email" 
                        label="Email" 
                        rules={[
                            { required: true, message: 'Ingresa tu email' },
                            { type: 'email', message: 'Email inválido' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="juan@email.com" />
                    </Form.Item>
                    
                    <Form.Item 
                        name="emailConfirm" 
                        label="Confirmar Email" 
                        dependencies={['email']}
                        rules={[
                            { required: true, message: 'Confirma tu email' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('email') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Los emails no coinciden'));
                                },
                            }),
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Repite tu email" />
                    </Form.Item>
                    
                    <Form.Item name="address" label="Dirección de Envío" rules={[{ required: true, message: 'Ingresa tu dirección' }]}>
                        <Input prefix={<HomeOutlined />} placeholder="Calle, Altura, Ciudad" />
                    </Form.Item>
                    
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        block 
                        loading={loading} 
                        icon={<CheckCircleOutlined />} 
                        size="large" 
                        style={{ backgroundColor: '#FF4500', borderColor: '#FF4500', marginTop: 10 }}
                    >
                        Generar Orden
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Checkout;