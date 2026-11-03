package br.pucminas.aluguel.controller;

import br.pucminas.aluguel.dto.AvaliacaoRequest;
import br.pucminas.aluguel.dto.ContratoRequest;
import br.pucminas.aluguel.dto.PedidoRequest;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Contrato;
import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.service.AutomovelService;
import br.pucminas.aluguel.service.PedidoService;
import br.pucminas.aluguel.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final AutomovelService automovelService;
    private final UsuarioService usuarioService;

    @GetMapping("/automoveis")
    public List<Automovel> automoveis() {
        return automovelService.listar();
    }

    @PostMapping("/automoveis")
    @ResponseStatus(HttpStatus.CREATED)
    public Automovel criarAutomovel(@Valid @RequestBody Automovel automovel) {
        return automovelService.criar(automovel);
    }

    @GetMapping("/pedidos")
    public List<Pedido> listar(Authentication auth) {
        return pedidoService.listar(usuarioService.atual(auth));
    }

    @GetMapping("/pedidos/{id}")
    public Pedido buscar(@PathVariable Long id, Authentication auth) {
        return pedidoService.buscar(id, usuarioService.atual(auth));
    }

    @PostMapping("/pedidos")
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido criar(@Valid @RequestBody PedidoRequest req, Authentication auth) {
        return pedidoService.criar(req, usuarioService.atual(auth));
    }

    @PutMapping("/pedidos/{id}")
    public Pedido modificar(@PathVariable Long id, @Valid @RequestBody PedidoRequest req, Authentication auth) {
        return pedidoService.modificar(id, req, usuarioService.atual(auth));
    }

    @PatchMapping("/pedidos/{id}/cancelar")
    public Pedido cancelar(@PathVariable Long id, Authentication auth) {
        return pedidoService.cancelar(id, usuarioService.atual(auth));
    }

    @PatchMapping("/pedidos/{id}/avaliar")
    public Pedido avaliar(@PathVariable Long id, @Valid @RequestBody AvaliacaoRequest req, Authentication auth) {
        return pedidoService.avaliar(id, req, usuarioService.atual(auth));
    }

    @PostMapping("/pedidos/{id}/contrato")
    @ResponseStatus(HttpStatus.CREATED)
    public Contrato contratar(@PathVariable Long id, @Valid @RequestBody ContratoRequest req, Authentication auth) {
        return pedidoService.contratar(id, req, usuarioService.atual(auth));
    }

    @GetMapping("/pedidos/{id}/contrato")
    public Contrato contrato(@PathVariable Long id, Authentication auth) {
        return pedidoService.buscarContrato(id, usuarioService.atual(auth));
    }
}
