<template>
    <div class='user-main'>
        <div class="user-warpper">
            <div class="userBox">
                <div class="backgroupImg">
                    <img v-lazy="user.bjCover" :key="user.bjCover">
                    <div class="more">
                        <div class="menu">
                            <ul>
                                <li @click="handleUpdateInfo">
                                    <svg-icon icon-class="edit"></svg-icon> 修改资料
                                </li>
                                <li @click="handleClikeMoreData">
                                    <svg-icon icon-class="xiangqing"></svg-icon> 更多资料
                                </li>
                                <li>
                                    <el-upload class="avatar-uploader" :show-file-list="false" ref="upload" name="filedatas"
                                        :action="uploadPictureHost" :http-request="uploadBjCoverFile" multiple>
                                        <svg-icon icon-class="photo"></svg-icon> 修改封面
                                    </el-upload>
                                </li>
                                <li @click="feedbackDialogTableVisible = true">
                                    <svg-icon icon-class="feedback"></svg-icon> 添加反馈
                                </li>
                            </ul>
                        </div>
                        <i class="el-icon-more-outline moreBtn"></i>
                    </div>

                </div>
                <div class="user-item">
                    <div class="toolbar">
                        <img class="cover" :src="user.avatar" alt="">
                    </div>
                    <div class="userInfo">
                        <div class="nickname">
                            昵称：<span>{{ user.nickname }}</span>
                            <el-tooltip class="item" effect="dark" content="LV1" placement="top">
                                <span>
                                    <svg-icon icon-class="level1"></svg-icon>
                                </span>
                            </el-tooltip>

                        </div>
                        <div class="desc">
                            个人简介：{{ user.intro ? user.intro : "这家伙很懒，什么都没有写..." }}
                        </div>
                    </div>
                    <div class="sign">
                        <button :class="!isTodaySign ? 'signBtn' : 'disabledSignBtn'" :disabled="isTodaySign"
                            @click="handleSign">
                            <svg-icon icon-class="sign1"></svg-icon>
                            <span>{{ isTodaySign ? "今天已签到" : "立即签到" }}</span>
                        </button>
                    </div>
                </div>

            </div>
            <div class="bottom-box">
                <div class="title">
                    <ul>
                        <li ref="btn" :class="index == 0 ? 'active' : ''" @click="btnClike(index)"
                            v-for="(item, index) in btnList" :key="index">
                            <span class="item-title">
                                <i :class="item.icon"></i> {{ item.name }}
                            </span>
                        </li>
                    </ul>

                </div>
                <!-- <div class="btnBox">
                    <div class="btn" @click="handleClike(1)">发布</div>
                    <div class="btn" @click="handleClike(2)">待审核</div>
                    <div class="btn" @click="handleClike(0)">下架</div>
                </div> -->
                <div class="articleBox" v-if="dataList.length">
                    <div class="articleItem">
                        <div v-if="pageData.index != 2" class="article" v-for="(item, index) in dataList" :key="index">
                            <router-link :to="'/article/' + item.id">
                                <div class="article-cover">
                                    <img v-lazy="item.avatar" :key="item.avatar">
                                </div>
                            </router-link>



                            <div class="article-info">
                                <div style="display: flex;position: relative;">
                                    <router-link :to="'/article/' + item.id">
                                        <div class="article-title">
                                            {{ item.title }}
                                        </div>
                                    </router-link>
                                    <div class="articleBtn">
                                        <div v-if="pageData.index == 0">
                                            <el-tooltip class="item" effect="dark" content="修改文章" placement="top">
                                                <el-button type="primary" size="mini" @click="handleUpdateArticle(item.id)"
                                                    icon="el-icon-edit" circle></el-button>
                                            </el-tooltip>
                                            <el-tooltip class="item" effect="dark" content="删除文章" placement="top">
                                                <el-button type="danger" size="mini"
                                                    @click="handleDeleteArticle(index, item.id)" icon="el-icon-delete"
                                                    circle></el-button>
                                            </el-tooltip>
                                        </div>

                                        <el-tooltip v-if="pageData.index == 1" class="item" effect="dark" content="取消收藏"
                                            placement="top">
                                            <el-button type="danger" size="mini" @click="handleCanCollect(index, item.id)"
                                                icon="el-icon-delete" circle></el-button>
                                        </el-tooltip>
                                    </div>
                                </div>


                                <div class="article-desc">
                                    {{ item.summary }}
                                </div>
                                <div class="article-tag">
                                    <el-tooltip class="item1" effect="dark" content="文章分类" placement="top">
                                        <el-tag size="mini" @click="handleClike(item.categoryId, '/categorys')">
                                            <i class=" el-icon-folder-opened"></i> {{ item.categoryName }}
                                        </el-tag>
                                    </el-tooltip>
                                    <el-tooltip class="item1" effect="dark" content="文章标签" placement="top"
                                        v-for="tag in item.tagList" :key="tag.id">

                                        <el-tag :type="tagStyle[Math.round(Math.random() * 4)]" size="mini"
                                            @click="handleClike(tag.id, '/tag')">
                                            <i class="el-icon-collection-tag"></i> {{ tag.name
                                            }}</el-tag>
                                    </el-tooltip>
                                </div>
                                <div class="article-user">
                                    <span class=" item">
                                        <i class=" el-icon-user"></i>
                                        <span class="nickname">{{ item.username }}</span>
                                    </span>

                                    <span class="time item">
                                        <i class="el-icon-time"></i>{{ item.createTime }}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                    <!-- 笔记列表 -->
                    <div v-if="pageData.index == 2" class="note" v-for="(item, index) in dataList" :key="index">
                        <div style="width: 100%;margin-bottom: 15px;">
                            <span class="time">
                                <i class="el-icon-time"></i> {{ item.createTime }}
                            </span>
                            <span style="float: right;">
                                <el-tag style="margin-right: 10px;" size="small" v-if="item.categoryName">{{
                                    item.categoryName }}</el-tag>
                                <el-tooltip class="item" effect="dark" content="删除笔记" placement="top">
                                    <el-button type="danger" size="mini" @click="handleDeleteNote(index, item.id)"
                                        icon="el-icon-delete" circle></el-button>
                                </el-tooltip>
                            </span>
                        </div>
                        <div style="width: 100%;">
                            <v-md-preview :text="item.content" ref="preview" v-highlight />
                        </div>
                    </div>
                    <!-- 分页按钮 -->
                    <sy-pagination :pageNo="pageData.pageNo" :pages="pages" @changePage="onPage" />
                </div>
                <div v-else>
                    <sy-empty />
                </div>
            </div>
        </div>
        <el-dialog title="个人信息" center :visible.sync="dialogTableVisible" :lock-scroll="false"
            :close-on-click-modal="false">
            <div style="">
                <div class="dialogItem item">
                    <span>
                        昵称：{{ form.nickname }}
                    </span>
                    <span>
                        简介：{{ form.intro }}
                    </span>
                </div>

                <div class="dialogItem item">
                    <span>
                        邮箱： {{ form.email }}
                    </span>
                    <span>
                        性别： 保密
                    </span>
                </div>
                <div class="dialogItem item">
                    <span>
                        地址： {{ form.address }}
                    </span>
                    <span>
                        个人网站： {{ form.webSite }}
                    </span>
                </div>
                <div class="item">
                    注册时间：{{ form.registerTime }}
                </div>
                <div class="item">
                    最后登录：{{ form.lastLoginTime }}
                </div>
            </div>
        </el-dialog>

        <!-- 修改资料弹出框 -->
        <el-dialog title="修改资料" center :visible.sync="editDialogTableVisible" :lock-scroll="false"
            :close-on-click-modal="false">
            <el-form label-position="left" label-width="60px" :model="form">
                <el-form-item label="头像：">
                    <el-upload class="avatar-uploader" :show-file-list="false" ref="upload" name="filedatas"
                        :action="uploadPictureHost" :http-request="uploadSectionFile" multiple>
                        <img v-if="form.avatar" style="width: 50%;height: 50%;" :src="form.avatar" class="imgAvatar">
                        <i v-else class="el-icon-plus avatar-img-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="昵称：">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="简介：">
                    <el-input v-model="form.intro"></el-input>
                </el-form-item>
                <el-form-item label="站点：">
                    <el-input v-model="form.webSite"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateUserInfo">提交</el-button>
            </span>
        </el-dialog>

        <!-- 添加反馈弹出框 -->
        <el-dialog title="添加反馈" center :visible.sync="feedbackDialogTableVisible" :lock-scroll="false"
            :close-on-click-modal="false">
            <el-form label-position="left" label-width="100px" :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="反馈类型:" prop="type">
                    <el-radio v-model="form.type" label="1">需求</el-radio>
                    <el-radio v-model="form.type" label="2">缺陷</el-radio>
                </el-form-item>
                <el-form-item label="反馈标题:" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="详细内容：" prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="insertFeedback">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
   
<script>
import {
    updateUserInfo, getUserInfo, upload, getArticleByUserId,
    deleteMyArticle, addFeedback
} from '@/api'

import { cancelCollect, getCollect } from '@/api/collect'
import { selectNoteByUserId, deleteNote } from '@/api/note'
import { sign, validateTodayIsSign } from '@/api/sign'
export default {
    name: '',
    data() {
        return {
            user: this.$store.state.userInfo,
            uploadPictureHost: process.env.VUE_APP_BASE_API + "/file/upload",
            dataList: [],
            pageData: {
                pageNo: 1,
                pageSize: 10,
                index: 0
            },
            form: {},
            files: {},
            dialogTableVisible: false,
            editDialogTableVisible: false,
            feedbackDialogTableVisible: false,
            tagStyle: ["success", "warning", "danger", "info"],
            btnList: ["文章", "收藏", "笔记"],
            btnList: [
                {
                    icon: "el-icon-document",
                    name: "文章"
                },
                {
                    icon: "el-icon-star-off",
                    name: "收藏"
                },
                {
                    icon: "el-icon-reading",
                    name: "笔记"
                },
            ],
            today: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? ('0' + (new Date().getMonth() + 1)) : new Date().getMonth() + 1) + '-'
                + (new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate()),
            isTodaySign: false,
            rules: {
                title: [
                    { required: true, message: '请输入反馈标题', trigger: 'blur' },
                ],
                type: [
                    { required: true, message: '请选择反馈类型', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入反馈详细内容', trigger: 'blur' },
                ],

            }

        }
    },
    created() {
        this.selectAricleList()
        this.validateTodayIsSign()
    },
    methods: {
        insertFeedback() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    addFeedback(this.form).then(res => {
                        this.$notify({
                            title: '成功通知',
                            message: "反馈成功",
                            type: 'success'
                        });
                        this.feedbackDialogTableVisible = false
                        this.form = {}
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        validateTodayIsSign() {
            validateTodayIsSign().then(res => {
                if (res.data != null) {
                    this.isTodaySign = true
                }
            })
        },
        handleSign() {
            sign(this.today).then(res => {
                this.isTodaySign = true
                this.$notify({
                    title: '成功',
                    message: "签到成功",
                    type: 'success'
                });
            })
        },
        updateUserInfo() {
            updateUserInfo(this.form).then(res => {
                this.user = this.form
                this.$notify({
                    title: '成功',
                    message: "修改成功",
                    type: 'success'
                });
                this.editDialogTableVisible = false
            })
        },
        handleClike(id, path) {
            this.$router.push({ path: path, query: { id: id } })
        },
        handleUpdateInfo() {
            this.handleBefore()
            this.editDialogTableVisible = true
        },
        handleClikeMoreData() {
            this.handleBefore()
            this.dialogTableVisible = true
        },
        handleBefore() {
            getUserInfo().then(res => {
                this.form = res.data
            })
        },
        handleUpdateArticle(id) {
            this.$router.push({ path: "/newposts", query: { id: id } })
        },
        handleCanCollect(index, id) {
            this.$confirm('确认取消收藏该文章吗？', '提示', {
                lockScroll: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(_ => {
                    cancelCollect(id).then(res => {
                        this.dataList.splice(index, 1)
                        this.$notify({
                            title: '成功',
                            message: "取消收藏成功",
                            type: 'success'
                        });
                    })
                })
                .catch(_ => {
                    this.$notify({
                        title: '提示',
                        message: "取消关闭",
                        type: 'info'
                    });
                });
        },
        handleDeleteArticle(index, id) {
            this.$confirm('确认删除该文章吗？', '提示', {
                lockScroll: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(_ => {
                    deleteMyArticle(id).then(res => {
                        this.dataList.splice(index, 1)
                        this.$notify({
                            title: '成功',
                            message: "删除成功",
                            type: 'success'
                        });
                    })
                })
                .catch(_ => {
                    this.$notify({
                        title: '提示',
                        message: "取消关闭",
                        type: 'info'
                    });
                });
        },
        handleDeleteNote(index, id) {
            this.$confirm('确认删除该笔记吗？', '提示', {
                lockScroll: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(_ => {
                    deleteNote(id).then(res => {
                        this.dataList.splice(index, 1)
                        this.$notify({
                            title: '成功',
                            message: "删除成功",
                            type: 'success'
                        });
                    })
                })
                .catch(_ => {
                    this.$notify({
                        title: '提示',
                        message: "取消关闭",
                        type: 'info'
                    });
                });
        },
        onPage() {
            this.pageData.pageNo++;
            this.before()
        },
        btnClike(index) {
            for (var i = 0; i < this.$refs.btn.length; i++) {
                this.$refs.btn[i].className = ""
            }
            this.$refs.btn[index].className = "active"
            this.dataList = []
            this.pageData.pageNo = 1
            this.pageData.index = index
            this.before()
        },
        before() {
            switch (this.pageData.index) {
                case 0:
                    this.selectAricleList()
                    break;
                case 1:
                    this.selectCollectionList()
                    break;
                case 2:
                    this.selectNoteList()
                    break;
                default:
                    this.selectAricleList()
                    break;
            }
        },
        selectAricleList(type) {
            if (type) {
                this.pageData.type = type
            }
            getArticleByUserId(this.pageData).then(res => {
                this.dataList.push(...res.data.records);
                this.pages = res.data.pages

            }).catch(err => {
                console.log(err)
            })
        },
        selectCollectionList() {
            getCollect(this.pageData).then(res => {
                this.dataList.push(...res.data.records);
                this.pages = res.data.pages
            })
        },
        selectNoteList() {
            selectNoteByUserId(this.pageData).then(res => {
                this.dataList.push(...res.data.records);
                this.pages = res.data.pages
            })
        },
        uploadBjCoverFile: function (param) {
            this.files = param.file
            // FormData 对象
            var formData = new FormData()
            // 文件对象
            formData.append('multipartFile', this.files)
            upload(formData).then(res => {
                let user = {
                    id: this.user.id,
                    bjCover: res.data
                }
                updateUserInfo(user).then(res => {
                    this.user.bjCover = res.data
                    this.$notify({
                        title: '成功',
                        message: "修改成功",
                        type: 'success'
                    });
                })
            })

        },
        uploadSectionFile: function (param) {
            this.files = param.file
            // FormData 对象
            var formData = new FormData()
            // 文件对象
            formData.append('multipartFile', this.files)
            upload(formData).then(res => {
                this.form.avatar = res.data
            })

        },
    },
}
</script>
   
<style lang='scss' scoped>
/deep/ .vuepress-markdown-body {
    background-color: var(--background-color);
    color: var(--article-color);
}

/deep/ .el-dialog {
    .el-dialog__body {
        padding: 10px 20px;
    }

    .item {
        margin-bottom: 10px;
    }

    .dialogItem {
        display: flex;

        span {
            width: 50%;
        }
    }
}

.user-main {
    display: flex;
    justify-content: center;

    @media screen and (max-width: 1118px) {
        padding: 10px;

        /deep/ .el-dialog {
            width: 90%;
            border-radius: 10px;

            .dialogItem {
                display: flex;

                span {
                    width: 50%;
                }
            }
        }

        .backgroupImg img {
            height: 200px;
        }

        .user-item .toolbar {
            margin-left: 20px;
            width: 100px;

        }

        .sign {
            display: none;
        }

        .user-warpper {
            width: 100%;
            margin-top: 80px;
        }

        .article-cover {
            display: none;
        }
    }

    @media screen and (min-width: 1119px) {
        /deep/ .el-dialog {
            width: 30%;
            border-radius: 10px;

            .dialogItem {
                display: flex;

                span {
                    width: 50%;
                }
            }
        }

        .backgroupImg img {
            height: 400px;
        }

        .user-item .toolbar {
            margin-left: 50px;
            width: 150px;

        }

        .user-warpper {
            width: 60%;
            margin-top: 80px;
        }

        .article-cover {
            width: 160px;
            height: 150px;
            cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
            overflow: hidden;
            border-radius: 5px;

            img {
                height: 100%;
                width: 100%;
                border-radius: 5px;
                transition: all 0.5s;
            }



            &:hover {
                img {
                    transform: scale(1.1);
                }
            }
        }

        .sign {
            position: absolute;
            right: 50px;
            padding: 5px;
            border-radius: 5px;

            .signBtn,
            .disabledSignBtn {
                border: none;
                cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                color: var(--text-color);
                background-color: var(--background-color);
            }

            .signBtn {
                &:hover {
                    color: var(--theme-color);
                }
            }

            .disabledSignBtn {
                cursor: no-drop;

            }

            svg {
                width: 20px;
                height: 20px;
                vertical-align: -4px;
                margin-right: 5px;
            }
        }
    }

    .user-warpper {
        display: flex;
        flex-direction: column;
    }

    .userBox {
        border-radius: 10px;
        background-color: var(--background-color);

        .backgroupImg {
            position: relative;
            width: 100%;

            img {
                width: 100%;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;

            }

            .more {
                position: absolute;
                right: 20px;
                bottom: 10px;
                color: var(--theme-color);
                cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                font-size: 20px;

                .menu {
                    background-color: var(--background-color);
                    color: var(--text-color);
                    padding: 10px 0;
                    border-radius: 5px;
                    font-size: 0.9rem;
                    text-align: center;
                    position: absolute;
                    right: -15px;
                    bottom: 20px;
                    display: none;
                    animation: fade-in 0.3s linear 1;
                    width: 120px;

                    @keyframes fade-in {
                        0% {
                            transform: scale(0);
                        }

                        100% {
                            transform: scale(1);
                        }
                    }

                    ul {
                        list-style: none;
                    }

                    li {
                        padding: 5px;
                        transition: transform .35s !important;

                        &:hover {
                            color: var(--theme-color);
                            transform: translateX(6px);
                        }

                        svg {
                            width: 20px;
                            height: 20px;
                            vertical-align: -5px;
                        }
                    }
                }

                &:hover {
                    .menu {
                        display: block;
                    }
                }
            }
        }

        .user-item {
            height: 80px;
            display: flex;
            margin-bottom: 20px;
            position: relative;
            align-items: center;

            .toolbar {
                padding: 5px;
                background-color: var(--background-color);
                border-radius: 5px;
                margin-top: -80px;
            }

            .cover {
                object-fit: cover;
                width: 100%;
                height: 100%;
            }

            .userInfo {
                margin: 20px;
                color: var(--article-color);
                font-style: italic;

                .nickname {

                    margin-bottom: 10px;


                    svg {
                        width: 35px;
                        height: 35px;
                        vertical-align: -12px;
                    }

                    span {
                        margin-right: 5px;
                        font-weight: 700;
                        background: radial-gradient(circle at 49.86% 48.37%, #0090ff 0, #0089ff 3.33%, #3a82ff 6.67%, #717aff 10%, #9371fb 13.33%, #ae67ef 16.67%, #c45de1 20%, #d652d2 23.33%, #e448c2 26.67%, #ef3eb0 30%, #f7369e 33.33%, #fd318c 36.67%, #ff317a 40%, #ff3569 43.33%, #fd3d57 46.67%, #f94646 50%, #f35035 53.33%, #ea5a22 56.67%, #e16308 60%, #d56d00 63.33%, #c97500 66.67%, #bb7d00 70%, #ac8300 73.33%, #9d8900 76.67%, #8c8f00 80%, #7a9300 83.33%, #669700 86.67%, #4f9b00 90%, #309e0e 93.33%, #00a029 96.67%, #00a23d 100%);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .desc {

                    font-size: 0.9rem;
                }
            }


        }

    }


    .bottom-box {
        border-radius: 10px;
        margin-top: 20px;
        min-height: 500px;

        .title {
            padding: 10px;

            ul {
                display: flex;
                list-style: none;

                li {
                    margin-right: 20px;
                    cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                    color: var(--text-color);

                    &:hover {
                        color: var(--theme-color);
                    }

                    .item-title {
                        margin-right: 5px;
                    }
                }

                .active {
                    color: var(--theme-color);
                    font-weight: 700;
                    font-style: italic;
                }
            }

            border-bottom: 1px solid var(--border-line);
        }

        .btnBox {
            padding: 10px;

            .btn {
                display: inline-block;
                margin-right: 10px;
                background-color: rgba(136, 136, 136, .1);
                padding: 6px;
                border-radius: 5px;
                font-size: 0.9rem;
                color: var(--text-color);
                cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;

                &:hover {
                    background-color: var(--theme-color);
                    color: #fff;
                }
            }
        }

        .articleBox {
            height: 100%;
            padding-top: 10px;

            .articleItem {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }

            .article {
                display: flex;
                padding: 10px;
                margin-bottom: 20px;
                border-radius: 5px;
                margin-left: 10px;
                background-color: var(--background-color);

                .articleBtn {
                    position: absolute;
                    right: 0;
                    display: none;
                }



                &:hover {
                    .articleBtn {
                        display: block;
                    }

                    background-color: #9093994a;
                }





                .article-info {
                    margin-left: 20px;
                    width: 70%;
                    position: relative;

                    a {
                        text-decoration: none;
                        color: var(--article-color);
                    }

                    .article-title {
                        font-size: 1.1rem;
                        font-weight: 600;
                        -webkit-line-clamp: 1;

                        &:hover {
                            color: var(--theme-color);
                            cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                        }
                    }

                    .article-title,
                    .article-desc {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;

                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .article-desc {
                        -webkit-line-clamp: 3;
                        margin-bottom: 10px;
                        margin-top: 5px;
                        color: var(--text-color);
                        min-height: 60px;
                    }

                    .article-tag {
                        .el-tag {
                            margin-right: 5px;
                            cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                        }
                    }

                    .article-user {
                        display: flex;
                        align-items: center;
                        margin-top: 10px;

                        .nickname {
                            color: var(--theme-color);
                        }

                        .item {
                            padding: 0 5px;
                            color: var(--text-color);

                            i {
                                margin-right: 5px;
                            }
                        }
                    }
                }


            }

            .note {
                margin-bottom: 20px;
                border-bottom: 2px dashed var(--border-line);
                margin-right: 10px;

                .time {
                    color: var(--text-color);
                    margin-bottom: 20px;
                }
            }
        }
    }
}
</style>