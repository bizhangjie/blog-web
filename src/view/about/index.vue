<template>
    <div class="about-box">
        <el-card class="box1">
            <h1 class="title">关于本站</h1>
            <v-md-preview class="content" :text="$store.state.webSiteInfo.aboutMe" ref="preview" />
        </el-card>

    </div>
</template>
<script>
export default {
    metaInfo: {
        meta: [{
            name: 'keyWords',
            content: "拾壹博客,开源博客,www.shiyit.com"  //变量或字符串
        }, {
            name: 'description',
            content: "一个专注于技术分享的博客平台,大家以共同学习,乐于分享,拥抱开源的价值观进行学习交流"
        }]
    },
    created() {
    },
    data() {
        return {
        }
    },

}
</script>

<style lang="scss" scoped>
.about-box {
    display: flex;
    justify-content: center;
    position: relative;
    padding: 10px;

    @media screen and (max-width: 1118px) {
        .box1 {
            width: 100%;
            margin-top: 70px;
        }
    }

    @media screen and (min-width: 1119px) {
        .box1 {
            width: 65%;
            margin-top: 80px;
        }
    }

    .box1 {
        background-color: var(--background-color);
        height: 100%;


        &:hover {
            box-shadow: 5px 4px 8px 6px rgba(7, 17, 27, .06);
            transition: all .3s;
        }

        /deep/ .vuepress-markdown-body {
            background-color: var(--background-color);
            color: var(--article-color);
        }

        .title {
            font-size: 24px;
            color: var(--article-color);
            text-align: center;
            padding-top: 20px;
            margin-bottom: 15px;
            word-break: break-word;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
            font-weight: 500;
        }

        .content {
            color: var(--article-color);
        }
    }

    .authorInfo {
        margin-top: 80px;
        margin-left: 20px;
        width: 18%;
    }
}
</style>