const axios = require('axios');
const fs = require('fs')
const FormData = require('form-data')

var img = fs.readFileSync("C:/Users/alessio/Documents/FX/screenshot.png"); // Without encoding get default (7bit)
console.log(img)
let data = new FormData();
data.append('image', img, "img.png")
console.log(data);
axios.post('http://192.168.43.193:3000/testAPI/upload_img_mt', data, {
	headers: {
		'accept': 'application/json',
		'Accept-Language': 'en-US,en,q=0.8',
		'Content-Transfer-Encoding': '7BIT', // header for multer (read 7bit image)
		'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
		'timeout': 999999
	},
})
	.then(function (response){
		console.log(response);
	})
	.catch(error => {
		console.log(error.response)
	})
