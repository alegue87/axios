const axios = require('axios');
const fs = require('fs')
const FormData = require('form-data')

const MT_USER = "51337600F56B69473E15EAFB8A7586B4";
const MT_DATA_PATH = "C:/Users/alessio/AppData/Roaming/MetaQuotes/Terminal/"+MT_USER+"/MQL4/Files"
const MT_SCREENSHOT_DAT = MT_DATA_PATH + "/screenshot.dat";
const data_separator = '#'
const data_separator_pos = '_'

var info = {
	username:'',
	pair:'',
	period:'',
	time:'', 
	filename: '',
	account_balance: 0.0, 		// Saldo
	account_equity: 0.0,		// Controvalore (leva*equity=max_pos_apribile - 1lot=100000)
	account_leverage: 0,		// Leverage
	account_margin: 0.0,		// Margine
	account_free_margin: 0.0,	// Margine disponibile
	account_profit: 0.0,		// Profit posizioni aperte
	positions: []
}

const POS_TICKET = 0,
	  POS_OPEN_TIME = 1,
	  POS_TYPE = 2,
	  POS_LOTS = 3,
	  POS_PROFIT = 4,
	  POS_SWAP = 5,
	  POS_COMMISSION = 6;

var info_positions = new Array();

setInterval(try_send_data_and_remove_file, 1000);

function try_send_data_and_remove_file(){
	console.log("Search file screenshot.dat..")
	if(fs.existsSync(MT_SCREENSHOT_DAT)){
		console.log("Reading file screenshot.dat")
		var screenshot_data = fs.readFile(MT_SCREENSHOT_DAT, function read(err, data){
			if( err ){
				console.log("Errore lettura file")
				console.log(err);
				return false;
			}
			content = data;

			let data_array = content.toString().split('\r\n');

			for(let i = 0 ; i < data_array.length-1 ; i++){

				var key = data_array[i].split(data_separator)[0]
				var value = data_array[i].split(data_separator)[1]
				if(key != 'position')
					info[key] = value;
				else{
					var position = {
						order_ticket: 0,
						order_open_time: '',
						order_type: '',
						order_lots: 0.0,
						order_profit: 0.0
					}
					var pos = value.split(data_separator_pos)
					position.order_ticket = pos[POS_TICKET]
					position.order_open_time = pos[POS_OPEN_TIME]
					position.order_type = pos[POS_TYPE]
					position.order_lots = pos[POS_LOTS]
					position.order_profit = pos[POS_PROFIT]
					position.order_swap = pos[POS_SWAP]
					position.order_commission = pos[POS_COMMISSION]
					info_positions.push(position)
				}
				
			}
			info.positions = info_positions;
			console.log(info);
			send_data(info);
			info_positions = new Array();
			fs.unlinkSync(MT_SCREENSHOT_DAT);
		});			
	}	
}

function send_data(info){
	var url = 'http://192.168.43.193:3000/testAPI/upload_img_mt'
	console.log("Sending data to: "+url)
	console.log("file: " + MT_DATA_PATH + '/' + info.filename)

	var img = fs.readFileSync(MT_DATA_PATH + '/' + info.filename); // Without encoding get default (7bit)

	let data = new FormData();
	data.append('username', info.username)
	data.append('pair', info.pair)
	data.append('period', info.period)
	data.append('filename', info.filename)
	data.append('time', info.time)
	data.append('account_balance', info.account_balance)
	data.append('account_equity', info.account_equity)
	data.append('account_leverage', info.account_leverage)
	data.append('account_free_margin', info.account_free_margin)
	data.append('account_profit', info.account_profit)
	data.append('positions', JSON.stringify(info.positions))

	data.append('image', img, "img.png")

	axios.post(url, data, {
		headers: {
			'accept': 'application/json',
			'Accept-Language': 'en-US,en,q=0.8',
			'Content-Transfer-Encoding': '7BIT', // header for multer (read 7bit image)
			'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
		},
	})
		.then(function (response){
			//console.log(response);
		})
		.catch(error => {
			console.log(error.response)
		})
}
