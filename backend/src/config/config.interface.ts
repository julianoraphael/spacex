export interface ApplicationConfiguration {
  node_app: {
    port: number;
    // Adicione outras propriedades de configuração aqui conforme necessário
  };
  database: {
    url: string; // Adicione a definição da propriedade 'url'
  };
  // Adicione outras seções de configuração conforme necessário
}
