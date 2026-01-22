// 🔹 Impede que o Astro gere esse endpoint de forma estática
// 🔹 Garante que o código rode no servidor a cada requisição
export const prerender = false;

// 🔹 Importa o Nodemailer (biblioteca para envio de e-mails)
import nodemailer from 'nodemailer';

// 🔹 Importa path para resolver o caminho da imagem corretamente
import path from 'path';

// 🔹 Função que responde a requisições POST (API Route do Astro)
export const POST = async ({ request, redirect }) => {

  // 🔹 Lê a senha do Gmail a partir do arquivo .env
  // 🔹 Essa senha deve ser uma "senha de app"
const GMAIL_PASS = process.env.GMAIL_PASS;

  try {
    // 🔹 Lê os dados enviados pelo formulário HTML
    // 🔹 Funciona para <form method="POST">
    const data = await request.formData();

    // 🔹 Pega os campos do formulário pelo atributo "name"
    const nome = data.get('nome');
    const email = data.get('email');
    const telefone = data.get('telefone');

    // 🔹 Cria o transportador SMTP (responsável por enviar o e-mail)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP do Gmail
      port: 587,              // Porta padrão TLS
      secure: false,          // false = TLS (587), true = SSL (465)
      auth: {
        user: 'studiomocotatoo@gmail.com', // Email remetente
        pass: GMAIL_PASS,                  // Senha de app do Gmail
      },
    });

    // 🔹 Envia o e-mail
    await transporter.sendMail({
      // 🔹 Nome que aparece para o destinatário
      from: '"ZOO Bestial" <studiomocotatoo@gmail.com>',

      // 🔹 Email do usuário que se cadastrou
      to: email,

      // 🔹 Assunto do e-mail
      subject: 'Seu Ingresso do ZOO Bestial!',

      // 🔹 Corpo do e-mail em HTML (permite imagem)
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">

          <!-- 🔹 Imagem embutida no e-mail -->
          <!-- 🔹 O src usa o CID definido no attachments -->
          <img
            src="cid:ingressoCortesia"
            alt="Ingresso ZOO Bestial"
            style="max-width:100%; border-radius:8px; margin-bottom:20px;"
          />

          <p>Olá <strong>${nome}</strong>!</p>

          <p>
            Seu ingresso como cortesia para o
            <strong>ZOO Bestial</strong> foi confirmado com sucesso.
          </p>

          <p>Apresente este e-mail na entrada do evento.</p>

          <p style="margin-top:20px;">
            Atenciosamente,<br/>
            <strong>Equipe ZOO Bestial 🐾</strong>
          </p>
        </div>
      `,

      // 🔹 Anexo da imagem (embutido, não aparece como download)
      attachments: [
        {
          filename: 'cortesia-ingresso.png',           // Nome do arquivo
          path: path.resolve('public/imagem-formulario/cortesia-ingresso.png'), // Caminho real
          cid: 'ingressoCortesia'                       // ID usado no <img>
        }
      ]
    });

   return redirect('/Sucesso');

  } catch (error) {
    // 🔹 Mostra o erro no terminal
    console.error('ERRO AO ENVIAR EMAIL:', error);

    // 🔹 Retorna erro para o frontend
    return new Response(
      JSON.stringify({
        message: 'Erro ao enviar agendamento',
        error: error.message
      }),
      { status: 500 }
    );
  }
}