import React from "react";

class Encryption extends React.Component {
	static alphabet = ['a','ą','b','c','ć','d','e','ę','f','g','h','i','j','k','l','ł','m','n','ń','o','ó','p','q','r','s','ś','t','u','v','w','x','y','z','ź','ż','!','@','#','$','%','^','&','*','(',')','_','+','{','}','|',':','"','<','>','?','[',']',';','\\','\'','"',',','.','/','`','~','1','2','3','4','5','6','7','8','9','0','-','=','A','Ą','B','C','Ć','D','E','Ę','F','G','H','I','J','K','L','Ł','M','N','Ń','O','Ó','P','Q','R','S','Ś','T','U','V','W','X','Y','Z','Ź','Ż'];

	static getKey(key1: string, key2: string) {
		let keys = [key1 ?? "", key2 ?? ""];
		keys.sort();
		let temp = keys[0];
		temp = temp.replace(/\D/g,'');
		let key = 20;
		if (temp.length > 0) {
			key = temp.length;
		}
		return key;
	}

	static encrypt(text: string, key1: string, key2: string) {
		let key = Encryption.getKey(key1, key2);
		let result = '';
		for (let i = 0; i < text.length; i++) {
			let index = Encryption.alphabet.indexOf(text[i]);
			if (index <= -1) {
				result += text[i];
				continue;
			}
			let newIndex = index + key;
			if (newIndex > Encryption.alphabet.length) {
				newIndex = newIndex - Encryption.alphabet.length;
			}
			result += Encryption.alphabet[newIndex];
		}

		return result;
	}

	static decrypt(text: string, key1: string, key2: string) {
		let key = Encryption.getKey(key1, key2);
		let result = '';
		for (let i = 0; i < text.length; i++) {
			let index = Encryption.alphabet.indexOf(text[i]);
			if (index <= -1) {
				result += text[i];
				continue;
			}
			let newIndex = index - key;
			if (newIndex < 0) {
				newIndex = Encryption.alphabet.length + newIndex;
			}
			result += Encryption.alphabet[newIndex];
		}
		return result;
	}
}

export default Encryption;
