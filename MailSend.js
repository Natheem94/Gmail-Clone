const nodemailer = require("nodemailer");

const CreateMail = async (userName, Password) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: userName,
      pass: Password, // generated ethereal password
    },
  });

  return transporter;
};

const SendEmail = async (transporter, data) => {
  let info = await transporter.sendMail(
    {
      from: `${transporter.options.auth.user}`,
      to: `${data.to}`, // sender addresslist of receivers
      subject: `${data.subject}`, // Subject line
      text: `${data.body}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    },
    (err, success) => {
      if (err) {
        // return err;
        console.log(err);
        return "Email not sent";
      } else {
        console.log(success);
        return "Email send successfully";
        // console.log(success.response.slpit(" "));
      }
    }
  );
  console.log(info);
  return info;
};
module.exports = { CreateMail, SendEmail };
