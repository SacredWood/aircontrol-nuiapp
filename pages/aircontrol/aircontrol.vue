<template>
	<view class="container">
		<!-- <view class="header"><h1>空调遥控器</h1></view> -->
		<view class="tips">
			<view class="speed">
				<view>当前风速:</view>
				<view>{{ windSpeedText }}</view>
			</view>
			<view v-if="isTimeShow" class="time-text">
				<view>{{ timeNum }}</view>
				<view>时</view>
				<view>{{ timeingModel ? '开' : '关' }}</view>
			</view>
		</view>
		<view id="tipsImg" class="tipsImg">
			<!-- #ifdef APP-PLUS || H5 -->
			<view id="chart" ref="chart" :prop="option" :change:prop="echarts.updateEcharts" class="echarts" style="width: 100vw;height:300px;"></view>
			<!-- <mpvue-echarts @onInit="initChart" canvasId="chart" ref="chart" /> -->
			<!-- #endif -->
			<view id="model">
				<view id="icon" :class="['iconfont', 'blue', modelIcon]"></view>
				<view>{{ modelText }}</view>
			</view>
		</view>
		<view class="content">
			<view class="buts">
				<view @click="wind" class="btn ripple">
					<view id="windImg" :class="['iconfont', 'icon-caidan', isWind ? 'blue' : '']"></view>
					<view class="p">匀速/强劲</view>
				</view>
				<view @click="timeOpen" class="btn ripple">
					<view id="timeOpenImg" :class="['iconfont', 'icon-dingshi', isOpen ? 'blue' : '']"></view>
					<view class="p">定时开</view>
				</view>
				<view @click="timeClose" class="btn ripple">
					<view id="timeCloseImg" :class="['iconfont', 'icon-shuimian1', isClose ? 'blue' : '']"></view>
					<view class="p">定时关</view>
				</view>
				<view @click="timeFixed" class="btn ripple">
					<view id="timeFixedImg" :class="['iconfont', 'icon-queding', isFixed ? 'blue' : '']"></view>
					<view class="p">预约/取消</view>
				</view>
				<view @click="upDw" class="btn ripple">
					<view id="upDwImg" :class="['iconfont', 'icon-icon05', isUpDw ? 'blue' : '']"></view>
					<view class="p">上下扫风</view>
				</view>
				<view @click="leRi" class="btn ripple">
					<view id="leRiImg" :class="['iconfont', 'icon-icon18', isLeRi ? 'blue' : '']"></view>
					<view class="p">左右扫风</view>
				</view>
				<view @click="modelCold" class="btn ripple">
					<view id="modelColdImg" :class="['iconfont', 'icon-xuehua', isModelCold ? 'blue' : '']"></view>
					<view class="p">一键制冷</view>
				</view>
				<view @click="modelHot" class="btn ripple">
					<view id="modelHotImg" :class="['iconfont', 'icon-taiyang', isModelHot ? 'blue' : '']"></view>
					<view class="p">一键制热</view>
				</view>

				<view @click="tempSub" class="btn ripple"><view id="tempSubImg" class="iconfont icon-jian"></view></view>
				<view id="tempText" class="btn" style="width: 140px;">
					温度（
					<view>{{ tempNum }}</view>
					℃）
				</view>
				<view @click="tempAdd" class="btn ripple"><view id="tempAddImg" class="iconfont icon-jia"></view></view>
			</view>
			<view @click="switchBtn" class="btn ripple switchBtn"><view id="switchBtnImg" :class="['iconfont', 'icon-guanji', isSwitchBtn ? 'red' : '']"></view></view>
		</view>
		<view class="footer"></view>
	</view>
</template>

<script>
import * as iot from 'alibabacloud-iot-device-sdk';

export default {
	data() {
		return {
			// echarts,
			// onInit: initChart,
			myChart: {},
			sdk_device: null,
			topic: '',
			device: null,
			timeOutEvent: null,
			windNum: 0,
			timeNum: 0,
			tempNum: 16,
			windSpeedText: '自动档',
			isTimeShow: false,
			timeingModel: false,
			modelText: '自动模式',
			modelIcon: 'cion-feng',
			isWind: false,
			isOpen: false,
			isClose: false,
			isFixed: false,
			isUpDw: false,
			isLeRi: false,
			isModelCold: false,
			isModelHot: false,
			isSwitchBtn: false,
			option : {
				backgroundColor: '#182035',
				tooltip: {
					show: true,
					formatter: '{a} <br/>{b} : {c}℃',
					backgroundColor: 'rgba(50,50,50,0.7)',
					trigger: 'item',
					borderColor: '#333', // 提示框浮层的边框颜色。...
					borderWidth: 0, // 提示框浮层的边框宽。...
					padding: 0
				},
				series: [
					{
						name: '业务指标',
						type: 'gauge',
						min: 16,
						max: 30,
						splitNumber: 7,
						legend: {
							padding: 0,
							margin: 0
						},
						detail: {
							formatter: '{value}℃',
							textStyle: {
								fontSize: 22
							}
						},
						title: {
							// 仪表盘标题。
							show: true, // 是否显示标题,默认 true。
							// offsetCenter: [0, "20%"], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
							color: '#fff', // 文字的颜色,默认 #333。
							fontSize: 16 // 文字的字体大小,默认 15。
						},
						data: [
							{
								value: 16,
								name: '温度'
							}
						]
					}
				]
			}
		};
	},
	components: {
		// mpvueEcharts
	},
	onLoad: function() {
		let that = this;
		uni.setStorageSync('$isSwitchBtn', false);
		if (uni.getStorageSync('$ProductKey')) {
			
			this.sdk_device = {
				productKey: uni.getStorageSync('$ProductKey'),
				deviceName: uni.getStorageSync('$DeviceName'),
				deviceSecret: uni.getStorageSync('$DeviceSecret'),
				tls: true,
			};
		} else {
			uni.showToast({
				title: '缺少必要参数',
				icon: 'none'
			});
		}
		this.topic = `/${this.sdk_device.productKey}/${this.sdk_device.deviceName}/user/${uni.getStorageSync('$Topic')}`;
		that.connect();
		if (this.isSwitchBtn) {
			this.readNum();
		}
	},
	onNavigationBarButtonTap() {
		let that = this;
		console.log('点击了自定义按钮');
		that.airlist();
	},
	methods: {
		// initChart(e) {
		// 	// 基于准备好的dom，初始化echarts实例
		// 	this.myChart = echarts.init(document.getElementById('chart'))
		// 	// 使用刚指定的配置项和数据显示图表。
		// 	this.myChart.setOption(this.option);
		// },
		connect: function() {
			let that = this;
			//保险起见，先关闭再打开
			if (that.device) {
				that.device.end();
			}
			if (!that.device) {
				console.log('开始连接....');
				that.device = iot.device(that.sdk_device);
				console.log(that.sdk_device);
			}
			// 测试上报一条设备标签数据
			this.device.on('connect', res => {
				console.log('连接成功=>', res);
			});
			this.device.on('error', err => {
				console.log('连接错误=> ', err);
			});
			this.device.onShadow(res => {
				console.log('获取最新设备影子=>', JSON.stringify(res));
			});
			this.device.on('offline', () => {
				console.log('连接已断开');
			});
			that.message();
			that.subscribe();
		},

		subscribe: function() {
			// 订阅消息
			let that = this;
			that.device.subscribe(
				that.topic,
				{
					qos: 1
				},
				(err, granted) => {
					// console.log('that.topic=>' + that.topic);
					if (err == null) {
						console.log('主题订阅成功 =>' + JSON.stringify(granted));
					} else {
						console.log('主题订阅失败 =>' + err);
					}
				}
			);
		},

		publish: function(msg) {
			// 向topic发送消息
			let that = this;
			let data = JSON.stringify(msg);
			that.device.publish(
				that.topic,
				data,
				{
					qos: 1
				},
				err => {
					// console.log('----------------------------------');
					// console.log('that.topic=>' + that.topic);
					if (err == null) {
						console.log('主题发布成功');
					} else {
						console.log('主题发布失败 => err: ' + err);
					}
				}
			);
		},

		message: function() {
			// 监听message事件
			let that = this;
			that.device.on('message', (topic, message) => {
				if (message == '' || message == null) {
					return;
				}
				console.log('来自topic的消息 => ' + topic);
				console.log('message => ' + message);
				try {
					// console.log(typeof(message))
					let obj = JSON.parse(message);
					// console.log(obj.tempNum)
					let tempNum = 16;
					if (obj.hasOwnProperty('tempNum')) {
						if (obj.tempNum) {
							tempNum = obj.tempNum;
						}
						that.option.series[0].data[0].value = tempNum;
						uni.setStorageSync('$tempNum', tempNum);
					} else {
						if (that.isSwitchBtn) {
							that.tempNum = uni.getStorageSync('$tempNum') ? parseInt(uni.getStorageSync('$tempNum')) : 16;
						}
						// console.log('tempNum 不存在', that.tempNum);
						that.option.series[0].data[0].value = that.tempNum;
					}
					that.myChart.setOption(that.option, true);
				} catch (err) {
					console.log('err => ', err);
					that.tempNum = uni.getStorageSync('$tempNum');
					that.myChart.setOption(that.option, true);
				}
			});
		},
		// 关机状态可设置定时开机
		readNum: function() {
			// console.log("parseInt(uni.getStorageSync('$tempNum'))", parseInt(uni.getStorageSync('$tempNum')))
			this.windNum = uni.getStorageSync('$windNum') ? parseInt(uni.getStorageSync('$windNum')) : 0;
			this.isClose = uni.getStorageSync('$isClose');
			this.isFixed = uni.getStorageSync('$isFixed');
			this.timeingModel = uni.getStorageSync('$timingModel'); //定时模式 开/关
			this.timeNum = uni.getStorageSync('$timeNum') ? parseInt(uni.getStorageSync('$timeNum')) : 0; //定时时间
			this.isUpDw = uni.getStorageSync('$isUpDw');
			this.isLeRi = uni.getStorageSync('$isLeRi');
			this.isModelCold = uni.getStorageSync('$isModelCold');
			this.isModelHot = uni.getStorageSync('$isModelHot');
			this.isSwitchBtn = uni.getStorageSync('$isSwitchBtn');
			console.log(typeof uni.getStorageSync('$tempNum'));
			this.tempNum = uni.getStorageSync('$tempNum') ? parseInt(uni.getStorageSync('$tempNum')) : 16;
			console.log(this.tempNum);
			if (this.windNum != 0) {
				switch (this.windNum) {
					case 0:
						this.windSpeedText = '自动档';
						break;
					case 1:
						this.windSpeedText = '低档';
						break;
					case 2:
						this.windSpeedText = '中档';
						break;
					case 3:
						this.windSpeedText = '高档';
						break;
					default:
						this.windSpeedText = '自动档';
						break;
				}
				this.isWind = true;
			}
			if (this.isFixed) {
				this.isTimeShow = true;
				if (this.timeingModel) {
					this.isOpen = true;
				} else {
					this.isClose = true;
				}
			}
			if (this.tempNum != 16) {
				this.option.series[0].data[0].value = this.tempNum;
				this.myChart.setOption(this.option, true);
			}
		},

		wind: function() {
			if (this.isSwitchBtn) {
				this.windNum = uni.getStorageSync('$windNum') ? parseInt(uni.getStorageSync('$windNum')) : 0;
				this.windNum += 1;
				this.windNum = this.windNum % 4;
				console.log(this.windNum);
				let msg = {
					wind: this.windNum
				};
				this.publish(msg);
				uni.setStorageSync('$windNum', this.windNum);
				switch (this.windNum) {
					case 0:
						this.windSpeedText = '自动档';
						break;
					case 1:
						this.windSpeedText = '低档';
						break;
					case 2:
						this.windSpeedText = '中档';
						break;
					case 3:
						this.windSpeedText = '高档';
						break;
					default:
						this.windSpeedText = '自动档';
						break;
				}
				if (this.windNum === 0) {
					this.isWind = false;
				} else {
					this.isWind = true;
				}
			}
		},

		timeFixed: function() {
			let that = this;
			// if (this.isSwitchBtn == 1) {
			this.isFixed = uni.getStorageSync('$isFixed');
			this.timeingModel = uni.getStorageSync('$timingModel'); //定时模式 开/关
			this.timeNum = uni.getStorageSync('$timeNum') ? parseInt(uni.getStorageSync('$timeNum')) : 0; //定时时间
			this.isFixed = !this.isFixed;
			console.log('确认定时', this.isFixed);
			let msg = {
				timeFixed: this.isFixed,
				timeOpen: this.timeNum
			};
			if (!this.timeingModel) {
				msg = {
					timeFixed: this.isFixed,
					timeClose: this.timeNum
				};
			}
			uni.setStorageSync('$isFixed', this.isFixed);
			that.publish(msg);
			if (!this.isFixed) {
				this.isTimeShow = false;
				this.isOpen = false;
				this.isClose = false;
			} else {
				this.isTimeShow = true;
				if (this.timeingModel) {
					this.isOpen = true;
				} else {
					this.isClose = true;
				}
			}
			// }
		},

		timeOpen: function() {
			// if (switchIndex == 1) {
			this.timeNum = uni.getStorageSync('$timeNum') ? parseInt(uni.getStorageSync('$timeNum')) : 0;
			this.timeNum += 1;
			this.timeNum = this.timeNum % 24;
			console.log(this.timeNum);
			uni.setStorageSync('$timeNum', this.timeNum);
			this.isTimeShow = true;
			this.isOpen = true;
			this.isClose = false;
			this.isFixed = false;
			this.timeingModel = true;
			uni.setStorageSync('$isFixed', this.isFixed);
			uni.setStorageSync('$timingModel', this.timeingModel); //true-定时开
			// }
		},

		timeClose: function() {
			if (this.isSwitchBtn) {
				this.timeNum = uni.getStorageSync('$timeNum') ? parseInt(uni.getStorageSync('$timeNum')) : 0;
				this.timeNum += 1;
				this.timeNum = this.timeNum % 24;
				console.log(this.timeNum);
				uni.setStorageSync('$timeNum', this.timeNum);
				this.isTimeShow = true;
				this.isOpen = false;
				this.isClose = true;
				this.isFixed = false;
				this.timeingModel = false;
				uni.setStorageSync('$isFixed', this.isFixed);
				uni.setStorageSync('$timingModel', this.timeingModel); //false-定时关
			}
		},

		upDw: function() {
			if (this.isSwitchBtn) {
				this.isUpDw = uni.getStorageSync('$isUpDw');
				this.isUpDw = !this.isUpDw;
				console.log(this.isUpDw);
				let msg = {
					upDw: this.isUpDw
				};
				this.publish(msg);
				uni.setStorageSync('$isUpDw', this.isUpDw);
			}
		},

		leRi: function() {
			if (this.isSwitchBtn) {
				this.isLeRi = uni.getStorageSync('$isLeRi');
				this.isLeRi = !this.isLeRi;
				console.log(this.isLeRi);
				let msg = {
					leRi: this.isLeRi
				};
				this.publish(msg);
				uni.setStorageSync('$isLeRi', this.isLeRi);
			}
		},

		modelCold: function() {
			if (this.isSwitchBtn) {
				this.isModelCold = uni.getStorageSync('$isModelCold');
				this.isModelCold = !this.isModelCold;
				this.isModelHot = false;
				console.log(this.isModelCold);
				let msg = {
					modelCold: this.isModelCold,
					modelHot: this.isModelHot
				};
				uni.setStorageSync('$isModelCold', this.isModelCold);
				uni.setStorageSync('$isModelHot', this.isModelHot);
				this.publish(msg);
				if (this.isModelCold) {
					this.isModelHot = false;
					this.modelText = '制冷模式';
					this.modelIcon = 'icon-xuehua';
				} else {
					this.modelText = '自动模式';
					this.modelIcon = 'icon-feng';
				}
			}
		},

		modelHot: function() {
			if (this.isSwitchBtn) {
				this.isModelHot = uni.getStorageSync('$isModelHot');
				this.isModelHot = !this.isModelHot;
				this.isModelCold = false;
				console.log(this.isModelHot);
				let msg = {
					modelCold: this.isModelCold,
					modelHot: this.isModelHot
				};
				this.publish(msg);
				uni.setStorageSync('$isModelCold', this.isModelCold);
				uni.setStorageSync('$isModelHot', this.isModelHot);
				if (this.isModelHot) {
					this.isModelCold = false;
					this.modelText = '制热模式';
					this.modelIcon = 'icon-taiyang';
				} else {
					this.modelText = '自动模式';
					this.modelIcon = 'icon-feng';
				}
			}
		},

		tempSub: function() {
			if (this.isSwitchBtn) {
				this.tempNum = uni.getStorageSync('$tempNum') ? parseInt(uni.getStorageSync('$tempNum')) : 16;
				this.tempNum -= 1;
				if (this.tempNum < 16) {
					this.tempNum = 16;
				}
				console.log(this.tempNum);
				let msg = {
					tempNum: this.tempNum
				};
				uni.setStorageSync('$tempNum', this.tempNum);
				this.publish(msg);
			}
		},

		tempAdd: function() {
			if (this.isSwitchBtn) {
				this.tempNum = uni.getStorageSync('$tempNum') ? parseInt(uni.getStorageSync('$tempNum')) : 16;
				this.tempNum += 1;
				if (this.tempNum > 30) {
					this.tempNum = 30;
				}
				console.log(this.tempNum);
				let msg = {
					tempNum: this.tempNum
				};
				uni.setStorageSync('$tempNum', this.tempNum);
				this.publish(msg);
			}
		},

		switchBtn: function() {
			let that = this;
			that.isSwitchBtn = uni.getStorageSync('$isSwitchBtn');
			that.isSwitchBtn = !that.isSwitchBtn;
			console.log('开关', that.isSwitchBtn);
			let msg = {
				switchBtn: that.isSwitchBtn
			};
			uni.setStorageSync('$isSwitchBtn', that.isSwitchBtn);
			that.publish(msg);
			if (!that.isSwitchBtn) {
				that.isSwitchBtn = false;
				that.isWind = false;
				that.isOpen = false;
				that.isClose = false;
				that.isFixed = false;
				that.isUpDw = false;
				that.isLeRi = false;
				that.isModelCold = false;
				that.isModelHot = false;
				that.tempNum = 16;
				that.myChart.setOption(that.option, true);
				// that.publish(msg);
				// that.device.end(); //断开连接
				// that.device = null;
				// console.log('断开连接');
			} else {
				that.isSwitchBtn = true;
				that.readNum();
			}
		},

		index: function() {
			uni.navigateTo({
				url: '../index/index'
			});
		},
		airlist: function() {
			uni.navigateTo({
				url: '../airlist/airlist'
			});
		}
	},
	//调用
	mounted() {
		this.$nextTick(function() {
			// this.initChart();
		});
	},
	onHide() {
		uni.setStorageSync('$isSwitchBtn', false);
	}
};
</script>

<script module="echarts" lang="renderjs">
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/echarts.js'
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			initEcharts() {
				this.myChart = echarts.init(document.getElementById('chart'))
				// 观测更新的数据在 view 层可以直接访问到
				this.myChart.setOption(this.option)
			},
			updateEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				this.myChart.setOption(newValue)
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			}
		}
	}
</script>

<style>
@import url('@/common/css/reset.css');
@import url('@/common/css/iconfont.css');
@import url('@/common/css/aircontrol.css');
</style>
