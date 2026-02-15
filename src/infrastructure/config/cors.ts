export const cors = {
    origin: ["https://meudominio.com"], // fixo e seguro
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true,
    optionsSuccessStatus: 204,
};