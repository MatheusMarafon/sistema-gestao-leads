document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SELETORES DO DOM ---
    const historicoTbody = document.getElementById('historico-tbody');
    const simulacaoForm = document.getElementById('simulacao-form');
    const resultadosContainer = document.getElementById('resultados-container');

    // Inputs do formulário
    const precoEnergiaInput = document.getElementById('preco-energia');
    const demandaPontaInput = document.getElementById('demanda-ponta');
    const demandaFPInput = document.getElementById('demanda-fp');

    // Spans de resultado
    const resultadoCustoAtual = document.getElementById('resultado-custo-atual');
    const resultadoCustoSimulado = document.getElementById('resultado-custo-simulado');
    const resultadoEconomiaReais = document.getElementById('resultado-economia-reais');
    const resultadoEconomiaPercentual = document.getElementById('resultado-economia-percentual');

    // --- 2. DADOS DE EXEMPLO (MOCK) ---
    // Histórico de consumo e demanda de um cliente fictício
    const historicoConsumoMock = [
        { mes: 'Ago/25', consumo_p: 5000, consumo_fp: 55000, demanda_medida_p: 95 },
        { mes: 'Jul/25', consumo_p: 4800, consumo_fp: 52000, demanda_medida_p: 92 },
        { mes: 'Jun/25', consumo_p: 4900, consumo_fp: 53000, demanda_medida_p: 94 },
        { mes: 'Mai/25', consumo_p: 5100, consumo_fp: 56000, demanda_medida_p: 98 },
        { mes: 'Abr/25', consumo_p: 5200, consumo_fp: 57000, demanda_medida_p: 100 },
        { mes: 'Mar/25', consumo_p: 5300, consumo_fp: 58000, demanda_medida_p: 102 },
        { mes: 'Fev/25', consumo_p: 4700, consumo_fp: 51000, demanda_medida_p: 90 },
        { mes: 'Jan/25', consumo_p: 5500, consumo_fp: 60000, demanda_medida_p: 105 },
        { mes: 'Dez/24', consumo_p: 5800, consumo_fp: 62000, demanda_medida_p: 110 },
        { mes: 'Nov/24', consumo_p: 5400, consumo_fp: 59000, demanda_medida_p: 103 },
        { mes: 'Out/24', consumo_p: 5100, consumo_fp: 55000, demanda_medida_p: 97 },
        { mes: 'Set/24', consumo_p: 5000, consumo_fp: 54000, demanda_medida_p: 96 },
    ];

    // Tarifas e impostos do cenário atual (fixo para o teste)
    const tarifasAtuais = {
        demanda_contratada_p: 100,
        tarifa_demanda_p: 45.50,  // R$/kW
        tarifa_ultrapassagem_demanda_p: 91.00, // Dobro da tarifa normal
        tarifa_consumo_p: 0.85, // R$/kWh
        tarifa_consumo_fp: 0.55, // R$/kWh
        impostos_percentual: 18 // ICMS
    };

    // --- 3. FUNÇÕES ---

    // Popula a tabela de histórico com os dados de exemplo
    function popularTabelaHistorico(dados) {
        historicoTbody.innerHTML = '';
        dados.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.mes}</td>
                <td>${item.consumo_p.toLocaleString('pt-BR')}</td>
                <td>${item.consumo_fp.toLocaleString('pt-BR')}</td>
                <td>${item.demanda_medida_p.toLocaleString('pt-BR')}</td>
            `;
            historicoTbody.appendChild(tr);
        });
    }

    // Calcula o custo total no cenário atual (mercado cativo)
    function calcularCustoAtual(historico, tarifas) {
        let custoTotal = 0;
        historico.forEach(mes => {
            // Custo do consumo
            let custoConsumo = (mes.consumo_p * tarifas.tarifa_consumo_p) + (mes.consumo_fp * tarifas.tarifa_consumo_fp);

            // Custo da demanda
            let custoDemanda = 0;
            if (mes.demanda_medida_p > tarifas.demanda_contratada_p) {
                // Se ultrapassou, paga o contratado + a ultrapassagem
                const ultrapassagem = mes.demanda_medida_p - tarifas.demanda_contratada_p;
                custoDemanda = (tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p) + (ultrapassagem * tarifas.tarifa_ultrapassagem_demanda_p);
            } else {
                // Se não ultrapassou, paga o valor contratado
                custoDemanda = tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p;
            }

            // Soma do mês (sem impostos)
            const subtotalMes = custoConsumo + custoDemanda;
            // Adiciona impostos (cálculo simplificado)
            const totalMes = subtotalMes / (1 - (tarifas.impostos_percentual / 100));
            custoTotal += totalMes;
        });
        return custoTotal;
    }

    // Calcula o custo total no cenário simulado (mercado livre)
    function calcularCustoSimulado(historico, params) {
        let custoTotal = 0;
        // No mercado livre, o cálculo é diferente. Esta é uma GRANDE simplificação.
        // O custo real envolveria TUSD, encargos, etc.
        const TARIFA_FIO_SIMPLES = 15.00; // R$/kW, valor de exemplo

        historico.forEach(mes => {
            // Custo da energia comprada
            const consumoTotalMWh = (mes.consumo_p + mes.consumo_fp) / 1000;
            const custoEnergia = consumoTotalMWh * params.preco_energia;

            // Custo da demanda paga à distribuidora
            const custoDemanda = (params.demanda_p * TARIFA_FIO_SIMPLES) + (params.demanda_fp * TARIFA_FIO_SIMPLES);

            const subtotalMes = custoEnergia + custoDemanda;
            // Impostos também se aplicam de forma diferente
            const totalMes = subtotalMes / (1 - (18 / 100)); // Usando ICMS fixo de 18% como exemplo
            custoTotal += totalMes;
        });
        return custoTotal;
    }
    
    // Formata um número para o padrão de moeda brasileiro
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    
    // Função principal que executa a simulação
    function executarSimulacao(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // 1. Pega os parâmetros do formulário
        const paramsSimulacao = {
            preco_energia: parseFloat(precoEnergiaInput.value),
            demanda_p: parseFloat(demandaPontaInput.value),
            demanda_fp: parseFloat(demandaFPInput.value)
        };

        // 2. Executa os cálculos
        const custoAtual = calcularCustoAtual(historicoConsumoMock, tarifasAtuais);
        const custoSimulado = calcularCustoSimulado(historicoConsumoMock, paramsSimulacao);
        const economiaReais = custoAtual - custoSimulado;
        const economiaPercentual = (economiaReais / custoAtual) * 100;

        // 3. Exibe os resultados
        resultadoCustoAtual.innerText = formatarMoeda(custoAtual);
        resultadoCustoSimulado.innerText = formatarMoeda(custoSimulado);
        resultadoEconomiaReais.innerText = formatarMoeda(economiaReais);
        resultadoEconomiaPercentual.innerText = `(${economiaPercentual.toFixed(2)}%)`;
        
        resultadosContainer.classList.remove('hidden');
    }

    // --- 4. INICIALIZAÇÃO E EVENT LISTENERS ---
    
    // Popula a tabela de histórico assim que a página carrega
    popularTabelaHistorico(historicoConsumoMock);

    // Adiciona o evento de 'submit' ao formulário
    simulacaoForm.addEventListener('submit', executarSimulacao);
});