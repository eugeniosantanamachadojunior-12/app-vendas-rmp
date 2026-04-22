const axios = require('axios');

const ML_TOKEN = process.env.ML_TOKEN;

// 🔎 buscar pedidos
async function getOrders() {
    const response = await axios.get(
        'https://api.mercadolibre.com/orders/search?seller=me',
        {
            headers: {
                Authorization: `Bearer ${ML_TOKEN}`
            }
        }
    );

    return response.data.results || [];
}

// 🔎 buscar cnpj
async function buscarCNPJ(nome) {
    try {
        const res = await axios.get(
            `https://api-publica.speedio.com.br/buscarcnpj?nome=${encodeURIComponent(nome)}`
        );
        return res.data;
    } catch {
        return null;
    }
}

// 🔎 verificar duplicado
async function clienteExiste(nome) {
    try {
        const res = await axios.get('https://app-vendas-rmp.onrender.com/clientes');
        return res.data.some(c => c.nome.toLowerCase() === nome.toLowerCase());
    } catch {
        return false;
    }
}

// 🚀 função principal
async function sincronizarClientesML() {
    console.log('🔄 Sync ML iniciado...');

    const orders = await getOrders();

    for (const order of orders) {
        const comprador = order.buyer;
        if (!comprador) continue;

        const dados = await buscarCNPJ(comprador.nickname);

        if (!dados || !dados.CNPJ) continue;

        const cliente = {
            nome: comprador.nickname,
            telefone: comprador.phone?.number || '',
            email: '',
            cpfCnpj: dados.CNPJ
        };

        if (!(await clienteExiste(cliente.nome))) {
            await axios.post(
                'https://app-vendas-rmp.onrender.com/clientes',
                cliente
            );

            console.log('✅ Cliente enviado:', cliente.nome);
        }
    }

    console.log('✅ Sync finalizado');
}

module.exports = { sincronizarClientesML };