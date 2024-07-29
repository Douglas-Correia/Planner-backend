export function sendEmailInvited(owner_name: string | null, destination: string, starts_at: string, ends_at: string, confirmationLink: string, convidado: boolean = false) {
    return `
<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalhes da Viagem</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
        <div class="container">
            ${convidado === true ? `<div class="header">
                    <h1>Você foi convidado para uma viagem!</h1>
                </div>
                <div class="content">
                    <p>Olá, ${owner_name !== null ? owner_name : 'convidado(a)'}</p>
                    <p>Você foi convidado(a) para participar de uma viagem! Aqui estão os detalhes:</p>
                    <ul>
                        <li><strong>Destino:</strong> ${destination}</li>
                        <li><strong>Data de Início:</strong> ${starts_at}</li>
                        <li><strong>Data de Término:</strong> ${ends_at}</li>
                    </ul>
                    <p>Estamos ansiosos para compartilhar essa aventura com você!</p>
                    <p>Caso tenha alguma dúvida, não hesite em nos contactar.</p>
                    <a href="${confirmationLink}" class="button">Confirmar viagem</a>
                </div>
                `
            :
            `<div class="content">
                    <div class="header">
                        <h1>Detalhes da Sua Viagem</h1>
                    </div>
                        <p>Olá ${owner_name},</p>
                        <p>Obrigado por planejar sua viagem conosco! Aqui estão os detalhes da sua próxima aventura:</p>
                        <ul>
                            <li><strong>Destino:</strong> ${destination}</li>
                            <li><strong>Data de Início:</strong> ${starts_at}</li>
                            <li><strong>Data de Término:</strong> ${ends_at}</li>
                        </ul>
                        <p>Esperamos que você tenha uma excelente viagem!</p>
                        <p>Caso tenha alguma dúvida, não hesite em nos contactar.</p>
                        <a href="${confirmationLink}" class="button">Confirmar viagem</a>
                </div>`
        }
                <div class="footer">
                    <p>© 2024 Equipe plann.er. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
    `.trim();
}