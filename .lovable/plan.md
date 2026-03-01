

## Restaurar Ficha Tecnica Completa

A ficha tecnica atual esta muito simplificada, com apenas 2 campos (nome e tipo). Vou restaura-la com todas as funcionalidades que existiam antes.

### O que sera adicionado

**Campos do formulario:**
- Nome do Produto e Tipo de Peca (ja existem)
- Referencia / Codigo
- Colecao
- Designer responsavel
- Data de criacao
- Desenho do Produto (upload de imagem ou PDF com preview e download)
- Tecidos (lista dinamica: nome, composicao, largura, fornecedor)
- Aviamentos (lista dinamica: tipo, cor, tamanho, quantidade)
- Acessorios (lista dinamica)
- Maquinario necessario (lista dinamica)
- Sequencia operacional de montagem (lista ordenada de etapas)
- Observacoes gerais

**Funcionalidade de Download:**
- Botao para gerar e baixar a ficha tecnica completa como PDF
- Preview do desenho tecnico (imagem ou PDF) com opcao de download
- Download do desenho tecnico enviado

### Detalhes tecnicos

1. **`src/components/FichaTecnicaForm.tsx`** - Reescrever o componente completo com:
   - Estados para todos os campos (referencia, colecao, designer, data, tecidos[], aviamentos[], acessorios[], maquinario[], sequenciaOperacional[], observacoes)
   - Funcoes para adicionar/remover itens das listas dinamicas
   - Upload de arquivo (imagem + PDF) com FileReader para preview
   - Funcao `handleDownloadFicha` que gera um documento HTML formatado e dispara download como PDF via `window.print()` ou criacao de Blob
   - Funcao `handleDownloadDesenho` para baixar o arquivo enviado
   - Layout organizado em secoes com estilo consistente

2. **Tipos de peca expandidos** (21 tipos): Blusa, Camiseta, Camisa, Top, Vestido, Saia, Calca, Shorts, Bermuda, Macacao, Jaqueta, Biquini, Maio, Fitness, Infantil, Sunga, Cueca, Calcinha, Sutia, Lingerie, Outros

