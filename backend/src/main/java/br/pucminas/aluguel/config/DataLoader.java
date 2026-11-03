package br.pucminas.aluguel.config;

import br.pucminas.aluguel.model.Agente;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Rendimento;
import br.pucminas.aluguel.model.TipoAgente;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private static final String SENHA_PADRAO = "123456";

    private final UsuarioRepository usuarioRepository;
    private final AutomovelRepository automovelRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(criarCliente());
            usuarioRepository.save(criarAgente("empresa", "Locadora Minas Veículos", "12.345.678/0001-90", TipoAgente.EMPRESA));
            usuarioRepository.save(criarAgente("banco", "Banco Horizonte S.A.", "98.765.432/0001-10", TipoAgente.BANCO));
        }
        if (automovelRepository.count() == 0) {
            automovelRepository.saveAll(List.of(
                    criarAutomovel("MAT-0001", 2022, "Volkswagen", "Gol", "QWE1A23"),
                    criarAutomovel("MAT-0002", 2023, "Fiat", "Argo", "RTY2B34"),
                    criarAutomovel("MAT-0003", 2021, "Chevrolet", "Onix", "UIO3C45"),
                    criarAutomovel("MAT-0004", 2024, "Toyota", "Corolla", "PAS4D56")));
        }
    }

    private Cliente criarCliente() {
        Cliente cliente = new Cliente();
        cliente.setLogin("cliente");
        cliente.setSenha(passwordEncoder.encode(SENHA_PADRAO));
        cliente.setNome("Maria Oliveira Santos");
        cliente.setRg("MG-12.345.678");
        cliente.setCpf("123.456.789-09");
        cliente.setEndereco("Rua da Bahia, 1200, Centro, Belo Horizonte - MG");
        cliente.setProfissao("Analista de Sistemas");
        cliente.getRendimentos().add(criarRendimento("Tech Minas Ltda", new BigDecimal("6500.00")));
        cliente.getRendimentos().add(criarRendimento("Consultoria Freelancer", new BigDecimal("1800.00")));
        return cliente;
    }

    private Rendimento criarRendimento(String entidade, BigDecimal valor) {
        Rendimento rendimento = new Rendimento();
        rendimento.setEntidadeEmpregadora(entidade);
        rendimento.setValor(valor);
        return rendimento;
    }

    private Agente criarAgente(String login, String nome, String cnpj, TipoAgente tipo) {
        Agente agente = new Agente();
        agente.setLogin(login);
        agente.setSenha(passwordEncoder.encode(SENHA_PADRAO));
        agente.setNome(nome);
        agente.setCnpj(cnpj);
        agente.setTipo(tipo);
        return agente;
    }

    private Automovel criarAutomovel(String matricula, int ano, String marca, String modelo, String placa) {
        Automovel automovel = new Automovel();
        automovel.setMatricula(matricula);
        automovel.setAno(ano);
        automovel.setMarca(marca);
        automovel.setModelo(modelo);
        automovel.setPlaca(placa);
        return automovel;
    }
}
