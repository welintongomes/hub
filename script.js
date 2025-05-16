// Versão corrigida da classe CodeSearchManager
class CodeSearchManager {
    constructor(textareaId) {
        this.textarea = document.getElementById(textareaId);
        this.searchInput = document.getElementById('code-search-input');
        this.resultsCount = document.getElementById('search-results-count');
        this.prevBtn = document.getElementById('search-prev-btn');
        this.nextBtn = document.getElementById('search-next-btn');

        this.matches = [];
        this.currentMatchIndex = -1;
        this.savedSelection = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.performSearch());

        // Impede que o clique nos botões de navegação tire o foco do input de pesquisa
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão
            this.navigateToMatch(-1);
            this.searchInput.focus(); // Mantém o foco no campo de pesquisa
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão
            this.navigateToMatch(1);
            this.searchInput.focus(); // Mantém o foco no campo de pesquisa
        });

        // Atalhos de teclado melhorados
        this.searchInput.addEventListener('keydown', (e) => {
            // Impede que Enter ou Shift+Enter enviem o formulário
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();

                if (e.shiftKey) {
                    this.navigateToMatch(-1);
                } else {
                    this.navigateToMatch(1);
                }
            }

            // Impede que setas para cima e para baixo mudem o foco
            else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();

                if (e.key === 'ArrowUp') {
                    this.navigateToMatch(-1);
                } else {
                    this.navigateToMatch(1);
                }
            }
        });

        // Salva a posição do cursor no textarea quando o usuário clica nele
        this.textarea.addEventListener('mouseup', () => {
            this.savedSelection = {
                start: this.textarea.selectionStart,
                end: this.textarea.selectionEnd
            };
        });

        // Salva a posição quando o usuário digita
        this.textarea.addEventListener('keyup', () => {
            this.savedSelection = {
                start: this.textarea.selectionStart,
                end: this.textarea.selectionEnd
            };
        });
    }

    performSearch() {
        const searchTerm = this.searchInput.value;
        const codeText = this.textarea.value;

        // Limpar highlights anteriores
        this.clearHighlights();

        if (!searchTerm) {
            this.matches = [];
            this.currentMatchIndex = -1;
            this.updateResultsCount();

            // Restaura a seleção anterior se existir
            if (this.savedSelection) {
                this.textarea.focus();
                this.textarea.setSelectionRange(
                    this.savedSelection.start,
                    this.savedSelection.end
                );
            }

            return;
        }

        // Encontrar todas as ocorrências
        this.matches = this.findAllMatches(codeText, searchTerm);
        this.currentMatchIndex = this.matches.length > 0 ? 0 : -1;
        this.updateResultsCount();

        // Destacar todas as ocorrências
        if (this.matches.length > 0) {
            this.highlightMatches();
            // NÃO chama scrollToCurrentMatch() aqui para evitar roubar o foco
        }
    }

    findAllMatches(text, searchTerm) {
        const matches = [];
        searchTerm = searchTerm.toLowerCase();
        let pos = 0;
        let lastIndex = 0;

        // Procurar case-insensitive
        const textLower = text.toLowerCase();
        while ((pos = textLower.indexOf(searchTerm, lastIndex)) !== -1) {
            matches.push({
                start: pos,
                end: pos + searchTerm.length,
                text: text.substring(pos, pos + searchTerm.length)
            });
            lastIndex = pos + 1;
        }

        return matches;
    }

    clearHighlights() {
        // Para textarea simples, apenas resetamos a seleção se necessário
        // Não fazemos nada aqui para evitar tirar o foco
    }

    highlightMatches() {
        if (this.matches.length > 0) {
            // Para o textarea simples, vamos apenas destacar o match atual
            const match = this.matches[this.currentMatchIndex];

            // Seleciona o texto sem tirar o foco do input de pesquisa
            this.selectTextWithoutFocus(match.start, match.end);
        }
    }

    selectTextWithoutFocus(start, end) {
        // Armazena o elemento que tem o foco atualmente
        const activeElement = document.activeElement;

        // Foca no textarea brevemente para fazer a seleção
        this.textarea.focus();
        this.textarea.setSelectionRange(start, end);

        // Faz o textarea visível na visualização
        this.scrollToSelection();

        // Devolve o foco ao elemento anterior (provavelmente o input de pesquisa)
        if (activeElement && activeElement !== this.textarea) {
            setTimeout(() => {
                activeElement.focus();
            }, 0);
        }
    }

    scrollToSelection() {
        const textareaRect = this.textarea.getBoundingClientRect();
        const lineHeight = parseInt(window.getComputedStyle(this.textarea).lineHeight) || 18;

        // Cálculo básico para posicionar a seleção visível
        const selectionPosition = this.getSelectionPosition();
        if (selectionPosition) {
            this.textarea.scrollTop = selectionPosition - textareaRect.height / 2 + lineHeight;
        }
    }

    getSelectionPosition() {
        // Simplificando, estimamos a posição com base no texto anterior
        if (this.currentMatchIndex < 0 || !this.matches.length) return null;

        const match = this.matches[this.currentMatchIndex];
        const textBeforeMatch = this.textarea.value.substring(0, match.start);
        const lines = textBeforeMatch.split('\n');

        // Estimativa básica com base no número de linhas
        return lines.length * 18; // 18px é uma estimativa de altura de linha
    }

    scrollToCurrentMatch() {
        // Implementação simplificada substituída pelo selectTextWithoutFocus
        // para controle mais preciso do foco
    }

    navigateToMatch(direction) {
        if (this.matches.length === 0) return;

        this.currentMatchIndex += direction;

        // Circular navigation
        if (this.currentMatchIndex < 0) {
            this.currentMatchIndex = this.matches.length - 1;
        } else if (this.currentMatchIndex >= this.matches.length) {
            this.currentMatchIndex = 0;
        }

        this.updateResultsCount();
        this.highlightMatches();
    }

    updateResultsCount() {
        if (this.matches.length === 0) {
            this.resultsCount.textContent = '0/0';
        } else {
            this.resultsCount.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`;
        }
    }
}
// Classe para gerenciar as ferramentas
class ToolsManager {
    // 1. Adicione este método à classe ToolsManager para detectar duplo clique/toque
    handleDoubleClick() {
        // Primeiro exibe a ferramenta e depois ativa o modo tela cheia
        if (this.currentToolId) {
            // Se já estiver exibindo a ferramenta atual, apenas ativa o modo tela cheia
            this.toggleFullscreen();
        }
    }

    // Adicione estes métodos à classe ToolsManager
    // Função para atualizar a visibilidade dos botões e título
    updateToolControlsVisibility() {
        const toolControls = document.querySelectorAll('.tool-control-btn');
        const toolTitle = document.getElementById('tool-title');

        // Se uma ferramenta estiver selecionada, mostre os controles
        if (this.currentToolId) {
            toolControls.forEach(btn => btn.style.display = 'inline-block');
            if (toolTitle) toolTitle.style.display = 'block';
        } else {
            // Caso contrário, oculte os controles
            toolControls.forEach(btn => btn.style.display = 'none');
            if (toolTitle) toolTitle.style.display = 'none';
        }
    }
    // Método para resetar para as ferramentas padrão
    resetToDefaultTools() {
        if (confirm('Isso irá substituir todas as suas ferramentas pelas ferramentas padrão. Deseja continuar?')) {
            const defaultTools = this.getDefaultTools();
            this.tools = [...defaultTools];
            this.saveTools();
            this.renderToolsList();

            // Reset da ferramenta atual
            this.currentToolId = null;
            document.getElementById('welcome-message').style.display = 'block';
            document.getElementById('tool-view').style.display = 'none';
            this.updateToolControlsVisibility();

            alert('Ferramentas redefinidas para o padrão com sucesso!');
        }
    }
    // Adicione este método à classe ToolsManager
    getDefaultTools() {
        // Retorna um array com ferramentas predefinidas
        return [
            {
                id: 'default-notes',
                title: 'Bloco de Notas',
                code: `<!DOCTYPE html>
<html>
<head>
    <title>Bloco de Notas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .controls {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #45a049;
        }
        textarea {
            width: 100%;
            height: 100%;
            padding: 15px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: none;
            font-size: 16px;
            line-height: 1.5;
            flex-grow: 1;
        }
        .status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Bloco de Notas</h1>
    
    <div class="controls">
        <button onclick="saveNote()">Salvar</button>
        <button onclick="clearNote()">Limpar</button>
        <button onclick="downloadNote()">Baixar</button>
    </div>
    
    <textarea id="notepad" placeholder="Digite seu texto aqui..."></textarea>
    
    <div class="status">
        <span id="character-count">0 caracteres</span> | 
        <span id="word-count">0 palavras</span> |
        <span id="auto-save-status">Autosalvo há 0s</span>
    </div>

    <script>
        const notepad = document.getElementById('notepad');
        const characterCount = document.getElementById('character-count');
        const wordCount = document.getElementById('word-count');
        const autoSaveStatus = document.getElementById('auto-save-status');
        
        let lastSaved = Date.now();
        let autoSaveInterval;
        
        // Carrega nota salva quando a página carregar
        document.addEventListener('DOMContentLoaded', () => {
            const savedNote = localStorage.getItem('savedNote');
            if (savedNote) {
                notepad.value = savedNote;
                updateCounts();
            }
            
            // Configura autosave a cada 5 segundos
            autoSaveInterval = setInterval(() => {
                if (notepad.value.length > 0) {
                    saveNote(true);
                }
                updateAutoSaveStatus();
            }, 5000);
        });
        
        // Atualiza contadores quando texto muda
        notepad.addEventListener('input', updateCounts);
        
        function updateCounts() {
            // Conta caracteres
            const text = notepad.value;
            characterCount.textContent = text.length + ' caracteres';
            
            // Conta palavras
            const words = text.trim() === '' ? 0 : text.trim().split(/\\s+/).length;
            wordCount.textContent = words + ' palavras';
        }
        
        function updateAutoSaveStatus() {
            const secondsAgo = Math.floor((Date.now() - lastSaved) / 1000);
            autoSaveStatus.textContent = 'Autosalvo há ' + secondsAgo + 's';
        }
        
        function saveNote(isAuto = false) {
            localStorage.setItem('savedNote', notepad.value);
            lastSaved = Date.now();
            
            if (!isAuto) {
                autoSaveStatus.textContent = 'Salvo manualmente';
                setTimeout(updateAutoSaveStatus, 2000);
            }
        }
        
        function clearNote() {
            if (confirm('Tem certeza que deseja limpar todas as notas?')) {
                notepad.value = '';
                updateCounts();
            }
        }
        
        function downloadNote() {
            if (notepad.value.trim() === '') {
                alert('O bloco de notas está vazio!');
                return;
            }
            
            const blob = new Blob([notepad.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'minhas_notas_' + new Date().toISOString().split('T')[0] + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`,
                createdAt: new Date().toISOString()
            }
            // Você pode adicionar mais ferramentas seguindo este formato abaixo
            // ,{
            // id: 'default-nome',
            // title: 'Titulo',
            // code: `<!DOCTYPE html>
            // <html>
            // <!-- Código existente do bloco de notas -->
            // </html>`,
            // createdAt: new Date().toISOString()
            // }  até aqui!


        ];
    }

    // Método para exportar todas as ferramentas
    exportTools() {
        if (this.tools.length === 0) {
            alert('Não há ferramentas para exportar.');
            return;
        }

        // Prepara o objeto para exportação
        const exportData = {
            tools: this.tools,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        // Converte para JSON
        const jsonData = JSON.stringify(exportData, null, 2);

        // Cria um Blob e um link para download
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Cria um elemento de link e simula o clique
        const a = document.createElement('a');
        a.href = url;
        a.download = `ferramentas-html-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Libera o URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // Método para importar ferramentas
    importTools(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const importData = JSON.parse(event.target.result);

                // Verifica se o formato é válido
                if (!importData.tools || !Array.isArray(importData.tools)) {
                    throw new Error('Formato de arquivo inválido.');
                }

                // Pergunta se deseja substituir ou adicionar
                const action = confirm(
                    'Deseja substituir todas as ferramentas existentes?\n' +
                    'OK: Substituir todas as ferramentas\n' +
                    'Cancelar: Adicionar às ferramentas existentes'
                );

                // Substitui ou adiciona as ferramentas
                if (action) {
                    // Substitui todas as ferramentas
                    this.tools = [...importData.tools];
                } else {
                    // Adiciona as novas ferramentas, evitando duplicatas por ID
                    const existingIds = new Set(this.tools.map(tool => tool.id));
                    importData.tools.forEach(tool => {
                        if (!existingIds.has(tool.id)) {
                            this.tools.push(tool);
                        }
                    });
                }

                this.saveTools();
                this.renderToolsList();
                alert(`Importação concluída! ${importData.tools.length} ferramentas importadas.`);

            } catch (error) {
                alert(`Erro ao importar ferramentas: ${error.message}`);
            }
        };

        reader.readAsText(file);
    }

    // 4. Modifique o método toggleFullscreen para adicionar suporte à tecla ESC
    toggleFullscreen() {
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.querySelector('.sidebar');
        const toolHeader = document.querySelector('.tool-header');
        const appHeader = document.querySelector('.app-header');

        // Alterna a classe de modo tela cheia
        mainContent.classList.toggle('fullscreen-mode');
        const isFullscreen = mainContent.classList.contains('fullscreen-mode');

        if (isFullscreen) {
            // ENTRANDO no modo tela cheia
            document.body.classList.add('fullscreen-active');

            // Esconde elementos da interface
            if (sidebar) sidebar.style.display = 'none';
            if (toolHeader) toolHeader.style.display = 'none';
            if (appHeader) appHeader.style.display = 'none';

            // Expande o iframe
            const toolContent = document.getElementById('tool-content');
            if (toolContent) {
                toolContent.style.position = 'fixed';
                toolContent.style.top = '0';
                toolContent.style.left = '0';
                toolContent.style.width = '100vw';
                toolContent.style.height = '100vh';
                toolContent.style.zIndex = '1000';
            }

            // Cria botão de sair
            const exitButton = document.createElement('button');
            exitButton.id = 'exit-fullscreen';
            exitButton.innerHTML = '✕';
            exitButton.style.position = 'fixed';
            exitButton.style.top = '10px';
            exitButton.style.right = '10px';
            exitButton.style.zIndex = '1001';
            exitButton.style.background = 'rgba(0, 0, 0, 0.5)';
            exitButton.style.color = 'white';
            exitButton.style.border = 'none';
            exitButton.style.borderRadius = '50%';
            exitButton.style.width = '30px';
            exitButton.style.height = '30px';
            exitButton.style.cursor = 'pointer';
            exitButton.style.fontSize = '16px';
            exitButton.style.display = 'flex';
            exitButton.style.alignItems = 'center';
            exitButton.style.justifyContent = 'center';

            exitButton.addEventListener('click', () => this.toggleFullscreen());
            document.body.appendChild(exitButton);

            // Adiciona handler para tecla ESC sair do modo tela cheia
            this.escKeyHandler = (e) => {
                if (e.key === 'Escape') this.toggleFullscreen();
            };
            document.addEventListener('keydown', this.escKeyHandler);
        } else {
            // SAINDO do modo tela cheia
            document.body.classList.remove('fullscreen-active');

            // Restaura elementos da interface
            if (sidebar) sidebar.style.display = '';
            if (toolHeader) toolHeader.style.display = '';
            if (appHeader) appHeader.style.display = '';

            // Restaura o iframe
            const toolContent = document.getElementById('tool-content');
            if (toolContent) {
                toolContent.style.position = '';
                toolContent.style.top = '';
                toolContent.style.left = '';
                toolContent.style.width = '';
                toolContent.style.height = '';
                toolContent.style.zIndex = '';
            }

            // Remove o botão de sair
            const exitButton = document.getElementById('exit-fullscreen');
            if (exitButton) exitButton.remove();

            // Remove o handler da tecla ESC
            if (this.escKeyHandler) {
                document.removeEventListener('keydown', this.escKeyHandler);
                this.escKeyHandler = null;
            }
        }
    }
    // Modificação para o construtor para inicializar a visibilidade dos controles
    constructor() {
        this.codeEditor = null;
        this.tools = this.loadTools();
        this.currentToolId = null;
        this.escKeyHandler = null; // Para armazenar o handler da tecla ESC
        this.codeSearchManager = null; // Para gerenciar a pesquisa de código

        this.setupEventListeners();
        this.renderToolsList();
        this.setupSearchFunctionality();

        // Inicializa a visibilidade dos controles
        this.updateToolControlsVisibility();
    }

    // Modifique o método loadTools na classe ToolsManager
    loadTools() {
        const storedTools = localStorage.getItem('html-tools');
        if (storedTools) {
            return JSON.parse(storedTools);
        } else {
            // Se não houver ferramentas salvas, carrega as ferramentas padrão
            const defaultTools = this.getDefaultTools();
            // Salva as ferramentas padrão para futuras sessões
            localStorage.setItem('html-tools', JSON.stringify(defaultTools));
            return defaultTools;
        }
    }

    // Salva as ferramentas no localStorage
    saveTools() {
        localStorage.setItem('html-tools', JSON.stringify(this.tools));
    }

    // Adiciona uma nova ferramenta
    addTool(title, code) {
        const newTool = {
            id: Date.now().toString(),
            title,
            code,
            createdAt: new Date().toISOString()
        };

        this.tools.push(newTool);
        this.saveTools();
        this.renderToolsList();
        return newTool;
    }

    // Atualiza uma ferramenta existente
    updateTool(id, title, code) {
        const toolIndex = this.tools.findIndex(tool => tool.id === id);
        if (toolIndex !== -1) {
            this.tools[toolIndex] = {
                ...this.tools[toolIndex],
                title,
                code,
                updatedAt: new Date().toISOString()
            };
            this.saveTools();
            this.renderToolsList();
            if (this.currentToolId === id) {
                this.displayTool(id);
            }
        }
    }

    // Remove uma ferramenta
    // Versão modificada do método deleteTool
    deleteTool(id) {
        this.tools = this.tools.filter(tool => tool.id !== id);
        this.saveTools();

        // Resetar currentToolId se a ferramenta atual foi excluída
        if (this.currentToolId === id) {
            this.currentToolId = null;

            // Atualiza a interface para mostrar a mensagem de boas-vindas
            document.getElementById('welcome-message').style.display = 'block';
            document.getElementById('tool-view').style.display = 'none';

            // Atualiza a visibilidade dos controles
            this.updateToolControlsVisibility();
        }

        // Renderiza a lista de ferramentas APÓS alterar o estado
        this.renderToolsList();
    }

    // Função melhorada para busca de ferramentas
    searchTools(query) {
        if (!query.trim()) {
            this.renderToolsList();
            return;
        }

        // Quebra a consulta em termos individuais para busca mais precisa
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

        // Diferentes níveis de correspondência para ordenação por relevância
        const exactMatches = [];
        const startsWithMatches = [];
        const containsMatches = [];

        this.tools.forEach(tool => {
            const title = tool.title.toLowerCase();

            // Verifica se todos os termos de busca estão presentes no título
            const allTermsMatch = searchTerms.every(term => title.includes(term));

            if (allTermsMatch) {
                // Determina o nível de correspondência para ordenação
                if (title === query.toLowerCase()) {
                    exactMatches.push(tool);
                } else if (title.startsWith(searchTerms[0])) {
                    startsWithMatches.push(tool);
                } else {
                    containsMatches.push(tool);
                }
            }
        });

        // Combina os resultados em ordem de relevância
        const filteredTools = [...exactMatches, ...startsWithMatches, ...containsMatches];

        this.renderToolsList(filteredTools);
    }

    // Renderiza a lista de ferramentas
    // Correção para o método renderToolsList
    renderToolsList(toolsToRender = this.tools) {
        const toolsContainer = document.getElementById('tools-container');
        const emptyState = document.getElementById('empty-tools');

        // Limpa o container
        toolsContainer.innerHTML = '';

        if (toolsToRender.length === 0) {
            if (emptyState) {
                const emptyStateClone = emptyState.cloneNode(true);
                toolsContainer.appendChild(emptyStateClone);
            } else {
                const newEmptyState = document.createElement('div');
                newEmptyState.id = 'empty-tools';
                newEmptyState.innerHTML = '<p>Nenhuma ferramenta encontrada.</p>';
                toolsContainer.appendChild(newEmptyState);
            }
            return;
        }

        // Ordena as ferramentas pelo título
        const sortedTools = [...toolsToRender].sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        // Cria os elementos da lista
        sortedTools.forEach(tool => {
            const toolItem = document.createElement('div');
            toolItem.className = 'tool-item';
            if (tool.id === this.currentToolId) {
                toolItem.classList.add('active');
            }
            toolItem.textContent = tool.title;
            toolItem.dataset.id = tool.id;

            // Evento de clique simples para exibir a ferramenta
            toolItem.addEventListener('click', () => {
                this.displayTool(tool.id);
            });

            // Adiciona evento de duplo clique para ativar imediatamente o modo tela cheia
            toolItem.addEventListener('dblclick', (e) => {
                e.preventDefault(); // Evita seleção de texto
                this.displayTool(tool.id);
                setTimeout(() => this.toggleFullscreen(), 50);
            });

            // Adiciona suporte para toque duplo em dispositivos móveis
            let lastTap = 0;
            toolItem.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                    this.displayTool(tool.id);
                    setTimeout(() => this.toggleFullscreen(), 50);
                }

                lastTap = currentTime;
            });

            toolsContainer.appendChild(toolItem);
        });
    }

    // Versão modificada do método displayTool para também atualizar a visibilidade dos controles
    displayTool(id) {
        const tool = this.tools.find(tool => tool.id === id);
        if (!tool) return;

        this.currentToolId = id;

        // Atualiza a interface
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('tool-view').style.display = 'flex';
        document.getElementById('tool-title').textContent = tool.title;

        // Atualiza a visibilidade dos controles
        this.updateToolControlsVisibility();

        // Atualiza a classe ativa na lista
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === id) {
                item.classList.add('active');
            }
        });

        // Renderiza o conteúdo da ferramenta
        const toolContent = document.getElementById('tool-content');
        toolContent.innerHTML = '';

        // Cria um iframe para isolar o código
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        toolContent.appendChild(iframe);

        // Escreve o código no iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(tool.code);
        iframeDoc.close();

        // Adiciona evento de duplo clique no container para alternar modo tela cheia
        toolContent.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.toggleFullscreen();
        });

        // Adiciona evento de duplo toque no container para alternar modo tela cheia
        let lastTapContent = 0;
        toolContent.addEventListener('touchend', (e) => {
            // Ignora se o clique foi no botão de sair do modo tela cheia
            if (e.target.id === 'exit-fullscreen') return;

            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapContent;

            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                this.toggleFullscreen();
            }

            lastTapContent = currentTime;
        });
    }

    // Abre o modal para adicionar uma nova ferramenta
    openAddToolModal() {
        document.getElementById('modal-title').textContent = 'Nova Ferramenta';
        document.getElementById('tool-id').value = '';
        document.getElementById('input-title').value = '';
        document.getElementById('input-code').value = '';
        document.getElementById('tool-modal').style.display = 'flex';
        document.querySelector('[data-tab="editor"]').click();
        const searchInput = document.getElementById('code-search-input');
        if (searchInput) {
            searchInput.value = '';
            if (this.codeSearchManager) {
                this.codeSearchManager.performSearch();
            }
        }
    }

    // Abre o modal para editar uma ferramenta existente
    openEditToolModal(id) {
        const tool = this.tools.find(tool => tool.id === id);
        if (!tool) return;

        document.getElementById('modal-title').textContent = 'Editar Ferramenta';
        document.getElementById('tool-id').value = tool.id;
        document.getElementById('input-title').value = tool.title;
        document.getElementById('input-code').value = tool.code;
        document.getElementById('tool-modal').style.display = 'flex';
        document.querySelector('[data-tab="editor"]').click();
        const searchInput = document.getElementById('code-search-input');
        if (searchInput) {
            searchInput.value = '';
            if (this.codeSearchManager) {
                this.codeSearchManager.performSearch();
            }
        }
    }

    // Fecha o modal
    closeModal() {
        document.getElementById('tool-modal').style.display = 'none';
    }

    // Configura os event listeners
    setupEventListeners() {
        // Adicione isto ao método setupEventListeners() na classe ToolsManager
        // Dentro do método setupEventListeners()

        // Botão de exportar
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportTools();
        });

        // Botão de importar
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        // Input de arquivo para importação
        document.getElementById('import-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importTools(e.target.files[0]);
                e.target.value = ''; // Limpa o input para permitir importar o mesmo arquivo novamente
            }
        });
        // Botão de restaurar padrões
        const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
        if (resetDefaultsBtn) { // Importante: verificar se o elemento existe
            resetDefaultsBtn.addEventListener('click', () => {
                this.resetToDefaultTools();
            });
        }
        // Botão de tela cheia
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });


        // Botão para adicionar nova ferramenta
        document.getElementById('add-tool-btn').addEventListener('click', () => {
            this.openAddToolModal();
        });

        // Botão de boas-vindas para adicionar primeira ferramenta
        document.getElementById('welcome-add-btn').addEventListener('click', () => {
            this.openAddToolModal();
        });

        // Botão para editar ferramenta
        document.getElementById('edit-tool-btn').addEventListener('click', () => {
            if (this.currentToolId) {
                this.openEditToolModal(this.currentToolId);
            }
        });

        // Botão para excluir ferramenta
        document.getElementById('delete-tool-btn').addEventListener('click', () => {
            if (this.currentToolId) {
                if (confirm('Tem certeza que deseja excluir esta ferramenta?')) {
                    this.deleteTool(this.currentToolId);
                }
            }
        });

        // Formulário para salvar ferramenta
        document.getElementById('tool-form').addEventListener('submit', (e) => {
            e.preventDefault();


            const id = document.getElementById('tool-id').value;
            const title = document.getElementById('input-title').value;
            const code = document.getElementById('input-code').value;

            if (!title || !code) return;

            if (id) {
                this.updateTool(id, title, code);
            } else {
                const newTool = this.addTool(title, code);
                this.displayTool(newTool.id);
            }

            this.closeModal();
        });
        // É importante também evitar que o Enter e outras teclas especiais 
        // submetam o formulário. Adicione isto no evento keydown do 
        // formulário no método setupEventListeners da classe ToolsManager:

        document.getElementById('tool-form').addEventListener('keydown', function (e) {
            // Impede que Enter submeta o formulário quando estiver na pesquisa ou na navegação
            if (e.key === 'Enter' &&
                (e.target.id === 'code-search-input' ||
                    e.target.id === 'search-next-btn' ||
                    e.target.id === 'search-prev-btn')) {
                e.preventDefault();
                return false;
            }
        });

        // Fechar modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Tabs do modal
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Atualiza classes ativas
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');

                // Se for a tab de preview, atualiza a pré-visualização
                if (tabName === 'preview') {
                    const code = document.getElementById('input-code').value;
                    const previewContainer = document.getElementById('preview-container');

                    // Cria um iframe para a pré-visualização
                    previewContainer.innerHTML = '';
                    const iframe = document.createElement('iframe');
                    iframe.style.width = '100%';
                    iframe.style.height = '350px';
                    iframe.style.border = 'none';
                    previewContainer.appendChild(iframe);

                    // Insere o código no iframe
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(code);
                    iframeDoc.close();
                }
            });
        });

        // Fechar o modal ao clicar fora dele
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('tool-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Tecla ESC para fechar o modal
        // Modifique o handler da tecla ESC para priorizar a saída do modo tela cheia
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mainContent = document.querySelector('.main-content');
                const modalVisible = document.getElementById('tool-modal').style.display === 'flex';

                // Se estiver em modo tela cheia, o handler específico cuidará disso
                if (mainContent && mainContent.classList.contains('fullscreen-mode')) {
                    // Não faz nada, o handler específico do modo tela cheia tratará isso
                    return;
                }
                // Se o modal estiver aberto, feche-o
                else if (modalVisible) {
                    this.closeModal();
                }
            }

        });
        // Adicione este bloco no final do método setupEventListeners()
        // Inicializa o gerenciador de pesquisa quando a tab de editor é aberta
        document.querySelectorAll('[data-tab="editor"]').forEach(tab => {
            tab.addEventListener('click', () => {
                // Pequeno timeout para garantir que o modal já esteja visível
                setTimeout(() => {
                    if (!this.codeSearchManager) {
                        this.codeSearchManager = new CodeSearchManager('input-code');
                    }
                }, 100);
            });
        });

    }

    // Configura a funcionalidade de busca
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        // Busca ao clicar no botão
        searchBtn.addEventListener('click', () => {
            this.searchTools(searchInput.value);
        });

        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchTools(searchInput.value);
            }
        });

        // Busca em tempo real ao digitar
        searchInput.addEventListener('input', () => {
            this.searchTools(searchInput.value);
        });
    }
}

// Inicializa o gerenciador de ferramentas quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.toolsManager = new ToolsManager();
});