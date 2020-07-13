<template>
	<view class="container">
		<view class="content">
			<label for="AliIotKey">
				<textarea type="text" name="AliIotKey" id="AliIotKey" v-model="aliIotKey" placeholder="此处粘贴阿里云物联网平台设备证书一键复制内容..." rows="3" cols="20"></textarea>
				<view class="btn-set">
					<button class="btn"></button>
					<button class="btn"></button>
					<button class="btn identify" @click="identify()">智能识别</button>
					<button class="btn select" @click="setDefault()">设为默认</button>
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
				<button class="btn clear" @click="clearAll()">清空</button>
				<button class="btn select" @click="goTo('keylist')">选择</button>
				<button class="btn control" @click="goTo('aircontrol')">空调遥控</button>
			</view>
		</view>
		<view class="footer"><view class="tips">重复内容将自动剔除</view></view>
	</view>
</template>

<script>
import Utils from '../../common/js/utils.js';
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
				if (this.aliIotKey == '') {
					uni.showToast({
						title: '参数不能为空',
						icon: 'none'
					});
					return;
				}
				let key = JSON.parse(this.aliIotKey);
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
		setDefault: function() {
			if (this.aliIotKey != '') {
				this.identify();
			}
			if (this.productKey=='' || this.deviceName=='' || this.deviceSecret=='' || this.topic=='') {
				uni.showToast({
					title: '参数不能为空',
					icon: 'none'
				});
				return;
			}
			console.log('save', '默认设置成功');
			let item = {
				productKey: this.productKey,
				deviceName: this.deviceName,
				deviceSecret: this.deviceSecret,
				topic: this.topic
			};
			uni.setStorageSync('$defaultApp', JSON.stringify(item));
			uni.showToast({
				title: '保存成功',
				icon: 'none'
			});
		},

		save: function() {
			let that = this;
			if (this.productKey=='' || this.deviceName=='' || this.deviceSecret=='' || this.topic=='') {
				uni.showToast({
					title: '参数不能为空',
					icon: 'none'
				});
				return;
			}
			let item = {
				productKey: this.productKey,
				deviceName: this.deviceName,
				deviceSecret: this.deviceSecret,
				topic: this.topic
			};
			this.deviceList = uni.getStorageSync('$DeviceList') || '[]'
			this.deviceList = JSON.parse(this.deviceList)
			this.deviceList.push(item);
			this.deviceList = Utils.unique(this.deviceList, 'deviceName','topic')
			console.log(this.deviceList);
			uni.setStorageSync('$DeviceList', JSON.stringify(this.deviceList));
			console.log('保存成功', uni.getStorageSync('$DeviceList'));
			this.clearAll(false);
			uni.showToast({
				title: '保存成功',
				icon: 'none'
			});
		},

		clearAll: function(showToast = true) {
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

		goTo: function(page = 'index') {
			Utils.goTo(page)
		}
	}
};
</script>

<style>
@import url('@/common/css/reset.css');
@import url('@/common/css/index.css');
</style>
