# Controle de Gastos

PWA mobile-first para controlar faturas de cartão, parcelas e pendências. Os dados ficam só no dispositivo (IndexedDB via Dexie) — sem backend na fase 1.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (em geral `http://localhost:5173`).

Outros scripts:

| Comando | Descrição |
| --- | --- |
| `npm run build` | Tipocheck + build de produção (com service worker) |
| `npm run preview` | Serve o build (`dist/`) para testar a PWA |
| `npm test` | Vitest — regras de cálculo e backup |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Estrutura de pastas

```
controle-gastos/
├── public/                 # Ícones e assets estáticos da PWA
├── src/
│   ├── components/         # UI reutilizável (Ring, Donut, forms…)
│   ├── constants/          # Paletas e constantes
│   ├── data/               # Camada de dados (interface + Dexie)
│   │   └── dexie/          # Implementação IndexedDB + seed demo
│   ├── domain/             # Modelos e regras puras (testáveis)
│   ├── hooks/              # Estado da aplicação
│   ├── screens/            # Visão geral e Dívidas
│   ├── styles/             # Tokens CSS e estilos globais
│   └── utils/              # Backup JSON
├── index.html
├── vite.config.ts
└── package.json
```

A UI fala só com `ExpenseRepository`. A implementação atual é Dexie; no futuro dá para plugar Supabase sem reescrever as telas.

## Telas

1. **Visão geral** — navegação de mês, anel de progresso (pago no mês), 3 cards de resumo, alerta de atraso, donut de pendências (por cartão ou por dívida) e lista de faturas do mês com botão circular de confirmação.
2. **Dívidas** — formulário de nova dívida, lista com barra de progresso e exclusão, backup JSON e “Apagar todos os dados”.

## Regras de negócio

- Valores **sempre em centavos** (inteiros). Resumos **nunca** são armazenados — sempre calculados a partir das parcelas.
- Ao criar uma dívida (descrição, cartão, valor total, nº de parcelas, primeiro vencimento), as parcelas são geradas automaticamente. A **última parcela absorve o resto** da divisão.
- **Total a pagar** = soma das parcelas não pagas.
- **Total do mês** = soma das parcelas com vencimento naquele mês.
- **A pagar no mês** = parcelas não pagas daquele mês.
- Alternar pago/não pago **recalcula tudo na hora**.
- Parcelas não pagas de meses anteriores aparecem como **Em atraso**.
- Excluir uma dívida remove também suas parcelas (com confirmação).
- Pendências podem ser agrupadas **por cartão** ou **por dívida**.
- Na primeira abertura, o app semeia os mesmos demos do protótipo: Notebook (Nubank) e Geladeira (Itaú).

## PWA / offline

O build gera `manifest.webmanifest` e service worker (`vite-plugin-pwa`). Para instalar e validar offline:

```bash
npm run build
npm run preview
```

Abra o preview em um navegador, instale o app e, após o SW registrar, desative a rede — o shell e os dados locais (IndexedDB) continuam disponíveis.

## Tema

Tema escuro padrão (fundo `#0a0a0a`, cards `#151515`, acento `#7ed321`). Tema claro via `prefers-color-scheme: light`. Layout centrado com `max-width: 480px`, alvos de toque ≥ 40px e foco de teclado visível.

## Licença

Uso pessoal / projeto de estudo.
