const request = require('request-promise')
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const fs = require('fs')

const sleep = require('sleep')


let url = "https://www.un.org/depts/dhl/resguide/r75_resolutions_table_en.htm"


let url2 = `https://digitallibrary.un.org/search?ln=en&cc=Voting+Data&p={id}&f=&rm=&ln=en&sf=&so=d&rg=50&c=Voting+Data&c=&of=hb&fti=0&fct__2=General+Assembly&fti=0&fct__2=General+Assembly`


let url3 = "https://digitallibrary.un.org/"

let rs = []


let results = ""

async function main (){


	let body = await request(url)
	let dom = $.parseHTML(body)
	let rows = $(dom).find('tr')
	$.each(rows, (r, el) => { 

		let body = el.innerHTML;
		if(/\d*-\d*-\d*/.test(body)){
			let ref = body.match(/A\/RES\/\d*\/[^<"]*/g)
			console.log(ref)
			let r = ref[0]
			rs.push(r)
		}


		// rs.forEach(r => {
			// 	let id = r.replace("/", "%2F")
			// 	let u = url2.replace("{id}", id)
			// 	request(u, (e, r , b) => {
				// 		console.log(b)
				// 	})
			// })
		// console.log(rs[0])
		// 	let id = rs[0].replace("/", "%2F")
		// 	let u = url2.replace("{id}", id)
		// 	request(u, (e, r , b) => {
			// 		console.log(b)
			// 	})
	})
	console.log(rs)

	for(i = 0; i < rs.length; i++) {

		try {
			let id = rs[i].replace(/\//g, "%2F")
			// let id = id.replace(/\ /g, "\ ")

			let u = url2.replace("{id}", id)

			// console.log(i, u)
			let b = await request(u)
			// console.log(e)
			// console.log(b)
			let record = b.match(/record\/\d*\?ln=en/g)
			let b2 = await request(url3 + record)
			let result = b2.match(/[^>]*SWITZERLAND[^<]*/g)
			results += rs[i] +", " + result + "\n"
			// fs.writeFile("result.txt", result, (err) => {
				// 	if(err){
					// 		console.log(err)
					// 		return
					// 	}
				// })

			console.log(rs[i] +": "+ result)


			sleep.sleep(2)

		} catch (e) {
			console.log(e)
		}

		// let id = rs[i].replace(/\//g, "%2F")
		// // let id = id.replace(/\ /g, "\ ")

		// let u = url2.replace("{id}", id)

		// // console.log(i, u)
		// request(u, (e, r , b) => {
			// 	// console.log(e)
			// 	console.log(b)
			// 	let record = b.match(/record\/\d*\?ln=en/g)
			// 	request(url3 + record, (e2, r2, b2) => {
				// 		let result = b2.match(/[^>]*SWITZERLAND[^<]*/g)
				// 		results += rs[i] +", " + result + "\n"
				// 		// fs.writeFile("result.txt", result, (err) => {
					// 			// 	if(err){
						// 				// 		console.log(err)
						// 				// 		return
						// 				// 	}
					// 			// })

				// 		console.log(rs[i] +": "+ result)
				// 	})
			// })
		// sleep.sleep(10)
	}

	// let id = rs[0].replace(/\//g, "%2F")
	// // let id = id.replace(/\ /g, "\ ")

	// let u = url2.replace("{id}", id)

	// // console.log(i, u)
	// request(u, (e, r , b) => {
		// 	// console.log(e)
		// 	console.log(b)
		// 	let record = b.match(/record\/\d*\?ln=en/g)
		// 	request(url3 + record, (e2, r2, b2) => {
			// 		let result = b2.match(/[^>]*SWITZERLAND[^<]*/g)
			// 		results += rs[0] +", " + result + "\n"
			// 		// fs.writeFile("result.txt", result, (err) => {
				// 			// 	if(err){
					// 				// 		console.log(err)
					// 				// 		return
					// 				// 	}
				// 			// })

			// 		console.log(rs[0] +": "+ result)
			// 	})
		// })
	// sleep.sleep(5)
	// rs.forEach((rp) => {
		// 	let id = rp.replace("/", "%2F")

		// 	let u = url2.replace("{id}", id)

		// 	request(u, (e, r , b) => {
			// 		console.log(e)
			// 		console.log(b)
			// 		let record = b.match(/record\/\d*\?ln=en/g)
			// 		request(url3 + record, (e2, r2, b2) => {
				// 			let result = b2.match(/[^>]*SWITZERLAND[^<]*/g)
				// 			results += rp +", " + result + "\n"
				// 			// fs.writeFile("result.txt", result, (err) => {
					// 			// 	if(err){
						// 			// 		console.log(err)
						// 			// 		return
						// 			// 	}
					// 			// })

				// 			console.log(rp +": "+ result)
				// 		})
			// 	})
		// 	sleep.sleep(2)

		// })


	console.log(results)

	fs.writeFile("result.txt", results, (err) => {
		if(err){
			console.log(err)
			return
		}
	})
}
main()
