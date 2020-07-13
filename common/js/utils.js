
let Utils = {
	pages: {
		index: '../index/index',
		connect: '../connect/connect',
		aircontrol: '../aircontrol/aircontrol',
		keylist: '../keylist/keylist',
		airlist: '../airlist/airlist',
	},
	goTo: function (page = 'index'){
		uni.navigateTo({
			url: this.pages[page]
		})
	},
	unique(arr, ...filter) {
		//对象数组去重 除去空值 重值
		let list = [];
		let hashMap = {};
		// debugger
		arr.forEach(obj => {
			if (obj && typeof obj == 'object') {
				let key = ''
				filter.forEach(str => {
					key += obj[str]
				})
				if(key){
					hashMap[key] = obj;
				}
			}
		});
		for (let val of Object.values(hashMap)) {
			list.push(val);
		}
		return list;
	},
}

export default Utils;