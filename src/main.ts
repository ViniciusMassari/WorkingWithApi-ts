import './style.css';
import dados, { FormaPagamento, dadosApi } from './api';
import {
  estatisticasTotais,
  getDiaDeMaisVendas,
  getTotal,
  formasDePagamento,
} from './functions';
import { StatusCompra } from './api';

export interface Pedidos {
  id: number;
  nome: string;
  status: StatusCompra;
  data: string;
  formaDePagamento: FormaPagamento;
  email: string;
  valor: string;
  clienteNovo: boolean;
}

const table = document.querySelector('#table tbody');
const estatisticas = document.querySelector('#estatisticas');

const fetchTableData = async () => {
  const dados = await dadosApi();
  if (dados && dados !== undefined) {
    fillTable(dados);
  }
};

fetchTableData();

function fillEstatistics(data: Array<unknown>) {
  if (checkArray(data) && estatisticas) {
    estatisticas.innerHTML += `
    <h2>Total</h2>
    <p>R$ ${getTotal(data.map((dado) => dado.valor)).toLocaleString()}</p>
  <hr>
     <p>Cartão de Crédito: ${
       formasDePagamento(data.map((dado) => dado.formaDePagamento)).cartao
     }</p>
   <p>Boleto: ${
     formasDePagamento(data.map((dado) => dado.formaDePagamento)).boleto
   }</p>
     <hr>
     <p>Paga: ${estatisticasTotais[0].paga} </p>
     <p>Recusada pela operadora de cartão: ${
       estatisticasTotais[0].recusada
     } </p>
     <p>Aguardando Pagamento: ${estatisticasTotais[0].aguardando} </p>
     <p>Estornada: ${estatisticasTotais[0].estornada} </p>
     <p>Dias com mais vendas: ${getDiaDeMaisVendas(
       data.map((dado) => dado.data)
     )} </p>

    `;
  }
}

const fetchStatistics = async () => {
  const dados = await dadosApi();
  if (dados && dados !== undefined) {
    fillEstatistics(dados);
  }
};

fetchStatistics();

function checkArray(data: unknown): data is Array<Pedidos> {
  if (data && typeof data === 'object' && data instanceof Array) {
    return data.every(
      (dataKey) => 'id' in dataKey && 'nome' in dataKey && 'status' in dataKey
    );
  } else {
    return false;
  }
}

function fillTable(dados: Array<unknown>) {
  if (checkArray(dados) && table) {
    dados.forEach((dado) => {
      table.innerHTML += ` <tr>
      <td scope="row">${dado.nome}</td>
      <td scope="row">${dado.email}</td>
      <td scope="row">${dado.valor}</td>
      <td scope="row">${dado.formaDePagamento}</td>
      <td scope="row">${dado.status}</td>
    </tr>`;
    });
  }
}
