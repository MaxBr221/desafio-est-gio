export interface Conta {
  id: string;
  titular: string;
  tipo: 'CORRENTE' | 'POUPANCA';
  saldo: number;
}