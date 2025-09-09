class AbrigoAnimais {
  constructor() {
    this.animais = {
      Rex: { tipo: "cão", brinquedos: ["RATO", "BOLA"] },
      Mimi: { tipo: "gato", brinquedos: ["BOLA", "LASER"] },
      Fofo: { tipo: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
      Zero: { tipo: "gato", brinquedos: ["RATO", "BOLA"] },
      Bola: { tipo: "cão", brinquedos: ["CAIXA", "NOVELO"] },
      Bebe: { tipo: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
      Loco: { tipo: "jabuti", brinquedos: ["SKATE", "RATO"] },
    };
  }

  #definirDestino(animal, tipo, brinquedos1, brinquedos2, brinquedosFavoritos, adocoes) {
    const pessoa1Atende = this.#verificarBrinquedos(brinquedos1, brinquedosFavoritos, animal);
    const pessoa2Atende = this.#verificarBrinquedos(brinquedos2, brinquedosFavoritos, animal);

    if (pessoa1Atende && pessoa2Atende) {
        return { destino: "abrigo" };
    }

    if (tipo === "gato" && pessoa1Atende && pessoa2Atende) {
        return { destino: "abrigo" };
    }

    const pessoa1Cheia = adocoes.pessoa1.total >= 3;
    const pessoa2Cheia = adocoes.pessoa2.total >= 3;

    if (pessoa1Cheia && pessoa2Cheia) {
        return { destino: "abrigo" };
    }

    if (animal === "Loco") {
        if (pessoa1Atende && !pessoa1Cheia && adocoes.pessoa1.total > 0) {
            return { destino: "pessoa 1", pessoa: "pessoa1" };
        }
        if (pessoa2Atende && !pessoa2Cheia && adocoes.pessoa2.total > 0) {
            return { destino: "pessoa 2", pessoa: "pessoa2" };
        }
        return { destino: "abrigo" };
    }

    if (pessoa1Atende && !pessoa1Cheia) {
        return { destino: "pessoa 1", pessoa: "pessoa1" };
    }
    if (pessoa2Atende && !pessoa2Cheia) {
        return { destino: "pessoa 2", pessoa: "pessoa2" };
    }

    return { destino: "abrigo" };
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const brinquedos1 = this.#validarBrinquedos(brinquedosPessoa1);
    const brinquedos2 = this.#validarBrinquedos(brinquedosPessoa2);
    const animais = this.#validarAnimais(ordemAnimais);

    if (!brinquedos1 || !brinquedos2) return { erro: "Brinquedo inválido" };
    if (!animais) return { erro: "Animal inválido" };

    const resultado = [];
    const adocoes = {
      pessoa1: { total: 0, animais: [] },
      pessoa2: { total: 0, animais: [] }
    };

    for (const animal of animais) {
      const { tipo, brinquedos: brinquedosFavoritos } = this.animais[animal];
      
      if (adocoes.pessoa1.total >= 3 && adocoes.pessoa2.total >= 3) {
        resultado.push(`${animal} - abrigo`);
        continue;
      }

      const destinoAnimal = this.#definirDestino(
        animal,
        tipo,
        brinquedos1,
        brinquedos2,
        brinquedosFavoritos,
        adocoes
      );

      if (destinoAnimal.pessoa) {
        adocoes[destinoAnimal.pessoa].total++;
        adocoes[destinoAnimal.pessoa].animais.push(animal);
      }

      resultado.push(`${animal} - ${destinoAnimal.destino}`);
    }

    return { 
      lista: resultado.sort((a, b) => {
        const [animalA] = a.split(' - ');
        const [animalB] = b.split(' - ');
        return animalA.localeCompare(animalB, 'pt-BR', { sensitivity: 'base' });
      })
    };
  }

  #validarBrinquedos(brinquedos) {
    if (!brinquedos || typeof brinquedos !== 'string') return null;
    const brinquedosArray = brinquedos.split(",").map(s => s.trim()).filter(s => s !== '');
    if (brinquedosArray.length === 0) return null;
    const brinquedosUnicos = new Set(brinquedosArray);
    return brinquedosUnicos.size === brinquedosArray.length ? brinquedosArray : null;
  }

  #validarAnimais(ordemAnimais) {
    if (!ordemAnimais || typeof ordemAnimais !== 'string') return null;
    const animaisArray = ordemAnimais.split(",").map(s => s.trim()).filter(s => s !== '');
    if (animaisArray.length === 0) return null;
    const animaisUnicos = new Set(animaisArray);
    if (animaisUnicos.size !== animaisArray.length) return null; 
    for (const animal of animaisArray) {
      if (!this.animais[animal]) return null;
    }
    return animaisArray;
  }

  #verificarBrinquedos(brinquedosPessoa, brinquedosFavoritos, animal, animaisAdotados) {
    if (animal === "Loco") {
      return brinquedosFavoritos.some(brinquedo => brinquedosPessoa.includes(brinquedo));
    }
    
    let indexBrinquedoFavorito = 0;
    for (const brinquedo of brinquedosPessoa) {
      if (brinquedo === brinquedosFavoritos[indexBrinquedoFavorito]) {
        indexBrinquedoFavorito++;
      }
      if (indexBrinquedoFavorito === brinquedosFavoritos.length) {
        return true;
      }
    }
    return false;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
