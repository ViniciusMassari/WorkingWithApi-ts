import { Pedidos } from './main';

const chavesApi: Array<string> = [
  'Status',
  'ID',
  'Data',
  'Nome',
  'Forma de Pagamento',
  'Email',
  'Valor (R$)',
  'Cliente Novo',
];

export type StatusCompra =
  | 'Paga'
  | 'Recusada pela operadora de cartão'
  | 'Aguardando pagamento'
  | 'Estornada';

export type FormaPagamento = 'Boleto' | 'Cartão de Crédito';

// Api with bad key names >:(
interface IApi {
  ID: number;
  Nome: string;
  Status: StatusCompra;
  Data: string;
  'Forma de Pagamento': FormaPagamento;
  Email: string;
  'Valor (R$)': string;
  'Cliente Novo': boolean;
}

// normalizador api
function normalizacao(obj: IApi | undefined): Array<Pedidos | undefined> {
  if (
    obj &&
    typeof obj === 'object' &&
    obj instanceof Array &&
    obj !== undefined
  ) {
    return obj.map((dado: IApi) => {
      if (
        chavesApi.filter((chave) => chave in dado).length === chavesApi.length
      ) {
        return {
          id: dado.ID,
          nome: dado.Nome,
          status: dado.Status,
          data: dado.Data,
          formaDePagamento: dado['Forma de Pagamento'],
          email: dado.Email,
          valor: dado['Valor (R$)'],
          clienteNovo: dado['Cliente Novo'],
        };
      }
    });
  } else {
    return [];
  }
}

export const dadosApi = async () => {
  try {
    const dados = await fetch('https://api.origamid.dev/json/transacoes.json');
    const dadosJson = await dados.json();
    if (dadosJson && dadosJson !== undefined) {
      return normalizacao(dadosJson);
    }
  } catch (error) {
    throw new Error('Não foi possivel acessar a API');
  }
  // Retorna uma Promessa resolvida com um array vazio
  return Promise.resolve([]);
};

const dados = dadosApi();

export default dados;
