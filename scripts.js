document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector(".main-nav-container");
    const header = document.querySelector("header");
    const mainContent = document.querySelector("main");
    
    // Guarda a posição original do menu
    const originalNavPosition = nav.offsetTop;
    let isFixed = false;

    window.addEventListener("scroll", function() {
        const scrollPosition = window.scrollY;
        const headerHeight = header.offsetHeight;
        
        if (scrollPosition >= originalNavPosition - headerHeight && !isFixed) {
            // Fixa o menu
            nav.classList.add("fixed-nav");
            mainContent.style.paddingTop = nav.offsetHeight + "px";
            isFixed = true;
        } 
        else if (scrollPosition < originalNavPosition - headerHeight && isFixed) {
            // Retorna o menu ao lugar original
            nav.classList.remove("fixed-nav");
            mainContent.style.paddingTop = "0";
            isFixed = false;
        }
    });


    // O restante do seu JavaScript original continua aqui...
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        
                        lazyImage.onload = () => {
                            lazyImage.style.opacity = 1;
                        };
                        
                        imageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '100px 0px'
            });

            lazyImages.forEach(lazyImage => {
                imageObserver.observe(lazyImage);
            });
        } else {
            lazyImages.forEach(lazyImage => {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
            });
        }
    }

    // Configuração dos Event Listeners
    function setupEventListeners() {
        // Filtros de categoria
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                filterCards(category);
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Barra de pesquisa
        document.querySelector('.bnt-env').addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            searchCards(searchTerm);
        });

        // Botão de login
        document.querySelector('.bnt-login').addEventListener('click', showLoginModal);
        
        // Aplica eventos aos cards existentes
        setupCardsEvents();
    }

    // Configura eventos para todos os cards
    function setupCardsEvents() {
        document.querySelectorAll('.card').forEach(card => {
            // Botão Curtir com efeito de pulsar
            const likeBtn = card.querySelector('.btn-like');
            if (likeBtn && !likeBtn.dataset.listenerAdded) {
                likeBtn.addEventListener('click', function() {
                    this.classList.toggle('liked');
                    this.textContent = this.classList.contains('liked') ? '❤️ Curtido' : '❤️ Curtir';
                    
                    // Reset e aplica animação
                    this.style.animation = 'none';
                    void this.offsetWidth;
                    this.style.animation = 'pulse 0.4s ease';
                });
                likeBtn.dataset.listenerAdded = "true";
            }
            
            // Botão Favoritar com efeito de estrela
            const favBtn = card.querySelector('.btn-favorite');
            if (favBtn && !favBtn.dataset.listenerAdded) {
                favBtn.addEventListener('click', function() {
                    const isFavorited = this.classList.toggle('favorited');
                    this.textContent = isFavorited ? '⭐ Favoritado' : '⭐ Favoritar';
                    
                    // Efeito de pulsar
                    this.style.animation = 'none';
                    void this.offsetWidth;
                    this.style.animation = 'pulse 0.4s ease';
                    
                    // Cria elemento para efeito da estrela
                    if (isFavorited) {
                        const star = document.createElement('div');
                        star.className = 'star-explosion';
                        this.appendChild(star);
                        setTimeout(() => star.remove(), 600);
                    }
                });
                favBtn.dataset.listenerAdded = "true";
                favBtn.style.position = 'relative';
                favBtn.style.overflow = 'hidden';
            }
            
            // Imagem clicável
            const cardImg = card.querySelector('.card-img');
            if (cardImg && !cardImg.dataset.listenerAdded) {
                cardImg.style.display = 'block';
                cardImg.style.opacity = '1';
                
                cardImg.addEventListener('click', function() {
                    const overlay = document.createElement('div');
                    overlay.className = 'image-overlay';
                    overlay.innerHTML = `
                        <div class="overlay-content">
                            <img src="${this.src}" alt="${this.alt}">
                            <span class="close-overlay">&times;</span>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                    
                    overlay.querySelector('.close-overlay').addEventListener('click', () => overlay.remove());
                    overlay.addEventListener('click', (e) => e.target === overlay && overlay.remove());
                });
                cardImg.dataset.listenerAdded = "true";
            }

            // Sistema de avaliação
            const ratingElement = card.querySelector('.rating');
            if (ratingElement && !ratingElement.dataset.listenerAdded) {
                setupRating(ratingElement);
                ratingElement.dataset.listenerAdded = "true";
            }
        });
    }

    // Funções de Filtro e Busca
    function filterCards(category) {
        document.querySelectorAll('.card').forEach(card => {
            if (category === 'todos' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function searchCards(term) {
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (term === '' || title.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Modal de Login
    function showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Login</h2>
                <form id="login-form">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Senha" required>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => e.target === modal && modal.remove());
        
        document.getElementById('login-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login realizado com sucesso!');
            modal.remove();
            document.querySelector('.bnt-login').textContent = 'Minha Conta';
        });
    }

    // Sistema de Avaliação
    function setupRating(ratingElement) {
        if (!ratingElement || ratingElement.dataset.ratingSetup) return;
        ratingElement.dataset.ratingSetup = "true";
        
        const ratingValue = parseFloat(ratingElement.dataset.rating);
        ratingElement.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = i <= ratingValue ? '★' : '☆';
            star.style.cursor = 'pointer';
            star.style.color = i <= ratingValue ? '#1a5276' : '#3498db';
            star.addEventListener('click', () => {
                const newRating = i;
                alert(`Você avaliou com ${newRating} estrelas!`);
                updateRatingStars(ratingElement, newRating);
            });
            ratingElement.appendChild(star);
        }
        
        const ratingText = document.createElement('span');
        ratingText.textContent = ' ' + ratingValue;
        ratingText.style.marginLeft = '5px';
        ratingText.style.color = '#333';
        ratingElement.appendChild(ratingText);
    }

    function updateRatingStars(ratingElement, newRating) {
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.textContent = (index + 1) <= newRating ? '★' : '☆';
            star.style.color = (index + 1) <= newRating ? '#1a5276' : '#3498db';
        });
        ratingElement.querySelector('span:last-child').textContent = ' ' + newRating;
    }

    // Inicialização
    setupLazyLoading();
    setupEventListeners();
    document.querySelectorAll('.rating').forEach(rating => {
        setupRating(rating);
    });
    function showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2 class="modal-title">Login</h2>
                <form class="modal-form">
                    <input type="email" placeholder="Seu e-mail" required>
                    <input type="password" placeholder="Sua senha" required>
                    <button type="submit" class="modal-submit">Entrar</button>
                </form>
                <div class="modal-footer">
                    Não tem conta? <a href="#">Cadastre-se</a>
                </div>
            </div>
        `;
    
        document.body.appendChild(modal);
        
        // Fechar modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Submit do formulário
        modal.querySelector('.modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            modal.remove();
            document.querySelector('.bnt-login').textContent = 'Minha Conta';
        });
        
        // Prevenir fechamento ao clicar no conteúdo
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});