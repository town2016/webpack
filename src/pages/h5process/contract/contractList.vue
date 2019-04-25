<template>
  <div class="contract">
    <dl class="contract-list">
      <dt class="contract-title fz-px-14">点击可展开查看合同/协议内容</dt>
      <dd class="contract-item" v-for="(item, index) in contactList" :key="index">
        <router-link
          class="contract-link"
          :to="{ path: '/contractDetail', query: { pdfUrl: item.pdfSignUrl } }">
          <div class="contract-index fz-px-14">{{ index + 1 }}</div>
          <div class="contract-name">《{{ item.contractName }}》</div>
          <img class="contract-icon" :src="require('@/assets/images/input/right_arrow.png')" />
        </router-link>
      </dd>
    </dl>
    <div class="contract-tips fz-px-14">注：请务必查看合同/协议</div>
  </div>
</template>
<script>
  import {
    GET_CONTACT_LIST
  } from '@/store/modules/contact/enum/actionsEnum';
  import {
    SET_CONTACT_LIST
  } from '@/store/modules/contact/enum/mutationsEnum';
  import {
    CONTACT_LIST
  } from '@/store/modules/contact/enum/gettersEnum';
  import { mapGetters, mapActions, mapMutations } from 'vuex';

  import storage from '@/utils/storage';

  export default {
    data() {
      return {
        list: [
          { name: '《评估确认书》', url: '' },
          { name: '《借款合同》', url: '' },
          { name: '《车辆抵/质押合同》', url: '' },
          { name: '《债权转让协议》', url: '' },
          { name: '《保证合同》', url: '' },
          { name: '《借款借据》', url: '' }
        ]
      }
    },
    computed: {
      ...mapGetters({
        contactList: CONTACT_LIST
      })
    },
    watch: {
      contactList(value) {
        storage.write('contactList', JSON.stringify(value))
      }
    },
    async created() {
      if(!this.contactList || !storage.read('contactList')) {
        storage.delete('search');
      }
      // 缓存的search和新的search
      const oldSearch = storage.read('search');
      const newSearch = window.location.search;
      // 如果有缓存，用缓存的list，否则开始请求
      if(oldSearch && oldSearch === newSearch) {
        const contactList = JSON.parse(storage.read('contactList'));
        this.setContactList(contactList);
        return;
      }
      storage.write('search', newSearch);
      const params = this.$route.query;
      let opts = {
        applyMoney: params.amount,
        loanTrem: params.term
      }
      await this.getContactList(opts);
    },
    methods: {
      ...mapMutations({
        setContactList: SET_CONTACT_LIST
      }),
      ...mapActions({
        getContactList: GET_CONTACT_LIST
      })
    }
  }
</script>

<style lang="scss" scoped>
  .contract {
    padding-top: 0.2rem;
    width: 100%;
  }
  .contract-list {
    width: 100%;
    background-color: #fff;
  }
  .contract-title {
    padding: 0 0.1rem;
    height: 0.4rem;
    line-height: 0.4rem;
    border-bottom: 1px solid #f1f1f1;
    color: #888;
  }
  .contract-item {
    position: relative;
    margin-left: 0.45rem;
    padding: 0.12rem 0.1rem 0.12rem 0;
  }
  .contract-link {
    display: flex;
    align-items: center;
    color: #333;
  }
  .contract-item + .contract-item {
    border-top: 1px solid #f1f1f1;
  }
  .contract-index {
    flex-shrink: 0;
    position: absolute;
    left: -0.35rem;
    transform: translateY(0.02rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.1rem;
    width: 0.22rem;
    height: 0.22rem;
    background-color: #bbb;
    border-radius: 999px;
    color: #fff;
  }
  .contract-name {
    width: 100%;
  }
  .contract-icon {
    flex-shrink: 0;
    margin-right: 0.06rem;
    width: 0.2rem;
    height: 0.2rem;
  }
  .contract-tips {
    padding: 0.1rem;
    color: #9c9c9c;
  }
</style>
