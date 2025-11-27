import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './contexto/CartContext.jsx'; 
import './index.css'; 
import { ConfigProvider } from 'antd'; 



const antdTheme = {
  token: {
    colorPrimary: '#FF4D4F', 
    colorInfo: '#FF4D4F',
    borderRadius: 8, 
  },
  components: {
    
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme}>
        <App />
    </ConfigProvider>
  </React.StrictMode>,
)