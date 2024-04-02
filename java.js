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



function carregarEstados() {
    fetch('municipios/estados.csv')
        .then(response => response.text())
        .then(data => {
            const estados = Papa.parse(data, { header: true }).data;
            const estadoSelect = document.getElementById('estado');
            estadoSelect.innerHTML = '<option value="" selected disabled>Escolher...</option>';
            estados.forEach(estado => {
                estadoSelect.innerHTML += `<option value="${estado.COD}">${estado.NOME}</option>`;
            });
        });
}

function carregarCidades(codEstado) {
    fetch('municipios/municipios.csv')
        .then(response => response.text())
        .then(data => {
            const cidades = Papa.parse(data, { header: true }).data;
            const cidadeSelect = document.getElementById('cidade');
            cidadeSelect.innerHTML = '<option value="" selected disabled>Escolher...</option>';
            const cidadesEstado = cidades.filter(cidade => cidade['COD UF'] === codEstado);
            cidadesEstado.forEach(cidade => {
                cidadeSelect.innerHTML += `<option value="${cidade.COD}">${cidade.NOME}</option>`;
            });
        });
}

function atualizarCidades() {
    const estadoSelect = document.getElementById('estado');
    const codEstadoSelecionado = estadoSelect.value;
    carregarCidades(codEstadoSelecionado);
}

// Biblioteca PapaParse para manipulação de CSV
// Certifique-se de incluir o script da biblioteca no seu HTML
// <script src="https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js"></script>

// Inicializar carregamento dos estados
carregarEstados();


var estados = {};
var municipios = {};

$(document).ready(function(){
    $.ajax({
        url: 'municipios/estados.csv',
        dataType: 'text',
        success: function(data){
            var lines = data.split(/\r\n|\n/);
            for(var i = 1; i < lines.length; i++){
                var parts = lines[i].split(',');
                var id = parts[0];
                var nome = parts[1];
                var sigla = parts[2];
                estados[nome.toUpperCase()] = { id: id, sigla: sigla };
            }
        }
    });

    $.ajax({
        url: 'municipios/municipios.csv',
        dataType: 'text',
        success: function(data){
            var lines = data.split(/\r\n|\n/);
            for(var i = 1; i < lines.length; i++){
                var parts = lines[i].split(',');
                var estadoId = parts[0];
                var municipioId = parts[1];
                var nome = parts[2];
                if(!municipios[estadoId]){
                    municipios[estadoId] = [];
                }
                municipios[estadoId].push({id: municipioId, nome: nome});
            }
        }
    });

    // Configurar o autocompletar para o campo de estado
    $('#estado').autocomplete({
        source: function(request, response) {
            var term = request.term.toUpperCase();
            var matches = Object.keys(estados).filter(function(key) {
                return key.indexOf(term) !== -1;
            });
            response(matches);
        },
        select: function(event, ui) {
            var estadoNome = ui.item.value;
            var estadoId = estados[estadoNome.toUpperCase()].id;
            var municipiosDoEstado = municipios[estadoId].map(function(municipio) { return municipio.nome; });
            $('#municipio').autocomplete({
                source: municipiosDoEstado
            });
        }
    });
});

