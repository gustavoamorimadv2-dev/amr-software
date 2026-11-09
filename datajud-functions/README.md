# DataJud — AMR Software

Integração direta entre andamento.html, a função consultarTribunalCrm, o DataJud/CNJ e o Firestore do AMR Software. Sem n8n.

## Projeto e publicação

Este repositório usa exclusivamente o Firebase dapapp-38637. O Rodrigues Amorim permanece no projeto rodrigues-amr, sem conexão de bancos ou autenticação entre eles.

Instale as dependências com npm ci --prefix datajud-functions e publique somente esta função:

    firebase deploy --only functions:datajud-crm:consultarTribunalCrm --project dapapp-38637

A chave DATAJUD_API_KEY fica no Secret Manager do próprio projeto. Nunca coloque a chave na página HTML. As funções já existentes do aplicativo não são chamadas nem substituídas.

O catálogo tribunais.json contém 91 endpoints oficiais. A coleção datajudTribunais do próprio projeto fornece as rotas; se faltar um registro, utiliza o mesmo catálogo local validado.

## Fluxo

O usuário autenticado escolhe Gerar andamento no card. O servidor valida que o processo pertence ao cadastro selecionado, identifica o tribunal pelo número CNJ, consulta a última movimentação e atualiza somente campos datajud* do cliente. Os dois modelos de mensagem leem esse rascunho, inclusive ao reabrir o card. O envio ao cliente continua sujeito à revisão pelo colaborador.

Não altera fila, status ou histórico do último andamento enviado. A consulta pode retornar ausência de registros ou indisponibilidade do DataJud; isso não significa ausência de nova movimentação.

## Testes

    npm test --prefix datajud-functions

Os testes usam dados sintéticos e o exemplo público do CNJ, sem escrever em clientes reais.
