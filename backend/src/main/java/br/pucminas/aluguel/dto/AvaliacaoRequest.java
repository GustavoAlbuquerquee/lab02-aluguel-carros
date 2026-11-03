package br.pucminas.aluguel.dto;

import jakarta.validation.constraints.NotNull;

public record AvaliacaoRequest(@NotNull Boolean aprovado, String parecer) {
}
