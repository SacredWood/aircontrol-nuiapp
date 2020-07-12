<template>
	<view class="container">
		<view class="content">
			<ul id="device-list" v-for="(item, index) in deviceList" :key="index">
				<li>
					<view class="device-title">{{ `${item.ProductKey}&${item.Topic}` }}</view>
					<view class="btn-set">
						<button class="btn del" @click="del(index)">删除</button>
						<button class="btn save" @click="use(index)">使用</button>
					</view>
				</li>
			</ul>
		</view>
		<view class="tips">重复内容将自动剔除</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			deviceList: []
		};
	},
	onShow() {
		this.createList();
	},
	onNavigationBarButtonTap() {
		let that = this
		// 允许从相机和相册扫码
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				if(res.result){
					try{
						that.deviceList.push(JSON.parse(res.result));
						that.deviceList = that.unique(that.deviceList)
						uni.setStorageSync('$DeviceList', JSON.stringify(that.deviceList));
						uni.showToast({
							title: '添加成功'
						})
					}catch(e){
						console.log(e)
						uni.showToast({
							title: '无法识别',
							icon: 'none'
						})
					}
				}
			}
		});
	},
	methods: {
		createList: function() {
			let that = this;
			let arr = uni.getStorageSync('$DeviceList');
			if (arr) {
				that.deviceList = JSON.parse(arr);
			}
		},
		del: function(index) {
			this.deviceList.splice(index, 1);
			uni.setStorageSync('$DeviceList', JSON.stringify(this.deviceList));
			console.log('clear', '清除成功');
			uni.showToast({
				title: '清除成功',
				icon: 'none'
			});
		},
		use: function(index) {
			let obj = this.deviceList[index];
			uni.setStorageSync('$ProductKey', obj.ProductKey);
			uni.setStorageSync('$DeviceName', obj.DeviceName);
			uni.setStorageSync('$DeviceSecret', obj.DeviceSecret);
			uni.setStorageSync('$Topic', obj.Topic);
			uni.navigateTo({
				url: '../aircontrol/aircontrol'
			});
		},
		unique(arr) {
			//除去空值 重值
			let list = []
			let hashMap = {}
			arr.forEach(obj => {
				// console.log(!obj,obj)
				if (obj && typeof obj == 'object') {
					let key = `${obj.ProductKey}${obj.Topic}`
					hashMap[key] = obj
				}
			});
			// console.log(hashMap)
			for(let val of Object.values(hashMap)){
				list.push(val)
			}
			return list
		},
		index: function() {
			uni.navigateTo({
				url: 'index.html'
			});
		},
		airlist: function() {
			uni.navigateTo({
				url: '../airlist/airlist'
			});
		}
	},
	onHide() {
		this.deviceList = [];
	}
};
</script>

<style>
@import url('@/common/css/reset.css');
@import url('@/common/css/keylist.css');
</style>
