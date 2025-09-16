import pyodbc
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
from dateutil.relativedelta import (
    relativedelta,
)  # Importação necessária para o cálculo de datas
import re
import os
import sys

# --- Configuração ---
app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# --- CONFIGURAÇÕES DO BANCO DE DADOS E FICHEIROS ---
CAMINHO_BANCO = r"c:\Users\matheus.r\Desktop\proposta-simulacao-acr.accdb"
CAMINHO_EXCEL_LOCALIDADES = r"ListaDeMunicipios.xls"

# --- NOMES DAS TABELAS ---
NOME_TABELA_LEADS = "tbl_22_01_01_CadastroLead"
NOME_TABELA_UNIDADES = "tbl_22_02_01_UnidadesLead"
NOME_TABELA_HISTORICO = "tbl_22_03_01_HistoricoUcLead"
NOME_TABELA_VENDEDORES = "tbl_22_04_01_VendedorResponsavel"
NOME_TABELA_CONTATOS = "tbl_22_05_01_ContatoLead"

# Tabelas de Proposta
NOME_TABELA_PROPOSTA = "tbl_24_01_01_Proposta"
NOME_TABELA_OBSERVACOES = "tbl_24_01_02_Observacoes"
NOME_TABELA_UC_PROPOSTA = "tbl_24_02_01_UcProposta"
NOME_TABELA_CONTATO_PROPOSTA = "tbl_24_04_01_ContatoProposta"
NOME_TABELA_DATA_ENVIO_PROPOSTA = "tbl_24_03_01_DataEnvioProposta"


# --- Funções Auxiliares ---
def carregar_localidades():
    """Carrega dados de localidades com tratamento de erro melhorado."""
    try:
        if not os.path.exists(CAMINHO_EXCEL_LOCALIDADES):
            print(f"[AVISO] Arquivo Excel não encontrado: {CAMINHO_EXCEL_LOCALIDADES}")
            return pd.DataFrame(columns=["Uf", "Cidade", "Codigo"])

        df = pd.read_excel(CAMINHO_EXCEL_LOCALIDADES, sheet_name="Municípios")
        print(f"[INFO] Carregadas {len(df)} localidades do arquivo Excel.")
        return df

    except Exception as e:
        print(f"[ERRO] Não foi possível carregar o ficheiro Excel de localidades: {e}")
        return pd.DataFrame(columns=["Uf", "Cidade", "Codigo"])


df_localidades = carregar_localidades()


def get_db_connection():
    """Cria uma ligação à base de dados MS Access com melhor tratamento de erros."""
    if not os.path.exists(CAMINHO_BANCO):
        print(f"[ERRO] Arquivo do banco não existe: {CAMINHO_BANCO}")
        return None

    connection_strings = [
        f"DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={CAMINHO_BANCO};",
    ]

    for conn_str in connection_strings:
        try:
            conn = pyodbc.connect(conn_str)
            return conn
        except pyodbc.Error as ex:
            print(f"[AVISO] Falha na conexão: {ex}")
            continue

    print("[ERRO] Todas as tentativas de conexão falharam!")
    return None


def row_to_dict(cursor, row):
    """Converte uma linha do pyodbc para um dicionário."""
    try:
        columns = [column[0] for column in cursor.description]
        return dict(zip(columns, row))
    except Exception as e:
        print(f"[ERRO] Erro ao converter linha para dicionário: {e}")
        return {}


def to_float(value_str):
    """Converte uma string para float, tratando vírgulas e valores vazios."""
    if value_str is None or str(value_str).strip() == "":
        return 0.0
    try:
        return float(str(value_str).replace(",", "."))
    except (ValueError, TypeError):
        return 0.0


def _realizar_calculo_simulacao(dados_simulacao):
    """Função interna reutilizável para calcular custos."""
    TARIFA_TE_PONTA = 0.65
    TARIFA_TE_FORA_PONTA = 0.45
    TARIFA_TUSD_DEMANDA = 30.00

    tipo = dados_simulacao.get("tipo")
    imposto_percentual = to_float(dados_simulacao.get("aliquota_icms", 0))
    imposto_fator = (
        1 / (1 - (imposto_percentual / 100)) if imposto_percentual < 100 else 1
    )

    if tipo == "cliente":
        historico = dados_simulacao.get("historico", [])
        if not historico:
            return None  # Retorna None se não houver histórico para o cliente

        total_consumo = sum(
            to_float(mes.get("kWhProjPonta", 0))
            + to_float(mes.get("kWhProjForaPonta", 0))
            for mes in historico
        )
        total_demanda = sum(to_float(mes.get("DemandaCP", 0)) for mes in historico)
        num_meses_historico = len(historico)

        consumo_medio_mensal = (
            total_consumo / num_meses_historico if num_meses_historico > 0 else 0
        )
        demanda_media_mensal = (
            total_demanda / num_meses_historico if num_meses_historico > 0 else 0
        )

        # Para simplificação, assume-se que todo consumo médio é fora ponta
        custo_consumo_medio = consumo_medio_mensal * TARIFA_TE_FORA_PONTA
        custo_demanda_medio = demanda_media_mensal * TARIFA_TUSD_DEMANDA

    else:  # tipo == 'lead'
        consumo_medio_mensal = to_float(dados_simulacao.get("consumo_estimado"))
        demanda_media_mensal = to_float(dados_simulacao.get("demanda_estimada"))

        custo_consumo_medio = consumo_medio_mensal * TARIFA_TE_FORA_PONTA
        custo_demanda_medio = demanda_media_mensal * TARIFA_TUSD_DEMANDA

    subtotal_medio = custo_consumo_medio + custo_demanda_medio
    custo_total_medio_mensal = subtotal_medio * imposto_fator
    custo_impostos_mes = custo_total_medio_mensal - subtotal_medio

    # Projeção para o período solicitado
    duracao_meses = dados_simulacao.get("duracao_meses", 12)
    custo_total_periodo = custo_total_medio_mensal * duracao_meses
    consumo_total_periodo = consumo_medio_mensal * duracao_meses

    # Gera detalhes mensais projetados
    detalhes_mensais = []
    data_inicio = dados_simulacao.get("data_inicio_obj")
    for i in range(duracao_meses):
        mes_atual = data_inicio + relativedelta(months=i)
        mes_formatado = mes_atual.strftime("%Y-%m")

        detalhes_mensais.append(
            {
                "mes": mes_formatado,
                "consumo_total_kwh": consumo_medio_mensal,
                "demanda_total_kw": demanda_media_mensal,
                "custo_consumo": custo_consumo_medio,
                "custo_demanda": custo_demanda_medio,
                "custo_impostos": custo_impostos_mes,
                "custo_total_mes": custo_total_medio_mensal,
            }
        )

    return {
        "totais": {
            "custo_total_periodo": custo_total_periodo,
            "custo_medio_mensal": custo_total_medio_mensal,
            "consumo_total_periodo": consumo_total_periodo,
            "demanda_media": demanda_media_mensal,
            "duracao_meses": duracao_meses,
        },
        "detalhes_mensais": detalhes_mensais,
    }


# --- Rotas da API ---


@app.route("/api/diagnostico", methods=["GET"])
def diagnostico():
    """Endpoint para verificar o estado do sistema."""
    problemas = []

    if not os.path.exists(CAMINHO_BANCO):
        problemas.append(f"Arquivo do banco não encontrado: {CAMINHO_BANCO}")

    if not os.path.exists(CAMINHO_EXCEL_LOCALIDADES):
        problemas.append(
            f"Arquivo Excel não encontrado: {CAMINHO_EXCEL_LOCALIDADES} (funcionalidade limitada)"
        )
    try:
        drivers = [
            x
            for x in pyodbc.drivers()
            if "Access" in x or "Microsoft Access Driver" in x
        ]
        if not drivers:
            problemas.append(
                "Driver do Microsoft Access não encontrado. Instale o Microsoft Access Database Engine."
            )
    except Exception as e:
        problemas.append(f"Erro ao verificar drivers ODBC: {e}")

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM MSysObjects WHERE Type=1")
            conn.close()
            db_status = "OK"
        except Exception as e:
            db_status = f"Erro: {e}"
            if conn:
                conn.close()
    else:
        db_status = "Falha na conexão"

    return jsonify(
        {
            "problemas": problemas,
            "status_banco": db_status,
            "localidades_carregadas": len(df_localidades),
            "drivers_odbc": [
                x
                for x in pyodbc.drivers()
                if "Access" in x or "Microsoft Access Driver" in x
            ],
        }
    )


@app.route("/api/localidades/estados", methods=["GET"])
def get_estados():
    try:
        if not df_localidades.empty:
            estados = sorted(df_localidades["Uf"].unique().tolist())
            return jsonify(estados)
        return jsonify([])
    except Exception as e:
        print(f"[ERRO] Erro ao buscar estados: {e}")
        return jsonify({"erro": "Erro ao buscar estados"}), 500


@app.route("/api/localidades/cidades/<string:uf>", methods=["GET"])
def get_cidades_por_uf(uf):
    try:
        if not df_localidades.empty and uf:
            cidades_df = df_localidades[df_localidades["Uf"] == uf][
                ["Cidade", "Codigo"]
            ]
            cidades_list = [
                {
                    "Cidade": row["Cidade"],
                    "Codigo": (
                        int(row["Codigo"]) if not pd.isna(row["Codigo"]) else None
                    ),
                }
                for _, row in cidades_df.sort_values(by="Cidade").iterrows()
            ]
            return jsonify(cidades_list)
        return jsonify([])
    except Exception as e:
        print(f"[ERRO] Erro ao buscar cidades para UF {uf}: {e}")
        return jsonify({"erro": "Erro ao buscar cidades"}), 500


@app.route("/api/leads", methods=["GET", "POST"])
def handle_leads():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na conexão."}), 500

    try:
        cursor = conn.cursor()
        if request.method == "GET":
            filtro = request.args.get("filtro", "")
            query = f"SELECT l.*, v.Vendedor, c.NomeContato AS Contato FROM (({NOME_TABELA_LEADS} AS l LEFT JOIN {NOME_TABELA_VENDEDORES} AS v ON l.Cpf_CnpjLead = v.Cpf_CnpjLead) LEFT JOIN {NOME_TABELA_CONTATOS} AS c ON l.Cpf_CnpjLead = c.Cpf_CnpjLead)"
            params = []
            if filtro:
                query += " WHERE l.RazaoSocialLead LIKE ? OR l.Cpf_CnpjLead LIKE ? OR l.NomeFantasia LIKE ?"
                filtro_param = f"%{filtro}%"
                params.extend([filtro_param, filtro_param, filtro_param])
            query += " ORDER BY l.DataResgistroLead DESC"
            cursor.execute(query, params)
            return jsonify([row_to_dict(cursor, row) for row in cursor.fetchall()])

        if request.method == "POST":
            novo_lead = request.json
            if (
                not novo_lead
                or not novo_lead.get("Cpf_CnpjLead")
                or not novo_lead.get("RazaoSocialLead")
            ):
                return (
                    jsonify({"erro": "CPF/CNPJ e Razão Social são obrigatórios"}),
                    400,
                )

            sql = f"INSERT INTO [{NOME_TABELA_LEADS}] (Cpf_CnpjLead, RazaoSocialLead, NomeFantasia, Cnae, Logradouro, Numero, Complemento, Bairro, Uf, Cidade, Cep, DataResgistroLead, UsuriaEditorRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            params = (
                novo_lead.get("Cpf_CnpjLead"),
                novo_lead.get("RazaoSocialLead"),
                novo_lead.get("NomeFantasia"),
                novo_lead.get("Cnae"),
                novo_lead.get("Logradouro"),
                novo_lead.get("Numero"),
                novo_lead.get("Complemento"),
                novo_lead.get("Bairro"),
                novo_lead.get("Uf"),
                novo_lead.get("Cidade"),
                novo_lead.get("Cep"),
                datetime.now(),
                novo_lead.get("UsuriaEditorRegistro"),
            )
            cursor.execute(sql, params)
            conn.commit()
            return jsonify({"sucesso": "Lead criado com sucesso"}), 201

    except pyodbc.IntegrityError:
        return jsonify({"erro": "Este CPF/CNPJ já existe na base de dados."}), 409
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads/<path:lead_id>", methods=["GET", "PUT", "DELETE"])
def handle_lead_by_id(lead_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na conexão."}), 500

    try:
        cursor = conn.cursor()
        if request.method == "GET":
            cursor.execute(
                f"SELECT * FROM [{NOME_TABELA_LEADS}] WHERE Cpf_CnpjLead = ?", lead_id
            )
            row = cursor.fetchone()
            return (
                jsonify(row_to_dict(cursor, row))
                if row
                else (jsonify({"erro": "Lead não encontrado"}), 404)
            )

        if request.method == "PUT":
            dados_lead = request.json
            sql = f"UPDATE [{NOME_TABELA_LEADS}] SET RazaoSocialLead = ?, NomeFantasia = ?, Cnae = ?, Logradouro = ?, Numero = ?, Complemento = ?, Bairro = ?, Uf = ?, Cidade = ?, Cep = ?, UsuriaEditorRegistro = ? WHERE Cpf_CnpjLead = ?"
            params = (
                dados_lead.get("RazaoSocialLead"),
                dados_lead.get("NomeFantasia"),
                dados_lead.get("Cnae"),
                dados_lead.get("Logradouro"),
                dados_lead.get("Numero"),
                dados_lead.get("Complemento"),
                dados_lead.get("Bairro"),
                dados_lead.get("Uf"),
                dados_lead.get("Cidade"),
                dados_lead.get("Cep"),
                dados_lead.get("UsuriaEditorRegistro"),
                lead_id,
            )
            cursor.execute(sql, params)
            conn.commit()
            return (
                jsonify({"sucesso": "Lead atualizado com sucesso"})
                if cursor.rowcount > 0
                else (jsonify({"erro": "Lead não encontrado"}), 404)
            )

        if request.method == "DELETE":
            cursor.execute(
                f"DELETE FROM [{NOME_TABELA_LEADS}] WHERE Cpf_CnpjLead = ?", lead_id
            )
            conn.commit()
            return (
                jsonify({"sucesso": "Lead excluído com sucesso"})
                if cursor.rowcount > 0
                else (jsonify({"erro": "Lead não encontrado"}), 404)
            )

    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads/<path:lead_id>/vendedor-contato", methods=["POST"])
def add_vendedor_contato(lead_id):
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        if data.get("Vendedor"):
            try:
                sql_vendedor = f"INSERT INTO [{NOME_TABELA_VENDEDORES}] (Cpf_CnpjLead, Vendedor, DataDeEnvioLead, ValidadeLead) VALUES (?, ?, ?, ?)"
                data_envio = datetime.strptime(data["DataEnvio"], "%d/%m/%Y")
                data_validade = datetime.strptime(data["DataValidade"], "%d/%m/%Y")
                cursor.execute(
                    sql_vendedor, lead_id, data["Vendedor"], data_envio, data_validade
                )
            except ValueError as e:
                return jsonify({"erro": f"Formato de data inválido: {e}"}), 400
        if data.get("NomeContato"):
            sql_contato = f"INSERT INTO [{NOME_TABELA_CONTATOS}] (Cpf_CnpjLead, NomeContato, [e-mail], Telefone) VALUES (?, ?, ?, ?)"
            cursor.execute(
                sql_contato,
                lead_id,
                data["NomeContato"],
                data.get("Email"),
                data.get("Telefone"),
            )
        conn.commit()
        return jsonify({"sucesso": "Informações salvas com sucesso!"}), 201
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads/<path:lead_id>/unidades", methods=["GET", "POST"])
def handle_unidades(lead_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        if request.method == "GET":
            cursor.execute(
                f"SELECT * FROM [{NOME_TABELA_UNIDADES}] WHERE Cpf_CnpjLead = ?",
                lead_id,
            )
            return jsonify([row_to_dict(cursor, row) for row in cursor.fetchall()])

        if request.method == "POST":
            data = request.json
            if not data.get("NumeroDaUcLead"):
                return jsonify({"erro": "O Nº da UC é obrigatório"}), 400

            sql = f"""INSERT INTO [{NOME_TABELA_UNIDADES}] (Cpf_CnpjLead, NumeroDaUcLead, CnpjDistribuidora, CnpjDaUnidadeConsumidora, NomeDaUnidade, Logradouro, Numero, Complemento, Bairro, Uf, Cidade, Cep, MercadoAtual, SubgrupoTarifario, Tarifa, AliquotaICMS, AplicaContaEHidrica, LiminarICMSDemanda, LiminarICMSTusd, BeneficioRuralIrrigacao, RuralOuSazoReconhecida, SaldoMaisRecenteSCEE, DataRegistroUC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
            params = (
                lead_id,
                data.get("NumeroDaUcLead"),
                data.get("CnpjDistribuidora"),
                data.get("CnpjDaUnidadeConsumidora"),
                data.get("NomeDaUnidade"),
                data.get("Logradouro"),
                data.get("Numero"),
                data.get("Complemento"),
                data.get("Bairro"),
                data.get("Uf"),
                data.get("Cidade"),
                data.get("Cep"),
                data.get("MercadoAtual"),
                data.get("SubgrupoTarifario"),
                data.get("Tarifa"),
                to_float(data.get("AliquotaICMS")),
                data.get("AplicaContaEHidrica"),
                data.get("LiminarICMSDemanda"),
                data.get("LiminarICMSTusd"),
                to_float(data.get("BeneficioRuralIrrigacao")),
                data.get("RuralOuSazoReconhecida"),
                to_float(data.get("SaldoMaisRecenteSCEE")),
                datetime.now(),
            )
            cursor.execute(sql, params)
            conn.commit()
            return jsonify({"sucesso": "Unidade criada com sucesso!"}), 201
    except pyodbc.IntegrityError:
        return (
            jsonify({"erro": "Já existe uma unidade com este número para este lead."}),
            409,
        )
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/unidades/<path:uc_id>", methods=["PUT"])
def update_unidade(uc_id):
    data = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        sql = f"""UPDATE [{NOME_TABELA_UNIDADES}] SET CnpjDistribuidora = ?, CnpjDaUnidadeConsumidora = ?, NomeDaUnidade = ?, Logradouro = ?, Numero = ?, Complemento = ?, Bairro = ?, Uf = ?, Cidade = ?, Cep = ?, MercadoAtual = ?, SubgrupoTarifario = ?, Tarifa = ?, AliquotaICMS = ?, AplicaContaEHidrica = ?, LiminarICMSDemanda = ?, LiminarICMSTusd = ?, BeneficioRuralIrrigacao = ?, RuralOuSazoReconhecida = ?, SaldoMaisRecenteSCEE = ? WHERE NumeroDaUcLead = ? AND Cpf_CnpjLead = ?"""
        params = (
            data.get("CnpjDistribuidora"),
            data.get("CnpjDaUnidadeConsumidora"),
            data.get("NomeDaUnidade"),
            data.get("Logradouro"),
            data.get("Numero"),
            data.get("Complemento"),
            data.get("Bairro"),
            data.get("Uf"),
            data.get("Cidade"),
            data.get("Cep"),
            data.get("MercadoAtual"),
            data.get("SubgrupoTarifario"),
            data.get("Tarifa"),
            to_float(data.get("AliquotaICMS")),
            data.get("AplicaContaEHidrica"),
            data.get("LiminarICMSDemanda"),
            data.get("LiminarICMSTusd"),
            to_float(data.get("BeneficioRuralIrrigacao")),
            data.get("RuralOuSazoReconhecida"),
            to_float(data.get("SaldoMaisRecenteSCEE")),
            uc_id,
            data.get("Cpf_CnpjLead"),
        )
        cursor.execute(sql, params)
        conn.commit()
        return (
            jsonify({"sucesso": "Unidade atualizada com sucesso!"})
            if cursor.rowcount > 0
            else (jsonify({"erro": "Nenhuma unidade encontrada para atualizar."}), 404)
        )
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/unidades/<path:uc_id>/historico", methods=["GET", "POST"])
def handle_historico(uc_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        if request.method == "GET":
            cursor.execute(
                f"SELECT * FROM [{NOME_TABELA_HISTORICO}] WHERE NumeroDaUcLead = ? ORDER BY IDMes DESC",
                uc_id,
            )
            historico_list = [row_to_dict(cursor, row) for row in cursor.fetchall()]
            for item in historico_list:
                if item.get("IDMes"):
                    id_mes_str = str(item["IDMes"])
                    if len(id_mes_str) == 6:
                        item["IDMes"] = f"{id_mes_str[:4]}-{id_mes_str[4:]}"
            return jsonify(historico_list)

        if request.method == "POST":
            data = request.json
            id_mes_str = re.sub(r"\D", "", data.get("IDMes", ""))
            if len(id_mes_str) != 6:
                return (
                    jsonify(
                        {
                            "erro": "O ID Mês é obrigatório e deve estar no formato YYYY-MM."
                        }
                    ),
                    400,
                )

            sql = f"""INSERT INTO [{NOME_TABELA_HISTORICO}] (NumeroDaUcLead, IDMes, DemandaCP, DemandaCFP, DemandaCG, kWProjPonta, kWProjForaPonta, kWhProjPonta, kWhProjForaPonta, kWhProjHRes, kWhProjPontaG, kWhProjForaPontaG, kWProjG, kWhProjDieselP, kWhCompensadoP, kWhCompensadoFP, kWhCompensadoHr, kWGeracaoProjetada, DataRegistroHistorico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
            params = (
                uc_id,
                int(id_mes_str),
                to_float(data.get("DemandaCP")),
                to_float(data.get("DemandaCFP")),
                to_float(data.get("DemandaCG")),
                to_float(data.get("kWProjPonta")),
                to_float(data.get("kWProjForaPonta")),
                to_float(data.get("kWhProjPonta")),
                to_float(data.get("kWhProjForaPonta")),
                to_float(data.get("kWhProjHRes")),
                to_float(data.get("kWhProjPontaG")),
                to_float(data.get("kWhProjForaPontaG")),
                to_float(data.get("kWProjG")),
                to_float(data.get("kWhProjDieselP")),
                to_float(data.get("kWhCompensadoP")),
                to_float(data.get("kWhCompensadoFP")),
                to_float(data.get("kWhCompensadoHr")),
                to_float(data.get("kWGeracaoProjetada")),
                datetime.now(),
            )
            cursor.execute(sql, params)
            conn.commit()
            return jsonify({"sucesso": "Registo de histórico criado com sucesso!"}), 201
    except pyodbc.IntegrityError:
        return (
            jsonify({"erro": "Já existe um histórico para esta unidade neste mês."}),
            409,
        )
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/historico/<path:uc_id>/<string:id_mes>", methods=["PUT"])
def update_historico(uc_id, id_mes):
    data = request.json
    id_mes_int = int(id_mes.replace("-", ""))
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        sql = f"""UPDATE [{NOME_TABELA_HISTORICO}] SET DemandaCP = ?, DemandaCFP = ?, DemandaCG = ?, kWProjPonta = ?, kWProjForaPonta = ?, kWhProjPonta = ?, kWhProjForaPonta = ?, kWhProjHRes = ?, kWhProjPontaG = ?, kWhProjForaPontaG = ?, kWProjG = ?, kWhProjDieselP = ?, kWhCompensadoP = ?, kWhCompensadoFP = ?, kWhCompensadoHr = ?, kWGeracaoProjetada = ? WHERE NumeroDaUcLead = ? AND IDMes = ?"""
        params = (
            to_float(data.get("DemandaCP")),
            to_float(data.get("DemandaCFP")),
            to_float(data.get("DemandaCG")),
            to_float(data.get("kWProjPonta")),
            to_float(data.get("kWProjForaPonta")),
            to_float(data.get("kWhProjPonta")),
            to_float(data.get("kWhProjForaPonta")),
            to_float(data.get("kWhProjHRes")),
            to_float(data.get("kWhProjPontaG")),
            to_float(data.get("kWhProjForaPontaG")),
            to_float(data.get("kWProjG")),
            to_float(data.get("kWhProjDieselP")),
            to_float(data.get("kWhCompensadoP")),
            to_float(data.get("kWhCompensadoFP")),
            to_float(data.get("kWhCompensadoHr")),
            to_float(data.get("kWGeracaoProjetada")),
            uc_id,
            id_mes_int,
        )
        cursor.execute(sql, params)
        conn.commit()
        return (
            jsonify({"sucesso": "Registo de histórico atualizado com sucesso!"})
            if cursor.rowcount > 0
            else (
                jsonify(
                    {"erro": "Nenhum registo de histórico encontrado para atualizar."}
                ),
                404,
            )
        )
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/propostas", methods=["GET", "POST"])
def handle_propostas():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500

    try:
        cursor = conn.cursor()
        if request.method == "GET":
            filtro = request.args.get("filtro", "")
            query = f"SELECT p.NProposta, p.AgenteDeVenda, p.StatusNegociacao, p.DataStatusNegociacao, p.RazaoSocialLead, o.Usuario, cp.NomeContato FROM ([{NOME_TABELA_PROPOSTA}] AS p LEFT JOIN [{NOME_TABELA_OBSERVACOES}] AS o ON p.NProposta = o.IdProposta) LEFT JOIN [{NOME_TABELA_CONTATO_PROPOSTA}] as cp ON p.NProposta = cp.IdProposta"
            params = []
            if filtro:
                query += " WHERE p.RazaoSocialLead LIKE ? OR p.AgenteDeVenda LIKE ? OR p.StatusNegociacao LIKE ? OR cp.NomeContato LIKE ? OR CStr(p.NProposta) LIKE ?"
                filtro_contains = f"%{filtro}%"
                params.extend(
                    [
                        filtro_contains,
                        filtro_contains,
                        filtro_contains,
                        filtro_contains,
                        f"{filtro}%",
                    ]
                )
            query += " ORDER BY p.NProposta DESC"
            cursor.execute(query, params)
            return jsonify([row_to_dict(cursor, row) for row in cursor.fetchall()])

        if request.method == "POST":
            data = request.json
            required_fields = ["Cpf_CnpjLead", "NumeroDaUcLead"]
            if not all(field in data and data[field] for field in required_fields):
                return (
                    jsonify({"erro": "Lead e Unidade Consumidora são obrigatórios."}),
                    400,
                )

            cursor.execute(f"SELECT MAX(NProposta) FROM [{NOME_TABELA_PROPOSTA}]")
            max_n_proposta = cursor.fetchone()[0]
            next_n_proposta = 1 if max_n_proposta is None else int(max_n_proposta) + 1
            id_proposta_texto = f"DPL_{datetime.now().year}_{next_n_proposta}"

            lead_id = data.get("Cpf_CnpjLead")
            cursor.execute(
                f"SELECT RazaoSocialLead, NomeFantasia, Cidade, Uf FROM [{NOME_TABELA_LEADS}] WHERE Cpf_CnpjLead = ?",
                lead_id,
            )
            lead_info = cursor.fetchone()
            if not lead_info:
                return (
                    jsonify({"erro": f"Lead com CPF/CNPJ {lead_id} não encontrado."}),
                    404,
                )

            sql_proposta = f"INSERT INTO [{NOME_TABELA_PROPOSTA}] (IdProposta, NProposta, Cpf_CnpjLead, RazaoSocialLead, NomeFantasia, Cidade, Uf, AgenteDeVenda, StatusNegociacao, DataStatusNegociacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            data_status = (
                datetime.strptime(data.get("DataStatusNegociacao"), "%d/%m/%Y")
                if data.get("DataStatusNegociacao")
                else None
            )
            cursor.execute(
                sql_proposta,
                (
                    id_proposta_texto,
                    next_n_proposta,
                    lead_id,
                    lead_info.RazaoSocialLead,
                    lead_info.NomeFantasia,
                    lead_info.Cidade,
                    lead_info.Uf,
                    data.get("AgenteDeVenda"),
                    data.get("StatusNegociacao"),
                    data_status,
                ),
            )

            sql_uc_proposta = f"INSERT INTO [{NOME_TABELA_UC_PROPOSTA}] (IdProposta, Uc) VALUES (?, ?)"
            cursor.execute(
                sql_uc_proposta, (next_n_proposta, data.get("NumeroDaUcLead"))
            )

            conn.commit()
            return (
                jsonify(
                    {"sucesso": f"Proposta {id_proposta_texto} salva com sucesso!"}
                ),
                201,
            )

    except pyodbc.Error as ex:
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


# --- Rotas de Simulação e Dashboard ---
@app.route("/api/simulacao/calcular", methods=["POST"])
def calcular_simulacao_acr():
    data = request.json
    tipo = data.get("tipo", "cliente")

    try:
        data_inicio_str = data.get("data_inicio")
        data_fim_str = data.get("data_fim")
        if not data_inicio_str or not data_fim_str:
            return jsonify({"erro": "Datas de início e fim são obrigatórias."}), 400

        data_inicio_obj = datetime.strptime(data_inicio_str, "%d/%m/%Y")
        data_fim_obj = datetime.strptime(data_fim_str, "%d/%m/%Y")

        delta = relativedelta(data_fim_obj, data_inicio_obj)
        duracao_meses = delta.years * 12 + delta.months + 1
    except (TypeError, ValueError):
        return jsonify({"erro": "Formato de data inválido. Use dd/mm/yyyy."}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        dados_para_calculo = {
            "tipo": tipo,
            "data_inicio_obj": data_inicio_obj,
            "duracao_meses": duracao_meses,
        }

        if tipo == "cliente":
            uc_id = data.get("uc_id")
            if not uc_id:
                return (
                    jsonify(
                        {
                            "erro": "ID da Unidade é obrigatório para simulação de cliente."
                        }
                    ),
                    400,
                )

            cursor = conn.cursor()
            cursor.execute(
                f"SELECT AliquotaICMS FROM [{NOME_TABELA_UNIDADES}] WHERE NumeroDaUcLead = ?",
                uc_id,
            )
            unidade_row = cursor.fetchone()
            if not unidade_row:
                return jsonify({"erro": "Unidade não encontrada."}), 404
            dados_para_calculo["aliquota_icms"] = unidade_row.AliquotaICMS

            cursor.execute(
                f"SELECT * FROM [{NOME_TABELA_HISTORICO}] WHERE NumeroDaUcLead = ?",
                uc_id,
            )
            historico_rows = cursor.fetchall()
            if not historico_rows:
                return (
                    jsonify({"erro": "Nenhum histórico de consumo para esta unidade."}),
                    404,
                )

            dados_para_calculo["historico"] = [
                row_to_dict(cursor, r) for r in historico_rows
            ]

        else:  # tipo == 'lead'
            dados_para_calculo["consumo_estimado"] = data.get("consumo_estimado")
            dados_para_calculo["demanda_estimada"] = data.get("demanda_estimada")
            dados_para_calculo["aliquota_icms"] = data.get("aliquota_icms", 17.0)

        resultados = _realizar_calculo_simulacao(dados_para_calculo)

        if resultados is None:
            return jsonify({"erro": "Não foi possível calcular a simulação."}), 400

        return jsonify(resultados)

    except Exception as e:
        print(f"[ERRO] Falha no cálculo da simulação: {e}")
        return jsonify({"erro": f"Ocorreu um erro interno: {e}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/dashboard_data", methods=["POST"])
def get_dashboard_data():
    data_req = request.json

    try:
        data_inicio_str = data_req.get("data_inicio")
        data_fim_str = data_req.get("data_fim")
        if not data_inicio_str or not data_fim_str:
            return jsonify({"erro": "Datas de início e fim são obrigatórias."}), 400
        data_inicio_obj = datetime.strptime(data_inicio_str, "%d/%m/%Y")
        data_fim_obj = datetime.strptime(data_fim_str, "%d/%m/%Y")
        delta = relativedelta(data_fim_obj, data_inicio_obj)
        duracao_meses = delta.years * 12 + delta.months + 1
    except (TypeError, ValueError):
        return jsonify({"erro": "Formato de data inválido para o dashboard."}), 400

    dados_para_calculo_cativo = {
        "tipo": "cliente",
        "data_inicio_obj": data_inicio_obj,
        "duracao_meses": duracao_meses,
    }

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na conexão."}), 500

    try:
        cursor = conn.cursor()
        uc_id = data_req.get("uc_id")
        cursor.execute(
            f"SELECT AliquotaICMS FROM [{NOME_TABELA_UNIDADES}] WHERE NumeroDaUcLead = ?",
            uc_id,
        )
        unidade_row = cursor.fetchone()
        if not unidade_row:
            return jsonify({"erro": "Unidade não encontrada."}), 404
        dados_para_calculo_cativo["aliquota_icms"] = unidade_row.AliquotaICMS

        cursor.execute(
            f"SELECT * FROM [{NOME_TABELA_HISTORICO}] WHERE NumeroDaUcLead = ?", uc_id
        )
        historico_rows = cursor.fetchall()
        if not historico_rows:
            return jsonify({"erro": "Nenhum histórico encontrado."}), 404
        dados_para_calculo_cativo["historico"] = [
            row_to_dict(cursor, r) for r in historico_rows
        ]

        custo_cativo_resultados = _realizar_calculo_simulacao(dados_para_calculo_cativo)
        if custo_cativo_resultados is None:
            return (
                jsonify(
                    {"erro": "Não foi possível calcular os dados para o dashboard."}
                ),
                400,
            )

        desconto_livre = 0.85
        custo_total_cativo = custo_cativo_resultados["totais"]["custo_total_periodo"]
        custo_total_livre = custo_total_cativo * desconto_livre

        dashboard_data = {
            "custo_atual": custo_total_cativo,
            "custo_simulado": custo_total_livre,
            "economia_reais": custo_total_cativo - custo_total_livre,
            "economia_percentual": (1 - desconto_livre) * 100,
            "detalhes_mensais": [
                {
                    "mes": mes["mes"],
                    "custoAtual": mes["custo_total_mes"],
                    "custoSimulado": mes["custo_total_mes"] * desconto_livre,
                    "economia": mes["custo_total_mes"]
                    - (mes["custo_total_mes"] * desconto_livre),
                }
                for mes in custo_cativo_resultados["detalhes_mensais"]
            ],
        }
        return jsonify(dashboard_data)
    except Exception as e:
        print(f"[ERRO] Falha no cálculo do dashboard: {e}")
        return jsonify({"erro": f"Ocorreu um erro interno no dashboard: {e}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
