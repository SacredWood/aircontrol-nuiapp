<template>
	<view class="container">
		<view class="content">
			<label for="AliIotKey">
				<textarea type="text" name="AliIotKey" id="AliIotKey" v-model="aliIotKey" placeholder="此处粘贴阿里云物联网平台设备证书一键复制内容..." rows="3" cols="20"></textarea>
				<view class="btn-set">
					<button class="btn"></button>
					<button class="btn"></button>
					<button class="btn"></button>
					<button class="btn identify" @click="identify()">智能识别</button>
				</view>
			</label>
			<label for="ProductKey">
				产品密钥
				<input type="text" name="ProductKey" id="ProductKey" v-model="productKey" placeholder="ProductKey" />
			</label>
			<label for="DeviceName">
				设备名称
				<input type="text" name="DeviceName" id="DeviceName" v-model="deviceName" placeholder="DeviceName" />
			</label>
			<label for="DeviceSecret">
				设备密钥
				<input type="text" name="DeviceSecret" id="DeviceSecret" v-model="deviceSecret" placeholder="DeviceSecret" />
			</label>
			<label for="Topic">
				订阅主题
				<input type="text" name="Topic" id="Topic" v-model="topic" placeholder="Topic" />
				<view class="tips">*注：此处只需要填自定义Topic主题名，如control</view>
			</label>
			<view class="btn-set">
				<button class="btn save" @click="save()">保存</button>
				<button class="btn clear" @click="clear()">清空</button>
				<button class="btn select" @click="keylist()">选择</button>
				<button class="btn control" @click="aircontrol()">空调遥控</button>
			</view>
		</view>
		<view class="footer">
			<view class="tips">重复内容将自动剔除</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			aliIotKey: '',
			productKey: '',
			deviceName: '',
			deviceSecret: '',
			topic: '',
			deviceList: []
		};
	},
	methods: {
		identify: function() {
			try {
				let txt = this.aliIotKey;
				if (txt == '') {
					uni.showToast({
						title: '参数不能为空',
						icon: 'none'
					});
					return;
				}
				let key = JSON.parse(txt);
				console.log(key);
				if (key.hasOwnProperty('ProductKey')) {
					this.productKey = key.ProductKey;
				}
				if (key.hasOwnProperty('DeviceName')) {
					this.deviceName = key.DeviceName;
				}
				if (key.hasOwnProperty('DeviceSecret')) {
					this.deviceSecret = key.DeviceSecret;
				}
				if (key.hasOwnProperty('Topic')) {
					this.topic = key.Topic;
				}
				this.aliIotKey = '';
			} catch (e) {
				uni.showToast({
					title: '参数错误，无法识别',
					icon: 'none'
				});
			}
		},

		save: function() {
			let that = this;
			if (this.productKey == '' || this.deviceName == '' || this.deviceSecret == '' || this.topic == '') {
				uni.showToast({
					title: '参数不能为空',
					icon: 'none'
				});
				return;
			}
			// uni.setStorageSync('$ProductKey', this.productKey);
			// uni.setStorageSync('$DeviceName', this.deviceName);
			// uni.setStorageSync('$DeviceSecret', this.deviceSecret);
			// uni.setStorageSync('$Topic', this.topic);
			let item = {
				ProductKey: this.productKey,
				DeviceName: this.deviceName,
				DeviceSecret: this.deviceSecret,
				Topic: this.topic
			};
			let arr = [];
			arr = uni.getStorageSync('$DeviceList');
			if (arr) {
				this.deviceList = JSON.parse(arr);
			}
			this.deviceList.push(item)
			this.deviceList = this.unique(this.deviceList)
			console.log(this.deviceList);
			uni.setStorageSync('$DeviceList', JSON.stringify(this.deviceList));
			console.log('保存成功', uni.getStorageSync('$DeviceList'));
			this.clear(false);
			uni.showToast({
				title: '保存成功',
				icon: 'none'
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

		clear: function(showToast = true) {
			// uni.setStorageSync('$ProductKey', '');
			// uni.setStorageSync('$DeviceName', '');
			// uni.setStorageSync('$DeviceSecret', '');
			// uni.setStorageSync('$Topic', '');
			this.aliIotKey = '';
			this.productKey = '';
			this.deviceName = '';
			this.deviceSecret = '';
			this.topic = '';
			if (showToast) {
				uni.showToast({
					title: '已清除',
					icon: 'none',
					position: 'bottom'
				});
			}
		},

		connection: function() {
			uni.navigateTo({
				url: '../connect/connect'
			});
		},

		aircontrol: function() {
			uni.navigateTo({
				url: '../aircontrol/aircontrol'
			});
		},

		keylist: function() {
			uni.navigateTo({
				url: '../keylist/keylist'
			});
		}
	}
};
</script>

<style>
@import url('@/common/css/reset.css');
@import url('@/common/css/index.css');
</style>
