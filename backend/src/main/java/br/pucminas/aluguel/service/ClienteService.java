package br.pucminas.aluguel.service;

import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Perfil;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Cliente criar(Cliente cliente) {
        if (cliente.getSenha() == null || cliente.getSenha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha é obrigatória");
        }
        if (usuarioRepository.existsByLogin(cliente.getLogin())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login já cadastrado");
        }
        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }
        cliente.setId(null);
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    public Cliente buscar(Long id, Usuario solicitante) {
        verificarAcesso(id, solicitante);
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    @Transactional
    public Cliente atualizar(Long id, Cliente dados, Usuario solicitante) {
        Cliente cliente = buscar(id, solicitante);
        if (!cliente.getLogin().equals(dados.getLogin()) && usuarioRepository.existsByLogin(dados.getLogin())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login já cadastrado");
        }
        if (!cliente.getCpf().equals(dados.getCpf()) && clienteRepository.existsByCpf(dados.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }
        cliente.setNome(dados.getNome());
        cliente.setLogin(dados.getLogin());
        cliente.setRg(dados.getRg());
        cliente.setCpf(dados.getCpf());
        cliente.setEndereco(dados.getEndereco());
        cliente.setProfissao(dados.getProfissao());
        cliente.getRendimentos().clear();
        cliente.getRendimentos().addAll(dados.getRendimentos());
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            cliente.setSenha(passwordEncoder.encode(dados.getSenha()));
        }
        return clienteRepository.save(cliente);
    }

    @Transactional
    public void excluir(Long id, Usuario solicitante) {
        Cliente cliente = buscar(id, solicitante);
        if (pedidoRepository.existsByClienteId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cliente possui pedidos e não pode ser excluído");
        }
        clienteRepository.delete(cliente);
    }

    private void verificarAcesso(Long id, Usuario solicitante) {
        if (solicitante.getPerfil() == Perfil.CLIENTE && !solicitante.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }
}
