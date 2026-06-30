import { Request, Response } from 'express';
import { contas, findConta, sacar, transferir } from '../service/ContaSevice';

export class ContaController {

  listar(req: Request, res: Response) {
    return res.json(contas);
  }

  buscar(req: Request, res: Response) {
    const id = req.params.id;

    if (typeof id !== 'string') {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const conta = findConta(id);
    if (!conta) {
      return res.status(404).json({ erro: 'Conta não encontrada' });
    }

    return res.json(conta);
  }

  sacar(req: Request, res: Response) {
    const { valor } = req.body;
    const id = req.params.id;

    if (typeof id !== 'string') {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    if (typeof valor !== 'number') {
      return res.status(400).json({ erro: 'O campo valor precisa ser um número' });
    }

    const resultado = sacar(id, valor);
    if (!resultado.sucesso) {
      return res.status(400).json({ erro: resultado.erro });
    }

    return res.json({
      mensagem: 'Saque realizado com sucesso',
    });
  }

  transferir(req: Request, res: Response) {
    const { origemId, destinoId, valor } = req.body;

    if (!origemId || !destinoId || typeof valor !== 'number') {
      return res.status(400).json({ erro: 'Campos obrigatórios: origemId, destinoId e valor (numérico)' });
    }

    const resultado = transferir(origemId, destinoId, valor);
    if (!resultado.sucesso) {
      return res.status(400).json({ erro: resultado.erro });
    }

    return res.json({ 
      mensagem: 'Transferência realizada com sucesso',
      remetente: findConta(origemId)
    });
  }
}