# EncomendaRapida- Sistema de Gestão de Encomendas e Frete

## Informações
- **Nome:** Rafaela Silva de Campos Conceição
- **Matricula: ** 22506969
- **Disciplina: ** Desenvolvimento Web
- **Professor: ** Maurizio

## Descrição do Projeto EncomendaRapida
O projeto **- EncomendaRapida-** é uma aplicação Web responsiva para gerenciar, controlar e ter uma precificação automática de fretes.
Esse projeto foi feito cumprindo as regras do projeto 1, opção A

## Funcionalidade Principais
1. **Modelagem Orientada a Objeto (POO em JS): **
   - Classe **Encomenda**: Encapsula dados do destinatário, peso, modalidade, frete e estado privado **#status**.
   - Classe **GerenciadorLogistica**: Gerencia a lista de encomendas, atualizações de estado e faturamento acumulado.
2. **Integração Assíncrona via Fetch API:**
   - Preenchimento automático de endereço (Logradouro, Bairro e Cidade/UF) através do consumo da API pública **ViaCEP**.
3. **Manipulação Dinâmica do DOM:**
   - Adição, transição de status (Pendente ➔ Em Trânsito ➔ Entregue) e exclusão de cartões em tempo real.
   - Atualização dinâmica de contadores e faturamento total.
4. **Layout Responsivo (CSS3 Puro):**
   - Construído sem a utilização de frameworks (como Bootstrap/Tailwind).
   - Adaptável a telas de Smartphones, Tablets e Desktops via Flexbox, CSS Grid e Media Queries.

## Acessar:
- Para acessar o projeto é só abaixar o ZIP, descompactar, rodar o lifeserver e abrir o arquivo index.html com microsoft edge