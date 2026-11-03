package br.pucminas.aluguel.service;

import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final PedidoRepository pedidoRepository;

    public List<Automovel> listar() {
        return automovelRepository.findAll();
    }

    public Automovel buscar(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Automóvel não encontrado"));
    }

    public Automovel criar(Automovel automovel) {
        automovel.setId(null);
        return automovelRepository.save(automovel);
    }

    public Automovel atualizar(Long id, Automovel dados) {
        Automovel automovel = buscar(id);
        automovel.setMatricula(dados.getMatricula());
        automovel.setAno(dados.getAno());
        automovel.setMarca(dados.getMarca());
        automovel.setModelo(dados.getModelo());
        automovel.setPlaca(dados.getPlaca());
        return automovelRepository.save(automovel);
    }

    public void excluir(Long id) {
        if (pedidoRepository.existsByAutomovelId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Automóvel possui pedidos e não pode ser excluído");
        }
        automovelRepository.delete(buscar(id));
    }
}
