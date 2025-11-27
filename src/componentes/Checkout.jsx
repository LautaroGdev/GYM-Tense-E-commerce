import React from 'react';
import { Card, Typography, Button, Result, Spin, Divider, Form, Input, message } from 'antd';
import { UserOutlined, MailOutlined, HomeOutlined, ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCart } from '../contexto/CartContext'; 
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore'; 
const db = window.db;

const { Title, Text } = Typography;

const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const navigate = useNavigate();

    if (cart.length === 0 && !orderId) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Result
                    status="info"
                    title="No hay productos en el carrito para finalizar la compra"
                    subTitle="Vuelve al inicio para comenzar a comprar."
                    extra={
                        <Button 
                            type="primary" 
                            onClick={() => navigate('/')}
                            style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                        >
                            Ver Productos
                        </Button>
                    }
                />
            </div>
        );
    }

    //crear la orden en Firestore
    const createOrder = async (values) => {
        setLoading(true);
        try {
            
            const order = {
                buyer: {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    address: values.address,
                },
                
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: totalPrice,
                date: Timestamp.fromDate(new Date()),
                status: 'generated', 
            };

            
            const ordersCollection = collection(db, 'artifacts', window.__app_id, 'public', 'data', 'orders');
            const docRef = await addDoc(ordersCollection, order);
            
            
            clearCart();
            setOrderId(docRef.id);
            message.success(`Tu orden ${docRef.id} fue generada con éxito.`);

        } catch (error) {
            console.error("Error al crear la orden:", error);
            message.error("Hubo un error al procesar tu compra. Inténtalo de nuevo. Revisa la consola para detalles.");
        } finally {
            setLoading(false);
        }
    };

    
    if (orderId) {
        return (
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <Result
                    status="success"
                    title="¡Compra Finalizada con Éxito!"
                    subTitle={`Tu número de orden es: ${orderId}. Recibirás un correo electrónico de confirmación en breve.`}
                    extra={[
                        <Button 
                            type="primary" 
                            key="home" 
                            onClick={() => navigate('/')}
                            style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                        >
                            Volver al Inicio
                        </Button>
                    ]}
                />
            </div>
        );
    }

    // formulario de Checkout (si el carrito tiene items)
    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
            <Title level={2} style={{ color: '#1C1C1C', marginBottom: 30, textAlign: 'center' }}>
                Finalizar Compra
            </Title>
            
            <Card 
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
                loading={loading}
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        Total a Pagar: <Text strong style={{ color: '#FF4500' }}>{totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</Text>
                    </Title>
                }
            >
                <Spin spinning={loading} tip="Procesando tu orden...">
                    <Title level={5} style={{ marginTop: 0 }}>Datos del Comprador</Title>
                    <Form
                        name="checkout_form"
                        layout="vertical"
                        onFinish={createOrder}
                        autoComplete="off"
                    >
                        
                        <Form.Item
                            name="name"
                            label="Nombre Completo"
                            rules={[{ required: true, message: 'Por favor, ingresa tu nombre completo' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Ej: Lautaro Gómez" />
                        </Form.Item>

                        
                        <Form.Item
                            name="phone"
                            label="Teléfono"
                            rules={[{ required: true, message: 'Por favor, ingresa tu teléfono' }]}
                        >
                            <Input placeholder="Ej: +54 9 11 5555-5555" />
                        </Form.Item>

                        
                        <Form.Item
                            name="email"
                            label="Correo Electrónico"
                            rules={[
                                { required: true, message: 'Por favor, ingresa tu email' },
                                { type: 'email', message: 'El formato de email no es válido' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="ejemplo@correo.com" />
                        </Form.Item>

                        
                        <Form.Item
                            name="address"
                            label="Dirección de Envío"
                            rules={[{ required: true, message: 'Por favor, ingresa una dirección de envío' }]}
                        >
                            <Input prefix={<HomeOutlined />} placeholder="Calle, número, ciudad, código postal" />
                        </Form.Item>

                        <Divider />
                        
                        
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                size="large" 
                                block 
                                icon={<CheckCircleOutlined />}
                                style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                                disabled={cart.length === 0 || loading}
                            >
                                Confirmar Compra
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default Checkout;