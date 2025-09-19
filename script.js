document.addEventListener('DOMContentLoaded', () => {

    // --- I. CONSTANTES E SELETORES GLOBAIS ---
    const API_URL = 'http://127.0.0.1:5000';
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Módulo de Leads
    const leadForm = document.getElementById('lead-form');
    const leadsTableBody = document.querySelector('#leads-table tbody');
    const filterInput = document.getElementById('filter-leads');
    const clearLeadButton = document.getElementById('clear-lead-button');
    const cpfCnpjInput = document.getElementById('cpf_cnpj');
    const cepInput = document.getElementById('cep');
    const ufSelect = document.getElementById('uf');
    const cidadeSelect = document.getElementById('cidade');
    const dataRegistroLeadInput = document.getElementById('data_registro_lead');
    const addLeadBtn = document.getElementById('add-lead-btn');
    const refreshLeadsBtn = document.getElementById('refresh-leads-btn');
    const cadastroListingScreen = document.getElementById('cadastro-listing-screen');
    const cadastroFormScreen = document.getElementById('cadastro-form-screen');
    const cadastroBackBtn = document.getElementById('cadastro-back-btn');
    const cadastroFormTitle = document.getElementById('cadastro-form-title');
    
    // Módulo de Unidades
    const unidadesTabButton = document.querySelector('.tab-button[data-tab="unidades"]');
    const unidadeSelector = document.getElementById('lead-selector');
    const unidadesTableBody = document.querySelector('#unidades-table tbody');
    const unidadeHistoricoTableBody = document.querySelector('#unidade-historico-table tbody');
    const unidadesSubtitle = document.getElementById('unidades-subtitle');
    const unidadeForm = document.getElementById('unidade-form');
    const unidadesFormTitle = document.getElementById('unidades-form-title');
    const clearUnidadeButton = document.getElementById('clear-unidade-button');
    const ufUnidadeSelect = document.querySelector('.uf-unidade-select');
    const cidadeUnidadeSelect = document.querySelector('.cidade-unidade-select');
    const addUnidadeBtn = document.getElementById('add-unidade-btn');
    const unidadesBackBtn = document.getElementById('unidades-back-btn');
    
    // Módulo de Histórico
    const historicoTabButton = document.querySelector('.tab-button[data-tab="historico"]');
    const historicoTableBody = document.querySelector('#historico-table tbody');
    const historicoSubtitle = document.getElementById('historico-subtitle');
    const historicoForm = document.getElementById('historico-form');
    const historicoFormTitle = document.getElementById('historico-form-title');
    const historicoInputTableBody = document.querySelector('#historico-input-table tbody');
    const manageHistoricoBtn = document.getElementById('manage-historico-btn');
    const historicoBackBtn = document.getElementById('historico-back-btn');
    const historicoLeadSelector = document.getElementById('historico-lead-selector');
    const historicoUnidadeSelector = document.getElementById('historico-unidade-selector');
    const historicoAnoSelector = document.getElementById('historico-ano-selector');
    
    // Módulo de Propostas
    const addPropostaBtn = document.getElementById('add-proposta-btn');
    const refreshPropostasBtn = document.getElementById('refresh-propostas-btn');
    const propostaBackBtn = document.getElementById('proposta-back-btn');
    const propostaLeadSelector = document.getElementById('proposta-lead-selector');
    const propostaUnidadeSelector = document.getElementById('proposta-unidade-selector');
    const propostaForm = document.getElementById('proposta-form');
    const savePropostaButton = document.getElementById('save-proposta-button');
    const propostasTableBody = document.querySelector('#propostas-table tbody');
    const filterPropostasInput = document.getElementById('filter-propostas');
    
    // Modais
    const vendedorModal = document.getElementById('vendedor-modal');
    const closeVendedorModalButton = document.getElementById('close-vendedor-modal');
    const vendedorContatoForm = document.getElementById('vendedor-contato-form');
    const calendarModal = document.getElementById('calendar-modal');
    const calendarWrapper = document.getElementById('calendar-wrapper');
    const precoMwhModal = document.getElementById('preco-mwh-modal');
    const closePrecoMwhModalBtn = document.getElementById('close-preco-mwh-modal');
    const cancelPrecoMwhBtn = document.getElementById('cancel-preco-mwh-button');
    const precoMwhForm = document.getElementById('preco-mwh-form');
    const custosMesModal = document.getElementById('custos-mes-modal');
    const closeCustosMesModalBtn = document.getElementById('close-custos-mes-modal');
    const cancelCustosMesBtn = document.getElementById('cancel-custos-mes-button');
    const custosMesForm = document.getElementById('custos-mes-form');
    const ajusteTarifaModal = document.getElementById('ajuste-tarifa-modal');
    const closeAjusteTarifaModalBtn = document.getElementById('close-ajuste-tarifa-modal');
    const cancelAjusteTarifaBtn = document.getElementById('cancel-ajuste-tarifa-button');
    const ajusteTarifaForm = document.getElementById('ajuste-tarifa-form');
    const dadosGeracaoModal = document.getElementById('dados-geracao-modal');
    const closeDadosGeracaoModalBtn = document.getElementById('close-dados-geracao-modal');
    const cancelDadosGeracaoBtn = document.getElementById('cancel-dados-geracao-button');
    const dadosGeracaoForm = document.getElementById('dados-geracao-form');
    const curvaGeracaoModal = document.getElementById('curva-geracao-modal');
    const closeCurvaGeracaoModalBtn = document.getElementById('close-curva-geracao-modal');
    const cancelCurvaGeracaoBtn = document.getElementById('cancel-curva-geracao-button');
    const curvaGeracaoForm = document.getElementById('curva-geracao-form');

        // Modal de Ajuste IPCA
    const addIpcaBtn = document.getElementById('add-ipca-btn');
    const ipcaModal = document.getElementById('ipca-modal');
    const ipcaModalTitle = document.getElementById('ipca-modal-title');
    const closeIpcaModalBtn = document.getElementById('close-ipca-modal');
    const cancelIpcaBtn = document.getElementById('cancel-ipca-button');
    const ipcaForm = document.getElementById('ipca-form');
    const ipcaAnoOriginalInput = document.getElementById('ipca-ano-original');

    // Módulo de Simulação (ACR)
    const simulacaoLeadSelector = document.getElementById('simulacao-lead-selector');
    const simulacaoUnidadeSelector = document.getElementById('simulacao-unidade-selector');
    const simulacaoCalcularBtn = document.getElementById('simulacao-calcular-btn');
    const simulacaoBtnIcon = document.getElementById('simulacao-btn-icon');
    const simulacaoBtnText = document.getElementById('simulacao-btn-text');
    const simulacaoDadosAutomaticos = document.getElementById('simulacao-dados-automaticos');
    const simulacaoInfoTarifa = document.getElementById('simulacao-info-tarifa');
    const simulacaoInfoDemanda = document.getElementById('simulacao-info-demanda');
    const simulacaoInfoImpostos = document.getElementById('simulacao-info-impostos');
    const simulacaoResultadoContainer = document.getElementById('simulacao-resultado-container');
    const simulacaoResultadoDescricao = document.getElementById('simulacao-resultado-descricao');
    const simulacaoLabelCustoTotal = document.getElementById('simulacao-label-custo-total');
    const simulacaoResultadoCustoAnual = document.getElementById('simulacao-resultado-custo-anual');
    const simulacaoResultadoCustoMensal = document.getElementById('simulacao-resultado-custo-mensal');
    const simulacaoResultadoConsumoAnual = document.getElementById('simulacao-resultado-consumo-anual');
    const simulacaoResultadoDemandaMedia = document.getElementById('simulacao-resultado-demanda-media');
    const simulacaoToggleDetalhesBtn = document.getElementById('simulacao-toggle-detalhes-btn');
    const simulacaoTabelaDetalhadaContainer = document.getElementById('simulacao-tabela-detalhada-container');
    const simulacaoTabelaDetalhadaTbody = document.getElementById('simulacao-tabela-detalhada-tbody');
    const tipoSimulacaoRadios = document.querySelectorAll('input[name="tipo_simulacao"]');
    const simulacaoLeadInputsContainer = document.getElementById('simulacao-lead-inputs');
    const simulacaoDataInicioInput = document.getElementById('simulacao-data-inicio');
    const simulacaoDataFimInput = document.getElementById('simulacao-data-fim');
    const periodoRapidoBtns = document.querySelectorAll('.btn-periodo-rapido');
    const simulacaoHistoricoContainer = document.getElementById('simulacao-historico-container');
    const simulacaoHistoricoChartCanvas = document.getElementById('simulacao-historico-chart').getContext('2d');
    const simulacaoInfoMercado = document.getElementById('simulacao-info-mercado');
    const saveAllParamsBtn = document.getElementById('save-all-params');

    // Módulo de Análise/Dashboard
    const dashboardTab = document.getElementById('dashboard');
    const reportLeadName = dashboardTab.querySelector('#report-lead-name');
    const reportUnitName = dashboardTab.querySelector('#report-unit-name');
    const dashResultadoCustoAtual = dashboardTab.querySelector('#resultado-custo-atual');
    const dashResultadoCustoSimulado = dashboardTab.querySelector('#resultado-custo-simulado');
    const dashResultadoEconomiaReais = dashboardTab.querySelector('#resultado-economia-reais');
    const dashResultadoEconomiaPercentual = dashboardTab.querySelector('#resultado-economia-percentual');
    const detalhesTbody = dashboardTab.querySelector('#detalhes-tbody');
    const totalAtual = dashboardTab.querySelector('#total-atual');
    const totalSimulado = dashboardTab.querySelector('#total-simulado');
    const totalEconomia = dashboardTab.querySelector('#total-economia');
    const ctxDashboard = dashboardTab.querySelector('#simulador-grafico-economia').getContext('2d');



    // --- II. ESTADO GLOBAL DA APLICAÇÃO ---
    let debounceTimer;
    let modoEdicao = { lead: false, unidade: false };
    let historicoChartInstance = null;
    let dashboardChartInstance = null;
    
    let estadoAtual = {
        lead: { id: null, razaoSocial: null },
        unidade: { id: null, nome: null, dados: null },
        historico: { ano: new Date().getFullYear() }
    };
    
    let dadosDaSimulacao = {
        resultados: null,
        parametros: null 
    };

    // --- III. FUNÇÕES GLOBAIS ---
    function mudarAba(abaId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const btnAtivo = document.querySelector(`.tab-button[data-tab="${abaId}"]`);
        const conteudoAtivo = document.getElementById(abaId);
        if (btnAtivo) btnAtivo.classList.add('active');
        if (conteudoAtivo) conteudoAtivo.classList.add('active');

        if (abaId === 'unidades') carregarLeadsEmSeletor(unidadeSelector);
        else if (abaId === 'historico') carregarLeadsEmSeletor(historicoLeadSelector);
        else if (abaId === 'proposta') carregarLeadsEmSeletor(propostaLeadSelector);
        else if (abaId === 'simulacao') iniciarAbaSimulacao();
        else if (abaId === 'dashboard') atualizarDashboard();
        else if (abaId === 'parametros') {
            setupParametrosSubTabs();
            carregarParametros();
        }
    }

    function switchScreen(tabId, screenToShow) {
        document.querySelectorAll(`#${tabId} .screen`).forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(`${tabId}-${screenToShow}-screen`);
        if (targetScreen) targetScreen.classList.add('active');
    }

    function abrirModal(modalElement) { modalElement.classList.remove('hidden'); }
    function abrirModalEdicaoIPCA(button) {
    const row = button.closest('tr');
    const ano = row.cells[0].textContent;
    const pct = row.cells[1].textContent;
    ipcaForm.reset();
    ipcaModalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Ajuste IPCA';
    ipcaForm.dataset.mode = 'edit';
    document.getElementById('ipca-ano').value = ano;
    document.getElementById('ipca-percentual').value = parseFloat(pct.replace('.', '').replace(',', '.'));
    ipcaAnoOriginalInput.value = ano;
    abrirModal(ipcaModal);
}
    function fecharModal(modalElement) { modalElement.classList.add('hidden'); }
    
    const formatarMoeda = (valor) => {
        if (typeof valor !== 'number') valor = 0;
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatNumber = (val) => {
        if (val === null || val === undefined || val === '') return '';
        try {
            const num = Number(String(val).replace(',', '.'));
            if (isNaN(num)) return val;
            return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } catch (e) {
            return val;
        }
    };
    
    function formatarData(isoString) {
        if (!isoString) return '';
        const data = new Date(isoString);
        const userTimezoneOffset = data.getTimezoneOffset() * 60000;
        return new Date(data.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR');
    }

    function formatarCpfCnpj(valor) {
        const digitos = valor.replace(/\D/g, '');
        if (digitos.length === 11) return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        if (digitos.length === 14) return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        return valor;
    }

    function formatarCep(valor) {
        const digitos = valor.replace(/\D/g, '');
        if (digitos.length === 8) return digitos.replace(/(\d{5})(\d{3})/, '$1-$2');
        return valor;
    }

    // ADICIONE ESTA NOVA FUNÇÃO AO SEU SCRIPT.JS

    async function carregarTabelaHistoricoCompleto(ucId) {
        historicoTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Carregando histórico completo...</td></tr>`;
        try {
            // Usa a rota que busca TODOS os registros, ordenada pelos mais recentes
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico`);
            const historicos = await response.json();
            
            historicoTableBody.innerHTML = '';
            if (historicos.length === 0) {
                historicoTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum histórico encontrado para esta unidade.</td></tr>`;
                return;
            }

            historicos.forEach(h => {
                const tr = document.createElement('tr');
                const idMesCompleto = h.IDMes || ''; // Mostra o Ano-Mês para clareza

                tr.innerHTML = `
                    <td>${idMesCompleto}</td>
                    <td>${formatNumber(h.DemandaCP)}</td>
                    <td>${formatNumber(h.DemandaCFP)}</td>
                    <td>${formatNumber(h.DemandaCG)}</td>
                    <td>${formatNumber(h.kWhProjPonta)}</td>
                    <td>${formatNumber(h.kWhProjForaPonta)}</td>
                    <td>${formatarData(h.DataRegistroHistorico)}</td>
                `;
                historicoTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Falha ao carregar histórico completo:', error);
            historicoTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">Erro ao carregar o histórico.</td></tr>`;
        }
    }
    // --- IV. LÓGICA DE LEADS, UNIDADES, HISTÓRICO, PROPOSTAS ---
    async function carregarLeads(filtro = '') {
        leadsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">A carregar...</td></tr>`;
        const url = `${API_URL}/api/leads?filtro=${encodeURIComponent(filtro)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
            const leads = await response.json();
            leadsTableBody.innerHTML = '';
            if (leads.length === 0) {
                leadsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum lead encontrado.</td></tr>`;
                return;
            }
            leads.forEach(lead => {
                const tr = document.createElement('tr');
                tr.dataset.id = lead.Cpf_CnpjLead;
                tr.dataset.razao = lead.RazaoSocialLead;
                tr.innerHTML = `
                    <td>${lead.Cpf_CnpjLead || ''}</td>
                    <td>${lead.RazaoSocialLead || ''}</td>
                    <td>${lead.NomeFantasia || ''}</td>
                    <td>${lead.Vendedor || ''}</td>
                    <td>${lead.Contato || ''}</td>
                    <td>${formatarData(lead.DataResgistroLead)}</td>
                    <td>${lead.UsuriaEditorRegistro || ''}</td>
                    <td class="actions-cell"></td>
                `;
                const vendedorBtn = document.createElement('button');
                vendedorBtn.innerHTML = '<i class="fas fa-user-tie"></i>';
                vendedorBtn.className = 'btn btn-info btn-action';
                vendedorBtn.title = 'Vendedor/Contato';
                vendedorBtn.onclick = (e) => {
                    e.stopPropagation();
                    estadoAtual.lead.id = lead.Cpf_CnpjLead;
                    abrirModal(vendedorModal);
                };
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.className = 'btn btn-edit btn-action';
                editBtn.title = 'Editar Lead';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    carregarLeadParaEdicao(lead.Cpf_CnpjLead);
                };
                tr.querySelector('.actions-cell').append(vendedorBtn, editBtn);
                tr.addEventListener('click', () => {
                    const linhaAntiga = leadsTableBody.querySelector('.selected');
                    if (linhaAntiga) linhaAntiga.classList.remove('selected');
                    tr.classList.add('selected');
                    selecionarLead(tr);
                });
                tr.addEventListener('dblclick', () => verUnidadesDoLead());
                leadsTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Falha ao procurar leads:', error);
            leadsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #ff6b6b;">Erro ao carregar os dados.</td></tr>`;
        }
    }

    async function selecionarLead(linhaElemento) {
        estadoAtual.lead.id = linhaElemento.dataset.id;
        estadoAtual.lead.razaoSocial = linhaElemento.dataset.razao;
        estadoAtual.unidade = { id: null, nome: null, dados: null };
    }

    async function salvarLead(event) {
        event.preventDefault();
        const formData = new FormData(leadForm);
        const leadData = Object.fromEntries(formData.entries());
        if (!leadData.Cpf_CnpjLead || !leadData.RazaoSocialLead) {
            alert('Os campos CPF/CNPJ e Razão Social são obrigatórios!');
            return;
        }
        const leadId = modoEdicao.lead ? estadoAtual.lead.id : leadData.Cpf_CnpjLead;
        const url = modoEdicao.lead ? `${API_URL}/api/leads/${encodeURIComponent(leadId)}` : `${API_URL}/api/leads`;
        const method = modoEdicao.lead ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro || 'Ocorreu um erro.');
            alert(result.sucesso);
            limparFormularioLead();
            await carregarLeads();
            switchScreen('cadastro', 'listing');
        } catch (error) {
            console.error('Falha ao salvar lead:', error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    }

    function limparFormularioLead() {
        leadForm.reset();
        modoEdicao.lead = false;
        cpfCnpjInput.disabled = false;
        cadastroFormTitle.innerHTML = '<i class="fas fa-user-plus"></i> Cadastro de Leads';
        if (dataRegistroLeadInput) dataRegistroLeadInput.value = new Date().toLocaleDateString('pt-BR');
        clearLeadButton.innerText = 'Limpar';
        estadoAtual.lead = { id: null, razaoSocial: null };
        const linhaAntiga = leadsTableBody.querySelector('.selected');
        if (linhaAntiga) linhaAntiga.classList.remove('selected');
        cidadeSelect.innerHTML = '<option value="">Selecione um estado</option>';
        cidadeSelect.disabled = true;
        if(document.activeElement) document.activeElement.blur();
    }
    
    async function carregarLeadParaEdicao(leadId) {
        if (!leadId) {
            alert("ID do lead não fornecido.");
            return;
        }
        cadastroFormTitle.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Carregando dados do Lead...';
        switchScreen('cadastro', 'form');
        try {
            const response = await fetch(`${API_URL}/api/leads/${encodeURIComponent(leadId)}`);
            if (!response.ok) throw new Error('Falha ao buscar os dados do lead.');
            const leadData = await response.json();
            for (const key in leadData) {
                const input = leadForm.querySelector(`[name="${key}"]`);
                if (input) {
                    if (key === 'Uf') {
                        input.value = leadData[key];
                        await carregarCidades(leadData[key], leadData.Cidade, ufSelect, cidadeSelect);
                    } else if (key === 'DataResgistroLead') {
                        input.value = leadData[key] ? new Date(leadData[key]).toLocaleDateString('pt-BR') : '';
                    } else if (key === 'Cep') {
                        input.value = formatarCep(leadData[key] || '');
                    } else {
                        input.value = leadData[key] || '';
                    }
                }
            }
            estadoAtual.lead.id = leadData.Cpf_CnpjLead;
            estadoAtual.lead.razaoSocial = leadData.RazaoSocialLead;
            modoEdicao.lead = true;
            cpfCnpjInput.disabled = true;
            cadastroFormTitle.innerHTML = '<i class="fas fa-edit"></i> Editando Lead';
            clearLeadButton.innerText = 'Cancelar Edição';
        } catch (error) {
            alert(`Erro ao carregar lead para edição: ${error.message}`);
            switchScreen('cadastro', 'listing');
        }
    }

    async function salvarVendedorContato(event) {
        event.preventDefault();
        if(!estadoAtual.lead.id) {
            alert("Nenhum lead selecionado.");
            return;
        }
        const formData = new FormData(vendedorContatoForm);
        const data = Object.fromEntries(formData.entries());
        if (!data.Vendedor || !data.DataEnvio || !data.DataValidade || !data.NomeContato) {
            alert("Os campos com * são obrigatórios.");
            return;
        }
        try {
            const leadIdEncoded = encodeURIComponent(estadoAtual.lead.id);
            const response = await fetch(`${API_URL}/api/leads/${leadIdEncoded}/vendedor-contato`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            alert(result.sucesso);
            fecharModal(vendedorModal);
            vendedorContatoForm.reset();
            await carregarLeads();
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    }



    async function carregarUnidadesDoLead(leadId) {
        unidadesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Carregando unidades...</td></tr>`;
        unidadeHistoricoTableBody.innerHTML = ''; // Limpa o preview do histórico
        estadoAtual.unidade = { id: null, nome: null, dados: null };

        if (!leadId) {
            unidadesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Selecione um lead acima.</td></tr>`;
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/leads/${encodeURIComponent(leadId)}/unidades`);
            const unidades = await response.json();
            unidadesTableBody.innerHTML = '';

            if (unidades.length === 0) {
                unidadesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhuma unidade cadastrada para este lead.</td></tr>`;
                return;
            }

            unidades.forEach(unidade => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.dataset.unidadeId = unidade.NumeroDaUcLead;
                tr.innerHTML = `
                    <td>${unidade.NumeroDaUcLead}</td>
                    <td>${unidade.NomeDaUnidade || ''}</td>
                    <td>${unidade.CnpjDaUnidadeConsumidora || ''}</td>
                    <td>${unidade.Logradouro || ''}</td>
                    <td>${unidade.Cidade || ''}</td>
                    <td>${unidade.Uf || ''}</td>
                    <td>${unidade.MercadoAtual || ''}</td>
                    <td class="actions-cell"></td>
                `;
                
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.className = 'btn btn-edit btn-action';
                editBtn.title = 'Editar Unidade';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    carregarUnidadeParaEdicao(unidade.NumeroDaUcLead, leadId);
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.className = 'btn btn-delete btn-action';
                deleteBtn.title = 'Excluir Unidade';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Tem certeza que deseja excluir a unidade ${unidade.NumeroDaUcLead}? Esta ação também removerá todo o seu histórico.`)) {
                        deletarUnidade(unidade.NumeroDaUcLead, leadId);
                    }
                };
                
                tr.querySelector('.actions-cell').append(editBtn, deleteBtn);

                tr.addEventListener('click', (e) => {
                    if (e.target.closest('button')) return;
                    const linhaAntiga = unidadesTableBody.querySelector('.selected');
                    if (linhaAntiga) linhaAntiga.classList.remove('selected');
                    tr.classList.add('selected');
                    selecionarUnidade(unidade);
                });

                unidadesTableBody.appendChild(tr);
            });

            const primeiraLinha = unidadesTableBody.querySelector('tr');
            if (primeiraLinha) {
                primeiraLinha.click(); // Simula um clique para carregar o histórico
            }

        } catch (error) {
            unidadesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro ao carregar unidades.</td></tr>`;
            console.error('Erro:', error);
        }
    }

    function limparFormularioUnidade() {
        unidadeForm.reset();
        modoEdicao.unidade = false;
        unidadeForm.querySelector('[name="NumeroDaUcLead"]').disabled = false;
        unidadesFormTitle.innerHTML = '<i class="fas fa-plug"></i> Nova Unidade Consumidora';
        clearUnidadeButton.innerText = "Limpar";
        estadoAtual.unidade = { id: null, nome: null, dados: null };
    }

    async function salvarUnidade(event) {
        event.preventDefault();
        if (!estadoAtual.lead.id) {
            alert("Nenhum lead está selecionado para associar esta unidade.");
            return;
        }
        const formData = new FormData(unidadeForm);
        const unidadeData = Object.fromEntries(formData.entries());

        const ucIdOriginal = document.getElementById('unidade-id-original').value;

        if (!unidadeData.NumeroDaUcLead) {
            alert("O Nº da UC é obrigatório!");
            return;
        }

        const leadIdEncoded = encodeURIComponent(estadoAtual.lead.id);
        const url = modoEdicao.unidade ? `${API_URL}/api/unidades/${encodeURIComponent(ucIdOriginal)}` : `${API_URL}/api/leads/${leadIdEncoded}/unidades`;
        const method = modoEdicao.unidade ? 'PUT' : 'POST';
        
        if (modoEdicao.unidade) {
            unidadeData.Cpf_CnpjLead = estadoAtual.lead.id;
        }

        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(unidadeData) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            alert(result.sucesso);
            switchScreen('unidades', 'listing');
            carregarUnidadesDoLead(estadoAtual.lead.id);
        } catch(error) {
            alert(`Erro ao salvar unidade: ${error.message}`);
        }
    }

    async function carregarUnidadeParaEdicao(ucId, leadId) {
        limparFormularioUnidade();
        unidadesSubtitle.innerText = `Editando Unidade para: ${estadoAtual.lead.razaoSocial || leadId}`;
        
        try {
            const response = await fetch(`${API_URL}/api/unidade/${encodeURIComponent(ucId)}`);
            if (!response.ok) throw new Error("Unidade não encontrada ou erro no servidor.");
            const unidade = await response.json();
            
            for(const key in unidade) {
                const input = unidadeForm.querySelector(`[name="${key}"]`);
                if(input) {
                     if (key === 'Uf') {
                        input.value = unidade[key];
                        await carregarCidades(unidade[key], unidade.Cidade, ufUnidadeSelect, cidadeUnidadeSelect);
                    } else {
                        input.value = unidade[key] || '';
                    }
                }
            }
            
            modoEdicao.unidade = true;
            document.getElementById('unidade-id-original').value = ucId; 
            unidadesFormTitle.innerHTML = '<i class="fas fa-edit"></i> Editando Unidade Consumidora';
            switchScreen('unidades', 'form');
            
        } catch (error) {
            console.error("Erro ao carregar unidade para edição:", error);
            alert(`Não foi possível carregar os dados da unidade: ${error.message}`);
        }
    }

    async function deletarUnidade(ucId, leadId) {
        try {
            const response = await fetch(`${API_URL}/api/unidades/${encodeURIComponent(ucId)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Cpf_CnpjLead: leadId }) 
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);

            alert(result.sucesso);
            carregarUnidadesDoLead(leadId); 
        } catch(error) {
            console.error("Erro ao excluir unidade:", error);
            alert(`Falha ao excluir unidade: ${error.message}`);
        }
    }
    
    function selecionarUnidade(unidade) {
        estadoAtual.unidade.id = unidade.NumeroDaUcLead;
        estadoAtual.unidade.nome = unidade.NomeDaUnidade || 'Unidade Sem Nome';
        estadoAtual.unidade.dados = unidade;
        // A linha abaixo foi alterada para chamar a nova função de preview
        carregarPreviewHistorico(unidade.NumeroDaUcLead); 
    }
    async function carregarPreviewHistorico(ucId) {
        const tableBody = document.querySelector('#unidade-historico-table tbody');
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">A carregar histórico...</td></tr>`;
        try {
            // Esta rota busca TODOS os históricos da unidade, independente do ano
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico`);
            const historicos = await response.json();
            
            tableBody.innerHTML = '';
            if (historicos.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum histórico encontrado para esta unidade.</td></tr>`;
                return;
            }

            // Pega apenas os 12 registros mais recentes para a pré-visualização
            const previewList = historicos.slice(0, 12);

            previewList.forEach(h => {
                const tr = document.createElement('tr');
                
                // Aqui usamos o IDMes completo (Ano-Mês) para o preview ficar mais claro
                const idMesCompleto = h.IDMes || '';

                tr.innerHTML = `
                    <td>${idMesCompleto}</td>
                    <td>${formatNumber(h.DemandaCP)}</td>
                    <td>${formatNumber(h.DemandaCFP)}</td>
                    <td>${formatNumber(h.DemandaCG)}</td>
                    <td>${formatNumber(h.kWhProjPonta)}</td>
                    <td>${formatNumber(h.kWhProjForaPonta)}</td>
                    <td>${formatarData(h.DataRegistroHistorico)}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Falha ao carregar preview do histórico:', error);
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">Erro ao carregar o histórico.</td></tr>`;
        }
    }
    function verUnidadesDoLead() { 
        if(estadoAtual.lead.id) {
            mudarAba('unidades'); 
            if(unidadeSelector) unidadeSelector.value = estadoAtual.lead.id;
            carregarUnidadesDoLead(estadoAtual.lead.id);
        } else {
            alert("Selecione um lead primeiro.");
        }
    }

    async function carregarHistorico(ucId, ano, tableBodyElement) {
        tableBodyElement.innerHTML = `<tr><td colspan="7" style="text-align:center;">A carregar...</td></tr>`;
        try {
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico/${ano}`);
            const historicos = await response.json();
            tableBodyElement.innerHTML = '';
            if (historicos.length === 0) {
                tableBodyElement.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum histórico encontrado para ${ano}.</td></tr>`;
                return;
            }
            historicos.forEach(h => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${h.IDMes || ''}</td>
                    <td>${formatNumber(h.DemandaCP)}</td>
                    <td>${formatNumber(h.DemandaCFP)}</td>
                    <td>${formatNumber(h.DemandaCG)}</td>
                    <td>${formatNumber(h.kWhProjPonta)}</td>
                    <td>${formatNumber(h.kWhProjForaPonta)}</td>
                    <td>${formatarData(h.DataRegistroHistorico)}</td>
                `;
                tableBodyElement.appendChild(tr);
            });
        } catch (error) {
            console.error('Falha ao carregar histórico:', error);
            tableBodyElement.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">${error.message}</td></tr>`;
        }
    }
    
    async function popularFormularioHistoricoAnual(ucId, ano) {
        historicoInputTableBody.innerHTML = '<tr><td colspan="17">Carregando...</td></tr>';
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const campos = [
            "DemandaCP", "DemandaCFP", "DemandaCG", "kWProjPonta", "kWProjForaPonta", 
            "kWhProjPonta", "kWhProjForaPonta", "kWhProjHRes", "kWhProjPontaG", 
            "kWhProjForaPontaG", "kWProjG", "kWhProjDieselP", "kWhCompensadoP", 
            "kWhCompensadoFP", "kWhCompensadoHr", "kWGeracaoProjetada"
        ];

        try {
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico/${ano}`);
            const historicosExistentes = await response.json();
            const historicoMap = new Map(historicosExistentes.map(h => [new Date(h.IDMes).getUTCMonth(), h]));
            
            historicoInputTableBody.innerHTML = ''; // Limpa a tabela antes de preencher

            for (let i = 0; i < 12; i++) {
                const mesData = historicoMap.get(i) || {};
                const tr = document.createElement('tr');
                let rowHTML = `<td>${meses[i]}</td>`;
                campos.forEach(campo => {
                    const valor = mesData[campo] != null ? formatNumber(mesData[campo]).replace(/\./g, '').replace(',', '.') : '';
                    rowHTML += `<td><input type="text" name="historico[${i}][${campo}]" value="${valor}" placeholder="0,00" class="numeric-input"></td>`;
                });
                tr.innerHTML = rowHTML;
                historicoInputTableBody.appendChild(tr);
            }
        } catch (error) {
            console.error("Erro ao buscar histórico para edição:", error);
            historicoInputTableBody.innerHTML = `<tr><td colspan="${campos.length + 1}" style="text-align:center; color: red;">Falha ao carregar dados.</td></tr>`;
        }
    }
    
    async function salvarHistorico(event) {
        event.preventDefault();
        const ano = document.getElementById('historico-form-ano').value;
        const ucId = estadoAtual.unidade.id;
        if (!ucId || !ano) {
            alert("Unidade ou Ano não definidos. Impossível salvar.");
            return;
        }

        const dadosHistorico = [];
        const rows = historicoInputTableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const mes = index + 1;
            const mesData = {
                IDMes: `${ano}-${String(mes).padStart(2, '0')}`
            };
            let hasData = false;
            const inputs = row.querySelectorAll('input');
            inputs.forEach(input => {
                const nameMatch = input.name.match(/\[(.*?)\]/g);
                if(nameMatch && nameMatch.length > 1) {
                    const name = nameMatch[1].replace(/\[|\]/g, '');
                    mesData[name] = input.value || null;
                    if (input.value) hasData = true;
                }
            });

            if (hasData) {
                dadosHistorico.push(mesData);
            }
        });

        try {
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ano: ano, dados: dadosHistorico })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            
            alert(result.sucesso);
            switchScreen('historico', 'listing');
            carregarHistorico(ucId, ano, historicoTableBody); 
        } catch (error) {
            alert(`Erro ao salvar histórico: ${error.message}`);
        }
    }

    function renderizarCalendario(year, month, inputElement) {
        calendarWrapper.innerHTML = '';
        const today = new Date();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `<button id="prev-month" class="calendar-nav-btn">&lt;</button><span class="calendar-month-year">${firstDay.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span><button id="next-month" class="calendar-nav-btn">&gt;</button>`;
        calendarWrapper.appendChild(header);
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dia => grid.innerHTML += `<div class="calendar-day-header">${dia}</div>`);
        for (let i = 0; i < firstDay.getDay(); i++) { grid.innerHTML += `<div></div>`; }
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerText = day;
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) dayElement.classList.add('today');
            dayElement.addEventListener('click', () => {
                const dataSelecionada = new Date(year, month, day);
                inputElement.value = dataSelecionada.toLocaleDateString('pt-BR');
                fecharModal(calendarModal);
            });
            grid.appendChild(dayElement);
        }
        calendarWrapper.appendChild(grid);
        document.getElementById('prev-month').addEventListener('click', () => renderizarCalendario(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, inputElement));
        document.getElementById('next-month').addEventListener('click', () => renderizarCalendario(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, inputElement));
    }

    function abrirCalendario(inputElement) {
        const hoje = new Date();
        renderizarCalendario(hoje.getFullYear(), hoje.getMonth(), inputElement);
        abrirModal(calendarModal);
    }
    
    async function carregarLeadsEmSeletor(seletorElement) {
        if (!seletorElement) return;
        try {
            const response = await fetch(`${API_URL}/api/leads`);
            if (!response.ok) throw new Error('Falha ao buscar leads');
            const leads = await response.json();
            seletorElement.innerHTML = `<option value="">Selecione um Lead...</option>`;
            leads.forEach(lead => {
                const option = document.createElement('option');
                option.value = lead.Cpf_CnpjLead;
                option.textContent = `${lead.RazaoSocialLead} (${lead.Cpf_CnpjLead})`;
                seletorElement.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar leads para o seletor:", error);
            seletorElement.innerHTML = '<option value="">Erro ao carregar leads</option>';
        }
    }
    
    async function carregarUnidadesEmSeletor(leadId, seletorDeUnidade) {
        if (!seletorDeUnidade) return;
        seletorDeUnidade.disabled = true;
        seletorDeUnidade.innerHTML = '<option value="">Carregando unidades...</option>';
        if (!leadId) {
            seletorDeUnidade.innerHTML = '<option value="">Selecione um lead primeiro</option>';
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/leads/${encodeURIComponent(leadId)}/unidades`);
            if (!response.ok) throw new Error('Falha ao buscar unidades');
            const unidades = await response.json();
            if (unidades.length === 0) {
                seletorDeUnidade.innerHTML = '<option value="">Nenhuma unidade encontrada</option>';
                return;
            }
            seletorDeUnidade.innerHTML = '<option value="">Selecione uma Unidade...</option>';
            unidades.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.NumeroDaUcLead;
                option.textContent = `${unidade.NumeroDaUcLead} - ${unidade.NomeDaUnidade || 'Sem Nome'}`;
                seletorDeUnidade.appendChild(option);
            });
            seletorDeUnidade.disabled = false;
        } catch (error) {
            console.error(`Erro ao carregar unidades para o lead ${leadId}:`, error);
            seletorDeUnidade.innerHTML = '<option value="">Erro ao carregar unidades</option>';
        }
    }

    async function buscarCep(cep) {
        const digitos = cep.replace(/\D/g, '');
        if (digitos.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
            if (!response.ok) return;
            const data = await response.json();
            if (data.erro) return;
            leadForm.querySelector('[name="Logradouro"]').value = data.logradouro;
            leadForm.querySelector('[name="Bairro"]').value = data.bairro;
            ufSelect.value = data.uf;
            await carregarCidades(data.uf, data.localidade, ufSelect, cidadeSelect);
        } catch (error) { console.error("Erro ao procurar CEP:", error); }
    }
    
    async function buscarCepUnidade(cep) {
        const digitos = cep.replace(/\D/g, '');
        if (digitos.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
            if (!response.ok) return;
            const data = await response.json();
            if (data.erro) return;
            unidadeForm.querySelector('[name="Logradouro"]').value = data.logradouro || '';
            unidadeForm.querySelector('[name="Bairro"]').value = data.bairro || '';
            if (ufUnidadeSelect) {
                ufUnidadeSelect.value = data.uf || '';
                await carregarCidades(data.uf, data.localidade, ufUnidadeSelect, cidadeUnidadeSelect);
            }
        } catch (error) { console.error("Erro ao procurar CEP da unidade:", error); }
    }

    async function carregarEstados(selectElement) {
        if (!selectElement) return;
        
        const cepInputs = document.querySelectorAll('input[name="Cep"], input[id="cep"]');
        cepInputs.forEach(input => input.disabled = true);
    
        try {
            const response = await fetch(`${API_URL}/api/localidades/estados`);
            const estados = await response.json();
            selectElement.innerHTML = '<option value="">Selecione...</option>';
            estados.forEach(uf => selectElement.innerHTML += `<option value="${uf}">${uf}</option>`);
            
            cepInputs.forEach(input => input.disabled = false);
    
        } catch (error) { 
            selectElement.innerHTML = '<option value="">Erro ao carregar</option>'; 
            console.error("Erro ao carregar estados:", error);
        }
    }
    
    async function carregarCidades(uf, cidadeParaSelecionar = null, ufSelectElem, cidadeSelectElem) {
        if (!cidadeSelectElem) return;
        if (!uf) {
            cidadeSelectElem.innerHTML = '<option value="">Selecione um estado</option>';
            cidadeSelectElem.disabled = true;
            return;
        }
        
        cidadeSelectElem.disabled = false;
        cidadeSelectElem.innerHTML = '<option value="">Carregando...</option>';
        
        try {
            const response = await fetch(`${API_URL}/api/localidades/cidades/${uf}`);
            const cidades = await response.json();
            cidadeSelectElem.innerHTML = '<option value="">Selecione...</option>';
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.Codigo; 
                option.textContent = cidade.Cidade;
                cidadeSelectElem.appendChild(option);
            });
    
            if (cidadeParaSelecionar) {
                const nomeCidadeNormalizado = cidadeParaSelecionar.trim().toUpperCase();
                
                const optByText = Array.from(cidadeSelectElem.options).find(
                    o => o.text.trim().toUpperCase() === nomeCidadeNormalizado
                );
                
                if (optByText) {
                    cidadeSelectElem.value = optByText.value;
                } else {
                     console.warn(`Cidade "${cidadeParaSelecionar}" não encontrada na lista para a UF ${uf}.`);
                }
            }
        } catch (error) { 
            cidadeSelectElem.innerHTML = '<option value="">Erro ao carregar</option>'; 
            console.error("Erro ao carregar cidades:", error);
        }
    }
    
    async function carregarPropostas(filtro = '') {
        propostasTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Carregando propostas...</td></tr>`;
        try {
            const response = await fetch(`${API_URL}/api/propostas?filtro=${encodeURIComponent(filtro)}`);
            if (!response.ok) throw new Error('Falha ao buscar propostas');
            const propostas = await response.json();
            propostasTableBody.innerHTML = '';
            if (propostas.length === 0) {
                propostasTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhuma proposta encontrada.</td></tr>`;
                return;
            }
            propostas.forEach(p => {
                const tr = document.createElement('tr');
                const dataStatusFormatada = p.DataStatusNegociacao ? new Date(p.DataStatusNegociacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';
                tr.innerHTML = `
                    <td>${p.NProposta || ''}</td>
                    <td>${p.AgenteDeVenda || ''}</td>
                    <td>${p.StatusNegociacao || ''}</td>
                    <td>${dataStatusFormatada}</td>
                    <td>${p.RazaoSocialLead || ''}</td>
                    <td>${p.NomeContato || ''}</td>
                    <td>${p.Usuario || ''}</td>
                    <td></td>
                `;
                propostasTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Erro ao carregar propostas:", error);
            propostasTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro ao carregar propostas.</td></tr>`;
        }
    }

    async function salvarProposta(event) {
        event.preventDefault();
        const formData = new FormData(propostaForm);
        const propostaData = Object.fromEntries(formData.entries());
        if (!propostaData.Cpf_CnpjLead || !propostaData.NumeroDaUcLead || !propostaData.AgenteDeVenda) {
            alert('Lead, Unidade e Agente de Venda são obrigatórios!');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/propostas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propostaData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro || 'Ocorreu um erro ao salvar a proposta.');
            alert(result.sucesso || 'Proposta salva com sucesso!');
            propostaForm.reset();
            propostaUnidadeSelector.innerHTML = '<option value="">Selecione um lead primeiro</option>';
            propostaUnidadeSelector.disabled = true;
            await carregarPropostas();
            switchScreen('proposta', 'listing');
        } catch (error) {
            console.error('Falha ao salvar proposta:', error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    }
    
    // --- V. LÓGICA DA ABA DE SIMULAÇÃO (DINÂMICA) ---
    async function iniciarAbaSimulacao() {
        simulacaoUnidadeSelector.innerHTML = '<option value="">Selecione um lead primeiro</option>';
        simulacaoUnidadeSelector.disabled = true;
        simulacaoCalcularBtn.disabled = true;
        simulacaoDadosAutomaticos.classList.add('hidden');
        simulacaoResultadoContainer.classList.add('hidden');
        simulacaoTabelaDetalhadaContainer.classList.add('hidden');
        simulacaoHistoricoContainer.classList.add('hidden');
        simulacaoLeadInputsContainer.classList.add('hidden');
        document.getElementById('tipo-cliente').checked = true;
        
        await carregarLeadsEmSeletor(simulacaoLeadSelector);
    }
    
    function renderizarGraficoHistorico(historicoData) {
        if (historicoChartInstance) {
            historicoChartInstance.destroy();
        }
        const dadosOrdenados = historicoData.sort((a, b) => String(a.IDMes).localeCompare(String(b.IDMes))).slice(-13);
        const labels = dadosOrdenados.map(h => h.IDMes);
        const consumoData = dadosOrdenados.map(h => {
            const consumoP = parseFloat(h.kWhProjPonta) || 0;
            const consumoFP = parseFloat(h.kWhProjForaPonta) || 0;
            return consumoP + consumoFP;
        });
        historicoChartInstance = new Chart(simulacaoHistoricoChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Consumo (kWh)',
                    data: consumoData,
                    borderColor: '#059BE2',
                    backgroundColor: 'rgba(5, 155, 226, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Consumo (kWh)' } } }
            }
        });
    }

    function exibirResultadosSimulacao(resultados) {
        const leadSelecionado = simulacaoLeadSelector.options[simulacaoLeadSelector.selectedIndex].text;
        const unidadeSelecionada = simulacaoUnidadeSelector.options[simulacaoUnidadeSelector.selectedIndex].text;
        const duracaoLabel = Math.round(resultados.totais.duracao_meses);

        simulacaoLabelCustoTotal.textContent = `Custo Total em ${duracaoLabel} Meses`;
        simulacaoResultadoDescricao.textContent = `Análise para: ${leadSelecionado} | Unidade: ${unidadeSelecionada}`;
        simulacaoResultadoCustoAnual.textContent = formatarMoeda(resultados.totais.custo_total_periodo);
        simulacaoResultadoCustoMensal.textContent = formatarMoeda(resultados.totais.custo_medio_mensal);
        simulacaoResultadoConsumoAnual.textContent = `${formatNumber(resultados.totais.consumo_total_periodo)} kWh`;
        simulacaoResultadoDemandaMedia.textContent = `${formatNumber(resultados.totais.demanda_media)} kW`;
        
        simulacaoTabelaDetalhadaTbody.innerHTML = '';
        resultados.detalhes_mensais.forEach(mes => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mes.mes}</td>
                <td class="text-right">${formatNumber(mes.consumo_total_kwh)}</td>
                <td class="text-right">${formatNumber(mes.demanda_total_kw)}</td>
                <td class="text-right">${formatarMoeda(mes.custo_consumo)}</td>
                <td class="text-right">${formatarMoeda(mes.custo_demanda)}</td>
                <td class="text-right">${formatarMoeda(mes.custo_impostos)}</td>
                <td class="text-right font-semibold">${formatarMoeda(mes.custo_total_mes)}</td>
            `;
            simulacaoTabelaDetalhadaTbody.appendChild(tr);
        });
    
        simulacaoResultadoContainer.classList.remove('hidden');
    }

    // --- VI. LÓGICA DA ABA DE DASHBOARD (DINÂMICA) ---
    async function atualizarDashboard() {
        if (!dadosDaSimulacao.parametros) {
            detalhesTbody.innerHTML = `<tr><td colspan="4" class="text-center">Execute uma simulação primeiro na aba <strong>"Simulação"</strong>.</td></tr>`;
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/dashboard_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosDaSimulacao.parametros)
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.erro || "Erro ao buscar dados do dashboard");
            }
            const data = await response.json();
            
            const leadInfo = simulacaoLeadSelector.options[simulacaoLeadSelector.selectedIndex].text;
            const unidadeInfo = simulacaoUnidadeSelector.options[simulacaoUnidadeSelector.selectedIndex].text;

            renderizarCabecalhoDashboard(leadInfo, unidadeInfo);
            renderizarResultadosDashboard(data);
            renderizarTabelaDashboard(data.detalhes_mensais);
            renderizarGraficoDashboard(data.detalhes_mensais);

        } catch (error) {
            console.error("Erro ao atualizar dashboard:", error);
            detalhesTbody.innerHTML = `<tr><td colspan="4" class="text-center" style="color:red;">${error.message}</td></tr>`;
        }
    }

    function renderizarCabecalhoDashboard(leadInfo, unidadeInfo) {
        reportLeadName.textContent = leadInfo;
        reportUnitName.textContent = unidadeInfo;
    }

    function renderizarResultadosDashboard(data) {
        dashResultadoCustoAtual.textContent = formatarMoeda(data.custo_atual);
        dashResultadoCustoSimulado.textContent = formatarMoeda(data.custo_simulado);
        dashResultadoEconomiaReais.textContent = formatarMoeda(data.economia_reais);
        dashResultadoEconomiaPercentual.textContent = `(${data.economia_percentual.toFixed(2)}%)`;
    }

    function renderizarTabelaDashboard(detalhes) {
        detalhesTbody.innerHTML = '';
        detalhes.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.mes}</td>
                <td>${formatarMoeda(item.custoAtual)}</td>
                <td>${formatarMoeda(item.custoSimulado)}</td>
                <td class="coluna-economia">${formatarMoeda(item.economia)}</td>
            `;
            detalhesTbody.appendChild(tr);
        });

        const totalAtualValor = detalhes.reduce((acc, item) => acc + item.custoAtual, 0);
        const totalSimuladoValor = detalhes.reduce((acc, item) => acc + item.custoSimulado, 0);
        const totalEconomiaValor = detalhes.reduce((acc, item) => acc + item.economia, 0);
        
        totalAtual.textContent = formatarMoeda(totalAtualValor);
        totalSimulado.textContent = formatarMoeda(totalSimuladoValor);
        totalEconomia.textContent = formatarMoeda(totalEconomiaValor);
    }

    function renderizarGraficoDashboard(detalhes) {
        if (dashboardChartInstance) {
            dashboardChartInstance.destroy();
        }
        const labels = detalhes.map(d => d.mes);
        const dadosAtuais = detalhes.map(d => d.custoAtual);
        const dadosSimulados = detalhes.map(d => d.custoSimulado);

        dashboardChartInstance = new Chart(ctxDashboard, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Custo Atual (R$)', data: dadosAtuais, backgroundColor: 'rgba(108, 117, 125, 0.7)', borderColor: 'rgba(108, 117, 125, 1)', borderWidth: 1 },
                    { label: 'Custo Simulado (R$)', data: dadosSimulados, backgroundColor: 'rgba(40, 167, 69, 0.7)', borderColor: 'rgba(40, 167, 69, 1)', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { callback: value => formatarMoeda(value) } } },
                plugins: { tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatarMoeda(context.parsed.y)}` } } }
            }
        });
    }
    async function carregarParametros() {
    const saveButton = document.getElementById('save-all-params');
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';

    try {
        const response = await fetch(`${API_URL}/api/parametros`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os parâmetros do servidor.');
        }
        const params = await response.json();

        // Popular cada seção com os dados recebidos
        popularSeletorClientesParametros(params.clientes);
        popularFormGerais(params.simulacao_geral);
        popularTabelaPrecos(params.precos_ano);
        popularTabelaCustos(params.custos_mes);

    } catch (error) {
        console.error("Erro ao carregar parâmetros:", error);
        alert(`Erro ao carregar parâmetros: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> Salvar Todos os Parâmetros';
    }
}

// --- LÓGICA DA ABA DE PARÂMETROS ---

function setupParametrosSubTabs() {
    const subNavButtons = document.querySelectorAll('.sub-nav-button');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' de todos
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            subTabContents.forEach(content => content.classList.remove('active'));

            // Adiciona 'active' ao clicado
            button.classList.add('active');
            const subTabId = `sub-tab-${button.dataset.subTab}`;
            document.getElementById(subTabId).classList.add('active');
            
            // Carrega os dados da sub-aba de Ajustes se for a primeira vez que é clicada
            if (button.dataset.subTab === 'ajustes' && !button.dataset.loaded) {
                carregarDadosAjustes();
                button.dataset.loaded = 'true'; // Marca como carregado
            }
            if (button.dataset.subTab === 'geracao' && !button.dataset.loaded) {
                carregarDadosGeracao();
                button.dataset.loaded = 'true';
            }
        });
    });
}

async function carregarDadosAjustes() {
    await carregarAjusteIPCA();
    await carregarDistribuidoras();
}

async function carregarAjusteIPCA() {
    const tbody = document.querySelector('#table-ajuste-ipca tbody');
    tbody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/api/parametros/ajuste-ipca`);
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.Ano}</td>
                <td>${formatNumber(item.PctIPCA)}</td>
                <td><button class="btn btn-edit btn-sm">Editar</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3" style="color:red;">Erro ao carregar dados.</td></tr>';
        console.error("Erro ao carregar ajuste IPCA:", error);
    }
}

async function carregarDistribuidoras() {
    const select = document.getElementById('ajuste-tarifa-distribuidora-select');
    select.innerHTML = '<option value="">Carregando...</option>';
    try {
        const response = await fetch(`${API_URL}/api/parametros/distribuidoras`);
        const data = await response.json();
        select.innerHTML = '<option value="">Selecione uma distribuidora...</option>';
        data.forEach(cnpj => {
            const option = document.createElement('option');
            option.value = cnpj;
            option.textContent = cnpj; // Pode-se formatar o CNPJ aqui se desejar
            select.appendChild(option);
        });
    } catch (error) {
        select.innerHTML = '<option value="">Erro ao carregar.</option>';
        console.error("Erro ao carregar distribuidoras:", error);
    }
}

async function carregarAjusteTarifa(cnpj) {
    const tbody = document.querySelector('#table-ajuste-tarifa tbody');
    if (!cnpj) {
        tbody.innerHTML = '';
        return;
    }
    tbody.innerHTML = '<tr><td colspan="8">Carregando tarifas...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/api/parametros/ajuste-tarifa/${encodeURIComponent(cnpj)}`);
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.Ano}</td>
                <td>${formatNumber(item.PctTusdkWP)}</td>
                <td>${formatNumber(item.PctTusdkWFP)}</td>
                <td>${formatNumber(item.PctTusdMWhP)}</td>
                <td>${formatNumber(item.PctTusdMWhFP)}</td>
                <td>${formatNumber(item.PctTEMWhP)}</td>
                <td>${formatNumber(item.PctTEMWhFP)}</td>
                <td><button class="btn btn-edit btn-sm">Editar</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="8" style="color:red;">Erro ao carregar tarifas.</td></tr>';
        console.error("Erro ao carregar ajuste de tarifa:", error);
    }
}
async function carregarDadosGeracao() {
    const tbodyDados = document.querySelector('#table-dados-geracao tbody');
    const tbodyCurva = document.querySelector('#table-curva-geracao tbody');
    tbodyDados.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    tbodyCurva.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/api/parametros/geracao`);
        if (!response.ok) throw new Error('Falha ao buscar dados de geração');
        const data = await response.json();

        popularTabelaDadosGeracao(data.dados_geracao);
        popularTabelaCurvaGeracao(data.curva_geracao);

    } catch (error) {
        tbodyDados.innerHTML = '<tr><td colspan="5" style="color:red;">Erro ao carregar dados.</td></tr>';
        tbodyCurva.innerHTML = '<tr><td colspan="5" style="color:red;">Erro ao carregar dados.</td></tr>';
        console.error("Erro ao carregar dados de geração:", error);
    }
}

function popularTabelaDadosGeracao(dados) {
    const tbody = document.querySelector('#table-dados-geracao tbody');
    tbody.innerHTML = '';
    if (!dados || dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum dado encontrado.</td></tr>';
        return;
    }
    dados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.Fonte || ''}</td>
            <td>${item.Local || ''}</td>
            <td>${item.VolumeMWhAno || ''}</td>
            <td>${formatNumber(item.PrecoRS_MWh)}</td>
            <td><button class="btn btn-edit btn-sm">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
}
// SUBSTITUA A FUNÇÃO ANTIGA POR ESTA VERSÃO CORRIGIDA

function popularTabelaCustos(custos) {
    // Armazena os dados originais para a função de edição consultar
    popularTabelaCustos.dados = custos;

    const tbody = document.querySelector('#table-custos-mes tbody');
    if (!tbody || !custos) return;

    tbody.innerHTML = ''; // Limpa a tabela
    custos.forEach(custo => {
        const tr = document.createElement('tr');        
        tr.dataset.mesRefOriginal = (typeof custo.MesRef === 'string') ? custo.MesRef.split('T')[0] : '';
        
        tr.innerHTML = `
            <td>${custo.MesRef ? new Date(custo.MesRef).toLocaleDateString('pt-BR', {month: '2-digit', year: 'numeric', timeZone: 'UTC'}) : ''}</td>
            <td>${formatNumber(custo.LiqMCPACL)}</td>
            <td>${formatNumber(custo.LiqMCPAPE)}</td>
            <td>${formatNumber(custo.LiqEnerReserva)}</td>
            <td>${formatNumber(custo.LiqRCAP)}</td>
            <td>${formatNumber(custo.SpreadVenda)}</td>
            <td>${formatNumber(custo.ModelagemMes)}</td>
            <td><button class="btn btn-edit btn-sm">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
}
function popularTabelaCurvaGeracao(dados) {
    const tbody = document.querySelector('#table-curva-geracao tbody');
    tbody.innerHTML = '';
      if (!dados || dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum dado encontrado.</td></tr>';
        return;
    }
    dados.forEach(item => {
        const tr = document.createElement('tr');

        // ---> ALTERAÇÃO AQUI: Adiciona o dataset com o IdMes original (ex: 202501)
        tr.dataset.idmesOriginal = item.IdMes;

        const idMesFormatado = String(item.IdMes).replace(/(\d{4})(\d{2})/, '$1-$2');
        tr.innerHTML = `
            <td>${idMesFormatado}</td>
            <td>${item.Fonte || ''}</td>
            <td>${item.Local || ''}</td>
            <td>${formatNumber(item.PctSazonalizacaoMes)}</td>
            <td><button class="btn btn-edit btn-sm">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
}
function popularSeletorClientesParametros(clientes) {
    const select = document.getElementById('param-cliente-select');
    if (!select || !clientes) return;

    // Guarda os dados dos clientes no próprio elemento para fácil acesso
    select.dataset.clientes = JSON.stringify(clientes);

    const valorAtual = select.value;
    select.innerHTML = '<option value="">Selecione um cliente/lead...</option>';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.Cliente;
        option.textContent = cliente.Cliente;
        select.appendChild(option);
    });

    if (valorAtual && select.querySelector(`option[value="${valorAtual}"]`)) {
        select.value = valorAtual;
    } else if (clientes.length > 0) {
        select.value = clientes[0].Cliente;
    }
    
    // Popula o formulário com os dados do cliente selecionado
    popularFormularioCliente(clientes, select.value);

    // Adiciona o listener para futuras mudanças
    select.removeEventListener('change', handleClienteParamChange);
    select.addEventListener('change', handleClienteParamChange);
}

function handleClienteParamChange(event) {
    const select = event.target;
    const clientes = JSON.parse(select.dataset.clientes || '[]');
    popularFormularioCliente(clientes, select.value);
}

function popularFormularioCliente(clientes, clienteSelecionado) {
    const form = document.getElementById('form-param-clientes');
    const clienteData = clientes.find(c => c.Cliente === clienteSelecionado);
    
    if (clienteData) {
        form.querySelector('[name="DataInicialSimula"]').value = formatarData(clienteData.DataInicialSimula);
        form.querySelector('[name="DataFinalSimula"]').value = formatarData(clienteData.DataFinalSimula);
        form.querySelector('[name="TipoGeracao"]').value = clienteData.TipoGeracao;
        form.querySelector('[name="IncluirGrupoB"]').checked = clienteData.IncluirGrupoB;
    } else {
        // Limpa o formulário se nenhum cliente for selecionado
        form.reset();
    }
}
function popularFormGerais(simulacaoGeral) {
    if (!simulacaoGeral) return;
    document.getElementById('param-pis').value = simulacaoGeral.Pis || '';
    document.getElementById('param-cofins').value = simulacaoGeral.Cofins || '';
    document.getElementById('param-custo-garantia').value = simulacaoGeral.PctCustoGarantia || '';
    document.getElementById('param-meses-garantia').value = simulacaoGeral.MesesGarantia || '';
    document.getElementById('param-perdas').value = simulacaoGeral.Perdas || '';
    document.getElementById('param-fonte-base').value = simulacaoGeral.FonteEnergiaBase || 'I0';
    document.getElementById('param-preco-diesel').value = simulacaoGeral.PrecoDiesel || '';
    document.getElementById('param-rendimento-gerador').value = simulacaoGeral.RendimentoGerador || '';
}

function popularTabelaPrecos(precos) {
    const tbody = document.querySelector('#table-precos-ano tbody');
    if (!tbody || !precos) return;

    tbody.innerHTML = ''; // Limpa a tabela
    precos.forEach(preco => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${preco.Ano || ''}</td>
            <td>${preco.Fonte || ''}</td>
            <td>${formatNumber(preco.PrecoRS_MWh)}</td>
            <td>${preco.Corrigir || ''}</td>
            <td><button class="btn btn-edit btn-sm">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
}



    // --- VII. EVENT LISTENERS ---
    tabButtons.forEach(button => button.addEventListener('click', () => mudarAba(button.dataset.tab)));
    addLeadBtn.addEventListener('click', () => { limparFormularioLead(); switchScreen('cadastro', 'form'); });
    cadastroBackBtn.addEventListener('click', () => { limparFormularioLead(); switchScreen('cadastro', 'listing'); });
    refreshLeadsBtn.addEventListener('click', () => carregarLeads(filterInput.value));
    leadForm.addEventListener('submit', salvarLead);
    clearLeadButton.addEventListener('click', () => { if(modoEdicao.lead) { switchScreen('cadastro', 'listing'); } limparFormularioLead(); });
    filterInput.addEventListener('keyup', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => carregarLeads(filterInput.value), 400); });
    unidadeSelector.addEventListener('change', () => { const leadId = unidadeSelector.value; if(leadId){ const t = unidadeSelector.options[unidadeSelector.selectedIndex].text; estadoAtual.lead.id = leadId; estadoAtual.lead.razaoSocial = t.split(' (')[0]; } else { estadoAtual.lead = { id: null, razaoSocial: null }; } carregarUnidadesDoLead(leadId); });
    addUnidadeBtn.addEventListener('click', () => { if (!estadoAtual.lead.id) { alert("Selecione um lead."); return; } limparFormularioUnidade(); unidadesSubtitle.innerText = `Nova Unidade para: ${estadoAtual.lead.razaoSocial}`; switchScreen('unidades', 'form'); });
    unidadesBackBtn.addEventListener('click', () => switchScreen('unidades', 'listing'));
    unidadeForm.addEventListener('submit', salvarUnidade);
    clearUnidadeButton.addEventListener('click', limparFormularioUnidade);
    
    document.getElementById('ajuste-tarifa-distribuidora-select').addEventListener('change', (event) => {
        carregarAjusteTarifa(event.target.value);
    });
    
    historicoForm.addEventListener('submit', salvarHistorico);
    historicoBackBtn.addEventListener('click', () => switchScreen('historico', 'listing'));
    
    historicoLeadSelector.addEventListener('change', (e) => {
        const leadId = e.target.value;
        estadoAtual.lead.id = leadId;
        historicoTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Selecione uma unidade.</td></tr>`;
        historicoAnoSelector.disabled = true;
        historicoAnoSelector.value = new Date().getFullYear();
        manageHistoricoBtn.disabled = true;
        carregarUnidadesEmSeletor(leadId, historicoUnidadeSelector);
    });

    historicoUnidadeSelector.addEventListener('change', (e) => {
        const ucId = e.target.value;
        estadoAtual.unidade.id = ucId;

        // Limpa a tabela e desabilita os controles
        historicoTableBody.innerHTML = '';
        historicoAnoSelector.disabled = true;
        manageHistoricoBtn.disabled = true;

        if (ucId) {
            // 1. Carrega TODO o histórico na tabela
            carregarTabelaHistoricoCompleto(ucId); 
            
            // 2. Define o ano atual como um padrão para facilitar a adição de novos dados
            historicoAnoSelector.value = new Date().getFullYear();
            
            // 3. Habilita os controles para o usuário poder agir
            historicoAnoSelector.disabled = false;
            manageHistoricoBtn.disabled = false;
        }
    });


    closePrecoMwhModalBtn.addEventListener('click', () => fecharModal(precoMwhModal));
    cancelPrecoMwhBtn.addEventListener('click', () => fecharModal(precoMwhModal));

    precoMwhForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const anoOriginal = document.getElementById('preco-mwh-ano-original').value;
        const fonteOriginal = document.getElementById('preco-mwh-fonte-original').value;
        
        const formData = new FormData(precoMwhForm);
        const data = Object.fromEntries(formData.entries());

        const url = `${API_URL}/api/parametros/preco-mwh/${anoOriginal}/${encodeURIComponent(fonteOriginal)}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            
            alert(result.sucesso);
            fecharModal(precoMwhModal);
            await carregarParametros(); // Atualiza a tabela na interface
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    });
    manageHistoricoBtn.addEventListener('click', () => {
        const ucId = estadoAtual.unidade.id;
        // Pega o ano diretamente do campo de input no momento do clique
        const ano = historicoAnoSelector.value; 

        if (!ucId || !ano || ano.length !== 4) {
            alert("Selecione uma Unidade e digite um ano válido (4 dígitos) para gerenciar.");
            return;
        }
        
        // O resto do código permanece igual
        estadoAtual.historico.ano = ano;
        document.getElementById('historico-form-ano').value = ano;
        historicoSubtitle.textContent = `Editando histórico para a UC ${ucId} do ano de ${ano}.`;
        popularFormularioHistoricoAnual(ucId, ano);
        switchScreen('historico', 'form');
    });




    // Botões Fechar e Cancelar sub abas
    closeCustosMesModalBtn.addEventListener('click', () => fecharModal(custosMesModal));
    cancelCustosMesBtn.addEventListener('click', () => fecharModal(custosMesModal));

    custosMesForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const mesRefOriginal = document.getElementById('custos-mes-ref-original').value;
        const formData = new FormData(custosMesForm);
        const data = Object.fromEntries(formData.entries());

        const url = `${API_URL}/api/parametros/custos-mes/${mesRefOriginal}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);

            alert(result.sucesso);
            fecharModal(custosMesModal);
            await carregarParametros();
        } catch (error) {
            alert(`Erro ao salvar Custos Base: ${error.message}`);
        }
    });

    closeAjusteTarifaModalBtn.addEventListener('click', () => fecharModal(ajusteTarifaModal));
    cancelAjusteTarifaBtn.addEventListener('click', () => fecharModal(ajusteTarifaModal));

    ajusteTarifaForm.addEventListener('submit',async (event) => {
        event.preventDefault();
        const cnpjOriginal = document.getElementById('ajuste-tarifa-cnpj-original').value;
        const anoOriginal = document.getElementById('ajuste-tarifa-ano-original').value;
        const formData = new formData(ajusteTarifaForm);
        const data = Object.fromEntries(formData.entries());

        const url = `${API_URL}/api/parametros/ajuste-tarifa/${encodeURIComponent(cnpjOriginal)}/${anoOriginal}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                header: { 'Content-Type': 'application/json '},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);

            alert(result.sucesso);
            fecharModal(ajusteTarifaModal);
            await carregarAjusteTarifa(cnpjOriginal);
        } catch (error) {
            alert(`Erro ao salvar Ajuste de Tarifa: ${error.message}`);
        }
    });

    closeDadosGeracaoModalBtn.addEventListener('click', () => fecharModal(dadosGeracaoModal));
    cancelDadosGeracaoBtn.addEventListener('click', () => fecharModal(dadosGeracaoModal));

    dadosGeracaoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fonteOriginal = document.getElementById('dados-geracao-fonte-original').value;
        const localOriginal = document.getElementById('dados-geracao-local-original').value;
        const formData = new formData(dadosGeracaoForm);
        const data = Object.fromEntries(formData.entries());

        const url = `${API_URL}/api/parametros/dados-geracao/${encodeURIComponent(fonteOriginal)}/${encodeURIComponent(localOriginal)}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error (result.erro);

            alert(result.sucesso);
            fecharModal(dadosGeracaoModal);
            await carregarDadosGeracao();
        } catch (error) {
            alert(`Erro ao salvar Dados de Geração: ${error.message}`);
        }
    });
    
    closeCurvaGeracaoModalBtn.addEventListener('click', () => fecharModal(curvaGeracaoModal));
    cancelCurvaGeracaoBtn.addEventListener('click', () => fecharModal(curvaGeracaoModal));

    curvaGeracaoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const idmesOriginal = document.getElementById('curva-geracao-idmes-original').value;
        const fonteOriginal = document.getElementById('curva-geracao-fonte-original').value;
        const localOriginal = document.getElementById('curva-geracao-local-original').value;
        const formData = new formatarData(curvaGeracaoForm);
        const data = Object.fromEntries(formData.entries());

        const url = `${API_URL}/api/parametros/curva-geracao/${idmesOriginal}/${encodeURIComponent(fonteOriginal)}/${encodeURIComponent(localOriginal)}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);

            alert(result.sucesso);
            fecharModal(curvaGeracaoModal);
            await carregarDadosGeracao();
        } catch (error){
            alert(`Erro ao salvar Curva de Geração: ${error.message}`);
        }
    });

    addPropostaBtn.addEventListener('click', () => { propostaForm.reset(); propostaUnidadeSelector.innerHTML = '<option value="">Selecione um lead primeiro</option>'; propostaUnidadeSelector.disabled = true; switchScreen('proposta', 'form'); });
    propostaBackBtn.addEventListener('click', () => switchScreen('proposta', 'listing'));
    refreshPropostasBtn.addEventListener('click', () => carregarPropostas(filterPropostasInput.value));
    propostaLeadSelector.addEventListener('change', (e) => carregarUnidadesEmSeletor(e.target.value, propostaUnidadeSelector));
    propostaForm.addEventListener('submit', salvarProposta);
    filterPropostasInput.addEventListener('keyup', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => carregarPropostas(filterPropostasInput.value), 400); });
    closeVendedorModalButton.addEventListener('click', () => { fecharModal(vendedorModal); vendedorContatoForm.reset(); });
    vendedorModal.addEventListener('click', (e) => { if (e.target === vendedorModal) { fecharModal(vendedorModal); vendedorContatoForm.reset(); } });
    vendedorContatoForm.addEventListener('submit', salvarVendedorContato);
    document.addEventListener('click', (e) => { const d=e.target.closest('.datepicker-input')||(e.target.classList.contains('fa-calendar-days')&&e.target.closest('.input-group').querySelector('.datepicker-input')); if(d){const i=d.classList.contains('datepicker-input')?d:d.closest('.input-group').querySelector('.datepicker-input');if(i)abrirCalendario(i);}});
    calendarModal.addEventListener('click', (e) => { if (e.target === calendarModal) fecharModal(calendarModal); });
    cpfCnpjInput.addEventListener('blur', (e) => e.target.value = formatarCpfCnpj(e.target.value));
    cepInput.addEventListener('blur', (e) => { e.target.value = formatarCep(e.target.value); buscarCep(e.target.value); });
    unidadeForm.querySelector('[name="Cep"]').addEventListener('blur', (e) => { e.target.value = formatarCep(e.target.value); buscarCepUnidade(e.target.value); });
    ufSelect.addEventListener('change', () => carregarCidades(ufSelect.value, null, ufSelect, cidadeSelect));
    ufUnidadeSelect.addEventListener('change', () => carregarCidades(ufUnidadeSelect.value, null, ufUnidadeSelect, cidadeUnidadeSelect));
    
    // Listeners da Aba de Simulação
    tipoSimulacaoRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const tipo = e.target.value;
            if (tipo === 'lead') {
                simulacaoLeadInputsContainer.classList.remove('hidden');
                simulacaoDadosAutomaticos.classList.add('hidden');
                simulacaoHistoricoContainer.classList.add('hidden');
                simulacaoUnidadeSelector.disabled = true;
            } else { // tipo === 'cliente'
                simulacaoLeadInputsContainer.classList.add('hidden');
                simulacaoUnidadeSelector.disabled = false;
            }
        });
    });
    // Listeners para o Modal de Ajuste IPCA
    addIpcaBtn.addEventListener('click', () => {
        ipcaForm.reset(); // Limpa o formulário
        ipcaModalTitle.innerHTML = '<i class="fas fa-plus"></i> Adicionar Ajuste IPCA';
        ipcaForm.dataset.mode = 'add'; // Define o modo como "adicionar"
        document.getElementById('ipca-ano').disabled = false;
        abrirModal(ipcaModal);
    });

    closeIpcaModalBtn.addEventListener('click', () => fecharModal(ipcaModal));
    cancelIpcaBtn.addEventListener('click', () => fecharModal(ipcaModal));

    ipcaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(ipcaForm);
        const data = Object.fromEntries(formData.entries());
        const mode = ipcaForm.dataset.mode;

        let url = `${API_URL}/api/parametros/ajuste-ipca`;
        let method = 'POST';

        if (mode === 'edit') {
            const anoOriginal = ipcaAnoOriginalInput.value;
            url = `${API_URL}/api/parametros/ajuste-ipca/${anoOriginal}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            
            alert(result.sucesso);
            fecharModal(ipcaModal);
            await carregarAjusteIPCA(); // Atualiza a tabela com os novos dados
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    });


    document.getElementById('parametros').addEventListener('click', (event) => {
        const editButton = event.target.closest('.btn-edit');
        if (!editButton) return;

        const table = editButton.closest('table');
        if (!table) return;

        if (table.id === 'table-ajuste-ipca') {
            abrirModalEdicaoIPCA(editButton);
        } 
        else if (table.id === 'table-precos-ano') {
            abrirModalEdicaoPrecoMwh(editButton);
        }
        else if (table.id === 'table-custos-mes'){
            abrirModalEdicaoCustosMes(editButton);
        }
        else if (table.id === 'table-ajuste-tarifa'){
            abrirModalEdicaoAjusteTarifa(editButton);
        }
        else if (table.id === 'table-dados-geracao'){
            abrirModalEdicaoDadosGeracao(editButton);
        }
        else if (table.id === 'table-curva-geracao'){
            abrirModalEdicaoCurvaGeracao(editButton);
        }
    });
    function abrirModalEdicaoPrecoMwh(button) {
        const row = button.closest('tr');
        const ano = row.cells[0].textContent;
        const fonte = row.cells[1].textContent;
        const preco = row.cells[2].textContent;
        const corrigir = row.cells[3].textContent;

        // Preenche os inputs escondidos com as chaves originais
        document.getElementById('preco-mwh-ano-original').value = ano;
        document.getElementById('preco-mwh-fonte-original').value = fonte;

        // Preenche o formulário
        precoMwhForm.querySelector('#preco-mwh-ano').value = ano;
        precoMwhForm.querySelector('#preco-mwh-fonte').value = fonte;
        precoMwhForm.querySelector('#preco-mwh-preco').value = preco.replace(/\./g, '').replace(',', '.'); // Formata para o input
        precoMwhForm.querySelector('#preco-mwh-corrigir').value = corrigir;

        abrirModal(precoMwhModal);
    }
    periodoRapidoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const meses = parseInt(btn.dataset.meses, 10);
            const hoje = new Date();
            const inicio = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
            const fim = new Date(inicio.getFullYear(), inicio.getMonth() + meses - 1, inicio.getDate());
            const fimCorrigido = new Date(fim.getFullYear(), fim.getMonth() + 1, 0);
            simulacaoDataInicioInput.value = inicio.toLocaleDateString('pt-BR');
            simulacaoDataFimInput.value = fimCorrigido.toLocaleDateString('pt-BR');
        });
    });

    function abrirModalEdicaoCustosMes(button) {
        const row = button.closest('tr');
        const mesRefOriginal = row.dataset.mesRefOriginal; // Pega a data original do atributo
        
        document.getElementById('custos-mes-ref-original').value = mesRefOriginal;
        custosMesForm.querySelector('#custos-mes-ref').value = row.cells[0].textContent;
        custosMesForm.querySelector('[name="LiqMCPACL"]').value = row.cells[1].textContent.replace(/\./g, '').replace(',', '.');
        custosMesForm.querySelector('[name="LiqMCPAPE"]').value = row.cells[2].textContent.replace(/\./g, '').replace(',', '.');
        custosMesForm.querySelector('[name="LiqEnerReserva"]').value = row.cells[3].textContent.replace(/\./g, '').replace(',', '.');
        custosMesForm.querySelector('[name="LiqRCAP"]').value = row.cells[4].textContent.replace(/\./g, '').replace(',', '.');
        custosMesForm.querySelector('[name="SpreadVenda"]').value = row.cells[5].textContent.replace(/\./g, '').replace(',', '.');
        custosMesForm.querySelector('[name="ModelagemMes"]').value = row.cells[6].textContent.replace(/\./g, '').replace(',', '.');
        abrirModal(custosMesModal);
    }

    function abrirModalEdicaoAjusteTarifa(button) {
        const cnpj = document.getElementById('ajuste-tarifa-distribuidora-select').value;
        const row = button.closest('tr');
        const ano = row.cells[0].textContent;

        document.getElementById('ajuste-tarifa-cnpj-original').value = cnpj;
        document.getElementById('ajuste-tarifa-ano-original').value = ano;

        ajusteTarifaForm.querySelector('[name="CnpjDistribuidora"]').value = cnpj;
        ajusteTarifaForm.querySelector('[name="Ano"]').value = ano;
        ajusteTarifaForm.querySelector('[name="PctTusdkWP"]').value = row.cells[1].textContent.replace(/\./g, '').replace(',', '.');
        ajusteTarifaForm.querySelector('[name="PctTusdkWFP"]').value = row.cells[2].textContent.replace(/\./g, '').replace(',', '.');
        ajusteTarifaForm.querySelector('[name="PctTusdMWhP"]').value = row.cells[3].textContent.replace(/\./g, '').replace(',', '.');
        ajusteTarifaForm.querySelector('[name="PctTusdMWhFP"]').value = row.cells[4].textContent.replace(/\./g, '').replace(',', '.');
        ajusteTarifaForm.querySelector('[name="PctTEMWhP"]').value = row.cells[5].textContent.replace(/\./g, '').replace(',', '.');
        ajusteTarifaForm.querySelector('[name="PctTEMWhFP"]').value = row.cells[6].textContent.replace(/\./g, '').replace(',', '.');
        
        abrirModal(ajusteTarifaModal);
    }

    function abrirModalEdicaoDadosGeracao(button) {
        const row = button.closest('tr');
        const fonte = row.cells[0].textContent;
        const local = row.cells[1].textContent;

        document.getElementById('dados-geracao-fonte-original').value = fonte;
        document.getElementById('dados-geracao-local-original').value = local;

        dadosGeracaoForm.querySelector('[name="Fonte"]').value = fonte;
        dadosGeracaoForm.querySelector('[name="Local"]').value = local;
        dadosGeracaoForm.querySelector('[name="VolumeMWhAno"]').value = row.cells[2].textContent.replace(/\./g, '').replace(',', '.');
        dadosGeracaoForm.querySelector('[name="PrecoRS_MWh"]').value = row.cells[3].textContent.replace(/\./g, '').replace(',', '.');

        abrirModal(dadosGeracaoModal);
    }

    function abrirModalEdicaoCurvaGeracao(button) {
        const row = button.closest('tr');
        const idMesOriginal = row.dataset.idmesOriginal; // Pega o ID original (ex: 202501)
        const fonte = row.cells[1].textContent;
        const local = row.cells[2].textContent;

        document.getElementById('curva-geracao-idmes-original').value = idMesOriginal;
        document.getElementById('curva-geracao-fonte-original').value = fonte;
        document.getElementById('curva-geracao-local-original').value = local;
        
        curvaGeracaoForm.querySelector('[name="IdMes"]').value = row.cells[0].textContent; // Mostra YYYY-MM
        curvaGeracaoForm.querySelector('[name="Fonte"]').value = fonte;
        curvaGeracaoForm.querySelector('[name="Local"]').value = local;
        curvaGeracaoForm.querySelector('[name="PctSazonalizacaoMes"]').value = row.cells[3].textContent.replace(/\./g, '').replace(',', '.');

        abrirModal(curvaGeracaoModal);
    }

    simulacaoLeadSelector.addEventListener('change', async () => {
        const leadId = simulacaoLeadSelector.value;
        simulacaoUnidadeSelector.innerHTML = '<option value="">Carregando unidades...</option>';
        simulacaoUnidadeSelector.disabled = true;
        simulacaoCalcularBtn.disabled = true;
        simulacaoDadosAutomaticos.classList.add('hidden');
        simulacaoHistoricoContainer.classList.add('hidden');
    
        if (leadId) {
            await carregarUnidadesEmSeletor(leadId, simulacaoUnidadeSelector);
        } else {
            simulacaoUnidadeSelector.innerHTML = '<option value="">Selecione um lead primeiro</option>';
        }
    });
    
    simulacaoUnidadeSelector.addEventListener('change', async () => {
        const select = simulacaoUnidadeSelector;
        const ucId = select.value;

        simulacaoHistoricoContainer.classList.add('hidden');
        simulacaoDadosAutomaticos.classList.add('hidden');
        simulacaoCalcularBtn.disabled = true;

        if (ucId) {
            try {
                const responseUnidade = await fetch(`${API_URL}/api/unidade/${encodeURIComponent(ucId)}`);
                if (!responseUnidade.ok) throw new Error('Falha ao buscar detalhes da unidade.');
                const unidadeSelecionada = await responseUnidade.json();

                if (unidadeSelecionada) {
                    dadosDaSimulacao.unidade = unidadeSelecionada;
                    simulacaoInfoTarifa.textContent = unidadeSelecionada.Tarifa || ' N/D';
                    simulacaoInfoDemanda.textContent = ` ${unidadeSelecionada.SubgrupoTarifario || ' N/D'}`;
                    simulacaoInfoImpostos.textContent = `ICMS ${unidadeSelecionada.AliquotaICMS || 0}%`;
                    simulacaoInfoMercado.textContent = unidadeSelecionada.MercadoAtual || ' N/D';
                    simulacaoDadosAutomaticos.classList.remove('hidden');
                    simulacaoCalcularBtn.disabled = false;

                    const responseHistorico = await fetch(`${API_URL}/api/unidades/${encodeURIComponent(ucId)}/historico`);
                    if (!responseHistorico.ok) throw new Error('Falha ao buscar histórico da unidade.');
                    
                    const historico = await responseHistorico.json();
                    if (historico && historico.length > 0) {
                        renderizarGraficoHistorico(historico);
                        simulacaoHistoricoContainer.classList.remove('hidden');
                    }
                }
            } catch (error) {
                console.error("Erro ao processar unidade ou histórico:", error);
                alert("Não foi possível carregar os dados da unidade selecionada.");
            }
        }
    });
    
    simulacaoCalcularBtn.addEventListener('click', async () => {
        const leadId = simulacaoLeadSelector.value;
        const ucId = simulacaoUnidadeSelector.value;
        const tipo = document.querySelector('input[name="tipo_simulacao"]:checked').value;
        const dataInicio = simulacaoDataInicioInput.value;
        const dataFim = simulacaoDataFimInput.value;

        if (!leadId || (tipo === 'cliente' && !ucId)) {
            alert("Por favor, selecione um Lead/Cliente e uma Unidade Consumidora.");
            return;
        }
        if (!dataInicio || !dataFim) {
            alert("Por favor, defina o período de início e fim da simulação.");
            return;
        }
        
        simulacaoBtnText.textContent = 'Calculando...';
        simulacaoBtnIcon.className = 'fas fa-spinner fa-spin';
        simulacaoCalcularBtn.disabled = true;
    
        const parametrosSimulacao = {
            lead_id: leadId,
            uc_id: ucId,
            tipo: tipo,
            data_inicio: dataInicio,
            data_fim: dataFim,
            consumo_estimado: tipo === 'lead' ? document.getElementById('lead-consumo-estimado').value : null,
            demanda_estimada: tipo === 'lead' ? document.getElementById('lead-demanda-estimada').value : null,
        };
    
        try {
            const response = await fetch(`${API_URL}/api/simulacao/calcular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parametrosSimulacao)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
            }
    
            const resultados = await response.json();
            dadosDaSimulacao.parametros = parametrosSimulacao; // Salva para o dashboard
            exibirResultadosSimulacao(resultados);
    
        } catch (error) {
            console.error("Erro ao executar simulação:", error);
            alert(`Falha ao calcular a simulação: ${error.message}`);
        } finally {
            simulacaoBtnText.textContent = 'Calcular Custo';
            simulacaoBtnIcon.className = 'fas fa-calculator';
            simulacaoCalcularBtn.disabled = false;
        }
    });
    
    saveAllParamsBtn.addEventListener('click', salvarTodosParametros);

    async function salvarTodosParametros() {
        saveAllParamsBtn.disabled = true;
        saveAllParamsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        const formClientes = document.getElementById('form-param-clientes');
        const formDataClientes = new FormData(formClientes);
        const clienteParams = Object.fromEntries(formDataClientes.entries());
        clienteParams.IncluirGrupoB = formClientes.querySelector('#param-incluir-grupob').checked;

        const formGerais = document.getElementById('form-param-gerais');
        const formDataGerais = new FormData(formGerais);
        const geraisParams = Object.fromEntries(formDataGerais.entries());

        const payload = {
            cliente_params: clienteParams,
            gerais_params: geraisParams
        };

        try {
            const response = await fetch(`${API_URL}/api/parametros/simulacao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            
            alert(result.sucesso);
            await carregarParametros(); 
        } catch (error) {
            alert(`Erro ao salvar os parâmetros: ${error.message}`);
        } finally {
            saveAllParamsBtn.disabled = false;
            saveAllParamsBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Todos os Parâmetros';
        }
    }
    
    simulacaoToggleDetalhesBtn.addEventListener('click', () => {
        const isHidden = simulacaoTabelaDetalhadaContainer.classList.contains('hidden');
        if (isHidden) {
            simulacaoTabelaDetalhadaContainer.classList.remove('hidden');
            simulacaoToggleDetalhesBtn.textContent = 'Ocultar Detalhes Mensais';
        } else {
            simulacaoTabelaDetalhadaContainer.classList.add('hidden');
            simulacaoToggleDetalhesBtn.textContent = 'Ver Detalhes Mensais';
        }
    });

    // --- VIII. INICIALIZAÇÃO ---
    console.log('Iniciando aplicação...');
    historicoAnoSelector.value = new Date().getFullYear();
    carregarLeads();
    carregarEstados(ufSelect);
    carregarEstados(ufUnidadeSelect);
    carregarPropostas();
    console.log('Aplicação inicializada completamente');
});