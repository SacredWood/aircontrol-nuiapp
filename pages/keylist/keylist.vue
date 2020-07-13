<template>
	<view class="container">
		<view class="content">
			<ul id="device-default">
				<li>
					<view class="device-title">{{ `${deviceDefault.deviceName}@${deviceDefault.topic}` }}</view>
					<view class="btn-set">
						<button class="btn"></button>
						<button class="btn save">默认</button>
					</view>
				</li>
			</ul>
			<ul id="device-list">
				<li  v-for="(item, index) in deviceList" :key="index">
					<view class="device-title">{{ `${item.deviceName}@${item.topic}` }}</view>
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
import Utils from '../../common/js/utils.js';
export default {
	data() {
		return {
			deviceList: [],
			deviceDefault: {}
		};
	},
	onShow() {
		this.createList();
	},
	onNavigationBarButtonTap() {
		let that = this;
		// 允许从相机和相册扫码
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				if (res.result) {
					try {
						that.deviceList.push(JSON.parse(res.result));
						that.deviceList = Utils.unique(this.deviceList, 'deviceName','topic')
						uni.setStorageSync('$DeviceList', JSON.stringify(that.deviceList));
						uni.showToast({
							title: '添加成功'
						});
					} catch (e) {
						console.log(e);
						uni.showToast({
							title: '无法识别',
							icon: 'none'
						});
					}
				}
			}
		});
	},
	methods: {
		createList: function() {
			try{
				this.deviceDefault = uni.getStorageSync('$defaultApp') || '{}'
				this.deviceDefault = JSON.parse(this.deviceDefault)
				this.deviceList = uni.getStorageSync('$DeviceList') || '[]'
				this.deviceList = JSON.parse(this.deviceList)
			}catch(e){
				console.log(e)
				uni.showToast({
					title: '未初始化成功',
					icon:'none'
				})
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
			uni.setStorageSync('$defaultApp', JSON.stringify(obj));
			Utils.goTo('aircontrol')
		},
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
