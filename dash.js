document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DADOS DE EXEMPLO (MOCK DATA) ---
    // Em uma aplicação real, estes dados viriam da seleção do usuário e de chamadas à API.

    const simulacaoDadosMock = {
        lead: { nome: "Indústrias ACME S/A" },
        unidade: { nome: "Fábrica Principal", numero: "987654321" },
        
        // Dados do Cenário Atual (lidos do cadastro da unidade)
        cenarioAtual: {
            demanda_contratada_p: 100, // kW
            tarifa_demanda_p: 45.50,    // R$/kW
            tarifa_ultrapassagem_demanda_p: 91.00, // Dobro da tarifa normal
            tarifa_consumo_p: 0.85,   // R$/kWh
            tarifa_consumo_fp: 0.55,  // R$/kWh
            impostos_percentual: 18     // ICMS, PIS/COFINS etc (simplificado)
        },

        // Dados do Cenário Simulado (entrados pelo vendedor)
        cenarioSimulado: {
            preco_energia: 550.00,      // R$/MWh
            demanda_contratada_p: 100, // kW
            tarifa_fio_p: 25.00,      // R$/kW (TUSD Demanda Ponta - exemplo)
            tarifa_fio_fp: 15.00,     // R$/kW (TUSD Demanda Fora Ponta - exemplo)
            impostos_percentual: 18
        },

        // Histórico de consumo e demanda do cliente
        historico: [
            { mes: 'Ago/25', c_p: 5000, c_fp: 55000, d_p: 95 },
            { mes: 'Jul/25', c_p: 4800, c_fp: 52000, d_p: 92 },
            { mes: 'Jun/25', c_p: 4900, c_fp: 53000, d_p: 94 },
            { mes: 'Mai/25', c_p: 5100, c_fp: 56000, d_p: 98 },
            { mes: 'Abr/25', c_p: 5200, c_fp: 57000, d_p: 100 },
            { mes: 'Mar/25', c_p: 5300, c_fp: 58000, d_p: 102 }, // Mês com ultrapassagem de demanda
            { mes: 'Fev/25', c_p: 4700, c_fp: 51000, d_p: 90 },
            { mes: 'Jan/25', c_p: 5500, c_fp: 60000, d_p: 105 }, // Mês com ultrapassagem de demanda
            { mes: 'Dez/24', c_p: 5800, c_fp: 62000, d_p: 110 }, // Mês com ultrapassagem de demanda
            { mes: 'Nov/24', c_p: 5400, c_fp: 59000, d_p: 103 }, // Mês com ultrapassagem de demanda
            { mes: 'Out/24', c_p: 5100, c_fp: 55000, d_p: 97 },
            { mes: 'Set/24', c_p: 5000, c_fp: 54000, d_p: 96 },
        ]
    };


    // --- 2. SELETORES DO DOM ---
    const reportLeadName = document.getElementById('report-lead-name');
    const reportUnitName = document.getElementById('report-unit-name');
    const resultadoCustoAtual = document.getElementById('resultado-custo-atual');
    const resultadoCustoSimulado = document.getElementById('resultado-custo-simulado');
    const resultadoEconomiaReais = document.getElementById('resultado-economia-reais');
    const resultadoEconomiaPercentual = document.getElementById('resultado-economia-percentual');
    const detalhesTbody = document.getElementById('detalhes-tbody');
    const totalAtual = document.getElementById('total-atual');
    const totalSimulado = document.getElementById('total-simulado');
    const totalEconomia = document.getElementById('total-economia');
    const ctx = document.getElementById('simulador-grafico-economia').getContext('2d');


    // --- 3. FUNÇÕES AUXILIARES E DE CÁLCULO ---
    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Calcula os custos mensais para o cenário ATUAL (CATIVO)
    const calcularCustosAtuais = (historico, tarifas) => {
        return historico.map(mes => {
            const custoConsumo = (mes.c_p * tarifas.tarifa_consumo_p) + (mes.c_fp * tarifas.tarifa_consumo_fp);
            
            let custoDemanda = 0;
            if (mes.d_p > tarifas.demanda_contratada_p) {
                const ultrapassagem = mes.d_p - tarifas.demanda_contratada_p;
                custoDemanda = (tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p) + (ultrapassagem * tarifas.tarifa_ultrapassagem_demanda_p);
            } else {
                custoDemanda = tarifas.demanda_contratada_p * tarifas.tarifa_demanda_p;
            }

            const subtotal = custoConsumo + custoDemanda;
            const totalComImpostos = subtotal / (1 - (tarifas.impostos_percentual / 100));
            
            return { mes: mes.mes, custo: totalComImpostos };
        });
    };

    // Calcula os custos mensais para o cenário SIMULADO (LIVRE)
    const calcularCustosSimulados = (historico, tarifas) => {
        return historico.map(mes => {
            const consumoTotalMWh = (mes.c_p + mes.c_fp) / 1000;
            const custoEnergia = consumoTotalMWh * tarifas.preco_energia;
            const custoDemanda = (tarifas.demanda_contratada_p * tarifas.tarifa_fio_p); // Simplificado
            
            const subtotal = custoEnergia + custoDemanda;
            const totalComImpostos = subtotal / (1 - (tarifas.impostos_percentual / 100));

            return { mes: mes.mes, custo: totalComImpostos };
        });
    };
    
    // --- 4. FUNÇÕES DE RENDERIZAÇÃO ---
    
    function renderizarCabecalho(lead, unidade) {
        reportLeadName.textContent = lead.nome;
        reportUnitName.textContent = `${unidade.nome} (${unidade.numero})`;
    }

    function renderizarResultados(totais) {
        resultadoCustoAtual.textContent = formatarMoeda(totais.atual);
        resultadoCustoSimulado.textContent = formatarMoeda(totais.simulado);
        resultadoEconomiaReais.textContent = formatarMoeda(totais.economiaReais);
        resultadoEconomiaPercentual.textContent = `(${totais.economiaPercentual.toFixed(2)}%)`;

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
                    {
                        label: 'Custo Atual (R$)',
                        data: dadosAtuais,
                        backgroundColor: 'rgba(108, 117, 125, 0.7)', // cinza
                        borderColor: 'rgba(108, 117, 125, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Custo Simulado (R$)',
                        data: dadosSimulados,
                        backgroundColor: 'rgba(40, 167, 69, 0.7)', // verde
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + (value / 1000) + 'k';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatarMoeda(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }


    // --- 5. EXECUÇÃO PRINCIPAL ---

    function executar() {
        // 1. Calcular custos mensais para cada cenário
        const custosMensaisAtuais = calcularCustosAtuais(simulacaoDadosMock.historico, simulacaoDadosMock.cenarioAtual);
        const custosMensaisSimulados = calcularCustosSimulados(simulacaoDadosMock.historico, simulacaoDadosMock.cenarioSimulado);

        // 2. Calcular totais anuais
        const totalAnualAtual = custosMensaisAtuais.reduce((acc, mes) => acc + mes.custo, 0);
        const totalAnualSimulado = custosMensaisSimulados.reduce((acc, mes) => acc + mes.custo, 0);
        const economiaAnualReais = totalAnualAtual - totalAnualSimulado;
        const economiaAnualPercentual = (economiaAnualReais / totalAnualAtual) * 100;
        
        const totais = {
            atual: totalAnualAtual,
            simulado: totalAnualSimulado,
            economiaReais: economiaAnualReais,
            economiaPercentual: economiaAnualPercentual
        };

        // 3. Juntar dados mensais para tabela e gráfico
        const dadosMensaisCombinados = simulacaoDadosMock.historico.map((item, index) => ({
            mes: item.mes,
            custoAtual: custosMensaisAtuais[index].custo,
            custoSimulado: custosMensaisSimulados[index].custo,
            economia: custosMensaisAtuais[index].custo - custosMensaisSimulados[index].custo
        }));

        // 4. Renderizar tudo na tela
        renderizarCabecalho(simulacaoDadosMock.lead, simulacaoDadosMock.unidade);
        renderizarResultados(totais);
        renderizarTabelaDetalhada(dadosMensaisCombinados);
        renderizarGrafico(dadosMensaisCombinados);
    }
    
    // Executa a simulação assim que a página carrega
    executar();
    
});