# Projeto Hackathon FIAP X – Processamento de Vídeos

Este projeto foi desenvolvido como trabalho final do curso de Pós-Graduação em Arquitetura de Software. O objetivo é demonstrar a aplicação prática dos conceitos de **Arquitetura Hexagonal**, **Microsserviços** e **Infraestrutura como Código (IaC)**, criando uma solução escalável e resiliente para o processamento de vídeos. A aplicação realiza o upload de vídeos, extrai frames utilizando FFmpeg e gera um arquivo ZIP com as imagens extraídas, além de oferecer autenticação, gerenciamento de status e notificações de erro.

---

## Índice

- [Projeto Hackathon FIAP X – Processamento de Vídeos](#projeto-hackathon-fiap-x--processamento-de-vídeos)
  - [Índice](#índice)
  - [Introdução](#introdução)
  - [Arquitetura do Sistema](#arquitetura-do-sistema)
    - [1. Camada de API (Entrada)](#1-camada-de-api-entrada)
    - [2. Camada de Processamento](#2-camada-de-processamento)
    - [3. Pipeline de CI/CD](#3-pipeline-de-cicd)
    - [4. Infraestrutura](#4-infraestrutura)
    - [5. Monitoramento](#5-monitoramento)
  - [Funcionalidades](#funcionalidades)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Como Executar](#como-executar)
    - [Desenvolvimento Local](#desenvolvimento-local)
    - [Deploy em Produção](#deploy-em-produção)
  - [CI/CD](#cicd)
  - [Monitoramento e Observabilidade](#monitoramento-e-observabilidade)
  - [Testes](#testes)
  - [Considerações Finais](#considerações-finais)
  - [Contribuição](#contribuição)

---

## Introdução

O sistema foi desenvolvido para atender à demanda da empresa FIAP X, que deseja evoluir o projeto apresentado a investidores. A nova versão permitirá que os usuários enviem vídeos e façam download de um arquivo ZIP contendo os frames extraídos. O projeto foi estruturado utilizando boas práticas de arquitetura, com foco em:

- **Escalabilidade:** Processamento de múltiplos vídeos simultaneamente, utilizando processamento assíncrono com SQS e funções Lambda.
- **Resiliência:** Garantia de que, mesmo em picos de requisições, nenhuma mensagem seja perdida.
- **Segurança:** Autenticação via JWT e proteção dos endpoints.
- **Infraestrutura Moderna:** Utilização de Docker, Terraform e pipelines CI/CD para automação de deploy e provisionamento de recursos.

---


## Arquitetura do Sistema

A solução adota uma abordagem **hexagonal** e **orientada a microsserviços**, dividindo o sistema em camadas e componentes independentes. Veja abaixo um resumo da arquitetura:

### 1. Camada de API (Entrada)

- **Fastify API:** Responsável por expor os endpoints REST para upload, listagem e download de vídeos.
- **JWT Auth:** Validação de tokens para garantir segurança.
- **Prisma/ Postgres:** Persistência dos dados (vídeos e usuários).
- **S3 Storage:** Armazenamento dos vídeos enviados.
- **SQS:** Publica mensagens para acionar o processamento assíncrono.

### 2. Camada de Processamento

- **Worker Mensageria:** Consome mensagens da fila SQS e aciona a função Lambda.
- **Lambda Extração:** Realiza a extração dos frames utilizando FFmpeg e armazena os resultados no S3. Após a extração, publica o status do processamento para atualizar o banco de dados.

### 3. Pipeline de CI/CD

- **GitHub Actions:** Automatiza os testes, builds e deploys.
- **Docker Build:** Cria imagens Docker da API e da função Lambda.
- **Amazon ECR e ECS:** Armazenamento das imagens e orquestração dos contêineres.

### 4. Infraestrutura

- **Terraform:** Provisiona a infraestrutura na AWS (VPC, RDS/EFS, ECS, Lambda, S3, SQS).
- **AWS Infra:** Representa o ambiente AWS onde os recursos são implantados.

### 5. Monitoramento

- **Prometheus:** Coleta métricas dos serviços.
- **Grafana:** Visualiza as métricas e fornece dashboards para monitoramento em tempo real.

> **Diagramas da Arquitetura:**
>
> **Arquitetura DDD e Componentes:** > ![DDD Frame Extractor](./docs/DDD%20Frame%20extractor.png)
>
> **Infraestrutura AWS:** > ![Arquitetura AWS](./docs/Arquitetura%20infra.png)

---

## Funcionalidades

- **Processamento Simultâneo:** Suporta o processamento de vários vídeos ao mesmo tempo.
- **Extração de Frames:** Utiliza FFmpeg para extrair frames dos vídeos.
- **Armazenamento e Persistência:** Utiliza S3 para armazenamento de arquivos e Postgres (via Prisma) para gerenciamento dos metadados.
- **Processamento Assíncrono:** Utiliza SQS para gerenciar mensagens e Lambda para processamento assíncrono.
- **Autenticação de Usuário:** Implementa autenticação JWT para segurança dos endpoints.
- **Notificações de Erro:** Envia notificações via e-mail utilizando a API Resend em caso de falhas.
- **CI/CD Automatizado:** Pipelines configuradas para build, testes e deploy.
- **Provisionamento de Infraestrutura:** Toda a infraestrutura é provisionada automaticamente com Terraform.
- **Monitoramento:** Integração com Prometheus e Grafana para visualização de métricas.

---

## Estrutura do Projeto

A organização do projeto segue uma arquitetura hexagonal, separando o domínio da infraestrutura:

```
/src
  ├── core/                   # Domínio da aplicação (Entidades, Casos de Uso, Eventos)
  ├── infra/                  # Adaptadores, Implementações e Configurações (HTTP, AWS, Repositórios)
  ├── entrypoints/            # Pontos de entrada (ex.: função Lambda)
  ├── @types/                # Tipos TypeScript customizados
  ├── shared/                # Utilitários e funções comuns (ex.: gerador de nomes únicos)
  └── worker.ts              # Processo contínuo para consumo da fila SQS
/dev/terraform              # Scripts Terraform para provisionamento de infraestrutura
/docker                     # Dockerfiles para API e Lambda
/tests                      # Testes unitários e de integração (Vitest)
```

---

## Pré-requisitos

- **Node.js** (versão 22 ou superior)
- **npm** ou **pnpm**
- **Docker** e **docker-compose** (para desenvolvimento local)
- **Terraform** (para provisionamento de infraestrutura)
- Conta na **AWS** configurada para deploy em produção
- **GitHub** (para CI/CD com GitHub Actions)

---

## Variáveis de Ambiente

Renomeie o arquivo `.env.example` para `.env` e configure as seguintes variáveis:

- `NODE_ENV` – Ambiente de execução (dev, test ou production)
- `PORT` – Porta da API
- `DATABASE_URL` – URL de conexão com o PostgreSQL
- `RESEND_API_KEY` – API Key para o serviço de e-mail Resend
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` – Credenciais AWS (se necessário)
- `AWS_REGION` – Região da AWS (ex.: us-east-1)
- `S3_BUCKET_NAME` – Nome base do bucket S3 (um sufixo aleatório será adicionado)
- `SQS_QUEUE_NAME` e `SQS_QUEUE_NAME_SUBSCRIPTION` – Nomes das filas SQS
- `JWT_SECRET` – Chave secreta para geração de tokens JWT

---

## Política de Uso de Dados

### Coleta de Dados:
O sistema coleta dados pessoais como informações de autenticação e dados relacionados ao vídeo enviado (nome do arquivo, informações sobre a extração dos frames). Esses dados são necessários para processar os vídeos e gerar as imagens.

### Uso dos Dados:
Os dados são utilizados para processar o conteúdo enviado, autenticar usuários e fornecer notificações relacionadas ao processo. Não utilizamos os dados para finalidades fora do escopo do serviço oferecido.

### Armazenamento de Dados:
Os vídeos e imagens geradas são armazenados de forma segura em infraestrutura AWS, com criptografia tanto em repouso quanto em trânsito. A plataforma garante que o acesso aos dados seja restrito aos processos necessários para o funcionamento do sistema.

### Consentimento do Usuário:
O usuário deve consentir com os termos de uso e a política de privacidade antes de enviar qualquer conteúdo para processamento.

### Compartilhamento de Dados:
Os dados pessoais não serão compartilhados com terceiros sem o devido consentimento do usuário, exceto em situações legais ou para cumprir com obrigações contratuais.

---


## Como Executar

### Desenvolvimento Local

1. **Instale as dependências:**

   ```bash
   npm install
   ```

   ou

   ```bash
   pnpm install
   ```

2. **Inicie os serviços auxiliares com Docker:**

   ```bash
   docker-compose up -d
   ```

3. **Execute a API:**

   ```bash
   npm run start:web
   ```

   Isso compilará o código TypeScript e iniciará o servidor Fastify.

4. **Executar os testes:**

   ```bash
   npm run test
   ```

   ou

   ```bash
   npm run test:watch
   ```

### Deploy em Produção

1. **Provisionamento de Infraestrutura:**

   No diretório `dev/terraform`, execute:

   ```bash
   terraform init
   terraform apply -auto-approve
   ```

   Isso criará todos os recursos na AWS (VPC, RDS/EFS, ECS, Lambda, S3 e SQS).

2. **Deploy da Aplicação:**

   Utilize o pipeline de CI/CD (GitHub Actions) para:

   - Executar testes e build das imagens Docker.
   - Publicar as imagens no Amazon ECR.
   - Atualizar o serviço no Amazon ECS e a função Lambda com as novas imagens.

---

## CI/CD

O projeto utiliza **GitHub Actions** para automatizar:

- **Testes:** Execução de testes unitários e de integração com Vitest.
- **Build:** Criação de imagens Docker para a API e função Lambda.
- **Deploy:** Push das imagens para o Amazon ECR e atualização dos serviços na AWS.

Os workflows estão configurados na pasta `.github/workflows/`.

---

## Monitoramento e Observabilidade

- **Prometheus:** Coleta métricas dos serviços (por exemplo, via plugin Fastify Metrics).
- **Grafana:** Visualiza e integra as métricas coletadas, possibilitando a criação de dashboards para monitoramento em tempo real.

A configuração de monitoramento pode ser ajustada conforme necessário, utilizando arquivos como `prometheus.yml` e as definições do Docker Compose.

---

## Testes

Os testes foram implementados utilizando **Vitest** e abrangem:

- **Testes de Casos de Uso:** Validação dos casos de uso de processamento de vídeo, extração de frames e criação do ZIP.
- **Testes de Domínio:** Verificação da criação e integridade das entidades (ex.: Video, VideoInformation).
- **Testes de Adaptadores:** Testes unitários dos adaptadores (ex.: S3Adapter, ZipCreatorArchiver, FrameExtractorFfmpeg).

Para rodar os testes, execute:

```bash
npm run test
```

ou em modo watch:

```bash
npm run test:watch
```

---

## Considerações Finais

Este projeto demonstra a aplicação de conceitos avançados de arquitetura de software:

- **Arquitetura Hexagonal:** Separação clara entre domínio e adaptadores, facilitando testes e evolução.
- **Microsserviços e Processamento Assíncrono:** Componentes independentes para escalabilidade e robustez.
- **Infraestrutura como Código:** Uso do Terraform para provisionar e gerenciar recursos AWS.
- **CI/CD e Monitoramento:** Automatização dos processos de build e deploy, além de integração com Prometheus e Grafana para garantir a saúde do sistema.

---

## Contribuição

Este projeto foi desenvolvido como trabalho final de um curso de pós-graduação e serve como demonstração de boas práticas e conceitos avançados em arquitetura de software. Professores e avaliadores poderão apreciar a clareza na separação das camadas, a robustez dos testes, a automação do deploy e o monitoramento integrado. Sugestões e melhorias são bem-vindas para aprimorar ainda mais a solução.

---

Esse README foi elaborado para fornecer uma visão completa do projeto e dos conceitos aplicados, facilitando a compreensão dos professores e avaliadores sobre as escolhas arquiteturais, técnicas e de infraestrutura utilizadas no desenvolvimento desta solução.
