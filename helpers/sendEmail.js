const nodemailer = require("nodemailer");
const ejs = require("ejs");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

module.exports = {
  sendEmail: (path, { receiver, subject, content }) => {
    return new Promise((resolve, reject) => {
      ejs.renderFile(path, { content }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          var mailOptions = {
            from: `Message App <${process.env.AUTH_EMAIL}>`,
            to: receiver,
            subject: subject,
            html: data,
          };

          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
            }
            console.log("Email sent: " + receiver + " " + info.response);
            resolve("Email sent: " + receiver + " " + info.response);
          });
        }
      });
    });
  },
};

// example;
// const path = __dirname + "/templates/validasi_registrasi.ejs";
// await sendEmail(path, {
//   receiver: "darmawandoni778@gmail.com",
//   subject: "test email",
//   content: {
//     otp: "778877",
//     link: "#",
//   },
// });
