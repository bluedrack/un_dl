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


	})
	console.log(rs)

	for(i = 0; i < rs.length; i++) {

		try {
			let id = rs[i].replace(/\//g, "%2F")
			let u = url2.replace("{id}", id)
			let b = await request(u)
			let record = b.match(/record\/\d*\?ln=en/g)
			let b2 = await request(url3 + record)
			let result = b2.match(/[^>]*SWITZERLAND[^<]*/g)
			results += rs[i] +", " + result + "\n"

			console.log(rs[i] +": "+ result)


			sleep.sleep(2)

		} catch (e) {
			console.log(e)
		}
	}

	console.log(results)

	fs.writeFile("result.txt", results, (err) => {
		if(err){
			console.log(err)
			return
		}
	})
}
main()
