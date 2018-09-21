const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: 'kaurprabhleen917@gmail.com',
        pass: '7696334493-'
    }
});

let mailOptions = {
    from: 'kaurprabhleen917@gmail.com',
    to: '',
    subject: 'Welcome Email',
  
    html:""
};

let autoEmail = (reciever, message) =>{

    mailOptions.to = reciever;

    mailOptions.html = message;
    //console.log(mailOptions);

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email Sent' + info.response);
        }
    });

}//end autoEmail

module.exports = {
    autoEmail: autoEmail
}