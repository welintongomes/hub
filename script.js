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
                id: 'default-calculator',
                title: 'Calculadora Simples',
                code: `<!DOCTYPE html>
<html>
<head>
    <title>Calculadora</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .calculator {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            width: 300px;
        }
        .display {
            background-color: #f0f0f0;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
            text-align: right;
            font-size: 24px;
            height: 40px;
            overflow: hidden;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        button {
            background-color: #e0e0e0;
            border: none;
            border-radius: 5px;
            padding: 15px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: #d0d0d0;
        }
        .operator {
            background-color: #f8a51b;
            color: white;
        }
        .operator:hover {
            background-color: #e59400;
        }
        .equals {
            background-color: #4caf50;
            color: white;
        }
        .equals:hover {
            background-color: #3d8c40;
        }
        .clear {
            background-color: #f44336;
            color: white;
        }
        .clear:hover {
            background-color: #d32f2f;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button onclick="appendCharacter('(')">(</button>
            <button onclick="appendCharacter(')')">)</button>
            <button class="operator" onclick="appendCharacter('/')">/</button>
            
            <button onclick="appendCharacter('7')">7</button>
            <button onclick="appendCharacter('8')">8</button>
            <button onclick="appendCharacter('9')">9</button>
            <button class="operator" onclick="appendCharacter('*')">×</button>
            
            <button onclick="appendCharacter('4')">4</button>
            <button onclick="appendCharacter('5')">5</button>
            <button onclick="appendCharacter('6')">6</button>
            <button class="operator" onclick="appendCharacter('-')">-</button>
            
            <button onclick="appendCharacter('1')">1</button>
            <button onclick="appendCharacter('2')">2</button>
            <button onclick="appendCharacter('3')">3</button>
            <button class="operator" onclick="appendCharacter('+')">+</button>
            
            <button onclick="appendCharacter('0')">0</button>
            <button onclick="appendCharacter('.')">.</button>
            <button onclick="backspace()">⌫</button>
            <button class="equals" onclick="calculate()">=</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentExpression = '0';

        function updateDisplay() {
            display.textContent = currentExpression;
        }

        function appendCharacter(char) {
            if (currentExpression === '0' && char !== '.') {
                currentExpression = char;
            } else {
                currentExpression += char;
            }
            updateDisplay();
        }

        function clearDisplay() {
            currentExpression = '0';
            updateDisplay();
        }

        function backspace() {
            if (currentExpression.length <= 1) {
                currentExpression = '0';
            } else {
                currentExpression = currentExpression.slice(0, -1);
            }
            updateDisplay();
        }

        function calculate() {
            try {
                currentExpression = eval(currentExpression).toString();
                updateDisplay();
            } catch (error) {
                currentExpression = 'Erro';
                updateDisplay();
                setTimeout(clearDisplay, 1000);
            }
        }
    </script>
</body>
</html>`,
                createdAt: new Date().toISOString()
            },
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
            },
            {//programa em versao compacta para nao poluir muito o codigo
                id: 'default-tabuada',
                title: 'Jogo de Tabuada',
                code: `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Jogo de Tabuada</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(to right,#4facfe,#00f2fe);display:flex;justify-content:center;align-items:center;height:100vh;margin:0;color:#333}.container{background:#fff;border-radius:10px;padding:30px 40px;box-shadow:0 10px 20px rgba(0,0,0,0.15);max-width:400px;width:100%;text-align:center}h1{margin-bottom:20px}select,button{padding:10px;font-size:16px;margin:10px;border-radius:5px;border:1px solid #ccc}.options button{display:block;width:100%;margin:10px 0;padding:12px;font-size:18px;border:none;border-radius:5px;background:#eee;cursor:pointer;transition:background-color .3s}.options button:hover{background-color:#d0ebff}.feedback{font-weight:bold;margin:15px 0}#game,#result{display:none}</style></head><body><div class="container"><h1>Jogo de Tabuada</h1><div id="menu"><label for="tabuada">Escolha a tabuada:</label><select id="tabuada"><option value="" disabled selected>Selecione</option>${[...Array(10).keys()].map(i => `<option value="${i + 1}">Tabuada do ${i + 1}</option>`).join('')}</select><br><button onclick="iniciarJogo()">Começar</button></div><div id="game"><h2>Questão <span id="questaoNumero">1</span> de 10</h2><div id="pergunta" style="font-size:22px;margin-bottom:15px;"></div><div class="options" id="opcoes"></div><div class="feedback" id="feedback"></div></div><div id="result"><h2>Fim do Jogo!</h2><p>Sua pontuação final: <strong id="pontuacaoFinal"></strong> de 10</p><button onclick="reiniciarJogo()">Jogar Novamente</button></div></div><script>let numeroTabuada=1,questaoAtual=1,pontuacao=0,multiplicadores=[],respostaCorreta=0;function iniciarJogo(){const e=document.getElementById("tabuada");if(numeroTabuada=parseInt(e.value),isNaN(numeroTabuada))return void alert("Por favor, selecione uma tabuada.");multiplicadores=[...Array(10).keys()].map(e=>e+1).sort(()=>Math.random()-.5),questaoAtual=1,pontuacao=0,document.getElementById("menu").style.display="none",document.getElementById("game").style.display="block",document.getElementById("result").style.display="none",proximaPergunta()}function proximaPergunta(){const e=multiplicadores[questaoAtual-1];respostaCorreta=numeroTabuada*e,document.getElementById("questaoNumero").textContent=questaoAtual,document.getElementById("pergunta").textContent=\`Quanto é \${numeroTabuada} × \${e}?\`,gerarOpcoesEnganosas(numeroTabuada,e,respostaCorreta),document.getElementById("feedback").textContent=""}function gerarOpcoesEnganosas(e,t,a){const n=document.getElementById("opcoes");n.innerHTML="";const o=new Set;o.add(a);for(;o.size<4;){let n;switch(Math.floor(4*Math.random())){case 0:n=(e+1)*t;break;case 1:n=e*(t+1);break;case 2:n=e+t;break;case 3:n=(e-1>0?e-1:e+2)*t}n!==a&&n>0&&o.add(n)}Array.from(o).sort(()=>Math.random()-.5).forEach(e=>{const t=document.createElement("button");t.textContent=e,t.onclick=()=>verificarResposta(e),n.appendChild(t)})}function verificarResposta(e){const t=document.getElementById("feedback");e===respostaCorreta?(pontuacao++,t.textContent="✅ Correto!",t.style.color="green"):(t.textContent=\`❌ Errado! A resposta correta era \${respostaCorreta}.\`,t.style.color="red"),questaoAtual++,setTimeout(()=>{questaoAtual<=10?proximaPergunta():mostrarResultado()},1500)}function mostrarResultado(){document.getElementById("game").style.display="none",document.getElementById("result").style.display="block",document.getElementById("pontuacaoFinal").textContent=pontuacao}function reiniciarJogo(){document.getElementById("menu").style.display="block",document.getElementById("result").style.display="none",document.getElementById("tabuada").selectedIndex=0}</script></body></html>`,
                createdAt: new Date().toISOString()
            }
            // Adicione mais ferramentas predefinidas aqui
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