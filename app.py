import pyodbc
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
import re
import os
import sys

# --- Configuração ---
app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# --- CONFIGURAÇÕES DO BANCO DE DADOS E FICHEIROS ---
CAMINHO_BANCO = r"c:\Users\matheus.r\Desktop\Proposta_Sistema-Leads.accdb"
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


# --- Função para verificar dependências ---
def verificar_dependencias():
    """Verifica se todas as dependências estão disponíveis."""
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

    return problemas


# --- Carregamento de dados de localidades ---
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
    if value_str is None or value_str == "":
        return None
    try:
        return float(str(value_str).replace(",", "."))
    except (ValueError, TypeError) as e:
        print(f"[AVISO] Erro ao converter '{value_str}' para float: {e}")
        return None


# --- ROTA DE DIAGNÓSTICO ---
@app.route("/api/diagnostico", methods=["GET"])
def diagnostico():
    """Endpoint para verificar o estado do sistema."""
    problemas = verificar_dependencias()

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


# region Localidades
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


# region Leads
@app.route("/api/leads", methods=["GET"])
def get_leads():
    filtro = request.args.get("filtro", "")
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500
    try:
        cursor = conn.cursor()
        query = f"""
            SELECT l.*, v.Vendedor, c.NomeContato AS Contato
            FROM (({NOME_TABELA_LEADS} AS l
            LEFT JOIN {NOME_TABELA_VENDEDORES} AS v ON l.Cpf_CnpjLead = v.Cpf_CnpjLead)
            LEFT JOIN {NOME_TABELA_CONTATOS} AS c ON l.Cpf_CnpjLead = c.Cpf_CnpjLead)
        """
        params = []
        if filtro:
            query += " WHERE l.RazaoSocialLead LIKE ? OR l.Cpf_CnpjLead LIKE ? OR l.NomeFantasia LIKE ?"
            filtro_param = f"%{filtro}%"
            params.extend([filtro_param, filtro_param, filtro_param])

        query += " ORDER BY l.DataResgistroLead DESC"

        cursor.execute(query, params)
        leads = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return jsonify(leads)
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Ocorreu um erro ao consultar os dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads/<path:lead_id>", methods=["GET"])
def get_lead_by_id(lead_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        query = f"SELECT * FROM [{NOME_TABELA_LEADS}] WHERE Cpf_CnpjLead = ?"
        cursor.execute(query, lead_id)
        row = cursor.fetchone()
        if row:
            lead_data = row_to_dict(cursor, row)
            if not df_localidades.empty and lead_data.get("Cidade"):
                try:
                    cidade_code = int(lead_data["Cidade"])
                    cidade_df = df_localidades[df_localidades["Codigo"] == cidade_code]
                    if not cidade_df.empty:
                        lead_data["NomeCidade"] = cidade_df.iloc[0]["Cidade"]
                except Exception as e:
                    print(f"[AVISO] Erro ao buscar nome da cidade: {e}")
            return jsonify(lead_data)
        else:
            return jsonify({"erro": "Lead não encontrado"}), 404
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro ao consultar o lead: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads", methods=["POST"])
def create_lead():
    novo_lead = request.json
    if (
        not novo_lead
        or "Cpf_CnpjLead" not in novo_lead
        or "RazaoSocialLead" not in novo_lead
    ):
        return jsonify({"erro": "CPF/CNPJ e Razão Social são obrigatórios"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500

    try:
        cidade_code = novo_lead.get("Cidade")
        cursor = conn.cursor()
        sql = f"""
            INSERT INTO [{NOME_TABELA_LEADS}] 
            (Cpf_CnpjLead, RazaoSocialLead, NomeFantasia, Cnae, Logradouro, Numero, 
            Complemento, Bairro, Uf, Cidade, Cep, DataResgistroLead, UsuriaEditorRegistro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
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
            cidade_code,
            novo_lead.get("Cep"),
            datetime.now(),
            novo_lead.get("UsuriaEditorRegistro"),
        )
        cursor.execute(sql, params)
        conn.commit()
    except pyodbc.IntegrityError:
        return jsonify({"erro": "Este CPF/CNPJ já existe na base de dados."}), 409
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"sucesso": "Lead criado com sucesso"}), 201


@app.route("/api/leads/<path:lead_id>", methods=["PUT"])
def update_lead(lead_id):
    dados_lead = request.json
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500

    try:
        cidade_code = dados_lead.get("Cidade")
        cursor = conn.cursor()
        sql = f"""
            UPDATE [{NOME_TABELA_LEADS}] SET
            RazaoSocialLead = ?, NomeFantasia = ?, Cnae = ?, Logradouro = ?, Numero = ?, 
            Complemento = ?, Bairro = ?, Uf = ?, Cidade = ?, Cep = ?, 
            UsuriaEditorRegistro = ?
            WHERE Cpf_CnpjLead = ?
        """
        params = (
            dados_lead.get("RazaoSocialLead"),
            dados_lead.get("NomeFantasia"),
            dados_lead.get("Cnae"),
            dados_lead.get("Logradouro"),
            dados_lead.get("Numero"),
            dados_lead.get("Complemento"),
            dados_lead.get("Bairro"),
            dados_lead.get("Uf"),
            cidade_code,
            dados_lead.get("Cep"),
            dados_lead.get("UsuriaEditorRegistro"),
            lead_id,
        )
        cursor.execute(sql, params)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"erro": "Nenhum lead encontrado para atualizar."}), 404
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"sucesso": "Lead atualizado com sucesso"}), 200


# NOVA ROTA ADICIONADA PARA EXCLUSÃO
@app.route("/api/leads/<path:lead_id>", methods=["DELETE"])
def delete_lead(lead_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500

    try:
        cursor = conn.cursor()

        # AVISO: Se o seu banco de dados não estiver configurado com "exclusão em cascata",
        # a exclusão de um lead com unidades associadas irá falhar.
        # O bloco 'except' abaixo trata este erro de forma amigável.

        sql = f"DELETE FROM [{NOME_TABELA_LEADS}] WHERE Cpf_CnpjLead = ?"
        cursor.execute(sql, lead_id)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"erro": "Nenhum lead encontrado para excluir."}), 404

        return jsonify({"sucesso": "Lead excluído com sucesso."}), 200

    except pyodbc.Error as ex:
        # Trata o erro de integridade referencial que impede a exclusão
        if "DELETE statement conflicted" in str(
            ex
        ) or "referential integrity constraint" in str(ex):
            return (
                jsonify(
                    {
                        "erro": "Não é possível excluir este lead pois ele possui registros associados (como unidades ou propostas). Remova os registros associados primeiro."
                    }
                ),
                409,
            )

        print(f"[ERRO] Erro ao deletar lead: {ex}")
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


# endregion


# region Vendedor e Contato
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
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"sucesso": "Informações salvas com sucesso!"}), 201


# endregion


# region Unidades
@app.route("/api/leads/<path:lead_id>/unidades", methods=["GET"])
def get_unidades_por_lead(lead_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        query = f"SELECT * FROM [{NOME_TABELA_UNIDADES}] WHERE Cpf_CnpjLead = ?"
        cursor.execute(query, lead_id)
        unidades_list = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return jsonify(unidades_list)
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro ao consultar as unidades: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/leads/<path:lead_id>/unidades", methods=["POST"])
def create_unidade(lead_id):
    data = request.json
    if not data.get("NumeroDaUcLead"):
        return jsonify({"erro": "O Nº da UC é obrigatório"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cidade_code = data.get("Cidade")
        cursor = conn.cursor()
        sql = f"""INSERT INTO [{NOME_TABELA_UNIDADES}] (
                     Cpf_CnpjLead, NumeroDaUcLead, CnpjDistribuidora, CnpjDaUnidadeConsumidora, 
                     NomeDaUnidade, Logradouro, Numero, Complemento, Bairro, Uf, Cidade, Cep, 
                     MercadoAtual, SubgrupoTarifario, Tarifa, AliquotaICMS, AplicaContaEHidrica, 
                     LiminarICMSDemanda, LiminarICMSTusd, BeneficioRuralIrrigacao, 
                     RuralOuSazoReconhecida, SaldoMaisRecenteSCEE, DataRegistroUC
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
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
            cidade_code,
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
    return jsonify({"sucesso": "Unidade criada com sucesso!"}), 201


@app.route("/api/unidades/<path:uc_id>", methods=["PUT"])
def update_unidade(uc_id):
    data = request.json
    lead_id = data.get("Cpf_CnpjLead")
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cidade_code = data.get("Cidade")
        cursor = conn.cursor()
        sql = f"""UPDATE [{NOME_TABELA_UNIDADES}] SET
                     CnpjDistribuidora = ?, CnpjDaUnidadeConsumidora = ?, NomeDaUnidade = ?, 
                     Logradouro = ?, Numero = ?, Complemento = ?, Bairro = ?, Uf = ?, 
                     Cidade = ?, Cep = ?, MercadoAtual = ?, SubgrupoTarifario = ?, Tarifa = ?,
                     AliquotaICMS = ?, AplicaContaEHidrica = ?, LiminarICMSDemanda = ?, 
                     LiminarICMSTusd = ?, BeneficioRuralIrrigacao = ?, RuralOuSazoReconhecida = ?, 
                     SaldoMaisRecenteSCEE = ?
                   WHERE NumeroDaUcLead = ? AND Cpf_CnpjLead = ?"""
        params = (
            data.get("CnpjDistribuidora"),
            data.get("CnpjDaUnidadeConsumidora"),
            data.get("NomeDaUnidade"),
            data.get("Logradouro"),
            data.get("Numero"),
            data.get("Complemento"),
            data.get("Bairro"),
            data.get("Uf"),
            cidade_code,
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
            lead_id,
        )
        cursor.execute(sql, params)
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"erro": "Nenhuma unidade encontrada para atualizar."}), 404
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"sucesso": "Unidade atualizada com sucesso!"}), 200


# endregion


# region Histórico
@app.route("/api/unidades/<path:uc_id>/historico", methods=["GET"])
def get_historico_por_uc(uc_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        query = f"SELECT * FROM [{NOME_TABELA_HISTORICO}] WHERE NumeroDaUcLead = ? ORDER BY IDMes DESC"
        cursor.execute(query, uc_id)
        historico_list = [row_to_dict(cursor, row) for row in cursor.fetchall()]

        for item in historico_list:
            if item.get("IDMes"):
                id_mes_str = str(item["IDMes"])
                if len(id_mes_str) == 6:
                    item["IDMes"] = f"{id_mes_str[:4]}-{id_mes_str[4:]}"
        return jsonify(historico_list)
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro ao consultar o histórico: {ex}"}), 500
    finally:
        if conn:
            conn.close()


@app.route("/api/unidades/<path:uc_id>/historico", methods=["POST"])
def create_historico(uc_id):
    data = request.json
    id_mes_str = re.sub(r"\D", "", data.get("IDMes", ""))
    if len(id_mes_str) != 6:
        return (
            jsonify(
                {"erro": "O ID Mês é obrigatório e deve estar no formato YYYY-MM."}
            ),
            400,
        )

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        sql = f"""INSERT INTO [{NOME_TABELA_HISTORICO}] (
                     NumeroDaUcLead, IDMes, DemandaCP, DemandaCFP, DemandaCG,
                     kWProjPonta, kWProjForaPonta, kWhProjPonta, kWhProjForaPonta, kWhProjHRes,
                     kWhProjPontaG, kWhProjForaPontaG, kWProjG, kWhProjDieselP,
                     kWhCompensadoP, kWhCompensadoFP, kWhCompensadoHr, kWGeracaoProjetada,
                     DataRegistroHistorico
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
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
    return jsonify({"sucesso": "Registo de histórico criado com sucesso!"}), 201


@app.route("/api/historico/<path:uc_id>/<string:id_mes>", methods=["PUT"])
def update_historico(uc_id, id_mes):
    data = request.json
    id_mes_int = int(id_mes.replace("-", ""))

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação."}), 500

    try:
        cursor = conn.cursor()
        sql = f"""UPDATE [{NOME_TABELA_HISTORICO}] SET
                     DemandaCP = ?, DemandaCFP = ?, DemandaCG = ?,
                     kWProjPonta = ?, kWProjForaPonta = ?, kWhProjPonta = ?, 
                     kWhProjForaPonta = ?, kWhProjHRes = ?, kWhProjPontaG = ?, 
                     kWhProjForaPontaG = ?, kWProjG = ?, kWhProjDieselP = ?,
                     kWhCompensadoP = ?, kWhCompensadoFP = ?, kWhCompensadoHr = ?, 
                     kWGeracaoProjetada = ?
                   WHERE NumeroDaUcLead = ? AND IDMes = ?"""
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
        if cursor.rowcount == 0:
            return (
                jsonify(
                    {"erro": "Nenhum registo de histórico encontrado para atualizar."}
                ),
                404,
            )
    except pyodbc.Error as ex:
        return jsonify({"erro": f"Erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"sucesso": "Registo de histórico atualizado com sucesso!"}), 200


# endregion


# ======================================================================================================
# region Propostas
@app.route("/api/propostas", methods=["GET"])
def get_propostas():
    filtro = request.args.get("filtro", "")
    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligção à base de dados."}), 500

    try:
        cursor = conn.cursor()
        query = f"""
            SELECT
                p.NProposta,
                p.AgenteDeVenda,
                p.StatusNegociacao,
                p.DataStatusNegociacao,
                p.RazaoSocialLead,
                o.Usuario,
                cp.NomeContato
            FROM
                ([{NOME_TABELA_PROPOSTA}] AS p
            LEFT JOIN
                 [{NOME_TABELA_OBSERVACOES}] AS o ON p.NProposta = o.IdProposta)
            LEFT JOIN 
                 [{NOME_TABELA_CONTATO_PROPOSTA}] as cp ON p.NProposta = cp.IdProposta
        """
        params = []

        if filtro:
            query += """
                WHERE
                    p.RazaoSocialLead LIKE ? OR
                    p.AgenteDeVenda LIKE ? OR
                    p.StatusNegociacao LIKE ? OR
                    cp.NomeContato LIKE ? OR
                    CStr(p.NProposta) LIKE ?
            """
            filtro_contains = f"%{filtro}%"
            filtro_startswith = f"{filtro}%"
            params.extend(
                [
                    filtro_contains,
                    filtro_contains,
                    filtro_contains,
                    filtro_contains,
                    filtro_startswith,
                ]
            )
        query += " ORDER BY p.NProposta DESC"

        cursor.execute(query, params)
        propostas = [row_to_dict(cursor, row) for row in cursor.fetchall()]
        return jsonify(propostas)
    except pyodbc.Error as ex:
        print(f"[ERRO] Erro ao buscar propostas: {ex}")
        return (
            jsonify({"erro": f"Ocorreu um erro ao consultar as propostas: {ex}"}),
            500,
        )
    finally:
        if conn:
            conn.close()


# ======================================================================================================


@app.route("/api/propostas", methods=["POST"])
def create_proposta():
    data = request.json

    required_fields = ["Cpf_CnpjLead", "NumeroDaUcLead"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"erro": "Lead e Unidade Consumidora são obrigatórios."}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"erro": "Falha na ligação à base de dados."}), 500

    try:
        cursor = conn.cursor()

        cursor.execute(f"SELECT MAX(NProposta) FROM [{NOME_TABELA_PROPOSTA}]")
        max_n_proposta = cursor.fetchone()[0]

        if max_n_proposta is None:
            next_n_proposta = 1
        else:
            next_n_proposta = int(max_n_proposta) + 1

        current_year = datetime.now().year
        id_proposta_texto = f"DPL_{current_year}_{next_n_proposta}"

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

        sql_proposta = f"""
            INSERT INTO [{NOME_TABELA_PROPOSTA}] 
            (IdProposta, NProposta, IdPropostaAntigo, Cpf_CnpjLead, RazaoSocialLead, NomeFantasia, Cidade, Uf, 
            AgenteDeVenda, StatusNegociacao, DataStatusNegociacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
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
                None,
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

        if data.get("DataDeEnvio") or data.get("DataValidade"):
            sql_data_envio = f"""
                INSERT INTO [{NOME_TABELA_DATA_ENVIO_PROPOSTA}]
                (IdProposta, DataDeEnvio, DataValidade)
                VALUES (?, ?, ?)
            """
            data_envio = (
                datetime.strptime(data.get("DataDeEnvio"), "%d/%m/%Y")
                if data.get("DataDeEnvio")
                else None
            )
            data_validade = (
                datetime.strptime(data.get("DataValidade"), "%d/%m/%Y")
                if data.get("DataValidade")
                else None
            )
            cursor.execute(sql_data_envio, next_n_proposta, data_envio, data_validade)

        if data.get("NomeContato"):
            sql_contato = f"""
                INSERT INTO [{NOME_TABELA_CONTATO_PROPOSTA}]
                (IdProposta, NomeContato, DepartamentoContato, EmailContato, TelefoneContato, CelularContato)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            cursor.execute(
                sql_contato,
                (
                    next_n_proposta,
                    data.get("NomeContato"),
                    data.get("DepartamentoContato"),
                    data.get("EmailContato"),
                    data.get("TelefoneContato"),
                    data.get("CelularContato"),
                ),
            )

        if data.get("Observacao"):
            sql_obs = f"""
                INSERT INTO [{NOME_TABELA_OBSERVACOES}]
                (IdProposta, Observacao, DataObservacao, Usuario)
                VALUES (?, ?, ?, ?)
            """
            data_obs = (
                datetime.strptime(data.get("DataObservacao"), "%d/%m/%Y")
                if data.get("DataObservacao")
                else None
            )
            cursor.execute(
                sql_obs,
                (
                    next_n_proposta,
                    data.get("Observacao"),
                    data_obs,
                    data.get("UsuarioObs"),
                ),
            )

        sql_uc_proposta = f"""
            INSERT INTO [{NOME_TABELA_UC_PROPOSTA}]
            (IdProposta, Uc)
            VALUES (?, ?)
        """
        cursor.execute(sql_uc_proposta, (next_n_proposta, data.get("NumeroDaUcLead")))

        conn.commit()

        return (
            jsonify({"sucesso": f"Proposta {id_proposta_texto} salva com sucesso!"}),
            201,
        )

    except pyodbc.IntegrityError as e:
        return (
            jsonify(
                {
                    "erro": f"Erro de integridade. É possível que o Nº da Proposta já exista. Detalhes: {e}"
                }
            ),
            409,
        )
    except (ValueError, TypeError) as e:
        return (
            jsonify(
                {"erro": f"Formato de data inválido. Use dd/mm/yyyy. Detalhes: {e}"}
            ),
            400,
        )
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"[ERRO] Erro de Banco de Dados ao salvar proposta: {sqlstate} - {ex}")
        return jsonify({"erro": f"Ocorreu um erro na base de dados: {ex}"}), 500
    finally:
        if conn:
            conn.close()


# endregion


@app.route("/")
def index():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
