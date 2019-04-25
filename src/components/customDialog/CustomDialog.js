import Vue from 'vue'
import CustomDialogComponent from './CustomDialog.vue'
const CustomDialogConstructor = Vue.extend(CustomDialogComponent)
let removeDom = event => {
    event.target.parentNode.removeChild(event.target);
};
CustomDialogConstructor.prototype.close = function() {
    this.visible = false;
    this.$el.addEventListener('transitionend', removeDom);
}; 
const CustomDialog = (options = {}) => {
    var instance = new CustomDialogConstructor()
    let duration = options.duration || 2500;
    // dialog内容
    instance.message = typeof options === 'string' ? options : options.message;
    // 位置 top middle bottom
    instance.position = options.position || 'middle';
    // 按钮内容
    instance.btnMessage = options.btnMessage || '确定';
    // 延时消失时间
    instance.duration = duration;
    // 是否需要延时消失
    instance.isDuration = options.btnMessage || true;
    // 是否显示延时消失时间
    instance.isShowDuration = options.isShowDuration || false;
    // 延时消失回调
    instance.callback = options.callback || null;
    
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el);
    instance.visible = true;
    Vue.nextTick(() => {
        instance.timer = setTimeout(function() {
            // instance.close();
        }, duration);
    })
    return instance
}

export default CustomDialog;