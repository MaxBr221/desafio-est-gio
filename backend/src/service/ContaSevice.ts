import { Conta } from '../model/Conta';

export const contas: Conta[] = [
  { id: '1', titular: 'Alice Silva', tipo: 'CORRENTE', saldo: 1000.00 },
  { id: '2', titular: 'Bruno Souza', tipo: 'POUPANCA', saldo: 500.00 },
  { id: '3', titular: 'Carlos Andrade', tipo: 'CORRENTE', saldo: -100.00 }
];

export const findConta = (id: string): Conta | undefined => {
  return contas.find(c => c.id === id);
};

export const sacar = (id: string, valor: number): { sucesso: boolean; erro?: string } => {
  const conta = findConta(id);

  if (!conta) return { sucesso: false, erro: 'Conta não encontrada' };
  if (valor <= 0) return { sucesso: false, erro: 'Valor inválido para saque' };

  if (conta.tipo === 'CORRENTE') {
    const taxa = 1.0;
    const total = valor + taxa;

    if (conta.saldo - total < -500.0) {
      return { sucesso: false, erro: 'Limite de cheque especial excedido (Máx: R$ 500,00 negativo)' };
    }

    conta.saldo -= total;
  } else {
    if (conta.saldo - valor < 0) {
      return { sucesso: false, erro: 'Conta poupança não pode ter saldo negativo' };
    }

    conta.saldo -= valor;
  }

  return { sucesso: true };
};
export const transferir = (
  origemId: string,
  destinoId: string,
  valor: number
): { sucesso: boolean; erro?: string } => {
  if (origemId === destinoId) {
    return { sucesso: false, erro: 'Contas de origem e destino devem ser diferentes' };
  }

  if (valor <= 0) {
    return { sucesso: false, erro: 'Valor inválido para transferência' };
  }

  const origem = findConta(origemId);
  const destino = findConta(destinoId);

  if (!origem || !destino) {
    return { sucesso: false, erro: 'Uma ou ambas as contas não foram encontradas' };
  }

  if (origem.tipo === 'CORRENTE') {
    const taxa = 1.00;
    const total = valor + taxa;

    if (origem.saldo - total < -500.00) {
      return {
        sucesso: false,
        erro: 'Saldo insuficiente na conta de origem (Limite de cheque especial atingido)'
      };
    }

    origem.saldo -= total;
  } else {
    if (origem.saldo - valor < 0) {
      return {sucesso: false, erro: 'Saldo insuficiente na conta poupança de origem' };
    }
    origem.saldo -= valor;
  }

  destino.saldo += valor;
  return {sucesso: true };
};