package br.pucminas.aluguel.service;

import br.pucminas.aluguel.dto.AvaliacaoRequest;
import br.pucminas.aluguel.dto.ContratoRequest;
import br.pucminas.aluguel.dto.PedidoRequest;
import br.pucminas.aluguel.model.*;
import br.pucminas.aluguel.repository.ContratoRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ContratoRepository contratoRepository;
    private final AutomovelService automovelService;

    public List<Pedido> listar(Usuario usuario) {
        if (usuario instanceof Cliente) {
            return pedidoRepository.findByClienteIdOrderByIdDesc(usuario.getId());
        }
        return pedidoRepository.findAllByOrderByIdDesc();
    }

    public Pedido buscar(Long id, Usuario usuario) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (usuario instanceof Cliente && !pedido.getCliente().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        return pedido;
    }

    @Transactional
    public Pedido criar(PedidoRequest req, Usuario usuario) {
        if (!(usuario instanceof Cliente cliente)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas clientes podem introduzir pedidos");
        }
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        preencher(pedido, req);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido modificar(Long id, PedidoRequest req, Usuario usuario) {
        Pedido pedido = buscar(id, usuario);
        boolean editavel = usuario instanceof Cliente
                ? pedido.getStatus() == StatusPedido.PENDENTE
                : pedido.getStatus() == StatusPedido.PENDENTE || pedido.getStatus() == StatusPedido.APROVADO;
        if (!editavel) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pedido com status " + pedido.getStatus() + " não pode ser modificado");
        }
        preencher(pedido, req);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido cancelar(Long id, Usuario usuario) {
        Pedido pedido = buscar(id, usuario);
        if (pedido.getStatus() != StatusPedido.PENDENTE && pedido.getStatus() != StatusPedido.APROVADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pedido com status " + pedido.getStatus() + " não pode ser cancelado");
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido avaliar(Long id, AvaliacaoRequest req, Usuario usuario) {
        Pedido pedido = buscar(id, usuario);
        if (!(usuario instanceof Agente agente)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas agentes avaliam pedidos");
        }
        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas pedidos pendentes podem ser avaliados");
        }
        pedido.setStatus(req.aprovado() ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
        pedido.setParecer(req.parecer());
        pedido.setAgenteAvaliador(agente);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Contrato contratar(Long id, ContratoRequest req, Usuario usuario) {
        Pedido pedido = buscar(id, usuario);
        if (!(usuario instanceof Agente agente)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas agentes executam contratos");
        }
        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas pedidos aprovados podem ser contratados");
        }
        Contrato contrato = new Contrato();
        contrato.setPedido(pedido);
        contrato.setTipoProprietario(req.tipoProprietario());
        contrato.setValor(req.valor());
        if (req.credito()) {
            if (agente.getTipo() != TipoAgente.BANCO) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contrato de crédito só pode ser concedido por um banco");
            }
            validarCredito(req);
            ContratoCredito credito = new ContratoCredito();
            credito.setBanco(agente);
            credito.setValor(req.valorCredito() != null ? req.valorCredito() : req.valor());
            credito.setTaxaJuros(req.taxaJuros());
            credito.setParcelas(req.parcelas());
            contrato.setContratoCredito(credito);
        }
        pedido.setStatus(StatusPedido.CONTRATADO);
        pedidoRepository.save(pedido);
        return contratoRepository.save(contrato);
    }

    public Contrato buscarContrato(Long id, Usuario usuario) {
        buscar(id, usuario);
        return contratoRepository.findByPedidoId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido sem contrato"));
    }

    private void validarCredito(ContratoRequest req) {
        if (req.valorCredito() != null && req.valorCredito().signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valor do crédito deve ser maior que zero");
        }
        if (req.taxaJuros() == null || req.taxaJuros().signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Taxa de juros deve ser informada e não pode ser negativa");
        }
        if (req.parcelas() == null || req.parcelas() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Número de parcelas deve ser no mínimo 1");
        }
    }

    private void preencher(Pedido pedido, PedidoRequest req) {
        if (req.dataFim().isBefore(req.dataInicio())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data final deve ser após a data inicial");
        }
        pedido.setAutomovel(automovelService.buscar(req.automovelId()));
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());
    }
}
