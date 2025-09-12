document.addEventListener('DOMContentLoaded', () => {

    // --- I. CONSTANTES E SELETORES GLOBAIS (CORRIGIDOS) ---
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

    // Módulo de Simulação (Seletores específicos para evitar conflito)
    const simulacaoTab = document.getElementById('simulacao');
    const simuHistoricoTbody = simulacaoTab.querySelector('#historico-tbody');
    const simulacaoForm = simulacaoTab.querySelector('#simulacao-form');
    const simuResultadosContainer = simulacaoTab.querySelector('#resultados-container');
    const precoEnergiaInput = simulacaoTab.querySelector('#preco-energia');
    const demandaPontaInput = simulacaoTab.querySelector('#demanda-ponta');
    const demandaFPInput = simulacaoTab.querySelector('#demanda-fp');
    const simuResultadoCustoAtual = simulacaoTab.querySelector('#resultado-custo-atual');
    const simuResultadoCustoSimulado = simulacaoTab.querySelector('#resultado-custo-simulado');
    const simuResultadoEconomiaReais = simulacaoTab.querySelector('#resultado-economia-reais');
    const simuResultadoEconomiaPercentual = simulacaoTab.querySelector('#resultado-economia-percentual');
    const atualModalidadeSpan = simulacaoTab.querySelector('#atual-modalidade');
    const atualSubgrupoSpan = simulacaoTab.querySelector('#atual-subgrupo');
    const atualIcmsSpan = simulacaoTab.querySelector('#atual-icms');

    // Módulo de Análise/Dashboard (Seletores específicos para evitar conflito)
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
    const ctx = dashboardTab.querySelector('#simulador-grafico-economia').getContext('2d');

    // --- II. ESTADO GLOBAL DA APLICAÇÃO ---
    let debounceTimer;
    let modoEdicao = { lead: false, unidade: false, historico: false };
    
    let estadoAtual = {
        lead: { id: null, razaoSocial: null },
        unidade: { id: null, nome: null, dados: null }
    };
    
    let dadosDaSimulacao = {
        lead: null,
        unidade: null,
        historico: [],
        resultados: null
    };

    // --- III. FUNÇÕES GLOBAIS ---
    function mudarAba(abaId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const btnAtivo = document.querySelector(`.tab-button[data-tab="${abaId}"]`);
        const conteudoAtivo = document.getElementById(abaId);
        if (btnAtivo) btnAtivo.classList.add('active');
        if (conteudoAtivo) conteudoAtivo.classList.add('active');

        // Lógica para carregar dados ao trocar para as abas
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
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

    // --- IV. LÓGICA DE LEADS, UNIDADES, HISTÓRICO, PROPOSTAS (CÓDIGO ORIGINAL) ---
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
        try {
            const response = await fetch(`${API_URL}/api/localidades/estados`);
            const estados = await response.json();
            selectElement.innerHTML = '<option value="">Selecione...</option>';
            estados.forEach(uf => selectElement.innerHTML += `<option value="${uf}">${uf}</option>`);
        } catch (error) { selectElement.innerHTML = '<option value="">Erro</option>'; }
    }

    async function carregarCidades(uf, cidadeParaSelecionar = null, ufSelectElem, cidadeSelectElem) {
        if (!cidadeSelectElem) return;
        if (!uf) {
            cidadeSelectElem.innerHTML = '<option value="">Selecione um estado</option>';
            cidadeSelectElem.disabled = true;
            return;
        }
        cidadeSelectElem.disabled = false;
        cidadeSelectElem.innerHTML = '<option value="">A carregar...</option>';
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
                const optByValue = Array.from(cidadeSelectElem.options).find(o => o.value == cidadeParaSelecionar);
                if (optByValue) {
                    cidadeSelectElem.value = optByValue.value;
                } else {
                    const optByText = Array.from(cidadeSelectElem.options).find(o => o.text === cidadeParaSelecionar);
                    if (optByText) cidadeSelectElem.value = optByText.value;
                }
            }
        } catch (error) { cidadeSelectElem.innerHTML = '<option value="">Erro</option>'; }
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
        simuResultadosContainer.classList.add('hidden');
        if (!estadoAtual.unidade.id || !estadoAtual.unidade.dados) {
            simuHistoricoTbody.innerHTML = `<tr><td colspan="4" class="text-center">Por favor, selecione uma unidade na aba <strong>"Unidades Lead"</strong> primeiro.</td></tr>`;
            atualSubgrupoSpan.textContent = '-';
            atualIcmsSpan.textContent = '-';
            atualModalidadeSpan.textContent = '-';
            return;
        }
        const unidade = estadoAtual.unidade.dados;
        atualSubgrupoSpan.textContent = unidade.SubgrupoTarifario || 'Não informado';
        atualIcmsSpan.textContent = parseFloat(unidade.AliquotaICMS || '0').toFixed(2);        
        atualModalidadeSpan.textContent = 'Azul';
        try {
            const response = await fetch(`${API_URL}/api/unidades/${estadoAtual.unidade.id}/historico`);
            if (!response.ok) throw new Error('Não foi possível carregar o histórico da unidade.');
            const historico = await response.json();
            if (historico.length === 0) {
                simuHistoricoTbody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum histórico de consumo encontrado para esta unidade.</td></tr>`;
                dadosDaSimulacao.historico = [];
                return;
            }
            dadosDaSimulacao.historico = historico;
            dadosDaSimulacao.unidade = estadoAtual.unidade;
            dadosDaSimulacao.lead = estadoAtual.lead;
            simuHistoricoTbody.innerHTML = '';
            historico.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.IDMes}</td>
                    <td>${formatNumber(item.kWhProjPonta)}</td>
                    <td>${formatNumber(item.kWhProjForaPonta)}</td>
                    <td>${formatNumber(item.DemandaCP)}</td>
                `;
                simuHistoricoTbody.appendChild(tr);
            });
        } catch (error) {
            console.error("Erro ao iniciar simulação:", error);
            simuHistoricoTbody.innerHTML = `<tr><td colspan="4" class="text-center" style="color:red;">${error.message}</td></tr>`;
        }
    }

    function executarSimulacao(event) {
        event.preventDefault();
        if (!dadosDaSimulacao.historico || dadosDaSimulacao.historico.length === 0) {
            alert("Não há dados de histórico para calcular. Selecione uma unidade com histórico válido.");
            return;
        }
        const paramsAtuais = {
            demanda_contratada_p: 100,
            tarifa_demanda_p: 45.50,
            tarifa_ultrapassagem_demanda_p: 91.00,
            tarifa_consumo_p: 0.85,
            tarifa_consumo_fp: 0.55,
            impostos_percentual: parseFloat(estadoAtual.unidade.dados.AliquotaICMS) || 18
        };
        const paramsSimulados = {
            preco_energia: parseFloat(precoEnergiaInput.value),
            demanda_contratada_p: parseFloat(demandaPontaInput.value),
            demanda_contratada_fp: parseFloat(demandaFPInput.value),
            tarifa_fio_p: 25.00,
            tarifa_fio_fp: 15.00,
            impostos_percentual: parseFloat(estadoAtual.unidade.dados.AliquotaICMS) || 18
        };
        const resultadosMensaisAtuais = calcularCustosAtuais(dadosDaSimulacao.historico, paramsAtuais);
        const resultadosMensaisSimulados = calcularCustosSimulados(dadosDaSimulacao.historico, paramsSimulados);
        const totalAnualAtual = resultadosMensaisAtuais.reduce((acc, mes) => acc + mes.custo, 0);
        const totalAnualSimulado = resultadosMensaisSimulados.reduce((acc, mes) => acc + mes.custo, 0);
        const economiaReais = totalAnualAtual - totalAnualSimulado;
        const economiaPercentual = totalAnualAtual !== 0 ? (economiaReais / totalAnualAtual) * 100 : 0;
        dadosDaSimulacao.resultados = {
            totais: {
                atual: totalAnualAtual,
                simulado: totalAnualSimulado,
                economiaReais: economiaReais,
                economiaPercentual: economiaPercentual
            },
            mensais: dadosDaSimulacao.historico.map((item, index) => ({
                mes: item.IDMes,
                custoAtual: resultadosMensaisAtuais[index].custo,
                custoSimulado: resultadosMensaisSimulados[index].custo,
                economia: resultadosMensaisAtuais[index].custo - resultadosMensaisSimulados[index].custo
            }))
        };
        simuResultadoCustoAtual.innerText = formatarMoeda(totalAnualAtual);
        simuResultadoCustoSimulado.innerText = formatarMoeda(totalAnualSimulado);
        simuResultadoEconomiaReais.innerText = formatarMoeda(economiaReais);
        simuResultadoEconomiaPercentual.innerText = `(${economiaPercentual.toFixed(2)}%)`;
        simuResultadosContainer.classList.remove('hidden');
        mudarAba('dashboard');
    }
    
    function calcularCustosAtuais(historico, tarifas) {
        return historico.map(mes => {
            const consumo_p = parseFloat(mes.kWhProjPonta) || 0;
            const consumo_fp = parseFloat(mes.kWhProjForaPonta) || 0;
            const demanda_medida_p = parseFloat(mes.DemandaCP) || 0;
            const custoConsumo = (consumo_p * tarifas.tarifa_consumo_p) + (consumo_fp * tarifas.tarifa_consumo_fp);
            let custoDemanda = 0;
            if (demanda_medida_p > tarifas.demanda_contratada_p) {
                const ultrapassagem = demanda_medida_p - tarifas.demanda_contratada_p;
                custoDemanda = (tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p) + (ultrapassagem * tarifas.tarifa_ultrapassagem_demanda_p);
            } else {
                custoDemanda = tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p;
            }
            const subtotal = custoConsumo + custoDemanda;
            const totalComImpostos = subtotal / (1 - (tarifas.impostos_percentual / 100));
            return { mes: mes.IDMes, custo: totalComImpostos };
        });
    }

    function calcularCustosSimulados(historico, tarifas) {
        return historico.map(mes => {
            const consumo_p = parseFloat(mes.kWhProjPonta) || 0;
            const consumo_fp = parseFloat(mes.kWhProjForaPonta) || 0;
            const consumoTotalMWh = (consumo_p + consumo_fp) / 1000;
            const custoEnergia = consumoTotalMWh * tarifas.preco_energia;
            const custoDemanda = (tarifas.demanda_contratada_p * tarifas.tarifa_fio_p);
            const subtotal = custoEnergia + custoDemanda;
            const totalComImpostos = subtotal / (1 - (tarifas.impostos_percentual / 100));
            return { mes: mes.IDMes, custo: totalComImpostos };
        });
    }

    // --- VI. LÓGICA DA ABA DE DASHBOARD (DINÂMICA) ---
    function atualizarDashboard() {
        if (!dadosDaSimulacao.resultados) {
            reportLeadName.textContent = '[N/D]';
            reportUnitName.textContent = '[N/D]';
            dashResultadoCustoAtual.textContent = 'R$ 0,00';
            dashResultadoCustoSimulado.textContent = 'R$ 0,00';
            dashResultadoEconomiaReais.textContent = 'R$ 0,00';
            dashResultadoEconomiaPercentual.textContent = '(0.00%)';
            totalAtual.textContent = 'R$ 0,00';
            totalSimulado.textContent = 'R$ 0,00';
            totalEconomia.textContent = 'R$ 0,00';
            detalhesTbody.innerHTML = `<tr><td colspan="4" class="text-center">Execute uma simulação na aba <strong>"Simulação"</strong> para ver os resultados.</td></tr>`;
            if (window.graficoEconomia instanceof Chart) {
                window.graficoEconomia.destroy();
            }
            return;
        }
        const { lead, unidade, resultados } = dadosDaSimulacao;
        renderizarCabecalho(lead, unidade);
        renderizarResultados(resultados.totais);
        renderizarTabelaDetalhada(resultados.mensais);
        renderizarGrafico(resultados.mensais);
    }
    
    function renderizarCabecalho(lead, unidade) {
        reportLeadName.textContent = lead.razaoSocial || '[Não informado]';
        reportUnitName.textContent = `${unidade.nome} (${unidade.id})`;
    }

    function renderizarResultados(totais) {
        dashResultadoCustoAtual.textContent = formatarMoeda(totais.atual);
        dashResultadoCustoSimulado.textContent = formatarMoeda(totais.simulado);
        dashResultadoEconomiaReais.textContent = formatarMoeda(totais.economiaReais);
        dashResultadoEconomiaPercentual.textContent = `(${totais.economiaPercentual.toFixed(2)}%)`;
        totalAtual.textContent = formatarMoeda(totais.atual);
        totalSimulado.textContent = formatarMoeda(totais.simulado);
        totalEconomia.textContent = formatarMoeda(totais.economiaReais);
    }

    function renderizarTabelaDetalhada(dadosMensais) {
        detalhesTbody.innerHTML = '';
        dadosMensais.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.mes}</td>
                <td>${formatarMoeda(item.custoAtual)}</td>
                <td>${formatarMoeda(item.custoSimulado)}</td>
                <td class="coluna-economia">${formatarMoeda(item.economia)}</td>
            `;
            detalhesTbody.appendChild(tr);
        });
    }

    function renderizarGrafico(dadosMensais) {
        const labels = dadosMensais.map(d => d.mes).reverse();
        const dadosAtuais = dadosMensais.map(d => d.custoAtual).reverse();
        const dadosSimulados = dadosMensais.map(d => d.custoSimulado).reverse();
        if (window.graficoEconomia instanceof Chart) {
            window.graficoEconomia.destroy();
        }
        window.graficoEconomia = new Chart(ctx, {
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
                scales: { y: { beginAtZero: true, ticks: { callback: value => 'R$ ' + (value / 1000) + 'k' } } },
                plugins: { tooltip: { callbacks: { label: context => { let l = context.dataset.label || ''; if(l) l += ': '; if (context.parsed.y !== null) l += formatarMoeda(context.parsed.y); return l; } } } }
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
    gotoHistoricoFromUnidadesBtn.addEventListener('click', () => { if (!estadoAtual.unidade.id) { alert("Nenhuma unidade selecionada."); return; } mudarAba('historico'); switchScreen('historico', 'form'); historicoSubtitle.innerText = `Adicionando histórico para a UC: ${estadoAtual.unidade.id} (${estadoAtual.unidade.nome || 'Sem Nome'})`; });
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
    addHistoricoBtn.addEventListener('click', () => { const l=historicoLeadSelector.value, u=historicoUnidadeSelector.value; if(!l||!u){ alert("Selecione um lead e unidade."); return; } estadoAtual.lead.id=l; estadoAtual.unidade.id=u; switchScreen('historico', 'form'); });
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
    simulacaoForm.addEventListener('submit', executarSimulacao);

    // --- VIII. INICIALIZAÇÃO ---
    console.log('Iniciando aplicação...');
    carregarLeads();
    carregarEstados(ufSelect);
    carregarEstados(ufUnidadeSelect);
    carregarPropostas();
    console.log('Aplicação inicializada completamente');
});