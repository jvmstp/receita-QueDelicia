function selectTab(event, tabId) {
    event.preventDefault(); // Previne o comportamento padrão do link
    
    // Remove a classe 'active' de todos os itens do menu
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    // Adiciona a classe 'active' apenas ao item clicado
    event.target.parentElement.classList.add('active');
    
    // Redireciona para a página correspondente
    window.location.href = event.target.href;
}

// Marcar a aba correta ao carregar a página
document.addEventListener("DOMContentLoaded", function(event) {
    var currentPath = window.location.pathname.split('/').pop();
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        if(link.getAttribute('href') === currentPath) {
            link.parentElement.classList.add('active');
        }
    });
});
