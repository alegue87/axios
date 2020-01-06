const axios = require('axios');
const fs = require('fs')
const FormData = require('form-data')

const MT_USER = "51337600F56B69473E15EAFB8A7586B4";
const MT_DATA_PATH = "C:/Users/alessio/AppData/Roaming/MetaQuotes/Terminal/"+MT_USER+"/MQL4/Files"
const MT_SCREENSHOT_DAT = MT_DATA_PATH + "/screenshot.dat";
const data_separator = '#'

var info = {time:'', filename: ''}

var screenshot_data = fs.readFile(MT_SCREENSHOT_DAT, function read(err, data){
	if( err ) throw err;
	content = data;

	let data_array = content.toString().split('\r\n');

	for(let i = 0 ; i < data_array.length-1 ; i++){

		var key = data_array[i].split(data_separator)[0]
		var value = data_array[i].split(data_separator)[1]
		info[key] = value;
		
	}
	info.data
	console.log(info);
	send_data(info);
});





function send_data(info){
	console.log(MT_DATA_PATH + '/' + info.filename)
	var img = fs.readFileSync(MT_DATA_PATH + '/' + info.filename); // Without encoding get default (7bit)

	let data = new FormData();
	data.append('filename', info.filename)
	data.append('time', info.time)
	data.append('image', img, "img.png")


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
}
