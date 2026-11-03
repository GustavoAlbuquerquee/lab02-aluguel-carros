package br.pucminas.aluguel.controller;

import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.service.ClienteService;
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
public class ClienteController {

    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    @GetMapping("/auth/me")
    public Usuario me(Authentication auth) {
        return usuarioService.atual(auth);
    }

    @PostMapping("/clientes")
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente criar(@Valid @RequestBody Cliente cliente) {
        return clienteService.criar(cliente);
    }

    @GetMapping("/clientes")
    public List<Cliente> listar() {
        return clienteService.listar();
    }

    @GetMapping("/clientes/{id}")
    public Cliente buscar(@PathVariable Long id, Authentication auth) {
        return clienteService.buscar(id, usuarioService.atual(auth));
    }

    @PutMapping("/clientes/{id}")
    public Cliente atualizar(@PathVariable Long id, @Valid @RequestBody Cliente cliente, Authentication auth) {
        return clienteService.atualizar(id, cliente, usuarioService.atual(auth));
    }

    @DeleteMapping("/clientes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id, Authentication auth) {
        clienteService.excluir(id, usuarioService.atual(auth));
    }
}
