<template>
    <div class="comment-main" v-show="showBox" ref="reply">
        <div class="comment-item">
            <div class="box">
                <div class="avatar">
                    <img v-if="user != null" :src="user.avatar" alt="">
                    <img v-else src="http://127.0.0.1:8800/shiyi/file/touristAvatar.png" alt="">
                </div>
                <div class="ml-3">
                    <div data-v-0089e256="" class="comment-input">
                        <textarea placeholder="留下点什么吧..." v-model="commentContent" class="comment-textarea"></textarea>
                    </div>
                    <div class="comment-btn">
                        <span @click.stop="chooseEmoji = !chooseEmoji" class="emoji-btn" @mouseenter="handleEmojiMouseEnter"
                            @mouseleave="handleEmojiMouseLeave">
                            <svg-icon :icon-class="emoji"></svg-icon>
                        </span>
                        <div style="margin-left: auto;">
                            <el-button type="info" @click="handleCancle" class="cancle-btn v-comment-btn">
                                取消
                            </el-button>
                            <el-button @click="addComment" class="upload-btn v-comment-btn">
                                提交
                            </el-button>
                        </div>
                    </div>
                    <div class="emoji-wrapper" v-show="chooseEmoji">
                        <Emoji @chooseEmoji="handleChooseEmoji" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { postComment } from '@/api/comment'
import { browserMatch } from '@/utils'
import Emoji from '@/components/emoji'
export default {
    components: {
        Emoji
    },
    data() {
        return {
            chooseEmoji: false,
            userId: null,
            nickname: null,
            parentId: null,
            index: null,
            commentContent: "",
            replyUserId: null,
            showBox: false,
            user: this.$store.state.userInfo,
            emoji: "emoji1"
        }
    },
    mounted() {
        document.addEventListener("click", e => {
            if (e.target.className != "iconfont icon-biaoqing") {
                this.chooseEmoji = false
            }
        })
    },
    methods: {
        handleEmojiMouseEnter() {
            this.emoji = "emoji2"
        },
        handleEmojiMouseLeave() {
            this.emoji = "emoji1"
        },
        handleChooseEmoji(value) {
            this.commentContent += value
        },
        handleCancle() {
            this.showBox = false
        },
        addComment() {
            if (!this.commentContent) {
                this.$notify({
                    title: '失败',
                    message: '评论不能为空',
                    type: 'error'
                });
                return;
            }
            let browser = browserMatch()
            let comment = {
                articleId: this.$route.params.articleId,
                avatar: "https://sdn.geekzu.org/avatar/eeb4fe09a1aaad7964b055f331f72608?s=256&d=monsterid",
                content: this.commentContent,
                replyUserId: this.replyUserId,
                parentId: this.parentId,
                browser: browser.browser.toLowerCase(),
                browserVersion: browser.browser + " " + browser.version,
            }
            postComment(comment).then(res => {
                this.$emit("reloadReply", this.index);
                this.$notify({
                    title: '成功',
                    message: '评论成功',
                    type: 'success'
                });
                this.$store.commit("isCommentFlag", true)
                this.commentContent = ""
                this.showBox = false
            })

        },
    },
}
</script>
<style lang="scss" scoped>
.comment-main {
    width: 100%;

    .comment-item {
        border: 1px solid rgba(144, 147, 153, .31);
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0 10px;

        .box {
            display: flex;

            .avatar {
                line-height: normal;
                position: relative;
                vertical-align: middle;

                img {
                    width: 40px;
                    width: 40px;
                    overflow: hidden;
                    border-radius: 50%;
                }
            }

            .ml-3 {
                margin-left: 12px !important;
                width: 100%;
                position: relative;

                .comment-input {
                    position: relative;

                    .comment-textarea {
                        font-size: .875rem;
                        color: var(--article-content-color) !important;
                        outline: none;
                        padding: 10px 5px;
                        min-height: 122px;
                        resize: none;
                        width: 100%;
                        border-radius: 4px;
                        background-color: transparent;
                        border-style: none;
                        background: url('http://127.0.0.1:8800/shiyi/file/plun.gif') 100% 100% no-repeat;
                        transition: all 0.25s ease-in-out 0s;

                        &:focus {
                            background-position-y: 150px;
                        }
                    }
                }

                .comment-btn {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;

                    .emoji-btn {
                        cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;

                        svg {
                            width: 20px;
                            height: 20px;
                        }
                    }

                    .emoji-btn-active {
                        .iconfont {
                            color: var(--theme-color);
                        }
                    }

                    .v-comment-btn {
                        border: 1px solid var(--border-line);
                        border-radius: 4px;
                        text-align: center;
                        padding: 10px 16px;
                        font-size: 14px;
                        transition: all .3s;
                        outline: none;
                        cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;
                    }

                    .cancle-btn {
                        margin-right: 1rem;
                        position: relative;
                    }


                    @media screen and (max-width: 767px) {
                        .upload-btn {

                            margin-left: auto;
                            color: #fff;
                            background-color: var(--theme-color);
                            position: relative;
                        }
                    }

                    @media screen and (min-width: 768px) {
                        .upload-btn {

                            margin-left: auto;
                            color: #fff;
                            background-color: var(--theme-color);
                            overflow: hidden;
                            transition: all .5s;
                            position: relative;

                            &:hover {
                                background-color: #00C853;
                            }

                            &:hover::before {
                                left: 120%;
                                transition: all .5s;
                            }

                            &::before {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: -40%;
                                width: 20%;
                                height: 100%;
                                background: linear-gradient(90deg, transparent, #fff, transparent);
                                transform: skew(-45deg);
                            }
                        }
                    }
                }

                .emoji-wrapper {
                    position: absolute;
                    top: 0;
                }
            }
        }
    }
}
</style>