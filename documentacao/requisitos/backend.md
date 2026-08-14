# BACK-END

Para o `BACK-END` utilizaremos como linguagem principal o `Django - Python` e para o banco de dados utilizaremos o `MySQL`.

## Django Arquitetura
`Precisamos separar a arquitetura do DJANGO em várias etapas para se manter organizado, então irá ter um APP central chamado MAIN, e dentro dele ficará nossas pastas, importante: Não vai ser um app para cada tabela e tals, vai ser um APP main para toda a aplicação`

### PASTAS
- MODELS: Ficará todos os models la dentro, então user_app, user_manager, etc... ficará todos dentro desta pasta.
- SERIALIZERS: Este será responsável para controlar oque vai ser enviado ou oque vai apenas receber, os dados que vão transitar.
- URLS: Onde vai ficar todas as nossas rodas de API centralizadas, comentadas e separadas por categoria, por exemplo: USER_APP, ai vai ter um comentário com informando que é as rotas de USER_APP:
```
#USER_APP
create/user_app
update/user_app
get/user_app
delete/user_app
```
- SERVICES: Os services vai ser onde vai rodar toda a lógica de criação e conexão com banco de dados, aqui ficam as regras de negócios que é batida antes de criar, um exemplo simples é a criação de usuário com email já existentente:
```
def create_user_app(self, dto):
    email_exist = UserApp.objects.filter(email=dto.email).exists()
    if (emial_exist) {
        return Response(status=http.404_BAD_REQUEST, data=...)
    }
    user = UserApp.objects.create(**dto)
    return user
```
- VIEWS: Aqui é onde vai ficar as validações dos dados enviados, e se validos será enviado para o service tratar a forma de negócio.

### FLUXO DO DADO ENVIADO
- Dado chega pelo ENDPOINT (`URLS`)
- Os arquivos de URLS chamam a função de CRIAR, UPDATE, GET ou DELETAR que estão dentro das VIEWS
- As `VIEWS` chama toda vez o serializer para as validações como: `Quantidade de caracteres`, `Obrigatório`, `ETC...`. Se válido então chega para os services.
- Com os dados no services então ali já tem campo obrigatório ou não, e com caracteres certo, então ele trata a lógica do negócio e assim ele cria chamando o `MODEL`


