
const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');

let MyChart = null;

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const inputValue = document.querySelector('.product-input').value.trim();

    if (!inputValue) {
        productList.innerHTML = '<p>Digite um produto para pesquisar!</p>';
        return;
    }

    try {
        productList.innerHTML = '<p>Carregando produtos...</p>';

        const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(inputValue)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.products || data.products.length === 0) {
            productList.innerHTML = '<p>Nenhum produto encontrado!</p>';

            if (MyChart) {
                MyChart.destroy();
                MyChart = null;
            }

            return;
        }

        displayItems(data.products);

        updatePriceChart(data.products);

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);

        productList.innerHTML = '<p>Erro ao carregar os produtos!</p>';
    }
});


function displayItems(products) {

    productList.innerHTML = products.map(product => `
        <div class="product-card">

            <img src="${product.thumbnail}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p>
                ${product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
            </p>

            <p>Marca: ${product.brand || 'Não informado'}</p>

        </div>
    `).join('');
}


function updatePriceChart(products) {

    const ctx = priceChart.getContext('2d');

    if (MyChart) {
        MyChart.destroy();
    }

    MyChart = new Chart(ctx, {

        type: 'bar',

        data: {
            labels: products.map(product =>
                product.title.substring(0, 20)
            ),

            datasets: [{
                label: 'Preço (R$)',

                data: products.map(product => product.price),

                backgroundColor: 'rgba(46, 204, 113, 0.6)',

                borderColor: 'rgba(46, 204, 113, 1)',

                borderWidth: 1
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                },

                title: {
                    display: true,
                    text: 'Gráfico de Preços',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },

            scales: {

                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            });
                        }
                    }
                }
            }
        }
    });
}
