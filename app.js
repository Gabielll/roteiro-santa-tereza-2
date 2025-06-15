// Dados dos pontos turísticos com imagens reais
const pontosTuristicos = [
    {
        nome: "Parque das Ruínas",
        coordenadas: [-22.9112, -43.1875],
        descricao: "Comece o dia com uma das vistas mais lindas do Rio. Explore as ruínas de um antigo palacete que virou centro cultural.",
        entrada: "Gratuita",
        horario: "Domingo, 09:00 - 18:00",
        numero: 1,
        imagem: "https://pplx-res.cloudinary.com/image/upload/v1750000350/pplx_project_search_images/c13f3185622cb393d8f2fa34e55ceb5b420c3c66.jpg"
    },
    {
        nome: "Escadaria Selarón",
        coordenadas: [-22.9115, -43.1793],
        descricao: "Obra de arte a céu aberto do artista Jorge Selarón. Uma escadaria vibrante com azulejos do mundo todo.",
        entrada: "Gratuita",
        tempo: "10 min de caminhada",
        numero: 2,
        imagem: "https://pplx-res.cloudinary.com/image/upload/v1750000350/pplx_project_search_images/b2ea896b41bcf33ac12c83327814370b8ac9c1f4.jpg"
    },
    {
        nome: "Arcos da Lapa",
        coordenadas: [-22.9141, -43.1787],
        descricao: "Coração da boemia carioca. Admire o imponente Aqueduto Carioca, um dos cartões-postais mais famosos do Rio.",
        entrada: "Gratuita",
        tempo: "6 min de caminhada",
        numero: 3,
        imagem: "https://pplx-res.cloudinary.com/image/upload/v1750000349/pplx_project_search_images/3e349438dfdd14993f89f732cad141b342262239.jpg"
    }
];

// Variável global para o mapa
let mapa;
let marcadores = [];

// Função para inicializar o mapa
function inicializarMapa() {
    try {
        // Verificar se o elemento do mapa existe
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Elemento do mapa não encontrado');
            return;
        }

        // Criar o mapa centrado na região dos pontos
        mapa = L.map('map', {
            center: [-22.9125, -43.1820],
            zoom: 15,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Adicionar camada do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(mapa);

        // Adicionar marcadores para cada ponto
        pontosTuristicos.forEach((ponto, index) => {
            // Criar ícone personalizado numerado
            const iconePersonalizado = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-number">${ponto.numero}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            // Criar conteúdo do popup com imagem
            let popupContent = `
                <div class="popup-content">
                    <div class="popup-image">
                        <img src="${ponto.imagem}" alt="${ponto.nome}" class="popup-img" loading="lazy">
                    </div>
                    <h3>${ponto.nome}</h3>
                    <p>${ponto.descricao}</p>
                    <div class="popup-details">
                        <span><i class="fas fa-ticket-alt"></i> ${ponto.entrada}</span>
            `;

            if (ponto.horario) {
                popupContent += `<span><i class="fas fa-clock"></i> ${ponto.horario}</span>`;
            }

            if (ponto.tempo) {
                popupContent += `<span><i class="fas fa-walking"></i> ${ponto.tempo}</span>`;
            }

            popupContent += `
                    </div>
                </div>
            `;

            // Adicionar marcador ao mapa
            const marcador = L.marker(ponto.coordenadas, { icon: iconePersonalizado })
                .addTo(mapa)
                .bindPopup(popupContent, {
                    maxWidth: 320,
                    className: 'custom-popup'
                });

            marcadores.push(marcador);
        });

        // Adicionar linha conectando os pontos
        const coordenadas = pontosTuristicos.map(ponto => ponto.coordenadas);
        L.polyline(coordenadas, {
            color: '#ff6f61',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 5'
        }).addTo(mapa);

        // Ajustar o zoom para mostrar todos os pontos
        const grupo = new L.featureGroup(marcadores);
        mapa.fitBounds(grupo.getBounds().pad(0.1));

        // Garantir que o mapa seja redimensionado corretamente
        setTimeout(() => {
            mapa.invalidateSize();
        }, 250);

        console.log('Mapa inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
    }
}

// Função para scroll suave ao clicar no botão CTA
function configurarScrollSuave() {
    const botaoCTA = document.querySelector('.hero-cta');
    const secaoResumo = document.querySelector('.summary-section');

    if (botaoCTA && secaoResumo) {
        botaoCTA.addEventListener('click', (e) => {
            e.preventDefault();
            secaoResumo.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        console.log('Scroll suave configurado');
    } else {
        console.error('Elementos para scroll suave não encontrados');
    }
}

// Função para adicionar animações ao scroll
function configurarAnimacoesScroll() {
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos que devem animar
    const elementos = document.querySelectorAll('.summary-card, .transport-card, .food-card, .route-point, .food-hero');
    elementos.forEach(elemento => {
        observador.observe(elemento);
    });
}

// Função para adicionar efeitos hover nos cards
function configurarEfeitosInterativos() {
    // Adicionar efeito de tilt nos summary cards
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Adicionar efeito de pulso nos ícones dos pontos do roteiro
    const pointNumbers = document.querySelectorAll('.point-number');
    pointNumbers.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.style.transform = 'scale(1.1)';
            point.style.boxShadow = '0 6px 20px rgba(255, 111, 97, 0.4)';
        });
        
        point.addEventListener('mouseleave', () => {
            point.style.transform = 'scale(1)';
            point.style.boxShadow = '0 4px 15px rgba(255, 111, 97, 0.3)';
        });
    });
}

// Função para adicionar funcionalidade de clique nos pontos do roteiro
function configurarCliquesPontos() {
    const pontosRoteiro = document.querySelectorAll('.route-point');
    
    pontosRoteiro.forEach((ponto, index) => {
        ponto.addEventListener('click', () => {
            // Destacar o ponto clicado
            pontosRoteiro.forEach(p => p.classList.remove('active'));
            ponto.classList.add('active');
            
            // Centralizar o mapa no ponto selecionado
            if (mapa && pontosTuristicos[index] && marcadores[index]) {
                mapa.setView(pontosTuristicos[index].coordenadas, 17);
                
                // Abrir popup do marcador correspondente
                setTimeout(() => {
                    marcadores[index].openPopup();
                }, 300);
            }
        });
    });
}

// Função para mostrar/ocultar informações extras
function configurarToggles() {
    // Adicionar funcionalidade de expandir detalhes dos transport cards
    const transportCards = document.querySelectorAll('.transport-card');
    
    transportCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// Função para garantir carregamento correto das imagens
function configurarImagens() {
    const imagens = document.querySelectorAll('img');
    
    imagens.forEach(img => {
        // Configurar fallback para imagens que falharem ao carregar
        img.addEventListener('error', (e) => {
            console.warn('Falha ao carregar imagem:', e.target.src);
            e.target.style.display = 'none';
        });

        // Adicionar efeito de fade-in quando carregar
        img.addEventListener('load', (e) => {
            e.target.style.opacity = '1';
        });

        // Inicializar com opacidade 0 para efeito de fade-in
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
    });
}

// Função para detectar se o dispositivo é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para ajustar o layout para mobile
function ajustarLayoutMobile() {
    if (isMobile()) {
        // Reduzir altura do mapa em mobile
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.style.height = '300px';
        }
        
        // Ajustar zoom inicial do mapa para mobile
        if (mapa) {
            mapa.setZoom(14);
            // Forçar atualização do tamanho do mapa
            setTimeout(() => {
                mapa.invalidateSize();
            }, 100);
        }
    }
}

// Função para monitorar o redimensionamento do mapa
function configurarObservadorMapa() {
    if (!mapa) return;

    // Observer para detectar quando o mapa entra na viewport
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Forçar redimensionamento do mapa quando ele se torna visível
                setTimeout(() => {
                    if (mapa) {
                        mapa.invalidateSize();
                    }
                }, 100);
            }
        });
    }, {
        threshold: 0.1
    });

    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapObserver.observe(mapElement);
    }
}

// Função principal de inicialização
function inicializar() {
    console.log('Iniciando aplicação...');

    // Aguardar o DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
        return;
    }

    // Configurar funcionalidades básicas primeiro
    configurarScrollSuave();
    configurarImagens();

    // Inicializar o mapa após um pequeno delay para garantir que tudo esteja carregado
    setTimeout(() => {
        inicializarMapa();
        configurarObservadorMapa();
        ajustarLayoutMobile();
    }, 500);

    // Configurar outras funcionalidades
    setTimeout(() => {
        configurarAnimacoesScroll();
        configurarEfeitosInterativos();
        configurarCliquesPontos();
        configurarToggles();
    }, 1000);

    // Listener para redimensionamento da janela
    window.addEventListener('resize', () => {
        ajustarLayoutMobile();
        if (mapa) {
            setTimeout(() => {
                mapa.invalidateSize();
            }, 250);
        }
    });

    // Listener para scroll que pode afetar o mapa
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (mapa) {
                mapa.invalidateSize();
            }
        }, 150);
    });

    console.log('Aplicação inicializada');
}

// Adicionar estilos CSS personalizados para os marcadores e popups
const estilosPersonalizados = `
<style>
.custom-marker {
    background: none;
    border: none;
}

.marker-number {
    background: linear-gradient(135deg, #ff6f61, #ff8a50);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(255, 111, 97, 0.4);
    border: 3px solid white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.marker-number:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 111, 97, 0.6);
}

.custom-popup .leaflet-popup-content-wrapper {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: none;
    padding: 0;
    overflow: hidden;
    max-width: 320px;
}

.custom-popup .leaflet-popup-tip {
    background: white;
}

.popup-content {
    overflow: hidden;
}

.popup-image {
    width: 100%;
    height: 120px;
    overflow: hidden;
    margin-bottom: 12px;
}

.popup-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.popup-content h3 {
    margin: 0 16px 8px 16px;
    color: #ff6f61;
    font-size: 18px;
    font-weight: 600;
}

.popup-content p {
    margin: 0 16px 12px 16px;
    color: #626c71;
    line-height: 1.5;
    font-size: 14px;
}

.popup-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px 16px 16px;
}

.popup-details span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #626c71;
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 20px;
}

.popup-details i {
    color: #ff6f61;
}

.route-point.active {
    background: linear-gradient(135deg, #fff8f0, #ffffff);
    border-left: 5px solid #ff6f61;
    transform: translateX(5px);
}

.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.transport-card.expanded {
    transform: scale(1.02);
}

/* Garantir que o mapa seja sempre visível */
#map {
    min-height: 400px !important;
    width: 100% !important;
    z-index: 1;
    position: relative;
}

.map-container {
    position: relative;
    overflow: hidden;
}

/* Melhorias visuais para mobile */
@media (max-width: 768px) {
    .popup-content {
        max-width: 280px;
    }
    
    .popup-image {
        height: 100px;
    }
    
    .marker-number {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }
    
    .custom-popup .leaflet-popup-content-wrapper {
        max-width: 300px;
    }

    #map {
        min-height: 300px !important;
    }
}

/* Fix para problemas de carregamento de imagem */
img {
    max-width: 100%;
    height: auto;
}

.point-img, .food-hero-img {
    transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
}

/* Evitar problemas de overflow no mapa */
.leaflet-container {
    background: #f8f9fa;
}
</style>
`;

// Adicionar estilos ao head
document.head.insertAdjacentHTML('beforeend', estilosPersonalizados);

// Inicializar quando o script for carregado
inicializar();