<template>
    <div class="artcile_main">
        <div class="box">
            <div class="title">
                <span>
                    <i style="color: var(--theme-color);font-weight: 700;margin-right: 5px;"
                        class="iconfont icon-search"></i>
                    以下是
                    <span style="color: var(--theme-color);font-weight: 700;">{{ pageData.keyword }}</span>
                    相关的文章：
                </span>
            </div>
            <div class="articleBox" v-if="articleList.length > 0">
                <el-card class="articleItem" v-for="item in articleList" :key="item.id">
                    <div class="articleInfo">
                        <div class="articleInfo-item">
                            <el-tooltip class="item" effect="dark" content="原创文章" placement="top-start">
                                <span v-if="item.isOriginal" class="original">
                                    <i class="el-icon-tickets"></i>
                                </span>
                            </el-tooltip>

                            <span v-if="item.isStick" class="top">置顶</span>
                            <router-link :to="'/article/' + item.id">
                                <h3 v-html="item.title"></h3>
                            </router-link>
                            <p>
                                {{ item.summary }}
                            </p>
                        </div>
                        <router-link :to="'/article/' + item.id">
                            <div class="articleImgBox">
                                <img class="articleImg" v-lazy="item.avatar" :key="item.avatar" />
                            </div>
                        </router-link>
                    </div>
                    <div class="bottumItem">
                        <div class="articleUser">
                            <el-avatar class="userAvatar" :src="item.userAvatar"></el-avatar>
                            <span>{{ item.username }}</span>
                        </div>

                        <div class="tag">
                            <el-tooltip class="item" effect="dark" content="文章分类" placement="top">
                                <el-tag size="mini" @click="handleClike(item.categoryId, '/categorys')">
                                    <i class=" el-icon-folder-opened"></i> {{ item.categoryName }}
                                </el-tag>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="文章标签" placement="top"
                                v-for="tag in item.tagList" :key="tag.id">
                                <el-tag :type="tagStyle[Math.round(Math.random() * 4)]" size="mini"
                                    @click="handleClike(tag.id, '/tag')">{{
                                        tag.name
                                    }}</el-tag>
                            </el-tooltip>


                        </div>

                        <div class="articleOhter">
                            <span class="item">
                                <i class="el-icon-view"></i>
                                <span class="name">阅读</span>{{ item.quantity }}
                            </span>
                            <span class="item">
                                <i class="el-icon-chat-dot-round"></i>
                                <span class="name">评论</span>{{ item.commentCount }}
                            </span>
                            <span class="item">
                                <span v-if="item.isCollect">
                                    <i style="font-size: 1rem;" class="el-icon-star-on"></i>
                                    <span class="name">收藏</span>{{ item.collectCount }}
                                </span>
                                <span v-else>
                                    <i style="font-size: 1rem;" class="el-icon-star-off"></i>
                                    <span class="name">收藏</span>{{ item.collectCount }}
                                </span>
                            </span>
                            <span class="item">
                                <i style="font-size: 0.8rem;" class="iconfont icon-dianzan1"></i>
                                <span class="name">赞</span>{{ item.likeCount }}
                            </span>
                            <span class="item">
                                <i class="el-icon-time"></i>{{ item.formatCreateTime }}
                            </span>
                        </div>
                    </div>
                </el-card>
                <!-- 分页按钮 -->
                <sy-pagination :pageNo="pageData.pageNo" :pages="pages" @changePage="handlePage" />

            </div>
            <div class="empty-box" v-else>
                <sy-empty message="哎呀，文章丢失啦..." />
            </div>
        </div>

    </div>
</template>
<script>
import { searchArticle } from '@/api'
export default {

    data() {
        return {
            pageData: {
                pageNo: 1,
                pageSize: 6,
                keyword: this.$route.query.keyword,
            },
            pages: 0,
            total: 0,
            tagStyle: ['', 'success', 'info', 'warning', 'danger'],
            articleList: [],

        }
    },

    created() {
        this.fetchArticleList()
    },
    methods: {

        handleClike(id, path) {
            this.$router.push({ path: path, query: { id: id } })
        },
        // 分页
        handlePage(val) {
            this.pageData.pageNo = val
            this.fetchArticleList()
        },

        fetchArticleList() {
            searchArticle(this.pageData).then(res => {
                this.articleList.push(...res.data.records);
                this.pages = res.data.pages
                this.total = res.data.total

            })
        },
    }
}
</script>
<style lang="scss" scoped>
.artcile_main {
    min-height: calc(100vh - 167px);
    display: flex;
    justify-content: center;
    position: relative;

    @media screen and (max-width: 1118px) {
        .box {
            width: 100%;
            margin-top: 70px;

            .articleInfo-item {
                width: 90%;
            }

            .articleImg {
                display: none;
            }

            .bottumItem {
                flex-wrap: wrap;
                margin-bottom: 10px;

                .articleUser,
                .tag {
                    width: 50%;
                    font-size: 0.8rem;
                }

                .articleOhter {
                    display: block;
                }
            }

        }
    }

    @media screen and (min-width: 1119px) {
        .box {
            width: 45%;
            margin-top: 80px;



            .articleInfo-item {
                width: 70%;
            }

            .articleImgBox {
                width: 180px;
                height: 110px;
                overflow: hidden;
                border: 1px solid var(--border-line);
                position: absolute;
                right: 30px;
                top: 20px;
                border-radius: 5px;

                &:hover .articleImg {
                    transform: scale(1.1);
                }

                .articleImg {
                    width: 100%;
                    height: 100%;
                    transition: all 0.5s;
                }
            }

            .articleUser {
                line-height: 50px;
            }

            .tag {
                display: inline-block;
                margin-left: 20px;

                .el-tag {
                    margin-right: 8px;
                    cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                }
            }

            .articleOhter {
                margin-left: 20px;
            }
        }
    }

    .box {
        height: 100%;
        padding: 10px;
    }

    .title {
        height: 45px;
        position: relative;
        border-bottom: 1px solid var(--border-line);
        margin-left: 15px;
        margin-bottom: 20px;

        span {
            display: inline-block;
            font-size: 1rem;
            line-height: 45px;
            font-weight: 700;
            color: var(--text-color);
        }
    }

    .articleBox {
        font-size: 1rem;
        width: 100%;

        .articleItem {
            position: relative;
            padding: 10px 5px 10px 15px;
            background-color: var(--background-color);
            margin-bottom: 20px;
            transition: box-shadow .35s, transform .35s;

            &:hover {
                box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
                transform: translateY(-2px)
            }


            .articleInfo {

                color: var(--article-color);

                .original {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-color: transparent #40c9c6;
                    /*上下颜色 左右颜色*/
                    border-width: 0 40px 40px 0;
                    border-style: solid;

                    i {
                        position: absolute;
                        top: 4px;
                        right: -37px;
                        font-size: 16px;
                        color: aquamarine;
                    }
                }

                .articleInfo-item {


                    a {
                        color: var(--article-color);
                    }

                    .top {
                        background-image: -webkit-linear-gradient(0deg, #3ca5f6 0, #a86af9 100%);
                        padding-left: 5px;
                        padding-right: 5px;
                        display: inline-block;
                        border-top-right-radius: 5px;
                        border-bottom-left-radius: 5px;
                        font-size: 0.9rem;
                        margin-right: 5px;
                        color: #fff;
                    }

                    h3 {
                        cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                        position: relative;
                        display: inline-block;

                        &::after {
                            content: "";
                            height: 2px;
                            overflow: hidden;
                            display: block;
                            left: 0;
                            bottom: -5px;
                            position: absolute;
                            width: 80%;
                            background: var(--theme-color);
                            transform: scaleX(0);
                            transition: all 0.5s;
                        }

                        &:hover {
                            &::after {
                                transform: scaleX(1);
                            }

                            color: var(--theme-color);
                        }

                    }

                    p {
                        margin-top: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                    }
                }


            }

            .bottumItem {
                align-items: center;
                height: 50px;
                display: flex;
                margin-top: 55px;

                .articleUser {

                    span {
                        color: var(--theme-color);
                        margin-left: 3px;
                        line-height: 40px;
                    }

                    .userAvatar {
                        vertical-align: top;
                        border: 1px solid var(--border-line);
                        transition: transform .5s;

                        &:hover {
                            transform: rotate(360deg);
                        }
                    }
                }



                .articleOhter {
                    font-size: 0.8rem;
                    color: var(--text-color);

                    .item {
                        margin-right: 10px;

                        .name {
                            margin-right: 3px;
                        }

                        i {
                            margin-right: 3px;
                        }
                    }
                }
            }

        }

    }

    .empty-box {
        text-align: center;
        margin-bottom: 50px;
        color: var(--text-color);
    }

}
</style>