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
    const gotoHistoricoFromUnidadesBtn = document.getElementById('goto-historico-from-unidades-btn');
    
    // Módulo de Histórico
    const historicoTabButton = document.querySelector('.tab-button[data-tab="historico"]');
    const historicoTableBody = document.querySelector('#historico-table tbody');
    const historicoSubtitle = document.getElementById('historico-subtitle');
    const historicoForm = document.getElementById('historico-form');
    const historicoFormTitle = document.getElementById('historico-form-title');
    const clearHistoricoButton = document.getElementById('clear-historico-button');
    const addHistoricoBtn = document.getElementById('add-historico-btn');
    const historicoBackBtn = document.getElementById('historico-back-btn');
    const historicoLeadSelector = document.getElementById('historico-lead-selector');
    const historicoUnidadeSelector = document.getElementById('historico-unidade-selector');
    
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
    let modoEdicao = { lead: false, unidade: false, historico: false };
    let historicoChartInstance = null;
    let dashboardChartInstance = null;
    
    let estadoAtual = {
        lead: { id: null, razaoSocial: null },
        unidade: { id: null, nome: null, dados: null }
    };
    
    let dadosDaSimulacao = {
        resultados: null,
        parametros: null // Para guardar os parâmetros da última simulação
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
    }

    function switchScreen(tabId, screenToShow) {
        document.querySelectorAll(`#${tabId} .screen`).forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(`${tabId}-${screenToShow}-screen`);
        if (targetScreen) targetScreen.classList.add('active');
    }

    function abrirModal(modalElement) { modalElement.classList.remove('hidden'); }
    function fecharModal(modalElement) { modalElement.classList.add('hidden'); }
    
    const formatarMoeda = (valor) => {
        if (typeof valor !== 'number') valor = 0;
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatNumber = (val) => {
        if (val === null || val === undefined || val === '') return '--';
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
        unidadeHistoricoTableBody.innerHTML = '';
        gotoHistoricoFromUnidadesBtn.disabled = true;
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
                    <td></td>
                `;
                unidadesTableBody.appendChild(tr);
            });
        } catch (error) {
            unidadesTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: red;">Erro ao carregar unidades.</td></tr>`;
            console.error('Erro:', error);
        }
    }

    function limparFormularioUnidade() {
        unidadeForm.reset();
        modoEdicao.unidade = false;
        unidadeForm.querySelector('[name="NumeroDaUcLead"]').disabled = false;
        unidadesFormTitle.innerText = "🔌 Nova Unidade Consumidora";
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
        if (modoEdicao.unidade) {
            unidadeData.NumeroDaUcLead = estadoAtual.unidade.id;
        }
        if (!unidadeData.NumeroDaUcLead) {
            alert("O Nº da UC é obrigatório!");
            return;
        }
        const leadIdEncoded = encodeURIComponent(estadoAtual.lead.id);
        const url = modoEdicao.unidade ? `${API_URL}/api/unidades/${unidadeData.NumeroDaUcLead}` : `${API_URL}/api/leads/${leadIdEncoded}/unidades`;
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
    
    function selecionarUnidade(unidade) {
        estadoAtual.unidade.id = unidade.NumeroDaUcLead;
        estadoAtual.unidade.nome = unidade.NomeDaUnidade || 'Unidade Sem Nome';
        estadoAtual.unidade.dados = unidade;
        gotoHistoricoFromUnidadesBtn.disabled = false;
        carregarHistorico(unidade.NumeroDaUcLead, unidadeHistoricoTableBody);
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

    async function carregarHistorico(ucId, tableBodyElement) {
        tableBodyElement.innerHTML = `<tr><td colspan="20" style="text-align:center;">A carregar...</td></tr>`;
        try {
            const response = await fetch(`${API_URL}/api/unidades/${ucId}/historico`);
            const historicos = await response.json();
            tableBodyElement.innerHTML = '';
            if (historicos.length === 0) {
                tableBodyElement.innerHTML = `<tr><td colspan="20" style="text-align:center;">Nenhum histórico encontrado.</td></tr>`;
                return;
            }
            historicos.forEach(h => {
                const tr = document.createElement('tr');
                tr.dataset.historico = JSON.stringify(h);
                tr.innerHTML = `
                    <td>${h.NumeroDaUcLead || ''}</td>
                    <td>${h.IDMes || ''}</td>
                    <td>${formatNumber(h.DemandaCP)}</td>
                    <td>${formatNumber(h.DemandaCFP)}</td>
                    <td>${formatNumber(h.DemandaCG)}</td>
                    <td>${formatNumber(h.kWProjPonta)}</td>
                    <td>${formatNumber(h.kWProjForaPonta)}</td>
                    <td>${formatNumber(h.kWhProjPonta)}</td>
                    <td>${formatNumber(h.kWhProjForaPonta)}</td>
                    <td>${formatNumber(h.kWhProjHRes)}</td>
                    <td>${formatNumber(h.kWhProjPontaG)}</td>
                    <td>${formatNumber(h.kWhProjForaPontaG)}</td>
                    <td>${formatNumber(h.kWProjG)}</td>
                    <td>${formatNumber(h.kWhProjDieselP)}</td>
                    <td>${formatNumber(h.kWhCompensadoP)}</td>
                    <td>${formatNumber(h.kWhCompensadoFP)}</td>
                    <td>${formatNumber(h.kWhCompensadoHr)}</td>
                    <td>${formatNumber(h.kWGeracaoProjetada)}</td>
                    <td>${formatarData(h.DataRegistroHistorico)}</td>
                    <td></td>
                `;
                const actionCell = tr.querySelector('td:last-child');
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.className = 'btn btn-edit btn-action';
                editBtn.title = 'Editar Histórico';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    mudarAba('historico');
                    switchScreen('historico', 'form');
                    carregarHistoricoParaEdicao(h);
                };
                actionCell.appendChild(editBtn);
                tableBodyElement.appendChild(tr);
            });
        } catch (error) {
            console.error('Falha ao carregar histórico:', error);
            tableBodyElement.innerHTML = `<tr><td colspan="20" style="text-align:center; color: red;">${error.message}</td></tr>`;
        }
    }

    function limparFormularioHistorico() {
        historicoForm.reset();
        modoEdicao.historico = false;
        historicoForm.querySelector('[name="IDMes"]').disabled = false;
        historicoFormTitle.innerText = "📜 Adicionar Registo de Histórico";
    }

    function carregarHistoricoParaEdicao(historicoData) {
        const numericFields = ['DemandaCP', 'DemandaCFP', 'DemandaCG', 'kWProjPonta', 'kWProjForaPonta', 'kWhProjPonta', 'kWhProjForaPonta', 'kWhProjHRes', 'kWhProjPontaG', 'kWhProjForaPontaG', 'kWProjG', 'kWhProjDieselP', 'kWhCompensadoP', 'kWhCompensadoFP', 'kWhCompensadoHr', 'kWGeracaoProjetada'];
        for (const key in historicoData) {
            const input = historicoForm.querySelector(`[name="${key}"]`);
            if (!input) continue;
            let value = historicoData[key];
            if (value === null || value === undefined) {
                input.value = '';
                continue;
            }
            if (numericFields.includes(key)) {
                input.value = formatNumber(value).replace(/\./g, '').replace(',', '.');
            } else {
                input.value = String(value);
            }
        }
        modoEdicao.historico = true;
        historicoForm.querySelector('[name="IDMes"]').disabled = true;
        historicoFormTitle.innerText = "✏️ Editando Histórico";
    }

    async function salvarHistorico(event) {
        event.preventDefault();
        if (!estadoAtual.unidade.id) {
            alert("Nenhuma unidade selecionada para adicionar histórico.");
            return;
        }
        const formData = new FormData(historicoForm);
        const data = Object.fromEntries(formData.entries());
        if (modoEdicao.historico) {
            data.IDMes = historicoForm.querySelector('[name="IDMes"]').value;
        }
        if (!data.IDMes || !/^\d{4}-\d{2}$/.test(data.IDMes)) {
            alert("O campo ID Mês é obrigatório e deve estar no formato YYYY-MM.");
            return;
        }
        const url = modoEdicao.historico ? `${API_URL}/api/historico/${estadoAtual.unidade.id}/${data.IDMes.replace('-', '')}` : `${API_URL}/api/unidades/${estadoAtual.unidade.id}/historico`;
        const method = modoEdicao.historico ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);
            alert(result.sucesso);
            limparFormularioHistorico();
            mudarAba('unidades');
            if(unidadeSelector) unidadeSelector.value = estadoAtual.lead.id;
            await carregarUnidadesDoLead(estadoAtual.lead.id, estadoAtual.unidade.id);
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
                option.dataset.unidade = JSON.stringify(unidade);
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
        if (!propostaData.NProposta || !propostaData.AgenteDeVenda || !propostaData.StatusNegociacao) {
            alert('Os campos Nº Proposta, Agente de Venda e Status são obrigatórios!');
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
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Consumo (kWh)' }
                    }
                }
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
    
    gotoHistoricoFromUnidadesBtn.addEventListener('click', () => { 
        if (!estadoAtual.unidade.id) { 
            alert("Nenhuma unidade selecionada."); 
            return; 
        } 
        mudarAba('historico'); 
        limparFormularioHistorico();
        switchScreen('historico', 'form'); 
        historicoSubtitle.innerText = `Adicionando histórico para a UC: ${estadoAtual.unidade.id} (${estadoAtual.unidade.nome || 'Sem Nome'})`; 
    });

    unidadesTableBody.addEventListener('click', async (e) => {
        const tr = e.target.closest('tr');
        if (!tr || !estadoAtual.lead.id) return;
        const linhaAntiga = unidadesTableBody.querySelector('.selected');
        if (linhaAntiga) linhaAntiga.classList.remove('selected');
        tr.classList.add('selected');
        const ucId = tr.dataset.unidadeId;
        try {
            const response = await fetch(`${API_URL}/api/leads/${estadoAtual.lead.id}/unidades`);
            const unidades = await response.json();
            const unidadeSelecionada = unidades.find(u => u.NumeroDaUcLead == ucId);
            if (unidadeSelecionada) {
                selecionarUnidade(unidadeSelecionada); 
            }
        } catch (error) {
            console.error("Erro ao obter dados completos da unidade:", error);
        }
    });
    historicoForm.addEventListener('submit', salvarHistorico);
    clearHistoricoButton.addEventListener('click', limparFormularioHistorico);
    
    addHistoricoBtn.addEventListener('click', () => { 
        const l=historicoLeadSelector.value, u=historicoUnidadeSelector.value; 
        if(!l||!u){ 
            alert("Selecione um lead e unidade."); 
            return; 
        } 
        estadoAtual.lead.id=l; 
        estadoAtual.unidade.id=u; 
        limparFormularioHistorico();
        switchScreen('historico', 'form'); 
    });

    historicoBackBtn.addEventListener('click', () => switchScreen('historico', 'listing'));
    historicoLeadSelector.addEventListener('change', () => { const l=historicoLeadSelector.value; estadoAtual.lead.id=l; historicoTableBody.innerHTML = `<tr><td colspan="20" class="text-center">Selecione uma unidade.</td></tr>`; carregarUnidadesEmSeletor(l, historicoUnidadeSelector); });
    historicoUnidadeSelector.addEventListener('change', () => { const u=historicoUnidadeSelector.value; estadoAtual.unidade.id=u; if (u) { carregarHistorico(u, historicoTableBody); } else { historicoTableBody.innerHTML = `<tr><td colspan="20" class="text-center">Selecione uma unidade.</td></tr>`; } });
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
                const optionSelecionado = select.options[select.selectedIndex];
                const unidadeSelecionada = JSON.parse(optionSelecionado.dataset.unidade);

                if (unidadeSelecionada) {
                    dadosDaSimulacao.unidade = unidadeSelecionada;
                    simulacaoInfoTarifa.textContent = unidadeSelecionada.Tarifa || ' N/D';
                    simulacaoInfoDemanda.textContent = ` ${unidadeSelecionada.SubgrupoTarifario || ' N/D'}`;
                    simulacaoInfoImpostos.textContent = `ICMS ${unidadeSelecionada.AliquotaICMS || 0}%`;
                    simulacaoInfoMercado.textContent = unidadeSelecionada.MercadoAtual || ' N/D';
                    simulacaoDadosAutomaticos.classList.remove('hidden');
                    simulacaoCalcularBtn.disabled = false;

                    const responseHistorico = await fetch(`${API_URL}/api/unidades/${ucId}/historico`);
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
    carregarLeads();
    carregarEstados(ufSelect);
    carregarEstados(ufUnidadeSelect);
    carregarPropostas();
    console.log('Aplicação inicializada completamente');
});