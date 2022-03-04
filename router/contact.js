const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')


router.post('/email', (req, res) => {
  console.log("START CTRL")
  let outputhtml = `
    <h2>Mail details</h2>
    <ul>
    <li>${req.body.name}</li>
    <li>${req.body.email}</li>
    <li>${req.body.phone}</li>
    </ul>

    <h3>MESSAGE</h3>
    <p>${req.body.message}</p> `

  "use strict";
  // const nodemailer = require("nodemailer");

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      // service: 'gmail.com',
      auth: {
        user: "gadamgurban01@gmail.com", // generated ethereal user
        pass: "iqxnwbjmrrxzydzt", // generated ethereal password
      },
    });
    //console.log("MAILL")
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'gadamgurban01@gmail.com', // sender address
      // to: "berdalyyew99@gmail.com", // list of receivers
      to: "gadamgurban01@gmail.com", // list of receivers
      subject: "Node contact", // Subject line
      text: "Hello world?", // plain text body
      // html: outputhtml, // html body
    });

    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.redirect('/contact')
  }

  main().catch(console.error);

})

module.exports = router

