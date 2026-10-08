/**
 * PROJETO 1- ENCOMENDA RÁPIDA 
 * MATÉRIA- DESENVOLVIMENTO WEB
 * PROFESSOR- MAURIZIO
*/

// =====================
// 1. CAMADA DE NEGÓCIO 
// =====================

/**
 * CLASSE ENTIDADE REPRESENTANDO UMA ENCOMENDA
*/

class Encomenda{
    // atributo privado ES6 (#)
    #status;
    /**
     * @param {string} id- identificador único
     * @param {string} destinatario- nome do destinatario
     * @param {number} peso- Peso em kg
     * @param {string} modalidade- padrão ou rápida
     * @param {object} endereco- objeto contendo logradouro, bairro, cidade,uf
     */
     constructor (id, destinatario, peso, modalidade, endereco) {
        this.id= id;
        this.destinatario=destinatario;
        this.peso=parseFloat(peso);
        this.modalidade=modalidade.toLowerCase();
        this.endereco=endereco;

        //campo privado inicializado como Pendente
        this.#status='Pendente';

        //Valor do frente calculado na instanciação
        this.valorFrete= Encomenda.calcularFrete(this.peso, this.modalidade);
     }

     /**
      * Getter para o atributo privado #status
      */
     get status() {
        return this.#status;
     }
     /**
      * Transição de estado (pendente -- em transito -- entregue)
      * 
      */

     avancarStatus() {
        if (this.#status=='Pendente' || this.#status=='Pendente') {
            this.#status = 'Em transito';
        } else if (this.#status=='Em transito' || this.#status=='Em Trânsito'){
            this.#status= 'Entregue';
        }
     }
     /**
      * METODO ESTÁTICO PARA CÁCULO DA TAXA DE FRETE
      * @param {number} peso- peso em kg
      * @param {string} modalidade- tipo de entrega
      * @returns {number}- valor calculated do frente
      */

     static calcularFrete(peso,modalidade) {
        const taxaBase=15.00;
        const precoPorKg=5.00;
        let valorTotal= taxaBase+(peso*precoPorKg);

        if(modalidade==='expressa' || modalidade==='rápida' || modalidade==='rapida') {
            valorTotal*=1.5; //adicional de cinquenta por cento de urgencia
        }
        return valorTotal;
     }
}

/**
 * Classe Gerneciadora para controle de encomendas e do faturamento
 * 
 */
class GerenciadorLogistica {
    //Atributo privado es6
    #encomendas;

    constructor(){
        this.#encomendas=[];
    }

    /**
     * Adiciona uma nova encomenda na colecao privada
     * @param {Encomenda}
     */
    adicionarEncomenda(encomenda) {
        this.#encomendas.push(encomenda);
    }
    /**
     * Remove uma encomenda pelo ID
     * @param {string} id
     */
    removerEncomenda(id) {
        this.#encomendas=this.#encomendas.filter(e => e.id !== id);
    }
    /**
     * Busca encomenda pelo ID
     * @param {string} id
     * @returns {Ecomenda | undefined}
     */

    obterPorId(id) {
        return this.#encomendas.find(e => e.id === id);
    }
     /**
      * Getter que retorna as cópias das encomendas
      */

     get todasEncomendas() {
        return [...this.#encomendas];
    }

    calcularFaturamentoTotal() {
        return this.#encomendas.reduce((acc, e) => acc + e.valorFrete, 0);
    }

     /**
      * Retorna contagem consolidadas por status
      */
     obterMetricas(){
        return{
            total: this.#encomendas.length,
            pendentes: this.#encomendas.filter(e=> e.status=='Pendente' || e.status=='Pendente').length,
            transito: this.#encomendas.filter(e=> e.status=='Em transito' || e.status=='Em Trânsito').length,
            entregues: this.#encomendas.filter(e=> e.status=='Entregue').length,
            faturamento: this.calcularFaturamentoTotal()
        };
     }
}

     //instancia global do gerenciador
     const sistemaLogistica= new GerenciadorLogistica();

     // =======================
     // 2. INTEGRACAO ASSINCRONA (FETCH API + VIACEP)
     // =======================

     /**
      * CONSULTA CEP NA API VIACEP COM TRATAMENTO DE ERROS E ASYNC, AWAIT
      * @param {string} cep - CEP digitado
      */
     const buscarEnderecoViaCEP= async (cep) => {
        const cepLimpo= cep.replace (/\D/g, '');
        const statusEl=document.getElementById('cep-status');

        if (cepLimpo.length !==8) {
            if (statusEl) {
                statusEl.textContent='CEP INVÁLIDO. DIGITE 8 NÚMEROS';
                statusEl.className= 'feedback-text erro';
            }
            limparCamposEndereco();
            return;
        }
        try{
            if (statusEl) {
                statusEl.textContent='Buscando CEP...';
                statusEl.className='feedback-text carregando';
            }

            const resposta= await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if(!resposta.ok) {
                throw new Error('Falha na requisição da API');
            }
            const dados= await resposta.json();

            if (dados.erro) {
                if (statusEl) {
                    statusEl.textContent='CEP não encontrado';
                    statusEl.className='feedback-text erro';
                }
                limparCamposEndereco();
                return;
            }
            // Preenchimento automático dos inputs
            document.getElementById('logradouro').value=dados.logradouro || 'N/A';
            document.getElementById('bairro').value=dados.bairro || 'N/A';
            document.getElementById('cidade-uf').value=`${dados.localidade}/${dados.uf}`;

            if (statusEl) {
                statusEl.textContent='Endereco localizado com sucesso';
                statusEl.className= 'feedback-text sucesso';
            }

        } catch (erro) {
            console.error('Erro na consulta do CEP:', erro);
            if (statusEl) {
                statusEl.textContent='Erro ao conectar a API do ViaCEP';
                statusEl.className= 'feedback-text erro';
            }
            limparCamposEndereco ();
        } finally {
            //Finalização Visual (opcional)
        }
     };
     const limparCamposEndereco= () => {
        const logradouro = document.getElementById('logradouro');
        const bairro = document.getElementById('bairro');
        const cidadeUf = document.getElementById('cidade-uf');

        if (logradouro) logradouro.value='';
        if (bairro) bairro.value='';
        if (cidadeUf) cidadeUf.value='';
     };

     // ==========================
     // 3. Manipulação do dom e interativade
     // ==========================

     document.addEventListener('DOMContentLoaded', () => {
         //Seletores do DOM
         const form=document.getElementById('form-encomenda');
         const inputCep= document.getElementById('cep');

         //Eventos de consulta de CEP ao perder foco ou atingir 8 dígitos
         if (inputCep) {
             inputCep.addEventListener('blur', (e) => {
                if (e.target.value.trim() !== '') {
                    buscarEnderecoViaCEP(e.target.value);
                }
             });
         }

         //Tratamento de envio do formulário do sistema
         if (form) {
             form.addEventListener ('submit', (event) => {
                event.preventDefault();

                const destinatario = document.getElementById('destinatario').value;
                const peso = document.getElementById('peso').value;
                const modalidade = document.getElementById('modalidade').value;
                const logradouro = document.getElementById('logradouro').value;
                const bairro = document.getElementById('bairro').value;
                const cidadeUf = document.getElementById('cidade-uf').value;

                if (!logradouro || !cidadeUf) {
                    alert('Por favor, informe um CEP válido para carregar o endereço.');
                    return;
                }

                // Criação de id único simples
                const id = 'ENC-' + Date.now().toString().slice(-6);

                const endereco = { logradouro, bairro, cidadeUf };

                // Instanciação do objeto via Classe POO
                const novaEncomenda = new Encomenda(id, destinatario, peso, modalidade, endereco);

                // Cadastro no Gerenciador
                sistemaLogistica.adicionarEncomenda(novaEncomenda);

                // Atualiza Interface
                renderizarEncomendas();
                atualizarMetricas();

                // Reset do formulário
                form.reset();
                const statusEl = document.getElementById('cep-status');
                if (statusEl) statusEl.textContent = '';
            });
         }

         // Chamada inicial ao carregar a página
         renderizarEncomendas();
         atualizarMetricas();
     });

/**
 * Renderiza os cards das encomendas dinamicamente na tela
 */
const renderizarEncomendas = () => {
    const containerEncomendas= document.getElementById('container-encomendas');
    if (!containerEncomendas) return;

    containerEncomendas.innerHTML = '';
    const lista = sistemaLogistica.todasEncomendas;

    if (lista.length === 0) {
        containerEncomendas.innerHTML = '<p class="empty-msg">Nenhuma encomenda cadastrada até o momento.</p>';
        return;
    }

    lista.forEach((enc) => {
        const card = document.createElement('article');
        card.className = `card-encomenda modalidade-${enc.modalidade}`;

        // Classe auxiliar de cor de status
        let classStatus = 'status-pendente';
        if (enc.status === 'Em Trânsito' || enc.status === 'Em transito') classStatus = 'status-transito';
        if (enc.status === 'Entregue') classStatus = 'status-entregue';

        card.innerHTML = `
            <div class="card-header">
                <h3>${enc.destinatario}</h3>
                <span class="badge-modalidade ${enc.modalidade}">${enc.modalidade}</span>
            </div>
            <div class="card-body">
                <p><strong>Cód:</strong> ${enc.id}</p>
                <p><strong>Peso:</strong> ${enc.peso} kg</p>
                <p><strong>Endereço:</strong> ${enc.endereco.logradouro}, ${enc.endereco.bairro} - ${enc.endereco.cidadeUf}</p>
                <p><strong>Frete:</strong> R$ ${enc.valorFrete.toFixed(2)}</p>
                <p><strong>Status:</strong> <span class="status-badge ${classStatus}">${enc.status}</span></p>
            </div>
            <div class="card-footer">
                ${enc.status !== 'Entregue' 
                    ? `<button class="btn-action btn-avancar" onclick="avancarStatusEncomenda('${enc.id}')">Avançar Status ➔</button>` 
                    : '<span style="font-size:0.8rem; color:#16a34a; font-weight:bold;">Entregue com Sucesso</span>'}
                <button class="btn-action btn-excluir" onclick="excluirEncomenda('${enc.id}')" title="Excluir Encomenda">🗑️</button>
            </div>
        `;

        containerEncomendas.appendChild(card);
    });
};

/**
 * Alerta status da encomenda
 * @param {string} id
 */
window.avancarStatusEncomenda= (id) => {
    const enc= sistemaLogistica.obterPorId(id);
    if (enc) {
        enc.avancarStatus();
        renderizarEncomendas();
        atualizarMetricas();
    }
};

/**
 * Remove encomenda do sistema
 * @param {string} id 
 */
window.excluirEncomenda = (id) => {
    if (confirm('Deseja realmente remover esta encomenda?')) {
        sistemaLogistica.removerEncomenda(id);
        renderizarEncomendas();
        atualizarMetricas();
    }
};

/**
 * Atualiza os contadores e o faturamento no DOM
 */
const atualizarMetricas = () => {
    const m = sistemaLogistica.obterMetricas();

    const elTotal = document.getElementById('total-encomendas');
    const elPendentes = document.getElementById('total-pendentes');
    const elTransito = document.getElementById('total-transito');
    const elEntregues = document.getElementById('total-entregues');
    const elFaturamento = document.getElementById('total-faturamento');

    if (elTotal) elTotal.textContent = m.total;
    if (elPendentes) elPendentes.textContent = m.pendentes;
    if (elTransito) elTransito.textContent = m.transito;
    if (elEntregues) elEntregues.textContent = m.entregues;
    if (elFaturamento) elFaturamento.textContent = `R$ ${m.faturamento.toFixed(2)}`;
};