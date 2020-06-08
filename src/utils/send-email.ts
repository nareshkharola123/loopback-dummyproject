import * as nodeMailer from 'nodemailer';

export const sendMail = async (mailAddress: [] | string): Promise<void> => {
  // const testAccount = await nodeMailer.createTestAccount();

  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +(process.env.EMAIL_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // sender address
    to: mailAddress, // list of receivers
    subject: 'Thanks For SignUp',
    text: 'Welcome to BlogsWebsite',
    html: '<b>Welcome To BlogSWebsite</b>',
  });

  console.log(info.messageId);
  console.log(nodeMailer.getTestMessageUrl(info));
};
