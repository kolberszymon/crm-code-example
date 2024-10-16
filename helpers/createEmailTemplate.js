export const createEmailTemplateHTML = (title, content) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OneClickCV</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
      }
      .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #EDEDED;
          border-radius: 8px;
          overflow: hidden;
      }
      .header {
          background-color: #015640;
          padding: 20px;
          text-align: center;
      }
      .header h1 {
          margin: 0;
          font-size: 24px;
          color: #ffffff;
      }
      .header img {
          width: 40px;
          vertical-align: middle;
      }
      .email-body {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #333333;
      }
      .email-body a {
          color: #0066cc;
          text-decoration: none;
          font-weight: bold;
      }
      .footer {
          padding: 20px;
          text-align: right;
          color: #777777;
          font-size: 12px;
      }
  </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <h1>
                  ${title}
              </h1>
          </div>
          <div class="email-body">
              ${content}
          </div>
          <div class="footer">
              <p>Pozdrawiamy, zespół Monlib</p>
          </div>
      </div>
  </body>
</html>

  `;
}