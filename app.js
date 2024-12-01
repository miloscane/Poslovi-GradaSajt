//Server
const server			=	require('express')();
const http				=	require('http').Server(server);
const express			=	require('express');
const fs 				=	require('fs');
const bodyParser		=	require('body-parser');
const nodemailer		=	require('nodemailer');
const dotenv 			=	require('dotenv');
const crypto			=	require('node:crypto');
dotenv.config();

server.set('view engine','ejs');
var viewArray	=	[__dirname+'/views'];
var viewFolder	=	fs.readdirSync('views');
for(var i=0;i<viewFolder.length;i++){
	if(viewFolder[i].split(".").length==1){
		viewArray.push(__dirname+'/'+viewFolder[i])
	}
}
server.set('views', viewArray);
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json({limit:'50mb'}));  
server.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));

var transporter = nodemailer.createTransport({
	host: process.env.transporterhost,
	port: 465,
	secure: true,
	auth: {
		user: process.env.transporteruser,
		pass: process.env.transporterpass
	}
});

http.listen(process.env.PORT, function(){
	console.log("Poslovi Grada Website");
	console.log("Server Started");
});

server.get('/', async (req,res)=>{
	res.render("home",{});
});

server.post('/karijera', async (req,res)=>{
	var mailOptions = {
		from: '"Poslovi grada sajt" <admin@poslovigrada.rs>',
		to: "posao@poslovigrada.rs,miloscane@gmail.com",
		subject: 'Nova aplikacija za posao',
		html: 'Ime: '+req.body.ime+'<br>Kontakt telefon:'+req.body.telefon
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			logError(error);
			res.redirect("/");
		}else{
			res.render("karijeraUspesno",{});
		}
	});
	
});