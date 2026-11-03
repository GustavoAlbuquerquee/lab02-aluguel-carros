package br.pucminas.aluguel.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cliente extends Usuario {

    @NotBlank
    @Column(nullable = false)
    private String rg;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String cpf;

    private String endereco;

    private String profissao;

    @Valid
    @Size(max = 3, message = "O cliente pode ter no máximo 3 rendimentos")
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    private List<Rendimento> rendimentos = new ArrayList<>();

    @Override
    public Perfil getPerfil() {
        return Perfil.CLIENTE;
    }
}
