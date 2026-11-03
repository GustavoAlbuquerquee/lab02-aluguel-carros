package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.TipoProprietario;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ContratoRequest(
        @NotNull TipoProprietario tipoProprietario,
        @NotNull @Positive BigDecimal valor,
        boolean credito,
        BigDecimal valorCredito,
        BigDecimal taxaJuros,
        Integer parcelas) {
}
