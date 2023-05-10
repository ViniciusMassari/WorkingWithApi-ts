import dados, { FormaPagamento, dadosApi } from './api';

import { Pedidos } from './main';

type Estatisticas = {
  paga: number;
  recusada: number;
  aguardando: number;
  estornada: number;
};

type BoletoOuCartao = {
  boleto: number;
  cartao: number;
};

export const estatisticasTotais: Array<Estatisticas> = [
  {
    paga: 0,
    recusada: 0,
    aguardando: 0,
    estornada: 0,
  },
];

// retorna o total em compras
export function getTotal(valores: string[]): number {
  return valores.reduce((acc, val) => {
    if (val && val.length + 1) {
      const valorNormalizado = val.replace(/\./g, '').replace(',', '.');

      if (valorNormalizado.includes('-') && !isNaN(+valorNormalizado)) {
        return (acc += +valorNormalizado);
      }
      if (!isNaN(+valorNormalizado)) {
        return (acc += +valorNormalizado);
      } else {
        return acc;
      }
    } else {
      return acc;
    }
  }, 0);
}

// retorna o total de cada forma de pagamento usada
export function formasDePagamento(
  formaDePagamento: Array<FormaPagamento>
): BoletoOuCartao {
  let boleto = 0;
  let cartao = 0;
  if (formaDePagamento) {
    formaDePagamento.forEach((forma) => {
      if (forma === 'Boleto') {
        boleto += 1;
      } else {
        cartao += 1;
      }
    });
  }
  return {
    boleto,
    cartao,
  };
}

// retorna o total de cada status de compra
export function getStatus(dados: Array<Pedidos | undefined>): Estatisticas {
  if (dados && dados !== undefined) {
    dados.forEach((d) => {
      switch (d?.status) {
        case 'Paga':
          estatisticasTotais[0].paga += 1;
          break;
        case 'Estornada':
          estatisticasTotais[0].estornada += 1;
          break;
        case 'Aguardando pagamento':
          estatisticasTotais[0].aguardando += 1;
          break;
        case 'Recusada pela operadora de cartão':
          estatisticasTotais[0].recusada += 1;
          break;
        default:
          break;
      }
      return estatisticasTotais;
    });
  }
  return {
    paga: 0,
    recusada: 0,
    aguardando: 0,
    estornada: 0,
  };
}

const fetchData = async () => {
  const dados = await dadosApi();
  if (dados && dados !== undefined) {
    getStatus(dados);
  }
};

fetchData();

function convertDate(dateString: string): string {
  const [date, time] = dateString.split(' ');
  const [day, month, year] = date.split('/');
  const [hour, minute] = time.split(':');
  const isoDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
  return isoDate;
}

// retorna o dia da semana onde houve mais vendas
export function getDiaDeMaisVendas(datas: string[]): string | undefined {
  let diaPreferido = '';
  let diasSemana: any = {
    domingo: 0,
    segunda: 0,
    terca: 0,
    quarta: 0,
    quinta: 0,
    sexta: 0,
    sabado: 0,
  };

  datas.forEach((data) => {
    const isoDate = convertDate(data);

    const diaSemana = new Date(isoDate).getDay();
    switch (diaSemana) {
      case 0:
        diasSemana.domingo += 1;
        break;
      case 1:
        diasSemana.segunda += 1;
        break;
      case 2:
        diasSemana.terca += 1;
        break;
      case 3:
        diasSemana.quarta += 1;
        break;
      case 4:
        diasSemana.quinta += 1;
        break;
      case 5:
        diasSemana.sexta += 1;
        break;
      case 6:
        diasSemana.sabado += 1;
        break;
      default:
        break;
    }
  });
  for (const dia in diasSemana) {
    if (diasSemana[dia] > diaPreferido) {
      diaPreferido = dia;
    }
  }

  return diaPreferido;
}
