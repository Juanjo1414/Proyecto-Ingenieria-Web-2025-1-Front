import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

interface PurchaseItem {
    id: string;
    quantity: number;
    product: {
    name: string;
    };
}

interface Purchase {
    id: string;
    createdAt: string;
    items: PurchaseItem[];
}

const HistorialCliente = () => {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        apiClient.get('/user-purchases/mine')
            .then(res => setPurchases(res.data))
            .catch(err => console.error('Error al cargar historial de compras:', err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-pink-600">🧾 Historial de Compras</h1>
            {purchases.length === 0 ? (
                <p>No has realizado compras todavía.</p>
            ) : (
                <div className="space-y-4">
                    {purchases.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded shadow">
                            <h2 className="font-bold mb-1">Compra #{p.id.slice(0, 8)} — {new Date(p.createdAt).toLocaleDateString()}</h2>
                            <ul className="list-disc list-inside">
                                {p.items.map(item => (
                                    <li key={item.id}>
                                        {item.product.name} x {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialCliente;
